import type { UserState } from "@/lib/auth/user-state";
import type { SetupContextScope } from "@/lib/analytics/taxonomy";

const ALLOWED_USER_STATES = new Set<UserState>([
  "public",
  "free_email",
  "paid_43",
  "sub_active",
  "sub_canceled",
  "past_due",
]);

interface SupabaseConfig {
  baseUrl: string;
  serviceRoleKey: string;
}

export interface AssessmentSetupDraftRecord {
  id: string;
  runBindingKey: string;
  userId: string | null;
  userState: UserState;
  contextScope: SetupContextScope;
  focusTarget: string;
  firstRep: string;
  sourceRoute: string;
}

export interface SaveDraftResult {
  ok: boolean;
  error?: string;
}

function buildAuthHeaders(key: string): Record<string, string> {
  const headers: Record<string, string> = { apikey: key };
  if (key.startsWith("eyJ")) {
    headers["Authorization"] = `Bearer ${key}`;
  }
  return headers;
}

function getSupabaseConfig(): SupabaseConfig | null {
  const baseUrl =
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    null;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

  if (!baseUrl || !serviceRoleKey) {
    return null;
  }

  return { baseUrl, serviceRoleKey };
}

export async function saveAssessmentSetupDraft(
  record: AssessmentSetupDraftRecord,
): Promise<SaveDraftResult> {
  if (!ALLOWED_USER_STATES.has(record.userState)) {
    return { ok: false, error: "invalid_user_state" };
  }

  const config = getSupabaseConfig();
  if (!config) {
    return { ok: false, error: "db_not_configured" };
  }

  const endpoint = `${config.baseUrl}/rest/v1/assessment_setup_drafts?on_conflict=id`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...buildAuthHeaders(config.serviceRoleKey),
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      id: record.id,
      run_binding_key: record.runBindingKey,
      user_id: record.userId,
      user_state: record.userState,
      source_route: record.sourceRoute,
      context_scope: record.contextScope,
      focus_target: record.focusTarget,
      first_rep: record.firstRep,
      status: "draft",
      updated_at: new Date().toISOString(),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    return {
      ok: false,
      error: `db_write_failed:${response.status}:${details.slice(0, 240)}`,
    };
  }

  return { ok: true };
}
