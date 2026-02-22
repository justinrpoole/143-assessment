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

function getConfig() {
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

async function callHealthcheck(baseUrl, serviceRoleKey) {
  const url = new URL("/rest/v1/rpc/runs_schema_healthcheck", baseUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...buildAuthHeaders(serviceRoleKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

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

async function run() {
  const config = getConfig();
  if (!config) {
    console.log("qa:runs SKIPPED");
    console.log("Reason: Supabase env not configured.");
    return;
  }

  const { response, parsed, raw } = await callHealthcheck(
    config.baseUrl,
    config.serviceRoleKey,
  );
  if (!response.ok) {
    console.error("qa:runs FAILED");
    console.error(`Healthcheck RPC failed: ${response.status}`);
    console.error(raw || "No error payload.");
    process.exit(1);
  }

  if (!Array.isArray(parsed)) {
    console.error("qa:runs FAILED");
    console.error("Healthcheck response is not an array.");
    process.exit(1);
  }

  const expectedTables = new Set([
    "assessment_runs",
    "assessment_responses",
    "assessment_results",
    "assessment_reports",
  ]);
  const failures = [];

  for (const row of parsed) {
    if (!expectedTables.has(row.table_name)) {
      continue;
    }
    if (!row.table_exists) {
      failures.push(`${row.table_name}: missing table`);
      continue;
    }
    if (!row.rls_enabled) {
      failures.push(`${row.table_name}: RLS disabled`);
    }
  }

  for (const tableName of expectedTables) {
    if (!parsed.some((row) => row.table_name === tableName)) {
      failures.push(`${tableName}: missing in healthcheck output`);
    }
  }

  if (failures.length > 0) {
    console.error("qa:runs FAILED");
    failures.forEach((failure, index) => {
      console.error(`${index + 1}. ${failure}`);
    });
    process.exit(1);
  }

  console.log("qa:runs PASS");
  console.log(`Tables checked: ${expectedTables.size}`);
  console.log("RLS enabled: yes");
}

run().catch((error) => {
  console.error("qa:runs FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
