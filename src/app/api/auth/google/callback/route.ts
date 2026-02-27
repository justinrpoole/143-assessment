import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { findOrCreateUser, setSessionCookies } from "@/lib/auth/session";
import { trackEvent } from "@/lib/events";

function getOAuthSecret(): string {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("MAGIC_LINK_SECRET is required in production");
  }
  return "dev-only-insecure-secret-do-not-use-in-prod";
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
 * Verify the HMAC signature on the OAuth state parameter.
 */
function verifyOAuthState(state: string): { sourceRoute: string; nonce: string } | null {
  const [stateBase64, signature] = state.split(".");
  if (!stateBase64 || !signature) return null;

  const expected = createHmac("sha256", getOAuthSecret()).update(stateBase64).digest("hex");
  const incoming = Buffer.from(signature, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");

  if (incoming.length !== expectedBuf.length || !timingSafeEqual(incoming, expectedBuf)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(stateBase64, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface GoogleIdTokenPayload {
  email?: string;
  email_verified?: boolean;
  sub?: string;
  name?: string;
}

/**
 * Decode JWT payload without verification.
 * Safe here because we received the token directly from Google over HTTPS.
 */
function decodeJwtPayload(jwt: string): GoogleIdTokenPayload {
  const parts = jwt.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT format");
  return JSON.parse(Buffer.from(parts[1]!, "base64url").toString("utf8"));
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const stateParam = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  // User denied consent or Google returned an error
  if (error) {
    console.warn("[auth:google] oauth_error", { error });
    return NextResponse.redirect(
      new URL("/login?error=google_denied", request.url),
    );
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(
      new URL("/login?error=google_missing_params", request.url),
    );
  }

  // Verify CSRF state
  const stateData = verifyOAuthState(stateParam);
  if (!stateData) {
    console.error("[auth:google] invalid_state_signature");
    return NextResponse.redirect(
      new URL("/login?error=google_invalid_state", request.url),
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("[auth:google] missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url),
    );
  }

  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error("[auth:google] token_exchange_failed", { status: tokenRes.status, body: errBody });
      return NextResponse.redirect(
        new URL("/login?error=google_token_failed", request.url),
      );
    }

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

    // Decode the ID token to get the user's email
    const idPayload = decodeJwtPayload(tokenData.id_token);

    if (!idPayload.email) {
      console.error("[auth:google] no_email_in_id_token");
      return NextResponse.redirect(
        new URL("/login?error=google_no_email", request.url),
      );
    }

    // Use the same flow as magic link — deterministic UUID from email
    const { userId, userState } = await findOrCreateUser(idPayload.email);

    const store = await cookies();
    const sessionId = setSessionCookies(store, userId, userState);

    void trackEvent({
      userId,
      eventType: "google_oauth_verified",
      eventData: { userState, provider: "google" },
    });

    console.info("[auth:google] session_created", {
      userId,
      userState,
      sourceRoute: stateData.sourceRoute,
      googleEmail: idPayload.email,
    });

    const redirectTo = stateData.sourceRoute || "/portal";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error("[auth:google] callback_failed", error);
    return NextResponse.redirect(
      new URL("/login?error=google_failed", request.url),
    );
  }
}
