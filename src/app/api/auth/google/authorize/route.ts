import { createHmac, randomBytes } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

import { sanitizeSourceRoute } from "@/lib/nav/source-route";

function getOAuthSecret(): string {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (!secret) {
    throw new Error(
      "MAGIC_LINK_SECRET is required. Set it in .env.local for development or as an environment variable in production.",
    );
  }
  return secret;
}

function getBaseUrl(request: NextRequest): string {
  return (
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    request.nextUrl.origin
  );
}

/**
 * Sign the OAuth state parameter to prevent CSRF.
 */
export function signOAuthState(payload: string): string {
  return createHmac("sha256", getOAuthSecret()).update(payload).digest("hex");
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error("[auth:google] GOOGLE_CLIENT_ID not configured");
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url),
    );
  }

  const sourceRoute = sanitizeSourceRoute(
    request.nextUrl.searchParams.get("source_route") ??
      request.nextUrl.searchParams.get("next"),
  );

  const nonce = randomBytes(16).toString("hex");
  const statePayload = JSON.stringify({ sourceRoute, nonce });
  const stateBase64 = Buffer.from(statePayload, "utf8").toString("base64url");
  const stateSignature = signOAuthState(stateBase64);
  const state = `${stateBase64}.${stateSignature}`;

  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.redirect(googleAuthUrl);
}
