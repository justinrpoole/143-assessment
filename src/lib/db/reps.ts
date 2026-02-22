import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { toLocalDateIso, nowLocalDateIso, weekStartInTimezone } from "@/lib/timezone";

export interface RepRow {
  id: string;
  user_id: string;
  run_id: string | null;
  tool_name: string;
  trigger_type: string | null;
  duration_seconds: number | null;
  quality: number | null;
  reflection_note: string | null;
  recognition: string | null;
  encouragement: string | null;
  performance: string | null;
  sustainability: string | null;
  logged_at: string;
}

const REP_SELECT =
  "id,user_id,run_id,tool_name,trigger_type,duration_seconds,quality,reflection_note,recognition,encouragement,performance,sustainability,logged_at";

export async function insertRep(params: {
  userId: string;
  toolName: string;
  triggerType?: string | null;
  durationSeconds?: number | null;
  quality?: number | null;
  reflectionNote?: string | null;
  runId?: string | null;
  recognition?: string | null;
  encouragement?: string | null;
  performance?: string | null;
  sustainability?: string | null;
}): Promise<RepRow> {
  const response = await supabaseRestFetch<RepRow[]>({
    restPath: "reps",
    method: "POST",
    query: { select: REP_SELECT },
    prefer: "return=representation",
    body: {
      user_id: params.userId,
      tool_name: params.toolName,
      trigger_type: params.triggerType ?? null,
      duration_seconds: params.durationSeconds ?? null,
      quality: params.quality ?? null,
      reflection_note: params.reflectionNote ?? null,
      run_id: params.runId ?? null,
      recognition: params.recognition ?? null,
      encouragement: params.encouragement ?? null,
      performance: params.performance ?? null,
      sustainability: params.sustainability ?? null,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "rep_insert_failed");
  }
  const row = response.data?.[0];
  if (!row) {
    throw new Error("rep_insert_empty");
  }
  return row;
}

export async function getRepsForUser(params: {
  userId: string;
  limit?: number;
}): Promise<RepRow[]> {
  const response = await supabaseRestFetch<RepRow[]>({
    restPath: "reps",
    query: {
      select: REP_SELECT,
      user_id: `eq.${params.userId}`,
      order: "logged_at.desc",
      limit: params.limit ?? 20,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "reps_list_failed");
  }
  return response.data ?? [];
}

export interface RepsSummary {
  total_count: number;
  count_this_week: number;
  streak_days: number;
  most_practiced_tool: string | null;
}

export async function getRepsSummary(params: {
  userId: string;
  timezone?: string;
}): Promise<RepsSummary> {
  const tz = params.timezone ?? "UTC";

  // Fetch last 90 days to compute streak + weekly count
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const response = await supabaseRestFetch<RepRow[]>({
    restPath: "reps",
    query: {
      select: "id,tool_name,logged_at",
      user_id: `eq.${params.userId}`,
      logged_at: `gte.${ninetyDaysAgo.toISOString()}`,
      order: "logged_at.desc",
      limit: 1000,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "reps_summary_failed");
  }

  const rows = response.data ?? [];

  // Total count (all time)
  const totalResponse = await supabaseRestFetch<Array<{ id: string }>>({
    restPath: "reps",
    query: {
      select: "id",
      user_id: `eq.${params.userId}`,
    },
  });
  const total_count = totalResponse.data?.length ?? 0;

  // Count this week (Mon–today) using user's timezone
  const weekStartStr = weekStartInTimezone(tz);
  const count_this_week = rows.filter((r) => {
    const repDate = toLocalDateIso(r.logged_at, tz);
    return repDate >= weekStartStr;
  }).length;

  // Streak: consecutive days (from today backward) with at least 1 rep
  // Convert each logged_at to a local date in the user's timezone
  const repDates = new Set(
    rows.map((r) => toLocalDateIso(r.logged_at, tz)),
  );
  let streak_days = 0;
  let cursorDate = nowLocalDateIso(tz);
  while (repDates.has(cursorDate)) {
    streak_days++;
    // Move cursor back one day
    const d = new Date(cursorDate + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() - 1);
    cursorDate = d.toISOString().slice(0, 10);
  }

  // Most practiced tool
  const toolCounts: Record<string, number> = {};
  for (const r of rows) {
    toolCounts[r.tool_name] = (toolCounts[r.tool_name] ?? 0) + 1;
  }
  let most_practiced_tool: string | null = null;
  let max = 0;
  for (const [tool, count] of Object.entries(toolCounts)) {
    if (count > max) {
      max = count;
      most_practiced_tool = tool;
    }
  }

  return { total_count, count_this_week, streak_days, most_practiced_tool };
}
