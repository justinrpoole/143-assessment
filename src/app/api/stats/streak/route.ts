import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/stats/streak
 * Returns current daily practice streak for the authenticated user.
 * Checks consecutive days with activity in daily_loop_entries.
 * Used by StreakBadge component.
 */
export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    return NextResponse.json({ streak: 0 });
  }

  // Import supabaseRestFetch dynamically to avoid issues if env vars missing
  const { supabaseRestFetch } = await import('@/lib/db/supabase-rest');

  // Get recent daily entries sorted by date descending
  const res = await supabaseRestFetch<{ created_date: string }[]>({
    restPath: '/daily_loop_entries',
    query: {
      select: 'created_date',
      user_id: `eq.${userId}`,
      order: 'created_date.desc',
      limit: '60',
    },
  });

  if (!res.ok || !res.data || res.data.length === 0) {
    return NextResponse.json({ streak: 0 });
  }

  // Count consecutive days from today backwards
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = new Set(res.data.map((d) => d.created_date));

  for (let i = 0; i < 60; i++) {
    const check = new Date(today);
    check.setDate(check.getDate() - i);
    const dateStr = check.toISOString().split('T')[0];
    if (dates.has(dateStr)) {
      streak++;
    } else if (i === 0) {
      // Today hasn't been logged yet, that's okay — keep checking from yesterday
      continue;
    } else {
      break;
    }
  }

  return NextResponse.json({ streak }, {
    headers: { 'Cache-Control': 'private, max-age=60' },
  });
}
