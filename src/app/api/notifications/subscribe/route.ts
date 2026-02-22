import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { trackEvent } from "@/lib/events";

interface PushSubscriptionJSON {
  endpoint: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
}

/**
 * POST /api/notifications/subscribe
 *
 * Stores or updates a push subscription for the authenticated user.
 */
export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      subscription?: PushSubscriptionJSON;
    };

    const sub = body.subscription;
    if (!sub?.endpoint) {
      return NextResponse.json(
        { error: "invalid_subscription" },
        { status: 400 },
      );
    }

    await supabaseRestFetch({
      restPath: "/push_subscriptions",
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: {
        user_id: auth.userId,
        endpoint: sub.endpoint,
        p256dh: sub.keys?.p256dh ?? null,
        auth_key: sub.keys?.auth ?? null,
        active: true,
        updated_at: new Date().toISOString(),
      },
    });

    void trackEvent({
      userId: auth.userId,
      eventType: "portal_visited" as Parameters<typeof trackEvent>[0]["eventType"],
      eventData: { action: "push_subscribed" },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "subscribe_failed" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/notifications/subscribe
 *
 * Marks a push subscription as inactive.
 */
export async function DELETE(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      endpoint?: string;
    };

    if (!body.endpoint) {
      return NextResponse.json(
        { error: "missing_endpoint" },
        { status: 400 },
      );
    }

    await supabaseRestFetch({
      restPath: "/push_subscriptions",
      method: "PATCH",
      query: {
        user_id: `eq.${auth.userId}`,
        endpoint: `eq.${body.endpoint}`,
      },
      body: {
        active: false,
        updated_at: new Date().toISOString(),
      },
    });

    void trackEvent({
      userId: auth.userId,
      eventType: "portal_visited" as Parameters<typeof trackEvent>[0]["eventType"],
      eventData: { action: "push_unsubscribed" },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "unsubscribe_failed" },
      { status: 500 },
    );
  }
}
