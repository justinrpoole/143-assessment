import { NextResponse } from "next/server";
import crypto from "crypto";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

/**
 * GET /api/invites
 * Returns the user's sent invitations and any team constellation data.
 *
 * POST /api/invites
 * Creates a referral invitation. Sends branded email with inviter's
 * archetype name (not scores). After both complete: Team Constellation view.
 */

interface InviteRow {
  id: string;
  inviter_id: string;
  inviter_archetype: string | null;
  invitee_email: string;
  invite_token: string;
  status: "pending" | "accepted" | "completed";
  invitee_archetype: string | null;
  created_at: string;
}

export async function GET() {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const res = await supabaseRestFetch<InviteRow[]>({
    restPath: "referral_invites",
    query: {
      select: "id,inviter_archetype,invitee_email,status,invitee_archetype,created_at",
      inviter_id: `eq.${auth.userId}`,
      order: "created_at.desc",
      limit: 20,
    },
  });

  return NextResponse.json({ invites: res.data ?? [] });
}

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { email?: string; message?: string };
  try {
    body = (await request.json()) as { email?: string; message?: string };
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  // Check for duplicate invite
  const existing = await supabaseRestFetch<{ id: string }[]>({
    restPath: "referral_invites",
    query: {
      select: "id",
      inviter_id: `eq.${auth.userId}`,
      invitee_email: `eq.${email}`,
      limit: 1,
    },
  });

  if (existing.data && existing.data.length > 0) {
    return NextResponse.json({ error: "already_invited" }, { status: 409 });
  }

  // Get inviter's archetype name from latest assessment
  const resultRes = await supabaseRestFetch<{ ray_pair_id: string }[]>({
    restPath: "assessment_results",
    query: {
      select: "ray_pair_id",
      user_id: `eq.${auth.userId}`,
      order: "created_at.desc",
      limit: 1,
    },
  });

  let inviterArchetype: string | null = null;
  if (resultRes.data?.[0]?.ray_pair_id) {
    // Look up archetype name — use pair code to find in blocks
    // We store the pair code; the UI resolves the name from JSON
    inviterArchetype = resultRes.data[0].ray_pair_id;
  }

  const inviteToken = crypto.randomBytes(16).toString("base64url");

  const insertRes = await supabaseRestFetch<InviteRow[]>({
    restPath: "referral_invites",
    method: "POST",
    prefer: "return=representation",
    body: {
      inviter_id: auth.userId,
      inviter_archetype: inviterArchetype,
      invitee_email: email,
      invite_token: inviteToken,
      status: "pending",
      message: body.message || null,
    },
  });

  if (!insertRes.ok) {
    return NextResponse.json(
      { error: "invite_failed", detail: insertRes.error },
      { status: 500 },
    );
  }

  const invite = insertRes.data?.[0];

  return NextResponse.json({
    ok: true,
    invite_id: invite?.id ?? null,
    invite_url: `/quiz?ref=${inviteToken}`,
  });
}
