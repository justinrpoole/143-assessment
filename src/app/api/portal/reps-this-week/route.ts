import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { weekStartInTimezone } from "@/lib/timezone";

interface RepRow {
  tool_name: string;
  logged_at: string;
}

/**
 * GET /api/portal/reps-this-week
 *
 * Returns individual rep entries for the current week (Mon-Sun).
 * Used by the WeeklyRepBreakdown component for day-by-day charting.
 */
export async function GET() {
  const { userId, isAuthenticated } = await getRequestAuthContext();

  if (!isAuthenticated || !userId) {
    return NextResponse.json({ reps: [] });
  }

  try {
    // Get user timezone from cookies or default to UTC
    const tz = "UTC"; // WeeklyRepBreakdown runs client-side, this is server approximation

    const weekStart = weekStartInTimezone(tz);

    const response = await supabaseRestFetch<RepRow[]>({
      restPath: "reps",
      query: {
        select: "tool_name,logged_at",
        user_id: `eq.${userId}`,
        logged_at: `gte.${weekStart}T00:00:00Z`,
        order: "logged_at.asc",
        limit: 100,
      },
    });

    return NextResponse.json({ reps: response.data ?? [] });
  } catch {
    return NextResponse.json({ reps: [] });
  }
}
