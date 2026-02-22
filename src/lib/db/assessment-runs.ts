import type { UserState } from "@/lib/auth/user-state";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

export type AssessmentRunStatus =
  | "draft"
  | "in_progress"
  | "completed"
  | "canceled";

export interface AssessmentRunRow {
  id: string;
  user_id: string;
  status: AssessmentRunStatus;
  run_number: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  context_scope: string | null;
  focus_area: string | null;
  source_route: string | null;
  user_state_at_start: UserState;
  entitlement_snapshot: Record<string, unknown> | null;
  /** Ordered array of item IDs selected for this run. Null for runs created before dynamic selection. */
  item_ids: string[] | null;
}

export interface AssessmentResponseRow {
  run_id: string;
  user_id: string;
  question_id: string;
  value: number;
}

export interface CreateRunResult {
  id: string;
  run_number: number;
  status: AssessmentRunStatus;
}

interface DraftInput {
  userId: string;
  userState: UserState;
  contextScope: string | null;
  focusArea: string | null;
  sourceRoute: string;
  entitlementSnapshot: Record<string, unknown>;
}

function nowIso(): string {
  return new Date().toISOString();
}

function unwrapSingle<T>(rows: T[] | null): T | null {
  if (!rows || rows.length === 0) {
    return null;
  }
  return rows[0] ?? null;
}

