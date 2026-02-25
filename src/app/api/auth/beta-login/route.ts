import { NextResponse, type NextRequest } from "next/server";

import { createMagicLinkToken } from "@/lib/auth/magic-link";
import {
  getBetaPreviewEmail,
  isBetaFreeMode,
  isBetaPreviewEmail,
} from "@/lib/config/beta";

/**
 * Beta login bypass — creates a magic link directly without email delivery.
 *
 * ONLY works when BETA_FREE_MODE=true.
 * Returns a redirect URL that sets session cookies.
 * Remove this route before public launch.
 */

function getBaseUrl(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; next?: string };
  const previewEmail = getBetaPreviewEmail();
  const requestedEmail = body.email?.toLowerCase().trim();
  const email = requestedEmail || previewEmail;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "invalid_email", message: "Please provide a valid email." },
      { status: 400 },
    );
  }

  if (!isBetaFreeMode() && !isBetaPreviewEmail(email)) {
    return NextResponse.json(
      { error: "beta_login_disabled", message: "Beta login is only available for preview access." },
      { status: 403 },
    );
  }

  const sourceRoute = typeof body.next === "string" && body.next.startsWith("/") ? body.next : "/portal";
  const token = createMagicLinkToken(email, sourceRoute);
  const baseUrl = getBaseUrl(request);
  const verifyUrl = `${baseUrl}/api/auth/login/verify?token=${encodeURIComponent(token)}`;

  return NextResponse.json({ ok: true, verify_url: verifyUrl });
}
