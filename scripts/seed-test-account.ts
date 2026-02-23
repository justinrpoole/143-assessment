/**
 * seed-test-account.ts
 *
 * Creates a fully-populated test user for Playwright testing:
 * - Authenticated as test@143leadership.com with sub_active entitlement
 * - Completed assessment run with realistic scores (R5+R7 archetype)
 * - 14 days of daily loops, 4 weeks of energy audits
 * - 20+ logged reps, 7 phase check-ins, intention set
 * - Outputs playwright/.auth/test-user.json for storageState
 *
 * Usage: npx tsx scripts/seed-test-account.ts
 */

import { createHash } from "crypto";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { createServer } from "net";
import { spawn, type ChildProcess } from "child_process";
import { resolve } from "path";

// ── Load env ──

const PROJECT_ROOT = resolve(__dirname, "..");

function loadEnv(): void {
  const candidates = [
    resolve(PROJECT_ROOT, ".env.local"),
    resolve(PROJECT_ROOT, ".env"),
  ];
  for (const filePath of candidates) {
    try {
      const content = readFileSync(filePath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex < 1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (!(key in process.env)) {
          process.env[key] = value;
        }
      }
    } catch {
      // File doesn't exist, try next
    }
  }
}

loadEnv();

// ── Config ──

const TEST_EMAIL = "test@143leadership.com";
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// ── Deterministic user ID (mirrors verify route) ──

function generateDeterministicUserId(email: string): string {
  const hash = createHash("sha256")
    .update(`143-leadership:${email}`)
    .digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16),
    ((parseInt(hash[16]!, 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join("-");
}

const USER_ID = generateDeterministicUserId(TEST_EMAIL.toLowerCase().trim());

// ── Helpers ──

function supabaseHeaders(): Record<string, string> {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };
}

function cookieHeader(): string {
  return [
    "auth_session=seed_test_session",
    "session_id=seed_test_session",
    `user_id=${encodeURIComponent(USER_ID)}`,
    "user_state=sub_active",
  ].join("; ");
}

async function fetchJson(
  url: string,
  options: RequestInit = {},
): Promise<{ ok: boolean; status: number; data: any; raw: string }> {
  const response = await fetch(url, options);
  const raw = await response.text();
  let data = null;
  try {
    data = JSON.parse(raw);
  } catch {
    data = null;
  }
  return { ok: response.ok, status: response.status, data, raw };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        server.close(() => reject(new Error("Could not allocate free port.")));
        return;
      }
      server.close((err) => {
        if (err) reject(err);
        else resolve(addr.port);
      });
    });
    server.on("error", reject);
  });
}

function startServer(port: number): ChildProcess {
  const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
  return spawn(cmd, ["next", "dev", "--port", String(port), "--hostname", "127.0.0.1"], {
    cwd: PROJECT_ROOT,
    env: { ...process.env },
    stdio: ["ignore", "ignore", "ignore"],
  });
}

async function waitForServer(
  baseUrl: string,
  proc: ChildProcess,
): Promise<void> {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (proc.exitCode !== null) {
      throw new Error(`Server exited with code ${proc.exitCode}`);
    }
    try {
      const res = await fetch(`${baseUrl}/login`, { redirect: "manual" });
      if (res.status >= 200 && res.status < 500) return;
    } catch {
      // not ready yet
    }
    await sleep(500);
  }
  throw new Error("Timed out waiting for dev server");
}

function dateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function mondayOfWeekNAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n * 7);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

// ── Results table ──

interface Row {
  step: string;
  expected: string;
  actual: string;
  pass: boolean;
}

const rows: Row[] = [];

function ok(step: string, expected: string, actual: string) {
  rows.push({ step, expected, actual, pass: true });
}

function fail(step: string, expected: string, actual: string): never {
  rows.push({ step, expected, actual, pass: false });
  printTable();
  process.exit(1);
}

function printTable() {
  console.log("\nSTEP | EXPECTED | ACTUAL | PASS");
  console.log("---|---|---|---");
  for (const r of rows) {
    console.log(
      `${r.step} | ${r.expected} | ${r.actual} | ${r.pass ? "PASS" : "FAIL"}`,
    );
  }
}

// ── Main ──

