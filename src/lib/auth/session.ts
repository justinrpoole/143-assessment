import { createHash, randomUUID } from "crypto";

import type { UserState } from "@/lib/auth/user-state";
import { getBetaPreviewEmail, isBetaFreeMode } from "@/lib/config/beta";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

interface UserEntitlementRow {
  user_id: string;
  user_state: string;
}

const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60;

/**
 * Generate a deterministic UUID v4-like ID from an email address.
 * Same email always produces the same user_id.
 */
export function generateDeterministicUserId(email: string): string {
  const hash = createHash("sha256").update(`143-leadership:${email}`).digest("hex");

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16),
    ((parseInt(hash[16]!, 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join("-");
}

/**
 * Find or create a user entitlement record for this email.
 * In BETA_FREE_MODE, new users are granted "free_email" state immediately.
 */
export async function findOrCreateUser(email: string): Promise<{
  userId: string;
  userState: string;
}> {
  const emailHash = email.toLowerCase().trim();
  const previewEmail = getBetaPreviewEmail();
  const isPreview = previewEmail ? emailHash === previewEmail : false;
  const previewState: UserState = "sub_active";

  const userId = generateDeterministicUserId(emailHash);

  const existing = await supabaseRestFetch<UserEntitlementRow[]>({
    restPath: "user_entitlements",
    query: {
      select: "user_id,user_state",
      user_id: `eq.${userId}`,
      limit: 1,
    },
  });

  if (existing.ok && existing.data && existing.data.length > 0) {
    const row = existing.data[0]!;
    if (isPreview && row.user_state !== previewState) {
      const update = await supabaseRestFetch<unknown>({
        restPath: "user_entitlements",
        method: "PATCH",
        query: { user_id: `eq.${row.user_id}` },
        prefer: "return=minimal",
        body: {
          user_state: previewState,
          updated_at: new Date().toISOString(),
        },
      });
      if (!update.ok) {
        console.error("[auth:session] failed_to_update_preview_entitlement", {
          userId: row.user_id,
          error: update.error,
        });
        return { userId: row.user_id, userState: row.user_state };
      }
      return { userId: row.user_id, userState: previewState };
    }
    return { userId: row.user_id, userState: row.user_state };
  }

  // New user — create entitlement
  const defaultState = isPreview ? previewState : isBetaFreeMode() ? "free_email" : "free_email";

  const insert = await supabaseRestFetch<unknown>({
    restPath: "user_entitlements",
    method: "POST",
    query: { on_conflict: "user_id" },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      user_id: userId,
      user_state: defaultState,
      updated_at: new Date().toISOString(),
    },
  });

  if (!insert.ok) {
    console.error("[auth:session] failed_to_create_entitlement", {
      userId,
      error: insert.error,
    });
  }

  return { userId, userState: defaultState };
}

/**
 * Set the 4 session cookies used for authentication.
 */
export function setSessionCookies(
  store: {
    set: (name: string, value: string, options: Record<string, unknown>) => void;
  },
  userId: string,
  userState: string,
  sessionId?: string,
): string {
  const sid = sessionId ?? randomUUID();

  const baseOptions = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ONE_WEEK_SECONDS,
  };

  store.set("auth_session", sid, { ...baseOptions, httpOnly: true });
  store.set("user_id", userId, { ...baseOptions, httpOnly: true });
  store.set("user_state", userState, { ...baseOptions, httpOnly: false });
  store.set("session_id", sid, { ...baseOptions, httpOnly: true });

  return sid;
}
