import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { verifyMagicLinkToken } from "@/lib/auth/magic-link";
import { findOrCreateUser, setSessionCookies } from "@/lib/auth/session";
import { trackEvent } from "@/lib/events";

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
    const { userId, userState } = await findOrCreateUser(payload.email);

    const store = await cookies();
    const sessionId = setSessionCookies(store, userId, userState);

    void trackEvent({ userId, eventType: "magic_link_verified", eventData: { userState } });

    console.info("[auth:verify] session_created", {
      userId,
      userState,
      sourceRoute: payload.sourceRoute,
    });

    const redirectTo = payload.sourceRoute || "/portal";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    console.error("[auth:verify] session_creation_failed", error);
    return NextResponse.redirect(
      new URL("/login?error=session_failed", request.url),
    );
  }
}
