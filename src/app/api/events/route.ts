import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { trackEvent } from "@/lib/events";
import type { EventType } from "@/lib/events";

const VALID_EVENT_TYPES = new Set<EventType>([
  "assessment_started",
  "assessment_completed",
  "question_answered",
  "report_viewed",
  "section_expanded",
  "coaching_question_reflected",
  "rep_logged",
  "streak_day",
  "daily_loop_completed",
  "evening_reflection_completed",
  "morning_entry_completed",
  "phase_checkin_completed",
  "portal_visited",
]);

interface EventBody {
  event_type?: string;
  event_data?: Record<string, unknown>;
}

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: EventBody;
  try {
    body = (await request.json()) as EventBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (
    typeof body.event_type !== "string" ||
    !VALID_EVENT_TYPES.has(body.event_type as EventType)
  ) {
    return NextResponse.json({ error: "invalid_event_type" }, { status: 400 });
  }

  await trackEvent({
    userId: auth.userId,
    eventType: body.event_type as EventType,
    eventData: body.event_data,
  });

  return NextResponse.json({ ok: true });
}
