import { spawn } from "node:child_process";
import { createServer } from "node:net";
import process from "node:process";
import { loadEnvIfMissing } from "./load-env.mjs";

loadEnvIfMissing();

function buildAuthHeaders(key) {
  const headers = { apikey: key };
  if (key.startsWith("eyJ")) {
    headers["Authorization"] = `Bearer ${key}`;
  }
  return headers;
}

function getSupabaseConfig() {
  const baseUrl =
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    null;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
  if (!baseUrl || !serviceRoleKey) {
    return null;
  }
  return { baseUrl, serviceRoleKey };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Could not resolve free port.")));
        return;
      }
      server.close((closeError) => {
        if (closeError) {
          reject(closeError);
          return;
        }
        resolve(address.port);
      });
    });
    server.on("error", reject);
  });
}

function startServer(port) {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const args = ["next", "start", "--port", String(port), "--hostname", "127.0.0.1"];
  return spawn(command, args, {
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
      throw new Error(`App server exited early with code ${serverProcess.exitCode}.`);
    }
    try {
      const response = await fetch(`${baseUrl}/login`, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) {
        return;
      }
    } catch {
      // Keep waiting.
    }
    await sleep(250);
  }
  throw new Error("Timed out waiting for server startup.");
}

async function checkSchema(config) {
  const url = new URL("/rest/v1/rpc/phase2d_retention_schema_healthcheck", config.baseUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...buildAuthHeaders(config.serviceRoleKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const raw = await response.text();
  if (!response.ok) {
    throw new Error(raw || `schema_healthcheck_failed:${response.status}`);
  }
  const rows = raw ? JSON.parse(raw) : [];
  const expectedTables = ["email_jobs", "morning_entries", "micro_joy_entries"];
  const failures = [];

  for (const tableName of expectedTables) {
    const row = rows.find((item) => item.table_name === tableName);
    if (!row) {
      failures.push(`${tableName}:missing_row`);
      continue;
    }
    if (!row.table_exists) {
      failures.push(`${tableName}:missing_table`);
    }
    if (!row.rls_enabled) {
      failures.push(`${tableName}:rls_disabled`);
    }
  }

  return { failures, rows };
}

async function checkUnauthApis(baseUrl) {
  const checks = [
    {
      route: "/api/morning/entry",
      method: "GET",
    },
    {
      route: "/api/morning/entry",
      method: "PUT",
      body: JSON.stringify({ reps_logged: 1 }),
    },
    {
      route: "/api/micro-joy/suggestions",
      method: "POST",
      body: JSON.stringify({ category: "default" }),
    },
    {
      route: "/api/micro-joy/entry",
      method: "POST",
      body: JSON.stringify({ entry_id: "x" }),
    },
    {
      route: "/api/growth/summary",
      method: "GET",
    },
    {
      route: "/api/toolkit/deliver",
      method: "POST",
      body: JSON.stringify({ source_route: "/toolkit" }),
    },
  ];

  const rows = [];
  for (const check of checks) {
    const response = await fetch(`${baseUrl}${check.route}`, {
      method: check.method,
      headers: check.body ? { "Content-Type": "application/json" } : undefined,
      body: check.body,
      redirect: "manual",
    });
    const pass = response.status === 401 || response.status === 403;
    rows.push({
      route: `${check.method} ${check.route}`,
      expected: "401 or 403",
      actual: response.status,
      pass,
    });
  }
  return rows;
}

async function run() {
  const config = getSupabaseConfig();
  if (!config) {
    console.log("qa:phase2d SKIPPED");
    console.log("Reason: Supabase env not configured.");
    return;
  }

  const schema = await checkSchema(config);
  if (schema.failures.length > 0) {
    console.error("qa:phase2d FAILED");
    for (const failure of schema.failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = startServer(port);

  try {
    await waitForServerReady(baseUrl, server);
    const apiChecks = await checkUnauthApis(baseUrl);

    console.log("ROUTE | EXPECTED | ACTUAL | PASS/FAIL");
    console.log("---|---|---|---");
    for (const row of apiChecks) {
      console.log(
        `${row.route} | ${row.expected} | ${row.actual} | ${row.pass ? "PASS" : "FAIL"}`,
      );
    }

    const failedApiRows = apiChecks.filter((row) => !row.pass);
    if (failedApiRows.length > 0) {
      console.error("qa:phase2d FAILED");
      process.exit(1);
    }

    console.log("qa:phase2d PASS");
    console.log("Schema tables checked: 3");
    console.log(`Unauth API checks: ${apiChecks.length}`);
  } finally {
    if (server.exitCode === null) {
      server.kill("SIGTERM");
      await sleep(250);
      if (server.exitCode === null) {
        server.kill("SIGKILL");
      }
    }
  }
}

run().catch((error) => {
  console.error("qa:phase2d FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
