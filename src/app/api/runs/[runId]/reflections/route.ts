import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getRunForUser } from "@/lib/db/assessment-runs";
import {
  getReflectionsForRun,
  upsertReflections,
} from "@/lib/db/assessment-reflections";

interface RouteParams {
  params: Promise<{ runId: string }> | { runId: string };
}

interface ReflectionInput {
  prompt_id: string;
  response_text: string;
}

interface RequestBody {
  reflections?: ReflectionInput[];
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
    const rows = await getReflectionsForRun({ runId, userId: auth.userId });
    return NextResponse.json({ reflections: rows });
  } catch (error) {
    return NextResponse.json(
      {
        error: "reflections_fetch_failed",
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

  const incoming = Array.isArray(body.reflections) ? body.reflections : [];
  if (incoming.length === 0) {
    return NextResponse.json({ error: "reflections_required" }, { status: 400 });
  }

  // Validate each reflection has a prompt_id and response_text
  const validated: ReflectionInput[] = [];
  for (const entry of incoming) {
    if (
      !entry ||
      typeof entry.prompt_id !== "string" ||
      !entry.prompt_id.trim() ||
      typeof entry.response_text !== "string"
    ) {
      return NextResponse.json(
        { error: "invalid_reflection_entry" },
        { status: 400 },
      );
    }
    validated.push({
      prompt_id: entry.prompt_id.trim(),
      response_text: entry.response_text,
    });
  }

  try {
    await upsertReflections({
      runId,
      userId: auth.userId,
      reflections: validated,
    });

    return NextResponse.json({ saved_count: validated.length });
  } catch (error) {
    return NextResponse.json(
      {
        error: "reflection_save_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
