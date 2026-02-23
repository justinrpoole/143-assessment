import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

/**
 * GET /api/portal/calendar?days=28
 *
 * Returns daily state data for the past N days (default 28) to power the
 * Eclipse Calendar Heatmap. Combines daily_loops (completion) and
 * energy_audits (load level) into a per-day summary.
 *
 * Response: { days: CalendarDay[], energy_audits: AuditWeek[] }
 */

interface DailyLoopRow {
  entry_date: string;
}

interface EnergyAuditRow {
  week_of: string;
  total_load: number;
}

export interface CalendarDay {
  date: string;           // YYYY-MM-DD
  has_loop: boolean;      // did the user complete a daily loop?
  load_band: "low" | "moderate" | "elevated" | "high" | null;
}

function loadBand(total: number): CalendarDay["load_band"] {
  if (total <= 6) return "low";
  if (total <= 12) return "moderate";
  if (total <= 18) return "elevated";
  return "high";
}

export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Math.min(Number(searchParams.get("days")) || 28, 90);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split("T")[0];

  // Fetch daily loops and energy audits in parallel
  const [loopsRes, auditsRes] = await Promise.all([
    supabaseRestFetch<DailyLoopRow[]>({
      restPath: "daily_loops",
      query: {
        select: "entry_date",
        user_id: `eq.${auth.userId}`,
        entry_date: `gte.${startStr}`,
        order: "entry_date.asc",
      },
    }),
    supabaseRestFetch<EnergyAuditRow[]>({
      restPath: "energy_audits",
      query: {
        select: "week_of,total_load",
        user_id: `eq.${auth.userId}`,
        week_of: `gte.${startStr}`,
        order: "week_of.asc",
      },
    }),
  ]);

  // Build lookup maps
  const loopDates = new Set(
    (loopsRes.data ?? []).map((r) => r.entry_date),
  );

  const auditByWeek = new Map<string, number>();
  for (const a of auditsRes.data ?? []) {
    auditByWeek.set(a.week_of, a.total_load);
  }

  // Build calendar days
  const calendarDays: CalendarDay[] = [];
  const today = new Date();
  const cursor = new Date(startStr);

  while (cursor <= today) {
    const dateStr = cursor.toISOString().split("T")[0];

    // Find the Monday of this week for energy audit lookup
    const dow = cursor.getDay();
    const monday = new Date(cursor);
    monday.setDate(monday.getDate() - ((dow + 6) % 7));
    const mondayStr = monday.toISOString().split("T")[0];

    const totalLoad = auditByWeek.get(mondayStr);

    calendarDays.push({
      date: dateStr,
      has_loop: loopDates.has(dateStr),
      load_band: totalLoad != null ? loadBand(totalLoad) : null,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return NextResponse.json({ days: calendarDays });
}
