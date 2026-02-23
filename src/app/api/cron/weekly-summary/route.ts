import { NextRequest, NextResponse } from "next/server";

import { listActiveAssessmentUsers } from "@/lib/db/app-users";
import { getRepsSummary } from "@/lib/db/reps";
import { queueEmailJob } from "@/lib/email/scheduler";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { RAY_NAMES } from "@/lib/types";

/**
 * POST /api/cron/weekly-summary
 *
 * Queues weekly summary emails for all active users with completed assessments.
 * Secured by CRON_SECRET env var — call from Vercel Cron or external scheduler.
 *
 * Vercel cron config (add to vercel.json if using Vercel Cron):
 * { "crons": [{ "path": "/api/cron/weekly-summary", "schedule": "0 17 * * 0" }] }
 */

interface ResultRow {
  run_id: string;
  ray_scores: Record<string, number> | null;
  top_rays: string[];
}

export async function POST(request: NextRequest) {
  // Auth check: require CRON_SECRET
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  } else {
    // In dev/stub mode, allow without secret but log warning
    console.warn("[weekly-summary] CRON_SECRET not set — running in dev mode");
  }

  try {
    const users = await listActiveAssessmentUsers(500);

    let queued = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const user of users) {
      try {
        // Fetch reps summary for this user
        const repsSummary = await getRepsSummary({
          userId: user.id,
          timezone: user.timezone || "UTC",
        }).catch(() => ({
          total_count: 0,
          count_this_week: 0,
          streak_days: 0,
          most_practiced_tool: null,
        }));

        // Skip users with zero activity this week (no spam)
        if (repsSummary.count_this_week === 0 && repsSummary.streak_days === 0) {
          skipped++;
          continue;
        }

        // Get bottom ray from latest assessment result
        const resultRes = await supabaseRestFetch<ResultRow[]>({
          restPath: "assessment_results",
          query: {
            select: "run_id,ray_scores,top_rays",
            user_id: `eq.${user.id}`,
            order: "created_at.desc",
            limit: 1,
          },
        });

        const resultRow = resultRes.data?.[0] ?? null;
        let bottomRayName: string | null = null;

        if (resultRow?.ray_scores) {
          const scores = resultRow.ray_scores;
          const entries = Object.entries(scores);
          if (entries.length > 0) {
            entries.sort((a, b) => a[1] - b[1]);
            const bottomRayId = entries[0][0];
            bottomRayName = RAY_NAMES[bottomRayId] ?? bottomRayId;
          }
        }

        await queueEmailJob({
          userId: user.id,
          type: "weekly_summary",
          payload: {
            to_email: user.email,
            template_id: "weekly_summary",
            reps_this_week: String(repsSummary.count_this_week),
            streak_days: String(repsSummary.streak_days),
            most_practiced_tool: repsSummary.most_practiced_tool ?? "None yet",
            bottom_ray_name: bottomRayName ?? "your training ray",
            portal_route: "/portal",
          },
        });

        queued++;
      } catch (err) {
        errors.push(`${user.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    return NextResponse.json({
      ok: true,
      total_users: users.length,
      queued,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "weekly_summary_cron_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
