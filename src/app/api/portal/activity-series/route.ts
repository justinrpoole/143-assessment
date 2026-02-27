import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getAppUserById } from "@/lib/db/app-users";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { nowLocalDateIso, toLocalDateIso } from "@/lib/timezone";

interface EntryCounts {
  morning: number;
  micro_joy: number;
  daily_loop: number;
  reflection: number;
}

interface LogCounts {
  reps: number;
}

export interface ActivityDay {
  date: string;
  entries: EntryCounts;
  logs: LogCounts;
  assessments: number;
  totals: {
    entries: number;
    logs: number;
  };
}

interface RunSummary {
  id: string;
  run_number: number;
  completed_at: string | null;
}

function buildDateRange(startStr: string, endStr: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${startStr}T12:00:00Z`);
  const end = new Date(`${endStr}T12:00:00Z`);
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

function emptyEntryCounts(): EntryCounts {
  return { morning: 0, micro_joy: 0, daily_loop: 0, reflection: 0 };
}

function emptyLogCounts(): LogCounts {
  return { reps: 0 };
}

export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const days = Math.min(
      Math.max(7, Number(url.searchParams.get("days")) || 28),
      90,
    );

    const appUser = await getAppUserById(auth.userId).catch(() => null);
    const timezone = appUser?.timezone ?? "UTC";
    const endStr = nowLocalDateIso(timezone);
    const startDate = new Date(`${endStr}T12:00:00Z`);
    startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
    const startStr = startDate.toISOString().slice(0, 10);
    const startIso = new Date(`${startStr}T00:00:00Z`).toISOString();

    const [morningRes, loopRes, reflectionRes, microJoyRes, repsRes, runsRes] =
      await Promise.all([
        supabaseRestFetch<Array<{ entry_date: string }>>({
          restPath: "morning_entries",
          query: {
            select: "entry_date",
            user_id: `eq.${auth.userId}`,
            entry_date: `gte.${startStr}`,
          },
        }),
        supabaseRestFetch<Array<{ entry_date: string }>>({
          restPath: "daily_loops",
          query: {
            select: "entry_date",
            user_id: `eq.${auth.userId}`,
            entry_date: `gte.${startStr}`,
          },
        }),
        supabaseRestFetch<Array<{ entry_date: string }>>({
          restPath: "evening_reflections",
          query: {
            select: "entry_date",
            user_id: `eq.${auth.userId}`,
            entry_date: `gte.${startStr}`,
          },
        }),
        supabaseRestFetch<Array<{ local_date: string }>>({
          restPath: "micro_joy_entries",
          query: {
            select: "local_date",
            user_id: `eq.${auth.userId}`,
            local_date: `gte.${startStr}`,
            selected: "eq.true",
          },
        }),
        supabaseRestFetch<Array<{ logged_at: string }>>({
          restPath: "reps",
          query: {
            select: "logged_at",
            user_id: `eq.${auth.userId}`,
            logged_at: `gte.${startIso}`,
            order: "logged_at.desc",
            limit: 1500,
          },
        }),
        supabaseRestFetch<RunSummary[]>({
          restPath: "assessment_runs",
          query: {
            select: "id,run_number,completed_at",
            user_id: `eq.${auth.userId}`,
            status: "eq.completed",
            order: "completed_at.desc",
            limit: 20,
          },
        }),
      ]);

    const dateRange = buildDateRange(startStr, endStr);
    const dayMap = new Map<string, ActivityDay>(
      dateRange.map((date) => [
        date,
        {
          date,
          entries: emptyEntryCounts(),
          logs: emptyLogCounts(),
          assessments: 0,
          totals: { entries: 0, logs: 0 },
        },
      ]),
    );

    for (const row of morningRes.data ?? []) {
      const day = dayMap.get(row.entry_date);
      if (day) day.entries.morning += 1;
    }

    for (const row of loopRes.data ?? []) {
      const day = dayMap.get(row.entry_date);
      if (day) day.entries.daily_loop += 1;
    }

    for (const row of reflectionRes.data ?? []) {
      const day = dayMap.get(row.entry_date);
      if (day) day.entries.reflection += 1;
    }

    for (const row of microJoyRes.data ?? []) {
      const day = dayMap.get(row.local_date);
      if (day) day.entries.micro_joy += 1;
    }

    for (const row of repsRes.data ?? []) {
      const date = toLocalDateIso(row.logged_at, timezone);
      const day = dayMap.get(date);
      if (day) day.logs.reps += 1;
    }

    for (const run of runsRes.data ?? []) {
      if (!run.completed_at) continue;
      const date = toLocalDateIso(run.completed_at, timezone);
      const day = dayMap.get(date);
      if (day) day.assessments += 1;
    }

    const daysOut = Array.from(dayMap.values()).map((day) => {
      const entriesTotal =
        day.entries.morning +
        day.entries.micro_joy +
        day.entries.daily_loop +
        day.entries.reflection;
      const logsTotal = day.logs.reps;
      return {
        ...day,
        totals: { entries: entriesTotal, logs: logsTotal },
      };
    });

    return NextResponse.json({
      timezone,
      range: { start: startStr, end: endStr, days },
      days: daysOut,
      runs: runsRes.data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "portal_activity_series_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
