import { supabaseRestFetch } from "@/lib/db/supabase-rest";

export interface AssessmentReflectionRow {
  prompt_id: string;
  response_text: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function upsertReflections(params: {
  runId: string;
  userId: string;
  reflections: Array<{ prompt_id: string; response_text: string }>;
}): Promise<void> {
  if (params.reflections.length === 0) return;

  const body = params.reflections.map((entry) => ({
    run_id: params.runId,
    user_id: params.userId,
    prompt_id: entry.prompt_id,
    response_text: entry.response_text,
    updated_at: nowIso(),
  }));

  const response = await supabaseRestFetch<unknown>({
    restPath: "assessment_reflections",
    method: "POST",
    query: {
      on_conflict: "run_id,prompt_id",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body,
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_upsert_reflections");
  }
}

export async function getReflectionsForRun(params: {
  runId: string;
  userId: string;
}): Promise<AssessmentReflectionRow[]> {
  const response = await supabaseRestFetch<AssessmentReflectionRow[]>({
    restPath: "assessment_reflections",
    query: {
      select: "prompt_id,response_text",
      run_id: `eq.${params.runId}`,
      user_id: `eq.${params.userId}`,
      order: "prompt_id.asc",
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_reflections");
  }

  return response.data ?? [];
}