export async function getCompletedRunsCount(userId: string): Promise<number> {
  const response = await supabaseRestFetch<Array<{ id: string }>>({
    restPath: "assessment_runs",
    query: {
      select: "id",
      user_id: `eq.${userId}`,
      status: "eq.completed",
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_completed_runs_count");
  }

  return response.data?.length ?? 0;
}

export async function getLatestDraftRun(
  userId: string,
): Promise<AssessmentRunRow | null> {
  const response = await supabaseRestFetch<AssessmentRunRow[]>({
    restPath: "assessment_runs",
    query: {
      select:
        "id,user_id,status,run_number,created_at,started_at,completed_at,context_scope,focus_area,source_route,user_state_at_start,entitlement_snapshot,item_ids",
      user_id: `eq.${userId}`,
      status: "eq.draft",
      order: "created_at.desc",
      limit: 1,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_latest_draft_run");
  }

  return unwrapSingle(response.data);
}

export async function getRunForUser(
  runId: string,
  userId: string,
): Promise<AssessmentRunRow | null> {
  const response = await supabaseRestFetch<AssessmentRunRow[]>({
    restPath: "assessment_runs",
    query: {
      select:
        "id,user_id,status,run_number,created_at,started_at,completed_at,context_scope,focus_area,source_route,user_state_at_start,entitlement_snapshot,item_ids",
      id: `eq.${runId}`,
      user_id: `eq.${userId}`,
      limit: 1,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_run");
  }

  return unwrapSingle(response.data);
}

export async function updateDraftRunMetadata(params: {
  runId: string;
  userId: string;
  contextScope: string | null;
  focusArea: string | null;
  sourceRoute: string;
  userState: UserState;
  entitlementSnapshot: Record<string, unknown>;
}): Promise<AssessmentRunRow> {
  const response = await supabaseRestFetch<AssessmentRunRow[]>({
    restPath: "assessment_runs",
    method: "PATCH",
    query: {
      id: `eq.${params.runId}`,
      user_id: `eq.${params.userId}`,
      status: "eq.draft",
      select:
        "id,user_id,status,run_number,created_at,started_at,completed_at,context_scope,focus_area,source_route,user_state_at_start,entitlement_snapshot,item_ids",
    },
    prefer: "return=representation",
    body: {
      context_scope: params.contextScope,
      focus_area: params.focusArea,
      source_route: params.sourceRoute,
      user_state_at_start: params.userState,
      entitlement_snapshot: params.entitlementSnapshot,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_update_draft");
  }

  const updated = unwrapSingle(response.data);
  if (!updated) {
    throw new Error("draft_not_found");
  }

  return updated;
}

export async function createDraftRun(params: DraftInput): Promise<CreateRunResult> {
  const response = await supabaseRestFetch<CreateRunResult[] | CreateRunResult>({
    restPath: "rpc/create_assessment_run",
    method: "POST",
    body: {
      p_user_id: params.userId,
      p_user_state_at_start: params.userState,
      p_context_scope: params.contextScope,
      p_focus_area: params.focusArea,
      p_source_route: params.sourceRoute,
      p_entitlement_snapshot: params.entitlementSnapshot,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_create_draft_run");
  }

  const payload = response.data;
  const row = Array.isArray(payload) ? payload[0] : payload;
  if (!row) {
    throw new Error("empty_create_run_response");
  }

  return row;
}

export async function markRunInProgress(params: {
  runId: string;
  userId: string;
  itemIds?: string[];
}): Promise<AssessmentRunRow | null> {
  const response = await supabaseRestFetch<AssessmentRunRow[]>({
    restPath: "assessment_runs",
    method: "PATCH",
    query: {
      id: `eq.${params.runId}`,
      user_id: `eq.${params.userId}`,
      status: "eq.draft",
      select:
        "id,user_id,status,run_number,created_at,started_at,completed_at,context_scope,focus_area,source_route,user_state_at_start,entitlement_snapshot,item_ids",
    },
    prefer: "return=representation",
    body: {
      status: "in_progress",
      started_at: nowIso(),
      ...(params.itemIds !== undefined ? { item_ids: params.itemIds } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_mark_in_progress");
  }

  return unwrapSingle(response.data);
}

export async function upsertResponses(params: {
  runId: string;
  userId: string;
  responses: Array<{ question_id: string; value: number }>;
}): Promise<void> {
  const body = params.responses.map((entry) => ({
    run_id: params.runId,
    user_id: params.userId,
    question_id: entry.question_id,
    value: entry.value,
    updated_at: nowIso(),
  }));

  const response = await supabaseRestFetch<unknown>({
    restPath: "assessment_responses",
    method: "POST",
    query: {
      on_conflict: "run_id,question_id",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body,
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_upsert_responses");
  }
}

export async function getResponsesForRun(params: {
  runId: string;
  userId: string;
}): Promise<AssessmentResponseRow[]> {
  const response = await supabaseRestFetch<AssessmentResponseRow[]>({
    restPath: "assessment_responses",
    query: {
      select: "run_id,user_id,question_id,value",
      run_id: `eq.${params.runId}`,
      user_id: `eq.${params.userId}`,
      order: "question_id.asc",
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_responses");
  }

  return response.data ?? [];
}

export async function upsertResult(params: {
  runId: string;
  userId: string;
  rayScores: Record<string, number>;
  topRays: string[];
  rayPairId: string;
  resultsPayload: Record<string, unknown>;
}): Promise<void> {
  const response = await supabaseRestFetch<unknown>({
    restPath: "assessment_results",
    method: "POST",
    query: {
      on_conflict: "run_id",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      run_id: params.runId,
      user_id: params.userId,
      computed_at: nowIso(),
      ray_scores: params.rayScores,
      top_rays: params.topRays,
      ray_pair_id: params.rayPairId,
      results_payload: params.resultsPayload,
      report_version: "v1",
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_upsert_result");
  }
}

export async function upsertHtmlReport(params: {
  runId: string;
  userId: string;
  html: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  const response = await supabaseRestFetch<unknown>({
    restPath: "assessment_reports",
    method: "POST",
    query: {
      on_conflict: "run_id,format",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      run_id: params.runId,
      user_id: params.userId,
      format: "html",
      status: "ready",
      html: params.html,
      meta: params.meta ?? {},
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_upsert_html_report");
  }
}

export async function markRunCompleted(params: {
  runId: string;
  userId: string;
}): Promise<void> {
  const response = await supabaseRestFetch<unknown>({
    restPath: "assessment_runs",
    method: "PATCH",
    query: {
      id: `eq.${params.runId}`,
      user_id: `eq.${params.userId}`,
      status: "neq.completed",
    },
    prefer: "return=minimal",
    body: {
      status: "completed",
      completed_at: nowIso(),
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_mark_run_completed");
  }
}

export interface AssessmentResultRow {
  run_id: string;
  user_id: string;
  computed_at: string;
  ray_scores: Record<string, number>;
  top_rays: string[];
  ray_pair_id: string;
  results_payload: Record<string, unknown>;
  report_version: string;
}

export async function getResultForRun(params: {
  runId: string;
  userId: string;
}): Promise<AssessmentResultRow | null> {
  const response = await supabaseRestFetch<AssessmentResultRow[]>({
    restPath: "assessment_results",
    query: {
      select:
        "run_id,user_id,computed_at,ray_scores,top_rays,ray_pair_id,results_payload,report_version",
      run_id: `eq.${params.runId}`,
      user_id: `eq.${params.userId}`,
      limit: 1,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_result");
  }

  return unwrapSingle(response.data);
}

export interface AssessmentReportRow {
  run_id: string;
  user_id: string;
  format: "html" | "pdf";
  status: "ready" | "pending" | "failed";
  html: string | null;
  storage_path: string | null;
  meta: Record<string, unknown> | null;
}

export async function getReportForRun(params: {
  runId: string;
  userId: string;
  format?: "html" | "pdf";
}): Promise<AssessmentReportRow | null> {
  const formatFilter =
    params.format === "html" || params.format === "pdf"
      ? `eq.${params.format}`
      : undefined;
  const response = await supabaseRestFetch<AssessmentReportRow[]>({
    restPath: "assessment_reports",
    query: {
      select: "run_id,user_id,format,status,html,storage_path,meta",
      run_id: `eq.${params.runId}`,
      user_id: `eq.${params.userId}`,
      ...(formatFilter ? { format: formatFilter } : {}),
      limit: 1,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_report");
  }

  return unwrapSingle(response.data);
}

export async function upsertPdfReport(params: {
  runId: string;
  userId: string;
  status: "pending" | "ready" | "failed";
  storagePath?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> {
  const response = await supabaseRestFetch<unknown>({
    restPath: "assessment_reports",
    method: "POST",
    query: {
      on_conflict: "run_id,format",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      run_id: params.runId,
      user_id: params.userId,
      format: "pdf",
      status: params.status,
      storage_path: params.storagePath ?? null,
      meta: params.meta ?? {},
      html: null,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_upsert_pdf_report");
  }
}
