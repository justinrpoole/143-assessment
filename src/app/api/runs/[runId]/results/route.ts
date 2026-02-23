import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getResultForRun, getRunForUser } from "@/lib/db/assessment-runs";

interface RouteParams {
  params: Promise<{ runId: string }> | { runId: string };
}

async function resolveRunId(params: RouteParams["params"]): Promise<string> {
  if (typeof (params as Promise<{ runId: string }>).then === "function") {
    const resolved = await (params as Promise<{ runId: string }>);
    return resolved.runId;
  }
  return (params as { runId: string }).runId;
}

export async function GET(_request: Request, context: RouteParams) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const runId = await resolveRunId(context.params);

  try {
    const run = await getRunForUser(runId, auth.userId);
    if (!run) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const result = await getResultForRun({
      runId,
      userId: auth.userId,
    });
    if (!result) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const payload = result.results_payload as Record<string, unknown>;
    emitEvent({
      eventName: "results_view",
      sourceRoute: "/results",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        run_id: result.run_id,
        run_number: run.run_number,
        confidence_band: payload.confidence_band ?? "STANDARD",
        signature_category_key: result.ray_pair_id,
      },
    });

    const pipelineOut = payload.pipeline_output as
      | { data_quality?: { confidence_band?: string } }
      | undefined;
    const confidenceBand = (payload.confidence_band as string | undefined)
      ?? pipelineOut?.data_quality?.confidence_band
      ?? "STANDARD";

    return NextResponse.json({
      run_id: result.run_id,
      computed_at: result.computed_at,
      ray_scores: result.ray_scores,
      top_rays: result.top_rays,
      ray_pair_id: result.ray_pair_id,
      confidence_band: confidenceBand,
      results_payload: result.results_payload,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "results_fetch_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
