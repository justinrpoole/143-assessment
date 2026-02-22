import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getRunForUser, markRunInProgress } from "@/lib/db/assessment-runs";
import { runItemSelection } from "@/lib/item-selection-runner";
import { getQuestionCountsForRun } from "@/lib/scoring/question-set";

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

export async function POST(_request: Request, context: RouteParams) {
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

    if (run.status === "in_progress") {
      const runCounts = getQuestionCountsForRun(run.run_number);
      return NextResponse.json({
        run_id: run.id,
        run_number: run.run_number,
        assessment_mode: runCounts.mode,
        question_count: runCounts.run,
        status: run.status,
      });
    }

    if (run.status === "completed" || run.status === "canceled") {
      return NextResponse.json(
        { error: "run_not_startable", status: run.status },
        { status: 409 },
      );
    }

    const selectedQuestions = runItemSelection(run.run_number);
    const itemIds = selectedQuestions.map((q) => q.id);

    const started = await markRunInProgress({
      runId: run.id,
      userId: auth.userId,
      itemIds,
    });

    if (!started) {
      const refreshed = await getRunForUser(runId, auth.userId);
      if (!refreshed) {
        return NextResponse.json({ error: "not_found" }, { status: 404 });
      }
      const refreshedCounts = getQuestionCountsForRun(refreshed.run_number);
      return NextResponse.json({
        run_id: refreshed.id,
        run_number: refreshed.run_number,
        assessment_mode: refreshedCounts.mode,
        question_count: refreshedCounts.run,
        status: refreshed.status,
      });
    }

    const runCounts = getQuestionCountsForRun(started.run_number);

    emitEvent({
      eventName: "full_assessment_start",
      sourceRoute: "/assessment",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        run_id: started.id,
        run_number: started.run_number,
        assessment_version: "v1",
        assessment_mode: runCounts.mode,
        question_count: runCounts.run,
      },
    });

    return NextResponse.json({
      run_id: started.id,
      run_number: started.run_number,
      assessment_mode: runCounts.mode,
      question_count: runCounts.run,
      status: started.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "start_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
