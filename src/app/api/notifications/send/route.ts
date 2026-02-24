import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/auth/admin";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

interface PushSubscriptionRow {
  user_id: string;
  endpoint: string;
  p256dh: string | null;
  auth_key: string | null;
}

/**
 * POST /api/notifications/send
 *
 * Admin-only endpoint to send push notifications.
 * Requires the `web-push` npm package and VAPID keys in env vars.
 *
 * Body:
 * - user_id?: string — Send to a specific user. Omit for broadcast to all active subscriptions.
 * - title: string
 * - body: string
 * - url?: string — Where to navigate on click (default: /portal)
 * - tag?: string — Notification grouping tag
 */
export async function POST(request: Request) {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidEmail = process.env.VAPID_CONTACT_EMAIL ?? "mailto:hello@143leadership.com";

  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json(
      { error: "vapid_not_configured" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      user_id?: string;
      title?: string;
      body?: string;
      url?: string;
      tag?: string;
    };

    const title = body.title ?? "143 Leadership";
    const notifBody = body.body ?? "Your daily light practice is waiting.";
    const url = body.url ?? "/portal";
    const tag = body.tag ?? "143-daily";

    // Fetch subscriptions
    const query: Record<string, string> = {
      select: "user_id,endpoint,p256dh,auth_key",
      active: "eq.true",
    };
    if (body.user_id) {
      query.user_id = `eq.${body.user_id}`;
    }

    const subsRes = await supabaseRestFetch<PushSubscriptionRow[]>({
      restPath: "/push_subscriptions",
      query,
    });

    const subs = subsRes.data ?? [];
    if (subs.length === 0) {
      return NextResponse.json({ sent: 0, message: "no_active_subscriptions" });
    }

    // Dynamic require of web-push (optional dependency, installed separately)
    let webpush: { setVapidDetails: (s: string, p: string, k: string) => void; sendNotification: (sub: { endpoint: string; keys: { p256dh: string; auth: string } }, payload: string) => Promise<void> };
    try {
      const moduleName = "web-push";
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      webpush = require(moduleName);
    } catch {
      return NextResponse.json(
        { error: "web_push_not_installed", message: "Run: npm install web-push" },
        { status: 503 },
      );
    }

    webpush.setVapidDetails(vapidEmail, vapidPublic, vapidPrivate);

    const payload = JSON.stringify({
      title,
      body: notifBody,
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag,
      data: { url },
    });

    let sent = 0;
    let failed = 0;

    await Promise.allSettled(
      subs.map(async (sub) => {
        if (!sub.endpoint || !sub.p256dh || !sub.auth_key) {
          failed++;
          return;
        }

        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth_key,
              },
            },
            payload,
          );
          sent++;
        } catch (err) {
          failed++;
          // If subscription is expired/invalid (410 Gone), mark inactive
          if (err && typeof err === "object" && "statusCode" in err && (err as { statusCode: number }).statusCode === 410) {
            await supabaseRestFetch({
              restPath: "/push_subscriptions",
              method: "PATCH",
              query: {
                endpoint: `eq.${sub.endpoint}`,
              },
              body: { active: false, updated_at: new Date().toISOString() },
            }).catch(() => { /* best-effort cleanup */ });
          }
        }
      }),
    );

    return NextResponse.json({ sent, failed, total: subs.length });
  } catch {
    return NextResponse.json(
      { error: "send_failed" },
      { status: 500 },
    );
  }
}
