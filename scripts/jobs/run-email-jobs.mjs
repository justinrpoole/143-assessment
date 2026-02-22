import process from "node:process";
import { loadEnvIfMissing } from "../qa/load-env.mjs";

loadEnvIfMissing();

function getConfig() {
  const baseUrl =
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    null;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
  return baseUrl && serviceRoleKey ? { baseUrl, serviceRoleKey } : null;
}

function authHeaders(serviceRoleKey) {
  const headers = { apikey: serviceRoleKey, "Content-Type": "application/json" };
  if (serviceRoleKey.startsWith("eyJ")) {
    headers["Authorization"] = `Bearer ${serviceRoleKey}`;
  }
  return headers;
}

function storageUrl(baseUrl, restPath, query = {}) {
  const path = restPath.startsWith("/") ? restPath.slice(1) : restPath;
  const url = new URL(`/rest/v1/${path}`, baseUrl);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function sendViaProvider({ to, templateId, payload }) {
  const apiUrl = process.env.EMAIL_PROVIDER_API_URL ?? "";
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY ?? "";
  if (!apiUrl || !apiKey) {
    console.info(
      "[email:stub]",
      JSON.stringify({ to, template_id: templateId, payload }),
    );
    return { ok: true, messageId: "stubbed" };
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to,
        template_id: templateId,
        payload,
      }),
    });
    const raw = await response.text();
    if (!response.ok) {
      return { ok: false, error: raw || `provider_error:${response.status}` };
    }
    let parsed = {};
    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      parsed = {};
    }
    return { ok: true, messageId: parsed.id ?? "provider_sent" };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function listDueJobs(config) {
  const url = storageUrl(config.baseUrl, "email_jobs", {
    select: "id,user_id,type,payload,send_at,status,attempts,last_error,sent_at",
    status: "eq.queued",
    send_at: `lte.${new Date().toISOString()}`,
    order: "send_at.asc",
    limit: 50,
  });
  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(config.serviceRoleKey),
  });
  const raw = await response.text();
  if (!response.ok) {
    throw new Error(raw || "list_due_jobs_failed");
  }
  return raw ? JSON.parse(raw) : [];
}

async function patchJob(config, jobId, body, extraQuery = {}) {
  const url = storageUrl(config.baseUrl, "email_jobs", {
    id: `eq.${jobId}`,
    ...extraQuery,
  });
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...authHeaders(config.serviceRoleKey),
      Prefer: "return=minimal",
    },
    body: JSON.stringify(body),
  });
  const raw = await response.text();
  if (!response.ok) {
    throw new Error(raw || "patch_job_failed");
  }
}

async function run() {
  const config = getConfig();
  if (!config) {
    console.log("run-email-jobs SKIPPED");
    console.log("Reason: Supabase env not configured.");
    return;
  }

  const jobs = await listDueJobs(config);
  if (!Array.isArray(jobs) || jobs.length === 0) {
    console.log("run-email-jobs PASS");
    console.log("Queued jobs processed: 0");
    return;
  }

  let sentCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const job of jobs) {
    const jobId = String(job.id);
    const payload = typeof job.payload === "object" && job.payload ? job.payload : {};
    const toEmail = typeof payload.to_email === "string" ? payload.to_email : null;

    try {
      await patchJob(config, jobId, {
        status: "processing",
        attempts: Number(job.attempts ?? 0) + 1,
      }, { status: "eq.queued" });

      if (!toEmail) {
        await patchJob(config, jobId, {
          status: "skipped",
          last_error: "recipient_missing",
        });
        skippedCount += 1;
        continue;
      }

      const sent = await sendViaProvider({
        to: toEmail,
        templateId: String(job.type),
        payload,
      });
      if (!sent.ok) {
        await patchJob(config, jobId, {
          status: "failed",
          last_error: sent.error ?? "provider_send_failed",
        });
        failedCount += 1;
        continue;
      }

      await patchJob(config, jobId, {
        status: "sent",
        sent_at: new Date().toISOString(),
        last_error: null,
      });
      sentCount += 1;
    } catch (error) {
      failedCount += 1;
      const detail = error instanceof Error ? error.message : String(error);
      try {
        await patchJob(config, jobId, {
          status: "failed",
          last_error: detail,
        });
      } catch {
        // Ignore nested failure, continue loop.
      }
    }
  }

  console.log("run-email-jobs PASS");
  console.log(
    `Queued jobs processed: ${jobs.length}; sent=${sentCount}; skipped=${skippedCount}; failed=${failedCount}`,
  );
  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error("run-email-jobs FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
