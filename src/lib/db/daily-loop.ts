import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { nowLocalDateIso } from "@/lib/timezone";

export interface DailyLoopRow {
  id: string;
  user_id: string;
  entry_date: string;
  name_it: string;
  ground_it: string;
  move_action: string;
  created_at: string;
  updated_at: string;
}

const SELECT_FIELDS =
  "id,user_id,entry_date,name_it,ground_it,move_action,created_at,updated_at";

export async function getDailyLoopForDate(params: {
  userId: string;
  entryDate?: string;
}): Promise<DailyLoopRow | null> {
  const entryDate = params.entryDate ?? nowLocalDateIso();
  const response = await supabaseRestFetch<DailyLoopRow[]>({
    restPath: "daily_loops",
    query: {
      select: SELECT_FIELDS,
      user_id: `eq.${params.userId}`,
      entry_date: `eq.${entryDate}`,
      limit: 1,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "daily_loop_load_failed");
  }
  return response.data?.[0] ?? null;
}

export async function upsertDailyLoop(params: {
  userId: string;
  entryDate: string;
  nameIt: string;
  groundIt: string;
  moveAction: string;
}): Promise<DailyLoopRow> {
  const response = await supabaseRestFetch<DailyLoopRow[]>({
    restPath: "daily_loops",
    method: "POST",
    query: {
      on_conflict: "user_id,entry_date",
      select: SELECT_FIELDS,
    },
    prefer: "resolution=merge-duplicates,return=representation",
    body: {
      user_id: params.userId,
      entry_date: params.entryDate,
      name_it: params.nameIt,
      ground_it: params.groundIt,
      move_action: params.moveAction,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "daily_loop_upsert_failed");
  }
  const row = response.data?.[0];
  if (!row) {
    throw new Error("daily_loop_upsert_empty");
  }
  return row;
}

export async function listRecentDailyLoops(params: {
  userId: string;
  limit?: number;
}): Promise<DailyLoopRow[]> {
  const response = await supabaseRestFetch<DailyLoopRow[]>({
    restPath: "daily_loops",
    query: {
      select: SELECT_FIELDS,
      user_id: `eq.${params.userId}`,
      order: "entry_date.desc",
      limit: params.limit ?? 7,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "daily_loop_list_failed");
  }
  return response.data ?? [];
}
