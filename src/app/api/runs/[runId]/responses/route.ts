import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  getResponsesForRun,
  getRunForUser,
  upsertResponses,
} from "@/lib/db/assessment-runs";
import { questionsFromItemIds } from "@/lib/item-selection-runner";
import { getQuestionMapForRun } from "@/lib/scoring/question-set";

interface RouteParams {
  params: Promise<{ runId: string }> | { runId: string };
}

interface ResponseInput {
  question_id: string;
  value: number;
}

interface QuestionDefinition {
  id: string;
  scale: { min: number; max: number };
}

interface RequestBody {
  responses?: ResponseInput[];
}

function validateResponses(
  rows: ResponseInput[],
  questionMap: Map<string, QuestionDefinition>,
) {
  const validated: ResponseInput[] = [];

  for (const row of rows) {
    if (!row || typeof row.question_id !== "string") {
      return {
        ok: false as const,
        error: "invalid_question_id",
      };
    }

    const question = questionMap.get(row.question_id);
    if (!question) {
      return {
        ok: false as const,
        error: `unknown_question_id:${row.question_id}`,
      };
    }

    if (!Number.isInteger(row.value)) {
      return {
        ok: false as const,
        error: `value_not_integer:${row.question_id}`,
      };
    }

    const scale = question.scale;
    if (
      typeof scale?.min !== "number" ||
      typeof scale?.max !== "number" ||
      row.value < scale.min ||
      row.value > scale.max
    ) {
      return {
        ok: false as const,
        error: `value_out_of_range:${row.question_id}`,
      };
    }

    validated.push({
      question_id: row.question_id,
      value: row.value,
    });
  }

  return {
    ok: true as const,
    validated,
  };
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
  const run = await getRunForUser(runId, auth.userId);
  if (!run) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const rows = await getResponsesForRun({ runId, userId: auth.userId });
    const responses = rows.map((r) => ({
      question_id: r.question_id,
      value: r.value,
    }));
    return NextResponse.json({ responses });
  } catch (error) {
    return NextResponse.json(
      {
        error: "responses_fetch_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteParams) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const runId = await resolveRunId(context.params);
  const run = await getRunForUser(runId, auth.userId);
  if (!run) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (run.status === "completed" || run.status === "canceled") {
    return NextResponse.json(
      { error: "run_not_writable", status: run.status },
      { status: 409 },
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const incoming = Array.isArray(body.responses) ? body.responses : [];
  if (incoming.length === 0) {
    return NextResponse.json({ error: "responses_required" }, { status: 400 });
  }

  // Build the question map: use per-run dynamic selection if available,
  // otherwise fall back to the static set for legacy runs.
  const questionMap: Map<string, QuestionDefinition> = run.item_ids && run.item_ids.length > 0
    ? new Map(
        questionsFromItemIds(run.item_ids).map((q) => [
          q.id,
          { id: q.id, scale: q.scale },
        ]),
      )
    : getQuestionMapForRun(run.run_number);

  const validation = validateResponses(incoming, questionMap);
  if (!validation.ok) {
    return NextResponse.json(
      { error: "invalid_responses", detail: validation.error },
      { status: 400 },
    );
  }

  try {
    await upsertResponses({
      runId,
      userId: auth.userId,
      responses: validation.validated,
    });

    return NextResponse.json({ saved_count: validation.validated.length });
  } catch (error) {
    return NextResponse.json(
      {
        error: "response_save_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
