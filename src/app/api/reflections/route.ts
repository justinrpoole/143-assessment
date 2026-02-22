import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { trackEvent } from "@/lib/events";

/**
 * Store coaching question reflections as events.
 * Lightweight: uses the existing user_events table rather than a new table.
 * Reflections can be surfaced later in portal journal views.
 */
export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    question?: string;
    reflection?: string;
    run_id?: string | null;
    source?: string;
  };

  const question = typeof body.question === "string" ? body.question.trim().slice(0, 500) : "";
  const reflection = typeof body.reflection === "string" ? body.reflection.trim().slice(0, 1000) : "";

  if (!reflection) {
    return NextResponse.json({ error: "empty_reflection" }, { status: 400 });
  }

  trackEvent({
    userId: auth.userId,
    eventType: "coaching_question_reflected",
    eventData: {
      question,
      reflection,
      run_id: body.run_id ?? null,
      source: body.source ?? "report",
    },
  });

  return NextResponse.json({ ok: true });
}
