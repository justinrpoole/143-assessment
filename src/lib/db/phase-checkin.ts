import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { nowLocalDateIso } from "@/lib/timezone";

export interface PhaseCheckinRow {
  id: string;
  user_id: string;
  entry_date: string;
  q1_score: number;
  q2_score: number;
  q3_score: number;
  total_score: number;
  detected_phase: string;
  created_at: string;
  updated_at: string;
}

const SELECT_FIELDS =
  "id,user_id,entry_date,q1_score,q2_score,q3_score,total_score,detected_phase,created_at,updated_at";

export async function getPhaseCheckinForDate(params: {
  userId: string;
  entryDate?: string;
}): Promise<PhaseCheckinRow | null> {
  const entryDate = params.entryDate ?? nowLocalDateIso();
  const response = await supabaseRestFetch<PhaseCheckinRow[]>({
    restPath: "phase_checkins",
    query: {
      select: SELECT_FIELDS,
      user_id: `eq.${params.userId}`,
      entry_date: `eq.${entryDate}`,
      limit: 1,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "phase_checkin_load_failed");
  }
  return response.data?.[0] ?? null;
}

export async function upsertPhaseCheckin(params: {
  userId: string;
  entryDate: string;
  q1Score: number;
  q2Score: number;
  q3Score: number;
  totalScore: number;
  detectedPhase: string;
}): Promise<PhaseCheckinRow> {
  const response = await supabaseRestFetch<PhaseCheckinRow[]>({
    restPath: "phase_checkins",
    method: "POST",
    query: {
      on_conflict: "user_id,entry_date",
      select: SELECT_FIELDS,
    },
    prefer: "resolution=merge-duplicates,return=representation",
    body: {
      user_id: params.userId,
      entry_date: params.entryDate,
      q1_score: params.q1Score,
      q2_score: params.q2Score,
      q3_score: params.q3Score,
      total_score: params.totalScore,
      detected_phase: params.detectedPhase,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "phase_checkin_upsert_failed");
  }
  const row = response.data?.[0];
  if (!row) {
    throw new Error("phase_checkin_upsert_empty");
  }
  return row;
}

export async function listRecentPhaseCheckins(params: {
  userId: string;
  limit?: number;
}): Promise<PhaseCheckinRow[]> {
  const response = await supabaseRestFetch<PhaseCheckinRow[]>({
    restPath: "phase_checkins",
    query: {
      select: SELECT_FIELDS,
      user_id: `eq.${params.userId}`,
      order: "entry_date.desc",
      limit: params.limit ?? 7,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "phase_checkin_list_failed");
  }
  return response.data ?? [];
}
