import { supabaseRestFetch } from "@/lib/db/supabase-rest";

export interface IfThenPlanRow {
  id: string;
  user_id: string;
  if_cue: string;
  then_action: string;
  tool_name: string | null;
  active: boolean;
  completed_count: number;
  created_at: string;
  updated_at: string;
}

const SELECT_FIELDS =
  "id,user_id,if_cue,then_action,tool_name,active,completed_count,created_at,updated_at";

export async function listActivePlans(params: {
  userId: string;
}): Promise<IfThenPlanRow[]> {
  const response = await supabaseRestFetch<IfThenPlanRow[]>({
    restPath: "if_then_plans",
    query: {
      select: SELECT_FIELDS,
      user_id: `eq.${params.userId}`,
      active: "eq.true",
      order: "created_at.desc",
      limit: 20,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "if_then_plans_load_failed");
  }
  return response.data ?? [];
}

export async function createIfThenPlan(params: {
  userId: string;
  ifCue: string;
  thenAction: string;
  toolName?: string | null;
}): Promise<IfThenPlanRow> {
  const response = await supabaseRestFetch<IfThenPlanRow[]>({
    restPath: "if_then_plans",
    method: "POST",
    query: { select: SELECT_FIELDS },
    prefer: "return=representation",
    body: {
      user_id: params.userId,
      if_cue: params.ifCue,
      then_action: params.thenAction,
      tool_name: params.toolName ?? null,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "if_then_plan_create_failed");
  }
  const row = response.data?.[0];
  if (!row) {
    throw new Error("if_then_plan_create_empty");
  }
  return row;
}

export async function incrementPlanCompletion(params: {
  id: string;
  userId: string;
}): Promise<IfThenPlanRow | null> {
  // Fetch current count, then update
  const current = await supabaseRestFetch<IfThenPlanRow[]>({
    restPath: "if_then_plans",
    query: {
      select: "id,completed_count",
      id: `eq.${params.id}`,
      user_id: `eq.${params.userId}`,
      limit: 1,
    },
  });
  const currentCount = current.data?.[0]?.completed_count ?? 0;

  const response = await supabaseRestFetch<IfThenPlanRow[]>({
    restPath: "if_then_plans",
    method: "PATCH",
    query: {
      id: `eq.${params.id}`,
      user_id: `eq.${params.userId}`,
      select: SELECT_FIELDS,
    },
    prefer: "return=representation",
    body: {
      completed_count: currentCount + 1,
    },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "if_then_plan_increment_failed");
  }
  return response.data?.[0] ?? null;
}

export async function deactivatePlan(params: {
  id: string;
  userId: string;
}): Promise<void> {
  const response = await supabaseRestFetch<IfThenPlanRow[]>({
    restPath: "if_then_plans",
    method: "PATCH",
    query: {
      id: `eq.${params.id}`,
      user_id: `eq.${params.userId}`,
    },
    prefer: "return=minimal",
    body: { active: false },
  });
  if (!response.ok) {
    throw new Error(response.error ?? "if_then_plan_deactivate_failed");
  }
}
