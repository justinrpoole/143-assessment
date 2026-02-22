import { supabaseRestFetch } from "@/lib/db/supabase-rest";

export interface EnergyAuditRow {
  id: string;
  user_id: string;
  week_of: string;
  sleep_debt: number;
  recovery_quality: number;
  fog: number;
  irritability: number;
  impulsivity: number;
  numbness: number;
  somatic_signals: number;
  compulsion: number;
  total_load: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const SELECT_FIELDS =
  "id,user_id,week_of,sleep_debt,recovery_quality,fog,irritability,impulsivity,numbness,somatic_signals,compulsion,total_load,notes,created_at,updated_at";

export async function getEnergyAuditForWeek(params: {
  userId: string;
  weekOf: string;
}): Promise<EnergyAuditRow | null> {
  const response = await supabaseRestFetch<EnergyAuditRow[]>({
    restPath: "energy_audits",
    query: {
      select: SELECT_FIELDS,
      user_id: `eq.${params.userId}`,
      week_of: `eq.${params.weekOf}`,
      limit: 1,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "energy_audit_load_failed");
  }
  return response.data?.[0] ?? null;
}

export async function upsertEnergyAudit(params: {
  userId: string;
  weekOf: string;
  scores: Record<string, number>;
  totalLoad: number;
  notes?: string | null;
}): Promise<EnergyAuditRow> {
  const response = await supabaseRestFetch<EnergyAuditRow[]>({
    restPath: "energy_audits",
    method: "POST",
    query: {
      on_conflict: "user_id,week_of",
      select: SELECT_FIELDS,
    },
    prefer: "resolution=merge-duplicates,return=representation",
    body: {
      user_id: params.userId,
      week_of: params.weekOf,
      sleep_debt: params.scores.sleep_debt ?? 0,
      recovery_quality: params.scores.recovery_quality ?? 0,
      fog: params.scores.fog ?? 0,
      irritability: params.scores.irritability ?? 0,
      impulsivity: params.scores.impulsivity ?? 0,
      numbness: params.scores.numbness ?? 0,
      somatic_signals: params.scores.somatic_signals ?? 0,
      compulsion: params.scores.compulsion ?? 0,
      total_load: params.totalLoad,
      notes: params.notes ?? null,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "energy_audit_upsert_failed");
  }
  const row = response.data?.[0];
  if (!row) {
    throw new Error("energy_audit_upsert_empty");
  }
  return row;
}

export async function listRecentEnergyAudits(params: {
  userId: string;
  limit?: number;
}): Promise<EnergyAuditRow[]> {
  const response = await supabaseRestFetch<EnergyAuditRow[]>({
    restPath: "energy_audits",
    query: {
      select: SELECT_FIELDS,
      user_id: `eq.${params.userId}`,
      order: "week_of.desc",
      limit: params.limit ?? 8,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "energy_audit_list_failed");
  }
  return response.data ?? [];
}
