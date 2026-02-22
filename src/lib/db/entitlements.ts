import type { UserState } from "@/lib/auth/user-state";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

export interface UserEntitlementRow {
  user_id: string;
  user_state: UserState;
  stripe_customer_id: string | null;
  paid_43_at: string | null;
  sub_status: string | null;
  sub_current_period_end: string | null;
  updated_at: string;
}

export interface StripeWebhookEventRow {
  event_id: string;
  event_type: string;
  status: "processing" | "processed" | "failed";
  payload_hash: string | null;
  failure_reason: string | null;
  processed_at: string | null;
}

function unwrapSingle<T>(rows: T[] | null): T | null {
  if (!rows || rows.length === 0) {
    return null;
  }
  return rows[0] ?? null;
}

export async function getEntitlementByUserId(
  userId: string,
): Promise<UserEntitlementRow | null> {
  const response = await supabaseRestFetch<UserEntitlementRow[]>({
    restPath: "user_entitlements",
    query: {
      select:
        "user_id,user_state,stripe_customer_id,paid_43_at,sub_status,sub_current_period_end,updated_at",
      user_id: `eq.${userId}`,
      limit: 1,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_entitlement");
  }

  return unwrapSingle(response.data);
}

export async function getEntitlementByCustomerId(
  customerId: string,
): Promise<UserEntitlementRow | null> {
  const response = await supabaseRestFetch<UserEntitlementRow[]>({
    restPath: "user_entitlements",
    query: {
      select:
        "user_id,user_state,stripe_customer_id,paid_43_at,sub_status,sub_current_period_end,updated_at",
      stripe_customer_id: `eq.${customerId}`,
      limit: 1,
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_load_entitlement_by_customer");
  }

  return unwrapSingle(response.data);
}

export async function upsertEntitlement(
  row: Partial<UserEntitlementRow> & { user_id: string; user_state: UserState },
): Promise<void> {
  const existing = await getEntitlementByUserId(row.user_id);
  const merged: UserEntitlementRow = {
    user_id: row.user_id,
    user_state: row.user_state,
    stripe_customer_id:
      row.stripe_customer_id ?? existing?.stripe_customer_id ?? null,
    paid_43_at: row.paid_43_at ?? existing?.paid_43_at ?? null,
    sub_status: row.sub_status ?? existing?.sub_status ?? null,
    sub_current_period_end:
      row.sub_current_period_end ?? existing?.sub_current_period_end ?? null,
    updated_at: new Date().toISOString(),
  };

  const response = await supabaseRestFetch<unknown>({
    restPath: "user_entitlements",
    method: "POST",
    query: {
      on_conflict: "user_id",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: merged,
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_upsert_entitlement");
  }
}

export async function markWebhookEventProcessing(params: {
  eventId: string;
  eventType: string;
  payloadHash: string | null;
}): Promise<"inserted" | "already_processed"> {
  const existing = await supabaseRestFetch<StripeWebhookEventRow[]>({
    restPath: "stripe_webhook_events",
    query: {
      select: "event_id,event_type,status,payload_hash,failure_reason,processed_at",
      event_id: `eq.${params.eventId}`,
      limit: 1,
    },
  });

  if (!existing.ok) {
    throw new Error(existing.error ?? "failed_to_check_webhook_event");
  }

  const row = unwrapSingle(existing.data);
  if (row && row.status === "processed") {
    return "already_processed";
  }

  const upsert = await supabaseRestFetch<unknown>({
    restPath: "stripe_webhook_events",
    method: "POST",
    query: {
      on_conflict: "event_id",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      event_id: params.eventId,
      event_type: params.eventType,
      status: "processing",
      payload_hash: params.payloadHash,
      processed_at: null,
      failure_reason: null,
      received_at: new Date().toISOString(),
    },
  });

  if (!upsert.ok) {
    throw new Error(upsert.error ?? "failed_to_mark_webhook_processing");
  }

  return "inserted";
}

export async function markWebhookEventProcessed(params: {
  eventId: string;
  success: boolean;
  failureReason?: string;
}): Promise<void> {
  const response = await supabaseRestFetch<unknown>({
    restPath: "stripe_webhook_events",
    method: "PATCH",
    query: {
      event_id: `eq.${params.eventId}`,
    },
    prefer: "return=minimal",
    body: {
      status: params.success ? "processed" : "failed",
      failure_reason: params.success ? null : params.failureReason ?? "unknown",
      processed_at: new Date().toISOString(),
    },
  });

  if (!response.ok) {
    throw new Error(response.error ?? "failed_to_mark_webhook_processed");
  }
}
