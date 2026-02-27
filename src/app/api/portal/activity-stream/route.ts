import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getAppUserById } from "@/lib/db/app-users";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { toLocalDateIso } from "@/lib/timezone";

type ActivityType = "entry" | "log" | "assessment";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  label: string;
  detail: string | null;
  timestamp: string;
  date: string;
  href: string;
}

interface MorningRow {
  id: string;
  entry_date: string;
  affirmation_text: string | null;
  reps_logged: number | null;
  created_at: string | null;
}

interface LoopRow {
  id: string;
  entry_date: string;
  name_it: string | null;
  created_at: string | null;
}

interface ReflectionRow {
  id: string;
  entry_date: string;
  what_happened: string | null;
  created_at: string | null;
}

interface MicroJoyRow {
  id: string;
  created_at: string;
  suggestion_text: string | null;
  local_date: string;
}

interface RepRow {
  id: string;
  logged_at: string;
  tool_name: string | null;
  reflection_note: string | null;
}

interface RunRow {
  id: string;
  run_number: number;
  completed_at: string | null;
}

function toTimestamp(entryDate: string): string {
  return `${entryDate}T12:00:00Z`;
}

function safeDetail(raw: string | null | undefined): string | null {
  const trimmed = (raw ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const limit = Math.min(
      Math.max(10, Number(url.searchParams.get("limit")) || 40),
      120,
    );

    const appUser = await getAppUserById(auth.userId).catch(() => null);
    const timezone = appUser?.timezone ?? "UTC";

    const [morningRes, loopRes, reflectionRes, microJoyRes, repsRes, runsRes] =
      await Promise.all([
        supabaseRestFetch<MorningRow[]>({
          restPath: "morning_entries",
          query: {
            select: "id,entry_date,affirmation_text,reps_logged,created_at",
            user_id: `eq.${auth.userId}`,
            order: "entry_date.desc",
            limit: 20,
          },
        }),
        supabaseRestFetch<LoopRow[]>({
          restPath: "daily_loops",
          query: {
            select: "id,entry_date,name_it,created_at",
            user_id: `eq.${auth.userId}`,
            order: "entry_date.desc",
            limit: 20,
          },
        }),
        supabaseRestFetch<ReflectionRow[]>({
          restPath: "evening_reflections",
          query: {
            select: "id,entry_date,what_happened,created_at",
            user_id: `eq.${auth.userId}`,
            order: "entry_date.desc",
            limit: 20,
          },
        }),
        supabaseRestFetch<MicroJoyRow[]>({
          restPath: "micro_joy_entries",
          query: {
            select: "id,created_at,suggestion_text,local_date",
            user_id: `eq.${auth.userId}`,
            selected: "eq.true",
            order: "created_at.desc",
            limit: 20,
          },
        }),
        supabaseRestFetch<RepRow[]>({
          restPath: "reps",
          query: {
            select: "id,logged_at,tool_name,reflection_note",
            user_id: `eq.${auth.userId}`,
            order: "logged_at.desc",
            limit: 30,
          },
        }),
        supabaseRestFetch<RunRow[]>({
          restPath: "assessment_runs",
          query: {
            select: "id,run_number,completed_at",
            user_id: `eq.${auth.userId}`,
            status: "eq.completed",
            order: "completed_at.desc",
            limit: 12,
          },
        }),
      ]);

    const events: ActivityEvent[] = [];

    for (const row of morningRes.data ?? []) {
      const stamp = row.created_at ?? toTimestamp(row.entry_date);
      events.push({
        id: `morning-${row.id}`,
        type: "entry",
        label: "Morning check-in",
        detail: safeDetail(row.affirmation_text) ?? (row.reps_logged ? `${row.reps_logged} rep${row.reps_logged === 1 ? "" : "s"} logged` : null),
        timestamp: stamp,
        date: toLocalDateIso(stamp, timezone),
        href: "/morning",
      });
    }

    for (const row of loopRes.data ?? []) {
      const stamp = row.created_at ?? toTimestamp(row.entry_date);
      events.push({
        id: `loop-${row.id}`,
        type: "entry",
        label: "Daily loop",
        detail: safeDetail(row.name_it),
        timestamp: stamp,
        date: toLocalDateIso(stamp, timezone),
        href: "/portal",
      });
    }

    for (const row of reflectionRes.data ?? []) {
      const stamp = row.created_at ?? toTimestamp(row.entry_date);
      events.push({
        id: `reflection-${row.id}`,
        type: "entry",
        label: "Reflection",
        detail: safeDetail(row.what_happened),
        timestamp: stamp,
        date: toLocalDateIso(stamp, timezone),
        href: "/reflect",
      });
    }

    for (const row of microJoyRes.data ?? []) {
      events.push({
        id: `microjoy-${row.id}`,
        type: "entry",
        label: "Micro-Joy",
        detail: safeDetail(row.suggestion_text),
        timestamp: row.created_at,
        date: toLocalDateIso(row.created_at, timezone),
        href: "/micro-joy",
      });
    }

    for (const row of repsRes.data ?? []) {
      events.push({
        id: `rep-${row.id}`,
        type: "log",
        label: "Rep logged",
        detail: safeDetail(row.reflection_note) ?? safeDetail(row.tool_name),
        timestamp: row.logged_at,
        date: toLocalDateIso(row.logged_at, timezone),
        href: "/reps",
      });
    }

    for (const row of runsRes.data ?? []) {
      if (!row.completed_at) continue;
      events.push({
        id: `run-${row.id}`,
        type: "assessment",
        label: `Assessment completed`,
        detail: `Run ${row.run_number}`,
        timestamp: row.completed_at,
        date: toLocalDateIso(row.completed_at, timezone),
        href: `/results?run_id=${encodeURIComponent(row.id)}`,
      });
    }

    const sorted = events
      .filter((e) => e.timestamp)
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
      .slice(0, limit);

    return NextResponse.json({ timezone, events: sorted });
  } catch (error) {
    return NextResponse.json(
      {
        error: "portal_activity_stream_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
