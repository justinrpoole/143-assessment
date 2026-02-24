import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

interface ResultRow {
  run_id: string;
  ray_scores: Record<string, number> | null;
  computed_at: string;
}

interface RunRow {
  id: string;
  run_number: number;
}

/**
 * GET /api/runs/history
 *
 * Returns all completed assessment runs with their ray scores
 * for the authenticated user. Used by ResultsStabilityScore
 * to compute multi-run stability coefficients.
 */
export async function GET() {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // Fetch completed runs
    const runRes = await supabaseRestFetch<RunRow[]>({
      restPath: "assessment_runs",
      query: {
        select: "id,run_number",
        user_id: `eq.${auth.userId}`,
        status: "eq.completed",
        order: "run_number.asc",
        limit: 20,
      },
    });

    const completedRuns = runRes.data ?? [];
    if (completedRuns.length === 0) {
      return NextResponse.json({ runs: [] });
    }

    // Fetch results for all completed runs
    const runIds = completedRuns.map((r) => r.id);
    const resultRes = await supabaseRestFetch<ResultRow[]>({
      restPath: "assessment_results",
      query: {
        select: "run_id,ray_scores,computed_at",
        user_id: `eq.${auth.userId}`,
        run_id: `in.(${runIds.join(",")})`,
        order: "computed_at.asc",
      },
    });

    const resultsByRunId = new Map(
      (resultRes.data ?? []).map((r) => [r.run_id, r]),
    );

    const runs = completedRuns
      .map((run) => {
        const result = resultsByRunId.get(run.id);
        if (!result || !result.ray_scores) return null;
        return {
          run_id: run.id,
          run_number: run.run_number,
          ray_scores: result.ray_scores,
          computed_at: result.computed_at,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ runs });
  } catch (error) {
    return NextResponse.json(
      {
        error: "runs_history_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
