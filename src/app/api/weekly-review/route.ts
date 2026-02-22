import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getRepsSummary, getRepsForUser } from "@/lib/db/reps";
import { listRecentPhaseCheckins } from "@/lib/db/phase-checkin";
import { listRecentDailyLoops } from "@/lib/db/daily-loop";
import { listRecentEveningReflections } from "@/lib/db/evening-reflection";
import { currentWeekMonday } from "@/lib/retention/energy-audit";

export async function GET() {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const weekStart = currentWeekMonday();

    // Fetch all data in parallel
    const [repsSummary, recentReps, phaseCheckins, dailyLoops, reflections] =
      await Promise.all([
        getRepsSummary({ userId: auth.userId }).catch(() => ({
          total_count: 0,
          count_this_week: 0,
          streak_days: 0,
          most_practiced_tool: null,
        })),
        getRepsForUser({ userId: auth.userId, limit: 50 }).catch(() => []),
        listRecentPhaseCheckins({ userId: auth.userId, limit: 7 }).catch(() => []),
        listRecentDailyLoops({ userId: auth.userId, limit: 7 }).catch(() => []),
        listRecentEveningReflections({ userId: auth.userId, limit: 7 }).catch(() => []),
      ]);

    // Count this week's items
    const thisWeekReps = recentReps.filter(
      (r) => r.logged_at >= weekStart,
    );
    const thisWeekCheckins = phaseCheckins.filter(
      (c) => c.entry_date >= weekStart,
    );
    const thisWeekLoops = dailyLoops.filter(
      (l) => l.entry_date >= weekStart,
    );
    const thisWeekReflections = reflections.filter(
      (r) => r.entry_date >= weekStart,
    );

    // Phase distribution this week
    const phaseCounts: Record<string, number> = {};
    for (const c of thisWeekCheckins) {
      phaseCounts[c.detected_phase] = (phaseCounts[c.detected_phase] ?? 0) + 1;
    }

    // Tool distribution this week
    const toolCounts: Record<string, number> = {};
    for (const r of thisWeekReps) {
      toolCounts[r.tool_name] = (toolCounts[r.tool_name] ?? 0) + 1;
    }
    const topTools = Object.entries(toolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    // Reflection quality average
    const avgQuality =
      thisWeekReflections.length > 0
        ? thisWeekReflections.reduce((sum, r) => sum + r.quality_score, 0) /
          thisWeekReflections.length
        : null;

    return NextResponse.json({
      week_of: weekStart,
      reps: {
        count_this_week: repsSummary.count_this_week,
        streak_days: repsSummary.streak_days,
        total_count: repsSummary.total_count,
        most_practiced_tool: repsSummary.most_practiced_tool,
        top_tools: topTools,
      },
      check_ins: {
        count: thisWeekCheckins.length,
        phase_distribution: phaseCounts,
      },
      daily_loops: {
        count: thisWeekLoops.length,
      },
      reflections: {
        count: thisWeekReflections.length,
        avg_quality: avgQuality !== null ? Math.round(avgQuality * 10) / 10 : null,
      },
      engagement: {
        days_active: new Set([
          ...thisWeekReps.map((r) => r.logged_at.slice(0, 10)),
          ...thisWeekCheckins.map((c) => c.entry_date),
          ...thisWeekLoops.map((l) => l.entry_date),
          ...thisWeekReflections.map((r) => r.entry_date),
        ]).size,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "weekly_review_fetch_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
