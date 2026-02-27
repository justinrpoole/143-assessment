import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestFetch } from '@/lib/db/supabase-rest';
import {
  morningReminder,
  streakAtRisk,
  almostWeeklyGoal,
  retakeReminder,
  firstRepNudge,
  shouldSuppressNotification,
  RETAKE_REMINDER_DAYS,
  type NotificationPayload,
} from '@/lib/notifications/triggers';

/**
 * POST /api/cron/daily-nudge
 *
 * Behavior-based daily push notification scheduler.
 * Evaluates each subscribed user's state and sends the most relevant
 * notification. Only one notification per user per day (no spam).
 *
 * Research: Calm's daily reminders drove 3x retention. Smart,
 * behavior-based triggers outperform arbitrary time-based sends.
 *
 * Secured by CRON_SECRET env var.
 * Vercel cron config: { "path": "/api/cron/daily-nudge", "schedule": "0 14 * * *" }
 */

interface PushSubscriptionRow {
  user_id: string;
  endpoint: string;
  p256dh: string | null;
  auth_key: string | null;
}

interface UserActivityRow {
  user_id: string;
  last_active: string | null;
  streak_days: number;
  reps_this_week: number;
  total_reps: number;
  last_assessment_at: string | null;
}

export async function POST(request: NextRequest) {
  // Auth check
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidEmail = process.env.VAPID_CONTACT_EMAIL ?? 'mailto:hello@143leadership.com';

  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json({ error: 'vapid_not_configured' }, { status: 503 });
  }

  // Load web-push
  let webpush: {
    setVapidDetails: (s: string, p: string, k: string) => void;
    sendNotification: (sub: { endpoint: string; keys: { p256dh: string; auth: string } }, payload: string) => Promise<void>;
  };
  try {
    const moduleName = 'web-push';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    webpush = require(moduleName);
  } catch {
    return NextResponse.json({ error: 'web_push_not_installed' }, { status: 503 });
  }

  webpush.setVapidDetails(vapidEmail, vapidPublic, vapidPrivate);

  try {
    // Fetch all active push subscriptions
    const subsRes = await supabaseRestFetch<PushSubscriptionRow[]>({
      restPath: '/push_subscriptions',
      query: { select: 'user_id,endpoint,p256dh,auth_key', active: 'eq.true' },
    });

    const subs = subsRes.data ?? [];
    if (subs.length === 0) {
      return NextResponse.json({ sent: 0, message: 'no_subscriptions' });
    }

    // De-duplicate by user_id (one notification per user)
    const userSubs = new Map<string, PushSubscriptionRow>();
    for (const sub of subs) {
      if (!userSubs.has(sub.user_id)) {
        userSubs.set(sub.user_id, sub);
      }
    }

    let sent = 0;
    let suppressed = 0;
    let failed = 0;

    const today = new Date().toISOString().split('T')[0];

    for (const [userId, sub] of userSubs) {
      try {
        if (!sub.endpoint || !sub.p256dh || !sub.auth_key) {
          failed++;
          continue;
        }

        // Fetch user activity summary (use RPC if available, otherwise basic query)
        const activityRes = await supabaseRestFetch<UserActivityRow[]>({
          restPath: '/rpc/user_nudge_context',
          method: 'POST',
          body: { target_user_id: userId, target_date: today },
        });

        const activity = activityRes.data?.[0] as unknown as UserActivityRow | undefined;

        // Default context if RPC doesn't exist yet
        const context = {
          lastActiveToday: activity?.last_active?.startsWith(today) ?? false,
          streakDays: activity?.streak_days ?? 0,
          repsThisWeek: activity?.reps_this_week ?? 0,
          totalReps: activity?.total_reps ?? 0,
          lastAssessmentAt: activity?.last_assessment_at ?? null,
        };

        // Smart suppression — don't nudge users who were already active today
        if (shouldSuppressNotification(context.lastActiveToday)) {
          suppressed++;
          continue;
        }

        // Determine which trigger to fire (priority order)
        let notification: NotificationPayload | null = null;

        // 1. Streak at risk (highest urgency)
        if (context.streakDays > 2 && !context.lastActiveToday) {
          notification = streakAtRisk(context.streakDays);
        }

        // 2. Almost at weekly goal
        if (!notification && context.repsThisWeek >= 4 && context.repsThisWeek < 5) {
          notification = almostWeeklyGoal(context.repsThisWeek, 5);
        }

        // 3. First rep nudge (has assessment but zero reps)
        if (!notification && context.totalReps === 0 && context.lastAssessmentAt) {
          notification = firstRepNudge();
        }

        // 4. Retake reminder
        if (!notification && context.lastAssessmentAt) {
          const daysSince = Math.floor(
            (Date.now() - new Date(context.lastAssessmentAt).getTime()) / (1000 * 60 * 60 * 24),
          );
          for (const reminderDay of RETAKE_REMINDER_DAYS) {
            if (daysSince === reminderDay) {
              notification = retakeReminder(daysSince);
              break;
            }
          }
        }

        // 5. Default morning reminder
        if (!notification) {
          notification = morningReminder();
        }

        // Send
        const payload = JSON.stringify({
          title: notification.title,
          body: notification.body,
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag: notification.tag,
          data: { url: notification.url },
        });

        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          payload,
        );
        sent++;
      } catch (err) {
        failed++;
        // Clean up expired subscriptions
        if (err && typeof err === 'object' && 'statusCode' in err && (err as { statusCode: number }).statusCode === 410) {
          await supabaseRestFetch({
            restPath: '/push_subscriptions',
            method: 'PATCH',
            query: { endpoint: `eq.${sub.endpoint}` },
            body: { active: false, updated_at: new Date().toISOString() },
          }).catch(() => {});
        }
      }
    }

    return NextResponse.json({ sent, suppressed, failed, total_users: userSubs.size });
  } catch (error) {
    return NextResponse.json(
      { error: 'daily_nudge_failed', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
