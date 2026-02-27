import { NextResponse } from 'next/server';
import { supabaseRestFetch } from '@/lib/db/supabase-rest';

/**
 * GET /api/stats/community
 * Returns anonymous aggregate community stats for social proof.
 * All data is aggregated — no individual user identification.
 * Cached for 15 minutes to reduce DB load.
 */
export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  // Fetch today's active users (distinct user_ids with daily_loop_entries today)
  const [activeRes, repsRes, assessmentRes] = await Promise.all([
    supabaseRestFetch<{ count: number }[]>({
      restPath: '/rpc/count_today_active',
      method: 'POST',
      body: { target_date: today },
    }),
    supabaseRestFetch<{ total: number }[]>({
      restPath: '/rpc/count_week_reps',
      method: 'POST',
      body: {},
    }),
    supabaseRestFetch<{ total: number }[]>({
      restPath: '/rpc/count_total_assessments',
      method: 'POST',
      body: {},
    }),
  ]);

  // Graceful fallbacks — if RPCs don't exist yet, return zeros
  const todayActive = activeRes.ok && activeRes.data?.[0]
    ? (activeRes.data[0] as unknown as { count_today_active: number }).count_today_active ?? 0
    : 0;
  const weekReps = repsRes.ok && repsRes.data?.[0]
    ? (repsRes.data[0] as unknown as { count_week_reps: number }).count_week_reps ?? 0
    : 0;
  const totalAssessments = assessmentRes.ok && assessmentRes.data?.[0]
    ? (assessmentRes.data[0] as unknown as { count_total_assessments: number }).count_total_assessments ?? 0
    : 0;

  return NextResponse.json(
    {
      today_active: todayActive,
      week_reps: weekReps,
      total_assessments: totalAssessments,
    },
    {
      headers: { 'Cache-Control': 'public, max-age=900, s-maxage=900' },
    },
  );
}
