/**
 * backfill-pipeline-scores.ts
 *
 * Re-scores all completed runs from the last 90 days using the canonical
 * scoring pipeline (pipeline.ts), replacing legacy score-assessment.mjs results.
 *
 * Usage:
 *   npx tsx scripts/backfill-pipeline-scores.ts           # dry-run (no writes)
 *   npx tsx scripts/backfill-pipeline-scores.ts --commit  # write updated results
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local or env.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ── Load env vars ──────────────────────────────────────────
function loadEnv() {
  const hasUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (hasUrl) return;

  const root = resolve(process.cwd());
  for (const name of [".env.local", ".env"]) {
    try {
      const content = readFileSync(resolve(root, name), "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq < 1) continue;
        const key = trimmed.slice(0, eq).trim();
        const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
    } catch { /* file not found */ }
  }
}

loadEnv();

// ── Supabase REST helpers ──────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

function headers(extra?: Record<string, string>) {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function supaGet<T>(path: string): Promise<T> {
  const url = new URL(`/rest/v1/${path}`, SUPABASE_URL);
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`GET ${path}: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function supaPatch(table: string, match: Record<string, string>, body: Record<string, unknown>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(match)) {
    params.set(k, `eq.${v}`);
  }
  const url = new URL(`/rest/v1/${table}?${params}`, SUPABASE_URL);
  const res = await fetch(url, {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${table}: ${res.status} ${await res.text()}`);
}

// ── Import pipeline modules ────────────────────────────────
import { scoreAssessment } from "../src/lib/scoring/pipeline";
import { loadItemBanks } from "../src/lib/scoring/load-item-banks";
import { buildResponsePacket } from "../src/lib/scoring/build-response-packet";
import type { AssessmentRunRow, AssessmentResponseRow } from "../src/lib/db/assessment-runs";

// ── Main ───────────────────────────────────────────────────
const DRY_RUN = !process.argv.includes("--commit");

interface ReflectionRow {
  prompt_id: string;
  response_text: string;
}

async function main() {
  console.log(`\nBackfill pipeline scores${DRY_RUN ? " (DRY RUN)" : " (COMMIT MODE)"}\n`);

  const banks = loadItemBanks();
  const allItems = [...banks.rayItems, ...banks.toolItems, ...banks.eclipseItems, ...banks.validityItems];

  // Fetch completed runs from last 90 days
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const runs = await supaGet<AssessmentRunRow[]>(
    `assessment_runs?status=eq.completed&completed_at=gte.${cutoff}&order=completed_at.desc`,
  );

  console.log(`Found ${runs.length} completed runs since ${cutoff.slice(0, 10)}\n`);

  let updated = 0;
  let skipped = 0;
  let errored = 0;

  for (const run of runs) {
    const label = `run ${run.id} (#${run.run_number})`;
    try {
      // Fetch responses
      const responseRows = await supaGet<AssessmentResponseRow[]>(
        `assessment_responses?run_id=eq.${run.id}&select=run_id,user_id,question_id,value`,
      );
      if (responseRows.length === 0) {
        console.log(`  SKIP ${label}: no responses`);
        skipped++;
        continue;
      }

      // Fetch reflections (may be empty for pre-reflection runs)
      let reflectionRows: ReflectionRow[] = [];
      try {
        reflectionRows = await supaGet<ReflectionRow[]>(
          `assessment_reflections?run_id=eq.${run.id}&select=prompt_id,response_text`,
        );
      } catch {
        // Table may not exist yet for older environments
      }
      const reflections = Object.fromEntries(
        reflectionRows.filter(r => r.response_text.trim()).map(r => [r.prompt_id, r.response_text]),
      );

      // Build packet and score
      const packet = buildResponsePacket({ run, responseRows, reflections, allItems });
      const pipelineOutput = scoreAssessment(packet, banks);

      // Derive legacy-compat fields
      const rayScoresById: Record<string, number> = {};
      for (const [rayId, rayOut] of Object.entries(pipelineOutput.rays)) {
        rayScoresById[rayId] = rayOut.score;
      }
      const topRays = pipelineOutput.light_signature.top_two.map(t => t.ray_id);
      const rayPairId = pipelineOutput.light_signature.archetype?.pair_code
        ?? `${topRays[0]}-${topRays[1]}`;

      const resultsPayload = {
        run_id: run.id,
        run_number: run.run_number,
        assessment_mode: run.run_number > 1 ? "monthly_43" : "full_143",
        computed_at: new Date().toISOString(),
        user_state_at_start: run.user_state_at_start,
        context_scope: run.context_scope,
        focus_area: run.focus_area,
        source_route: run.source_route,
        ray_scores_by_id: rayScoresById,
        top_rays: topRays,
        ray_pair_id: rayPairId,
        ray_pair: rayPairId,
        confidence_band: pipelineOutput.data_quality.confidence_band,
        pipeline_output: pipelineOutput,
      };

      if (DRY_RUN) {
        console.log(`  OK   ${label}: ${rayPairId} (${topRays.join(", ")}) — dry run, not writing`);
      } else {
        await supaPatch("assessment_results", { run_id: run.id }, {
          ray_scores: rayScoresById,
          top_rays: topRays,
          ray_pair_id: rayPairId,
          results_payload: resultsPayload,
          computed_at: new Date().toISOString(),
        });
        console.log(`  OK   ${label}: ${rayPairId} (${topRays.join(", ")}) — updated`);
      }
      updated++;
    } catch (err) {
      console.error(`  ERR  ${label}: ${err instanceof Error ? err.message : String(err)}`);
      errored++;
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}, Errors: ${errored}`);
  if (DRY_RUN && updated > 0) {
    console.log("Re-run with --commit to write changes.");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
