import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getRepsForUser, insertRep } from "@/lib/db/reps";
import { trackEvent } from "@/lib/events";

const ALLOWED_TOOL_NAMES = new Set([
  "90_second_window",
  "presence_pause",
  "watch_me",
  "go_first",
  "i_rise",
  "reflection_loop",
  "if_then_planning",
  "boundary_of_light",
  "ras_reset",
  "question_loop",
  "witness",
  "143_challenge",
  "let_them",
  "full_reps",
  "evidence_receipt",
  "challenge_rep",
]);

const ALLOWED_TRIGGER_TYPES = new Set([
  "watch_me",
  "go_first",
  "i_rise",
  "scheduled",
  "ad_hoc",
  "full_reps",
]);

const ALLOWED_QUALITIES = new Set([1, 2, 3]);

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const toolName = typeof body.tool_name === "string" ? body.tool_name : null;
  if (!toolName || !ALLOWED_TOOL_NAMES.has(toolName)) {
    return NextResponse.json({ error: "invalid_tool_name" }, { status: 400 });
  }

  const triggerType =
    typeof body.trigger_type === "string" &&
    ALLOWED_TRIGGER_TYPES.has(body.trigger_type)
      ? body.trigger_type
      : null;

  const durationSeconds =
    typeof body.duration_seconds === "number" &&
    body.duration_seconds > 0 &&
    body.duration_seconds <= 7200
      ? Math.round(body.duration_seconds)
      : null;

  const quality =
    typeof body.quality === "number" && ALLOWED_QUALITIES.has(body.quality)
      ? body.quality
      : null;

  const reflectionNote =
    typeof body.reflection_note === "string" &&
    body.reflection_note.trim().length > 0
      ? body.reflection_note.trim().slice(0, 2000)
      : null;

  const rayNumber =
    typeof body.ray_number === "number" &&
    Number.isInteger(body.ray_number) &&
    body.ray_number >= 1 &&
    body.ray_number <= 9
      ? body.ray_number
      : null;

  const runId =
    typeof body.run_id === "string" && body.run_id.length > 0
      ? body.run_id
      : null;

  const recognition =
    typeof body.recognition === "string" && body.recognition.trim().length > 0
      ? body.recognition.trim().slice(0, 2000)
      : null;

  const encouragement =
    typeof body.encouragement === "string" &&
    body.encouragement.trim().length > 0
      ? body.encouragement.trim().slice(0, 2000)
      : null;

  const performance =
    typeof body.performance === "string" && body.performance.trim().length > 0
      ? body.performance.trim().slice(0, 2000)
      : null;

  const sustainability =
    typeof body.sustainability === "string" &&
    body.sustainability.trim().length > 0
      ? body.sustainability.trim().slice(0, 2000)
      : null;

  try {
    const rep = await insertRep({
      userId: auth.userId,
      toolName,
      triggerType,
      durationSeconds,
      quality,
      reflectionNote,
      rayNumber,
      runId,
      recognition,
      encouragement,
      performance,
      sustainability,
    });

    void trackEvent({
      userId: auth.userId,
      eventType: "rep_logged",
      eventData: { tool_name: toolName, trigger_type: triggerType, quality },
    });

    return NextResponse.json({ rep });
  } catch (error) {
    return NextResponse.json(
      {
        error: "rep_log_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 20, 100) : 20;

  try {
    const reps = await getRepsForUser({ userId: auth.userId, limit });
    return NextResponse.json({ reps });
  } catch (error) {
    return NextResponse.json(
      {
        error: "reps_load_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
