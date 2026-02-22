import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { nowLocalDateIso } from "@/lib/timezone";

export interface EveningReflectionRow {
  id: string;
  user_id: string;
  entry_date: string;
  what_happened: string;
  what_i_did: string;
  what_next: string;
  quality_score: number;
  created_at: string;
  updated_at: string;
}

const SELECT_FIELDS =
  "id,user_id,entry_date,what_happened,what_i_did,what_next,quality_score,created_at,updated_at";

export async function getEveningReflectionForDate(params: {
  userId: string;
  entryDate?: string;
}): Promise<EveningReflectionRow | null> {
  const entryDate = params.entryDate ?? nowLocalDateIso();
  const response = await supabaseRestFetch<EveningReflectionRow[]>({
    restPath: "evening_reflections",
    query: {
      select: SELECT_FIELDS,
      user_id: `eq.${params.userId}`,
      entry_date: `eq.${entryDate}`,
      limit: 1,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "evening_reflection_load_failed");
  }
  return response.data?.[0] ?? null;
}

export async function upsertEveningReflection(params: {
  userId: string;
  entryDate: string;
  whatHappened: string;
  whatIDid: string;
  whatNext: string;
  qualityScore: number;
}): Promise<EveningReflectionRow> {
  const response = await supabaseRestFetch<EveningReflectionRow[]>({
    restPath: "evening_reflections",
    method: "POST",
    query: {
      on_conflict: "user_id,entry_date",
      select: SELECT_FIELDS,
    },
    prefer: "resolution=merge-duplicates,return=representation",
    body: {
      user_id: params.userId,
      entry_date: params.entryDate,
      what_happened: params.whatHappened,
      what_i_did: params.whatIDid,
      what_next: params.whatNext,
      quality_score: params.qualityScore,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "evening_reflection_upsert_failed");
  }
  const row = response.data?.[0];
  if (!row) {
    throw new Error("evening_reflection_upsert_empty");
  }
  return row;
}

export async function listRecentEveningReflections(params: {
  userId: string;
  limit?: number;
}): Promise<EveningReflectionRow[]> {
  const response = await supabaseRestFetch<EveningReflectionRow[]>({
    restPath: "evening_reflections",
    query: {
      select: SELECT_FIELDS,
      user_id: `eq.${params.userId}`,
      order: "entry_date.desc",
      limit: params.limit ?? 7,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "evening_reflection_list_failed");
  }
  return response.data ?? [];
}
