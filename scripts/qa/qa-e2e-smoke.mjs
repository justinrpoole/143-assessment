import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";
import process from "node:process";

import { loadEnvIfMissing } from "./load-env.mjs";

loadEnvIfMissing();

const REQUIRED_TABLES = [
  "assessment_runs",
  "assessment_responses",
  "assessment_results",
  "assessment_reports",
];

function isSet(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function looksLikePlaceholder(value) {
  if (!isSet(value)) return true;
  return /__PASTE|YOUR_|CHANGEME|PLACEHOLDER/i.test(String(value));
}

function buildSupabaseAuthHeaders(key) {
  const headers = { apikey: key };
  if (key.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${key}`;
  }
  return headers;
}

function getConfig() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (
    !isSet(supabaseUrl) ||
    !isSet(serviceRoleKey) ||
    !isSet(anonKey) ||
    looksLikePlaceholder(serviceRoleKey) ||
    looksLikePlaceholder(anonKey) ||
    serviceRoleKey.startsWith("sb_publishable_")
  ) {
    return null;
  }

  return { supabaseUrl, serviceRoleKey, anonKey };
}

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

function getFreePort() {
  return new Promise((resolvePromise, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Could not allocate free port.")));
        return;
      }
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolvePromise(address.port);
      });
    });
    server.on("error", reject);
  });
}

function startServer(port) {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  return spawn(command, ["next", "start", "--port", String(port), "--hostname", "127.0.0.1"], {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "ignore", "ignore"],
  });
}

async function waitForServerReady(baseUrl, serverProcess) {
  const timeoutMs = 30_000;
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (serverProcess.exitCode !== null) {
      throw new Error(`Server exited early with code ${serverProcess.exitCode}.`);
    }
    try {
      const response = await fetch(`${baseUrl}/login`, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) {
        return;
      }
    } catch {
      // Keep polling until timeout.
    }
    await sleep(250);
  }
  throw new Error("Timed out waiting for app server to start.");
}

function cookieHeader(userId, userState = "sub_active") {
  return [
    "auth_session=qa_e2e_smoke",
    "session_id=qa_e2e_smoke",
    `user_id=${encodeURIComponent(userId)}`,
    `user_state=${encodeURIComponent(userState)}`,
  ].join("; ");
}

function getQuestionsFixture() {
  const filePath = resolve(process.cwd(), "src/content/questions.json");
  const raw = readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("questions.json is empty or invalid.");
  }
  return parsed;
}

function buildSyntheticResponses() {
  const questions = getQuestionsFixture();
  return questions.map((question) => {
    const min = Number(question?.scale?.min);
    const max = Number(question?.scale?.max);
    const hasScale = Number.isFinite(min) && Number.isFinite(max);
    const value = hasScale ? Math.round((min + max) / 2) : 2;
    return {
      question_id: String(question.id),
      value,
    };
  });
}

async function assertHealthcheck(config) {
  const rpcUrl = new URL("/rest/v1/rpc/runs_schema_healthcheck", config.supabaseUrl);
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: {
      ...buildSupabaseAuthHeaders(config.serviceRoleKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`healthcheck_rpc_failed:${response.status}:${raw.slice(0, 200)}`);
  }
  const rows = raw ? JSON.parse(raw) : [];
  for (const tableName of REQUIRED_TABLES) {
    const row = rows.find((entry) => entry.table_name === tableName);
    if (!row || row.table_exists !== true || row.rls_enabled !== true) {
      throw new Error(`healthcheck_table_invalid:${tableName}`);
    }
  }
}

async function createAuthUser(config) {
  const existingUserUrl = new URL("/rest/v1/assessment_runs", config.supabaseUrl);
  existingUserUrl.searchParams.set("select", "user_id");
  existingUserUrl.searchParams.set("order", "created_at.desc");
  existingUserUrl.searchParams.set("limit", "1");
  const existingResponse = await fetch(existingUserUrl, {
    method: "GET",
    headers: {
      ...buildSupabaseAuthHeaders(config.serviceRoleKey),
      "Content-Type": "application/json",
    },
  });
  if (existingResponse.ok) {
    const raw = await existingResponse.text();
    const rows = raw ? JSON.parse(raw) : [];
    const existingUserId = Array.isArray(rows) ? rows[0]?.user_id : null;
    if (typeof existingUserId === "string" && existingUserId.length > 0) {
      return { userId: existingUserId, email: "reused-existing-user" };
    }
  }

  const email = `qae2e${Date.now()}${Math.random().toString(36).slice(2, 8)}@gmail.com`;
  const password = `QaSmoke!${Math.random().toString(36).slice(2, 10)}A1`;

  const adminUrl = new URL("/auth/v1/admin/users", config.supabaseUrl);
  const adminResponse = await fetch(adminUrl, {
    method: "POST",
    headers: {
      ...buildSupabaseAuthHeaders(config.serviceRoleKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { source: "qa_e2e_smoke" },
    }),
  });

  const adminRaw = await adminResponse.text();
  if (adminResponse.ok) {
    const adminPayload = adminRaw ? JSON.parse(adminRaw) : {};
    const adminUserId = adminPayload?.id ?? adminPayload?.user?.id ?? null;
    if (adminUserId && typeof adminUserId === "string") {
      return { userId: adminUserId, email };
    }
  }

  const url = new URL("/auth/v1/signup", config.supabaseUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: config.anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: { source: "qa_e2e_smoke" },
    }),
  });
  const raw = await response.text();
  if (!response.ok) {
    const adminSnippet = adminRaw ? ` admin=${adminRaw.slice(0, 120)}` : "";
    throw new Error(`auth_signup_failed:${response.status}:${raw.slice(0, 300)}${adminSnippet}`);
  }

  const payload = raw ? JSON.parse(raw) : {};
  const userId = payload?.user?.id ?? payload?.id ?? null;
  if (!userId || typeof userId !== "string") {
    throw new Error("auth_signup_missing_user_id");
  }

  return { userId, email };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const raw = await response.text();
  let parsed = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  }
  return { response, parsed, raw };
}

async function verifyStorageObject(config, bucket, objectPath) {
  const normalized = String(objectPath).replace(/^\/+/, "");
  const url = new URL(
    `/storage/v1/object/${encodeURIComponent(bucket)}/${normalized}`,
    config.supabaseUrl,
  );
  const response = await fetch(url, {
    method: "GET",
    headers: buildSupabaseAuthHeaders(config.serviceRoleKey),
  });
  return response.ok;
}

function printTable(rows) {
  console.log("STEP | EXPECTED | ACTUAL | PASS/FAIL");
  console.log("---|---|---|---");
  for (const row of rows) {
    console.log(`${row.step} | ${row.expected} | ${row.actual} | ${row.pass ? "PASS" : "FAIL"}`);
  }
}

async function run() {
  const config = getConfig();
  if (!config) {
    console.log("qa:e2e SKIPPED");
    console.log("Reason: Missing or placeholder Supabase env vars (URL, service role key, anon key).");
    return;
  }

  const rows = [];
  let server = null;

  try {
    await assertHealthcheck(config);
    rows.push({
      step: "healthcheck_rpc",
      expected: "200 + required tables with RLS",
      actual: "ok",
      pass: true,
    });

    const created = await createAuthUser(config);
    rows.push({
      step: "auth_signup",
      expected: "user_id created",
      actual: created.userId,
      pass: true,
    });

    const port = await getFreePort();
    const baseUrl = `http://127.0.0.1:${port}`;
    server = startServer(port);
    await waitForServerReady(baseUrl, server);
    rows.push({
      step: "app_boot",
      expected: "next start reachable",
      actual: `${baseUrl}/login`,
      pass: true,
    });

    const authCookie = cookieHeader(created.userId, "sub_active");

    const draft = await fetchJson(`${baseUrl}/api/runs/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: authCookie },
      body: JSON.stringify({
        context_scope: "work",
        focus_area: "clarity",
        source_route: "/assessment/setup",
      }),
    });
    const draftRunId = draft.parsed?.run_id;
    const draftPass = draft.response.ok && typeof draftRunId === "string";
    rows.push({
      step: "run_draft",
      expected: "200 + run_id",
      actual: draft.response.ok ? String(draftRunId ?? "missing_run_id") : `${draft.response.status}`,
      pass: draftPass,
    });
    if (!draftPass) {
      throw new Error(`draft_failed:${draft.response.status}:${draft.raw.slice(0, 300)}`);
    }

    const start = await fetchJson(`${baseUrl}/api/runs/${encodeURIComponent(draftRunId)}/start`, {
      method: "POST",
      headers: { Cookie: authCookie },
    });
    const startPass = start.response.ok;
    rows.push({
      step: "run_start",
      expected: "200",
      actual: String(start.response.status),
      pass: startPass,
    });
    if (!startPass) {
      throw new Error(`start_failed:${start.response.status}:${start.raw.slice(0, 300)}`);
    }

    const responsesPayload = buildSyntheticResponses();
    const responses = await fetchJson(
      `${baseUrl}/api/runs/${encodeURIComponent(draftRunId)}/responses`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", Cookie: authCookie },
        body: JSON.stringify({ responses: responsesPayload }),
      },
    );
    const responsesPass = responses.response.ok;
    rows.push({
      step: "run_responses",
      expected: "200 + saved_count",
      actual: responses.response.ok
        ? String(responses.parsed?.saved_count ?? "ok")
        : String(responses.response.status),
      pass: responsesPass,
    });
    if (!responsesPass) {
      throw new Error(
        `responses_failed:${responses.response.status}:${responses.raw.slice(0, 300)}`,
      );
    }

    const complete = await fetchJson(
      `${baseUrl}/api/runs/${encodeURIComponent(draftRunId)}/complete`,
      {
        method: "POST",
        headers: { Cookie: authCookie },
      },
    );
    const completePass =
      complete.response.ok &&
      Array.isArray(complete.parsed?.top_rays) &&
      typeof complete.parsed?.ray_pair_id === "string";
    rows.push({
      step: "run_complete",
      expected: "200 + top_rays + ray_pair_id",
      actual: complete.response.ok
        ? `${complete.parsed?.ray_pair_id ?? "missing_pair"}`
        : String(complete.response.status),
      pass: completePass,
    });
    if (!completePass) {
      throw new Error(
        `complete_failed:${complete.response.status}:${complete.raw.slice(0, 300)}`,
      );
    }

    const reportHtml = await fetchJson(
      `${baseUrl}/api/runs/${encodeURIComponent(draftRunId)}/report`,
      {
        method: "GET",
        headers: { Cookie: authCookie },
      },
    );
    const reportHtmlPass =
      reportHtml.response.ok &&
      reportHtml.parsed?.format === "html" &&
      typeof reportHtml.parsed?.html === "string";
    rows.push({
      step: "report_html",
      expected: "200 + html",
      actual: reportHtml.response.ok
        ? String(reportHtml.parsed?.status ?? "ok")
        : String(reportHtml.response.status),
      pass: reportHtmlPass,
    });
    if (!reportHtmlPass) {
      throw new Error(
        `report_html_failed:${reportHtml.response.status}:${reportHtml.raw.slice(0, 300)}`,
      );
    }

    const reportPdf = await fetchJson(
      `${baseUrl}/api/runs/${encodeURIComponent(draftRunId)}/report/pdf`,
      {
        method: "POST",
        headers: { Cookie: authCookie },
      },
    );
    const reportPdfSignedUrl = reportPdf.parsed?.signed_url;
    const reportPdfStoragePath = reportPdf.parsed?.storage_path;
    const reportPdfPass =
      reportPdf.response.ok &&
      typeof reportPdfSignedUrl === "string" &&
      reportPdfSignedUrl.startsWith("http") &&
      typeof reportPdfStoragePath === "string";
    rows.push({
      step: "report_pdf",
      expected: "200 + signed_url + storage_path",
      actual: reportPdf.response.ok
        ? "signed_url_ready"
        : `${reportPdf.response.status}:${reportPdf.parsed?.error ?? "error"}`,
      pass: reportPdfPass,
    });
    if (!reportPdfPass) {
      throw new Error(`report_pdf_failed:${reportPdf.response.status}:${reportPdf.raw.slice(0, 300)}`);
    }

    const reportPdfStorageOk = await verifyStorageObject(
      config,
      "reports",
      reportPdfStoragePath,
    );
    rows.push({
      step: "report_pdf_storage",
      expected: "storage object exists",
      actual: reportPdfStorageOk ? "exists" : "missing",
      pass: reportPdfStorageOk,
    });
    if (!reportPdfStorageOk) {
      throw new Error("report_pdf_storage_missing");
    }

    const sharecardTypes = [
      {
        type: "results",
        payload: {
          run_id: draftRunId,
          ray_pair_id: complete.parsed.ray_pair_id,
          top_rays: complete.parsed.top_rays,
        },
      },
      {
        type: "growth",
        payload: {
          run_id: draftRunId,
          ray_pair_id: complete.parsed.ray_pair_id,
          top_rays: complete.parsed.top_rays,
        },
      },
      {
        type: "morning",
        payload: {
          run_id: draftRunId,
          short_line: "Run one repeatable rep today.",
        },
      },
    ];

    for (const entry of sharecardTypes) {
      const share = await fetchJson(`${baseUrl}/api/sharecards/${entry.type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: authCookie },
        body: JSON.stringify(entry.payload),
      });
      const shareSignedUrl = share.parsed?.signed_url;
      const shareStoragePath = share.parsed?.storage_path;
      const sharePass =
        share.response.ok &&
        typeof shareSignedUrl === "string" &&
        typeof shareStoragePath === "string";
      rows.push({
        step: `sharecard_${entry.type}`,
        expected: "200 + signed_url + storage_path",
        actual: share.response.ok
          ? "signed_url_ready"
          : `${share.response.status}:${share.parsed?.error ?? "error"}`,
        pass: sharePass,
      });
      if (!sharePass) {
        throw new Error(
          `sharecard_${entry.type}_failed:${share.response.status}:${share.raw.slice(0, 300)}`,
        );
      }

      const storageOk = await verifyStorageObject(
        config,
        "sharecards",
        shareStoragePath,
      );
      rows.push({
        step: `sharecard_${entry.type}_storage`,
        expected: "storage object exists",
        actual: storageOk ? "exists" : "missing",
        pass: storageOk,
      });
      if (!storageOk) {
        throw new Error(`sharecard_${entry.type}_storage_missing`);
      }
    }

    printTable(rows);
    console.log("qa:e2e PASS");
  } catch (error) {
    printTable(rows);
    console.error("qa:e2e FAILED");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    if (server && server.exitCode === null) {
      server.kill("SIGTERM");
      await sleep(250);
      if (server.exitCode === null) {
        server.kill("SIGKILL");
      }
    }
  }
}

run().catch((error) => {
  console.error("qa:e2e FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
