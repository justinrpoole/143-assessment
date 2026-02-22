import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { verifyMagicLinkToken } from "@/lib/auth/magic-link";
import { isBetaFreeMode } from "@/lib/config/beta";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

interface UserEntitlementRow {
  user_id: string;
  user_state: string;
}

/**
 * Find or create a user entitlement record for this email.
 * In BETA_FREE_MODE, new users are granted "free_email" state immediately.
 * Otherwise, new users start as "free_email" after email verification.
 */
async function findOrCreateUser(email: string): Promise<{
  userId: string;
  userState: string;
}> {
  // Look up existing user by email in assessment_runs (email is stored there)
  // or in user_entitlements. For now, we use a deterministic UUID from email.
  // This ensures the same email always maps to the same user_id.
  const emailHash = email.toLowerCase().trim();

  // Check if entitlement exists for a user with this email
  // We generate a deterministic user_id from email for simplicity
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
    return { userId: row.user_id, userState: row.user_state };
  }

  // New user — create entitlement
  const defaultState = isBetaFreeMode() ? "free_email" : "free_email";

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
    console.error("[auth:verify] failed_to_create_entitlement", {
      userId,
      error: insert.error,
    });
  }

  return { userId, userState: defaultState };
}

/**
 * Generate a deterministic UUID v5-like ID from an email address.
 * Uses a simple namespace approach to ensure the same email always
 * produces the same user_id.
 */
function generateDeterministicUserId(email: string): string {
  // Use crypto to create a deterministic hash, then format as UUID
  const { createHash } = require("crypto") as typeof import("crypto");
  const hash = createHash("sha256").update(`143-leadership:${email}`).digest("hex");

  // Format first 32 hex chars as UUID v4-like format
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16), // version 4
    ((parseInt(hash[16]!, 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20), // variant
    hash.slice(20, 32),
  ].join("-");
}

const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=missing_token", request.url),
    );
  }

  const payload = verifyMagicLinkToken(token);

  if (!payload) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_or_expired", request.url),
    );
  }

  try {
    // Find or create the user
    const { userId, userState } = await findOrCreateUser(payload.email);

    // Set session cookies
    const store = await cookies();
    const sessionId = randomUUID();

    store.set("auth_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ONE_WEEK_SECONDS,
    });

    store.set("user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ONE_WEEK_SECONDS,
    });

    store.set("user_state", userState, {
      httpOnly: false, // Middleware needs to read this
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ONE_WEEK_SECONDS,
    });

    store.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ONE_WEEK_SECONDS,
    });

    console.info("[auth:verify] session_created", {
      userId,
      userState,
      sourceRoute: payload.sourceRoute,
    });

    // Redirect to the intended destination
    const redirectTo = payload.sourceRoute || "/portal";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error("[auth:verify] session_creation_failed", error);
    return NextResponse.redirect(
      new URL("/login?error=session_failed", request.url),
    );
  }
}
