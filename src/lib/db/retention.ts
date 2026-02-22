import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { nowLocalDateIso } from "@/lib/timezone";

export interface MorningEntryRow {
  id: string;
  user_id: string;
  entry_date: string;
  affirmation_text: string;
  reps_logged: number;
  created_at: string;
  updated_at: string;
}

export interface MicroJoyEntryRow {
  id: string;
  user_id: string;
  created_at: string;
  suggestion_text: string;
  selected: boolean;
  notes: string | null;
  category: string | null;
  template_key: string | null;
  local_date: string;
}

export async function getMorningEntryForDate(params: {
  userId: string;
  entryDate?: string;
}): Promise<MorningEntryRow | null> {
  const entryDate = params.entryDate ?? nowLocalDateIso();
  const response = await supabaseRestFetch<MorningEntryRow[]>({
    restPath: "morning_entries",
    query: {
      select: "id,user_id,entry_date,affirmation_text,reps_logged,created_at,updated_at",
      user_id: `eq.${params.userId}`,
      entry_date: `eq.${entryDate}`,
      limit: 1,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "morning_entry_load_failed");
  }
  return response.data?.[0] ?? null;
}

export async function upsertMorningEntry(params: {
  userId: string;
  entryDate: string;
  affirmationText: string;
  repsLogged: number;
}): Promise<MorningEntryRow> {
  const response = await supabaseRestFetch<MorningEntryRow[]>({
    restPath: "morning_entries",
    method: "POST",
    query: {
      on_conflict: "user_id,entry_date",
      select: "id,user_id,entry_date,affirmation_text,reps_logged,created_at,updated_at",
    },
    prefer: "resolution=merge-duplicates,return=representation",
    body: {
      user_id: params.userId,
      entry_date: params.entryDate,
      affirmation_text: params.affirmationText,
      reps_logged: params.repsLogged,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "morning_entry_upsert_failed");
  }
  const row = response.data?.[0];
  if (!row) {
    throw new Error("morning_entry_upsert_empty");
  }
  return row;
}

export async function createMicroJoyEntry(params: {
  userId: string;
  suggestionText: string;
  selected: boolean;
  notes?: string | null;
  category?: string | null;
  templateKey?: string | null;
  localDate?: string;
}): Promise<MicroJoyEntryRow> {
  const response = await supabaseRestFetch<MicroJoyEntryRow[]>({
    restPath: "micro_joy_entries",
    method: "POST",
    query: {
      select:
        "id,user_id,created_at,suggestion_text,selected,notes,category,template_key,local_date",
    },
    prefer: "return=representation",
    body: {
      user_id: params.userId,
      suggestion_text: params.suggestionText,
      selected: params.selected,
      notes: params.notes ?? null,
      category: params.category ?? null,
      template_key: params.templateKey ?? null,
      local_date: params.localDate ?? nowLocalDateIso(),
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "micro_joy_create_failed");
  }
  const row = response.data?.[0];
  if (!row) {
    throw new Error("micro_joy_create_empty");
  }
  return row;
}

export async function updateMicroJoyEntrySelection(params: {
  id: string;
  userId: string;
  selected: boolean;
  notes?: string | null;
}): Promise<MicroJoyEntryRow | null> {
  const response = await supabaseRestFetch<MicroJoyEntryRow[]>({
    restPath: "micro_joy_entries",
    method: "PATCH",
    query: {
      id: `eq.${params.id}`,
      user_id: `eq.${params.userId}`,
      select:
        "id,user_id,created_at,suggestion_text,selected,notes,category,template_key,local_date",
    },
    prefer: "return=representation",
    body: {
      selected: params.selected,
      notes: params.notes ?? null,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "micro_joy_update_failed");
  }
  return response.data?.[0] ?? null;
}

export async function countMicroJoyEntriesForDate(params: {
  userId: string;
  localDate?: string;
}): Promise<number> {
  const response = await supabaseRestFetch<Array<{ id: string }>>({
    restPath: "micro_joy_entries",
    query: {
      select: "id",
      user_id: `eq.${params.userId}`,
      local_date: `eq.${params.localDate ?? nowLocalDateIso()}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "micro_joy_count_failed");
  }
  return response.data?.length ?? 0;
}

export async function listRecentMicroJoyEntries(params: {
  userId: string;
  limit?: number;
}): Promise<MicroJoyEntryRow[]> {
  const response = await supabaseRestFetch<MicroJoyEntryRow[]>({
    restPath: "micro_joy_entries",
    query: {
      select:
        "id,user_id,created_at,suggestion_text,selected,notes,category,template_key,local_date",
      user_id: `eq.${params.userId}`,
      order: "created_at.desc",
      limit: params.limit ?? 10,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "micro_joy_list_failed");
  }
  return response.data ?? [];
}
