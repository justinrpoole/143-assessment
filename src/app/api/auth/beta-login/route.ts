import { NextResponse, type NextRequest } from "next/server";

import { createMagicLinkToken } from "@/lib/auth/magic-link";
import { isBetaFreeMode } from "@/lib/config/beta";

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
  if (!isBetaFreeMode()) {
    return NextResponse.json(
      { error: "beta_login_disabled", message: "Beta login is only available in beta mode." },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { email?: string };
  const email = body.email?.toLowerCase().trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "invalid_email", message: "Please provide a valid email." },
      { status: 400 },
    );
  }

  const token = createMagicLinkToken(email, "/portal");
  const baseUrl = getBaseUrl(request);
  const verifyUrl = `${baseUrl}/api/auth/login/verify?token=${encodeURIComponent(token)}`;

  return NextResponse.json({ ok: true, verify_url: verifyUrl });
}
