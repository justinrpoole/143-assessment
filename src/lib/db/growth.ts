import { supabaseRestFetch } from "@/lib/db/supabase-rest";

interface CompletedRunRow {
  id: string;
  run_number: number;
  completed_at: string;
}

interface ResultRow {
  run_id: string;
  ray_pair_id: string;
  top_rays: string[];
  ray_scores: Record<string, number>;
}

export interface GrowthSummaryRun {
  run_id: string;
  run_number: number;
  completed_at: string;
  ray_pair_id: string;
  top_rays: string[];
  ray_scores: Record<string, number>;
}

function inFilter(values: string[]): string {
  return `in.(${values.join(",")})`;
}

export async function listGrowthSummaryRuns(params: {
  userId: string;
  limit?: number;
}): Promise<GrowthSummaryRun[]> {
  const runResponse = await supabaseRestFetch<CompletedRunRow[]>({
    restPath: "assessment_runs",
    query: {
      select: "id,run_number,completed_at",
      user_id: `eq.${params.userId}`,
      status: "eq.completed",
      order: "completed_at.desc",
      limit: params.limit ?? 12,
    },
  });
  if (!runResponse.ok) {
    throw new Error(runResponse.error ?? "growth_runs_load_failed");
  }

  const runs = runResponse.data ?? [];
  if (runs.length === 0) {
    return [];
  }

  const runIds = runs.map((run) => run.id);
  const resultResponse = await supabaseRestFetch<ResultRow[]>({
    restPath: "assessment_results",
    query: {
      select: "run_id,ray_pair_id,top_rays,ray_scores",
      user_id: `eq.${params.userId}`,
      run_id: inFilter(runIds),
    },
  });
  if (!resultResponse.ok) {
    throw new Error(resultResponse.error ?? "growth_results_load_failed");
  }

  const resultsByRunId = new Map<string, ResultRow>();
  for (const result of resultResponse.data ?? []) {
    resultsByRunId.set(result.run_id, result);
  }

  return runs
    .map((run): GrowthSummaryRun | null => {
      const result = resultsByRunId.get(run.id);
      if (!result) {
        return null;
      }
      return {
        run_id: run.id,
        run_number: run.run_number,
        completed_at: run.completed_at,
        ray_pair_id: result.ray_pair_id,
        top_rays: Array.isArray(result.top_rays)
          ? result.top_rays.map((entry) => String(entry))
          : [],
        ray_scores:
          result.ray_scores && typeof result.ray_scores === "object"
            ? result.ray_scores
            : {},
      };
    })
    .filter((row): row is GrowthSummaryRun => row !== null);
}
