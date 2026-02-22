import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getRunForUser } from "@/lib/db/assessment-runs";
import { questionsFromItemIds } from "@/lib/item-selection-runner";
import { getQuestionsForRun } from "@/lib/scoring/question-set";

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

    if (run.status === "completed" || run.status === "canceled") {
      return NextResponse.json(
        { error: "run_not_active", status: run.status },
        { status: 409 },
      );
    }

    // Use the dynamically selected items stored for this run.
    // Fall back to the static set for runs created before dynamic selection.
    if (run.item_ids && run.item_ids.length > 0) {
      const questions = questionsFromItemIds(run.item_ids);
      return NextResponse.json({ questions, source: "dynamic" });
    }

    // Legacy fallback: serve from static question-set
    const questions = getQuestionsForRun(run.run_number);
    return NextResponse.json({ questions, source: "static" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "questions_fetch_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