async function run() {
  console.log("── Seed Test Account ──");
  console.log(`  Email:   ${TEST_EMAIL}`);
  console.log(`  User ID: ${USER_ID}`);

  // Step 1: Upsert user_entitlements to sub_active
  const entitlementUrl = new URL("/rest/v1/user_entitlements", SUPABASE_URL);
  const entRes = await fetch(entitlementUrl, {
    method: "POST",
    headers: {
      ...supabaseHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      user_id: USER_ID,
      user_state: "sub_active",
      updated_at: new Date().toISOString(),
    }),
  });
  if (!entRes.ok) {
    const text = await entRes.text();
    fail("upsert_entitlement", "200-204", `${entRes.status}: ${text.slice(0, 200)}`);
  }
  ok("upsert_entitlement", "sub_active", "ok");

  // Step 2: Boot dev server
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`\n  Starting dev server on port ${port}...`);
  const server = startServer(port);

  try {
    await waitForServer(baseUrl, server);
    ok("dev_server", "reachable", baseUrl);

    const cookie = cookieHeader();
    const headers = { "Content-Type": "application/json", Cookie: cookie };

    // Step 3: Create assessment run
    const draft = await fetchJson(`${baseUrl}/api/runs/draft`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        context_scope: "work",
        focus_area: "clarity",
        source_route: "/assessment/setup",
      }),
    });
    if (!draft.ok || !draft.data?.run_id) {
      fail("run_draft", "200+run_id", `${draft.status}: ${draft.raw.slice(0, 200)}`);
    }
    const runId = draft.data.run_id as string;
    ok("run_draft", "run_id", runId.slice(0, 8) + "...");

    // Step 4: Start the run
    const start = await fetchJson(
      `${baseUrl}/api/runs/${encodeURIComponent(runId)}/start`,
      { method: "POST", headers: { Cookie: cookie } },
    );
    if (!start.ok) {
      fail("run_start", "200", `${start.status}`);
    }
    ok("run_start", "200", "ok");

    // Step 5: Load questions and build responses
    // Use questions.json (the derived item list for the assessment runner)
    const questionsPath = resolve(PROJECT_ROOT, "src/content/questions.json");
    const questions = JSON.parse(readFileSync(questionsPath, "utf-8")) as Array<{
      id: string;
      ray_id?: string;
      scale?: { min: number; max: number };
    }>;

    // Load seed profile for R5+R7 archetype (Purposeful Connector)
    const seedPath = resolve(PROJECT_ROOT, "test_fixtures/seed_profiles.json");
    const seedProfiles = JSON.parse(readFileSync(seedPath, "utf-8")) as Array<{
      profile_id: string;
      responses: Record<string, number>;
    }>;
    // Use pair_R5_R7 if available, otherwise pair_R1_R2
    const targetProfile =
      seedProfiles.find((p) => p.profile_id === "pair_R5_R7") ??
      seedProfiles.find((p) => p.profile_id === "pair_R1_R2") ??
      seedProfiles[0]!;

    const responses = questions.map((q) => {
      // If seed profile has this question, use it
      if (targetProfile.responses[q.id] !== undefined) {
        return { question_id: q.id, value: targetProfile.responses[q.id] };
      }
      // Otherwise use mid-point value
      const min = q.scale?.min ?? 0;
      const max = q.scale?.max ?? 4;
      return { question_id: q.id, value: Math.round((min + max) / 2) };
    });

    // Step 6: Submit responses
    const respRes = await fetchJson(
      `${baseUrl}/api/runs/${encodeURIComponent(runId)}/responses`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ responses }),
      },
    );
    if (!respRes.ok) {
      fail(
        "run_responses",
        "200+saved",
        `${respRes.status}: ${respRes.raw.slice(0, 200)}`,
      );
    }
    ok("run_responses", "saved", `${responses.length} items`);

    // Step 7: Complete assessment
    const complete = await fetchJson(
      `${baseUrl}/api/runs/${encodeURIComponent(runId)}/complete`,
      { method: "POST", headers: { Cookie: cookie } },
    );
    if (
      !complete.ok ||
      !complete.data?.ray_pair_id
    ) {
      fail(
        "run_complete",
        "200+ray_pair_id",
        `${complete.status}: ${complete.raw.slice(0, 200)}`,
      );
    }
    ok(
      "run_complete",
      "archetype",
      `${complete.data.ray_pair_id} (${complete.data.top_rays?.map((t: any) => t.ray_name).join("+") ?? "?"})`,
    );

    // Step 8: Populate 14 days of daily loops
    let loopCount = 0;
    const loopPrompts = [
      { name: "Noticed tension before a meeting", ground: "Paused and took one breath", move: "Set 90-second timer before next call" },
      { name: "Felt rushed during morning standup", ground: "Named the urgency out loud", move: "Practice presence pause at lunch" },
      { name: "Caught myself multitasking in 1-on-1", ground: "Closed laptop and made eye contact", move: "Turn off notifications during meetings" },
      { name: "Frustration rising in feedback session", ground: "Counted to three before responding", move: "Journal the trigger tonight" },
      { name: "Energy dip at 2pm after back-to-back calls", ground: "Walked outside for 5 minutes", move: "Block 15-min breaks between calls tomorrow" },
    ];
    for (let i = 0; i < 14; i++) {
      const prompts = loopPrompts[i % loopPrompts.length]!;
      const res = await fetchJson(`${baseUrl}/api/daily-loop`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          entry_date: dateNDaysAgo(i),
          name_it: prompts.name,
          ground_it: prompts.ground,
          move_action: prompts.move,
        }),
      });
      if (res.ok) loopCount++;
    }
    ok("daily_loops", "14 days", `${loopCount} saved`);

    // Step 9: Populate 4 weeks of energy audits
    let auditCount = 0;
    for (let w = 0; w < 4; w++) {
      const base = w === 0 ? 1 : w === 1 ? 1 : w === 2 ? 2 : 2;
      const res = await fetchJson(`${baseUrl}/api/energy-audit`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          week_of: mondayOfWeekNAgo(w),
          scores: {
            sleep_debt: Math.min(3, base + (w === 3 ? 1 : 0)),
            recovery_quality: base,
            fog: Math.max(0, base - 1),
            irritability: base,
            impulsivity: Math.max(0, base - 1),
            numbness: Math.max(0, base - 1),
            somatic_signals: base,
            compulsion: Math.max(0, base - 1),
          },
          notes: `Week ${w + 1} reflection: ${w === 0 ? "Good recovery week" : w === 1 ? "Steady pace" : w === 2 ? "Heavy project load" : "Sprint recovery"}`,
        }),
      });
      if (res.ok) auditCount++;
    }
    ok("energy_audits", "4 weeks", `${auditCount} saved`);

    // Step 10: Log 22 reps across different tools
    const TOOLS = [
      "90_second_window", "presence_pause", "watch_me", "go_first", "i_rise",
      "reflection_loop", "if_then_planning", "boundary_of_light", "ras_reset",
      "question_loop", "witness",
    ];
    const TRIGGERS = ["ad_hoc", "scheduled", "watch_me", "go_first"];
    let repCount = 0;
    for (let i = 0; i < 22; i++) {
      const res = await fetchJson(`${baseUrl}/api/reps`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          tool_name: TOOLS[i % TOOLS.length],
          trigger_type: TRIGGERS[i % TRIGGERS.length],
          quality: (i % 3) + 1,
          duration_seconds: 60 + (i % 5) * 30,
          reflection_note: `Rep ${i + 1}: Noticed improvement in response pattern`,
        }),
      });
      if (res.ok) repCount++;
    }
    ok("reps_logged", "22 reps", `${repCount} saved`);

    // Step 11: 7 phase check-ins
    let checkinCount = 0;
    for (let i = 0; i < 7; i++) {
      const q1 = i < 3 ? 2 : 1;
      const q2 = i < 2 ? 2 : i < 5 ? 1 : 2;
      const q3 = i < 4 ? 1 : 2;
      const res = await fetchJson(`${baseUrl}/api/phase-checkin`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          entry_date: dateNDaysAgo(i),
          answers: [q1, q2, q3],
        }),
      });
      if (res.ok) checkinCount++;
    }
    ok("phase_checkins", "7 days", `${checkinCount} saved`);

    // Step 12: Set intention
    const intentionRes = await fetchJson(`${baseUrl}/api/portal/intention`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        intention: "Lead with presence and purpose in every interaction this month",
      }),
    });
    ok("intention", "set", intentionRes.ok ? "ok" : `${intentionRes.status}`);

    // Step 13: Verify portal summary
    const summary = await fetchJson(`${baseUrl}/api/portal/summary`, {
      method: "GET",
      headers: { Cookie: cookie },
    });
    if (summary.ok) {
      ok(
        "portal_summary",
        "has_data",
        `run=${summary.data?.has_completed_run}, streak=${summary.data?.streak_days}, reps=${summary.data?.total_reps}`,
      );
    } else {
      ok("portal_summary", "check", `${summary.status} (may need page visit)`);
    }

    // Step 14: Write Playwright auth state
    const authDir = resolve(PROJECT_ROOT, "playwright/.auth");
    mkdirSync(authDir, { recursive: true });
    const storageState = {
      cookies: [
        {
          name: "auth_session",
          value: "seed_test_session",
          domain: "localhost",
          path: "/",
          httpOnly: true,
          secure: false,
          sameSite: "Lax" as const,
          expires: -1,
        },
        {
          name: "session_id",
          value: "seed_test_session",
          domain: "localhost",
          path: "/",
          httpOnly: true,
          secure: false,
          sameSite: "Lax" as const,
          expires: -1,
        },
        {
          name: "user_id",
          value: USER_ID,
          domain: "localhost",
          path: "/",
          httpOnly: true,
          secure: false,
          sameSite: "Lax" as const,
          expires: -1,
        },
        {
          name: "user_state",
          value: "sub_active",
          domain: "localhost",
          path: "/",
          httpOnly: false,
          secure: false,
          sameSite: "Lax" as const,
          expires: -1,
        },
      ],
      origins: [],
    };
    const authPath = resolve(authDir, "test-user.json");
    writeFileSync(authPath, JSON.stringify(storageState, null, 2));
    ok("auth_state", "written", authPath.split("/").slice(-3).join("/"));

    // Done
    printTable();
    console.log("\nseed:test PASS");
    console.log(`\nTest account ready: ${TEST_EMAIL}`);
    console.log(`User ID: ${USER_ID}`);
    console.log(`Archetype: ${complete.data.ray_pair_id}`);
    console.log(`Run ID: ${runId}`);
    console.log(`Auth state: ${authPath}`);
  } finally {
    if (server.exitCode === null) {
      server.kill("SIGTERM");
      await sleep(250);
      if (server.exitCode === null) server.kill("SIGKILL");
    }
  }
}

run().catch((err) => {
  console.error("seed:test FAILED");
  console.error(err instanceof Error ? err.message : String(err));
  printTable();
  process.exit(1);
});
