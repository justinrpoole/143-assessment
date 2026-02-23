import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

/**
 * POST /api/reports/share-link
 *
 * Creates a time-limited read-only share link for a report.
 * The link expires after 48 hours and does not require authentication.
 *
 * Body: { run_id: string, recipient_email?: string, message?: string }
 * Returns: { share_url: string, expires_at: string, token: string }
 */

interface ShareLinkRow {
  id: string;
  token: string;
  user_id: string;
  run_id: string;
  recipient_email: string | null;
  message: string | null;
  expires_at: string;
  created_at: string;
  views: number;
}

const SHARE_TTL_HOURS = 48;

export async function POST(request: NextRequest) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { run_id?: string; recipient_email?: string; message?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const runId = body.run_id;
  if (!runId || typeof runId !== "string") {
    return NextResponse.json({ error: "run_id_required" }, { status: 400 });
  }

  // Verify the user owns this run
  const runCheck = await supabaseRestFetch<{ id: string }[]>({
    restPath: "assessment_runs",
    query: {
      select: "id",
      id: `eq.${runId}`,
      user_id: `eq.${auth.userId}`,
      limit: 1,
    },
  });

  if (!runCheck.ok || !runCheck.data?.length) {
    return NextResponse.json({ error: "run_not_found" }, { status: 404 });
  }

  // Generate unique token
  const token = crypto.randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + SHARE_TTL_HOURS * 60 * 60 * 1000).toISOString();

  // Store share link
  const insertRes = await supabaseRestFetch<ShareLinkRow[]>({
    restPath: "report_share_links",
    method: "POST",
    prefer: "return=representation",
    body: {
      token,
      user_id: auth.userId,
      run_id: runId,
      recipient_email: body.recipient_email || null,
      message: body.message || null,
      expires_at: expiresAt,
      views: 0,
    },
  });

  if (!insertRes.ok) {
    return NextResponse.json(
      { error: "share_link_create_failed", detail: insertRes.error },
      { status: 500 },
    );
  }

  const origin = request.nextUrl.origin;
  const shareUrl = `${origin}/shared-report/${token}`;

  return NextResponse.json({
    share_url: shareUrl,
    expires_at: expiresAt,
    token,
  });
}
