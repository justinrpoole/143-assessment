import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { trackEvent } from "@/lib/events";

interface IntentionEvent {
  event_data: { intention?: string };
}

export async function GET() {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ intention: null });
  }

  const res = await supabaseRestFetch<IntentionEvent[]>({
    restPath: "user_events",
    method: "GET",
    query: {
      user_id: `eq.${auth.userId}`,
      event_type: "eq.intention_set",
      select: "event_data",
      order: "created_at.desc",
      limit: 1,
    },
  });

  const intention = res.data?.[0]?.event_data?.intention ?? null;
  return NextResponse.json({ intention });
}

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
