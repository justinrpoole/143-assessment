import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { trackEvent } from "@/lib/events";

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { intention?: string };
  const intention = typeof body.intention === "string" ? body.intention.trim().slice(0, 500) : "";

  if (!intention) {
    return NextResponse.json({ error: "empty_intention" }, { status: 400 });
  }

  // Store as an event — lightweight, no new table needed
  trackEvent({
    userId: auth.userId,
    eventType: "intention_set",
    eventData: { intention, source: "welcome_flow" },
  });

  return NextResponse.json({ ok: true });
}
