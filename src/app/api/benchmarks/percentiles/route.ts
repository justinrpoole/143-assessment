import { NextResponse } from "next/server";

import { supabaseRestFetch } from "@/lib/db/supabase-rest";

/**
 * GET /api/benchmarks/percentiles?ray_scores=R1:72,R2:65,...
 *
 * Returns percentile rank for each provided ray score relative to all
 * assessment_results in the database. Feature-gated: returns empty if
 * population < 100 assessments.
 *
 * Response: { percentiles: Record<string, number>, population: number }
 */

const MIN_POPULATION = 100;

/** In-memory cache: recompute at most once per hour */
let cache: { distributions: Record<string, number[]>; population: number; ts: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface ResultRow {
  ray_scores: Record<string, number> | null;
}

async function loadDistributions(): Promise<{
  distributions: Record<string, number[]>;
  population: number;
}> {
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    return cache;
  }

  // Fetch all ray_scores from assessment_results
  const res = await supabaseRestFetch<ResultRow[]>({
    restPath: "assessment_results",
    query: {
      select: "ray_scores",
      limit: 10000,
    },
  });

  const rows = res.data ?? [];
  const population = rows.length;

  // Build sorted arrays per ray
  const buckets: Record<string, number[]> = {};
  for (const row of rows) {
    if (!row.ray_scores || typeof row.ray_scores !== "object") continue;
    for (const [rayId, score] of Object.entries(row.ray_scores)) {
      if (typeof score !== "number") continue;
      if (!buckets[rayId]) buckets[rayId] = [];
      buckets[rayId].push(score);
    }
  }

  // Sort each ray's scores ascending for percentile computation
  for (const rayId of Object.keys(buckets)) {
    buckets[rayId].sort((a, b) => a - b);
  }

  cache = { distributions: buckets, population, ts: Date.now() };
  return cache;
}

/**
 * Compute percentile rank: percentage of scores strictly below the given value.
 * Uses linear interpolation for ties.
 */
function percentileRank(sorted: number[], value: number): number {
  const n = sorted.length;
  if (n === 0) return 50;

  let below = 0;
  let equal = 0;
  for (const s of sorted) {
    if (s < value) below++;
    else if (s === value) equal++;
  }

  // Percentile rank = (below + 0.5 * equal) / n * 100
  return Math.round(((below + 0.5 * equal) / n) * 100);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rayScoresParam = searchParams.get("ray_scores");

  if (!rayScoresParam) {
    return NextResponse.json({ error: "ray_scores parameter required" }, { status: 400 });
  }

  // Parse ray_scores: "R1:72,R2:65,R3:80,..."
  const userScores: Record<string, number> = {};
  for (const pair of rayScoresParam.split(",")) {
    const [rayId, scoreStr] = pair.split(":");
    if (rayId && scoreStr) {
      const score = Number(scoreStr);
      if (!isNaN(score)) {
        userScores[rayId] = score;
      }
    }
  }

  try {
    const { distributions, population } = await loadDistributions();

    // Feature gate: require minimum population
    if (population < MIN_POPULATION) {
      return NextResponse.json({ percentiles: {}, population, gated: true });
    }

    const percentiles: Record<string, number> = {};
    for (const [rayId, score] of Object.entries(userScores)) {
      const sorted = distributions[rayId];
      if (sorted && sorted.length > 0) {
        percentiles[rayId] = percentileRank(sorted, score);
      }
    }

    return NextResponse.json({ percentiles, population, gated: false });
  } catch (err) {
    return NextResponse.json(
      { error: "percentile_computation_failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
