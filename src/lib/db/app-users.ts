import { supabaseRestFetch } from "@/lib/db/supabase-rest";

export interface AppUserRow {
  id: string;
  email: string;
  user_state: string;
  source_route: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export async function getAppUserById(userId: string): Promise<AppUserRow | null> {
  const response = await supabaseRestFetch<AppUserRow[]>({
    restPath: "app_users",
    query: {
      select: "id,email,user_state,source_route,timezone,created_at,updated_at",
      id: `eq.${userId}`,
      limit: 1,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_app_user");
  }

  return response.data?.[0] ?? null;
}

/**
 * List all users with completed assessments (user_state not 'public').
 * Used by cron jobs to send weekly summaries.
 */
export async function listActiveAssessmentUsers(limit = 500): Promise<AppUserRow[]> {
  const response = await supabaseRestFetch<AppUserRow[]>({
    restPath: "app_users",
    query: {
      select: "id,email,user_state,source_route,timezone,created_at,updated_at",
      user_state: "neq.public",
      order: "created_at.asc",
      limit,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_list_active_users");
  }

  return response.data ?? [];
}

export async function updateUserTimezone(params: {
  userId: string;
  timezone: string;
}): Promise<void> {
  const response = await supabaseRestFetch<unknown>({
    restPath: "app_users",
    method: "PATCH",
    query: {
      id: `eq.${params.userId}`,
    },
    prefer: "return=minimal",
    body: {
      timezone: params.timezone,
      updated_at: new Date().toISOString(),
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_update_timezone");
  }
}
