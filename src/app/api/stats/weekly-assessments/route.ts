import { NextResponse } from 'next/server';
import { supabaseRestFetch } from '@/lib/db/supabase-rest';

/**
 * GET /api/stats/weekly-assessments
 * Returns count of assessment_runs completed in the last 7 days.
 * Used by LiveActivityBadge for social proof.
 */
export async function GET() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const res = await supabaseRestFetch<{ count: number }[]>({
    restPath: '/assessment_runs',
    query: {
      select: 'count',
      completed_at: `gte.${sevenDaysAgo}`,
    },
    prefer: 'count=exact',
  });

  if (!res.ok) {
    return NextResponse.json({ count: 0 });
  }

  // Supabase returns count in content-range header or as array length
  const count = Array.isArray(res.data) ? res.data.length : 0;

  return NextResponse.json({ count }, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
