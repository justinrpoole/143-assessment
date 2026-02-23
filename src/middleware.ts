import { NextResponse, type NextRequest } from "next/server";

const AUTH_SESSION_COOKIE_KEYS = [
  "auth_session",
  "session_id",
  "user_id",
  "sb-access-token",
  "sb-refresh-token",
] as const;

const CANONICAL_USER_STATES = new Set([
  "public",
  "free_email",
  "paid_43",
  "sub_active",
  "sub_canceled",
  "past_due",
]);

function hasAuthSessionCookie(request: NextRequest): boolean {
  return AUTH_SESSION_COOKIE_KEYS.some((cookieName) =>
    Boolean(request.cookies.get(cookieName)?.value),
  );
}

function getUserState(request: NextRequest): string | null {
  const raw = request.cookies.get("user_state")?.value;
  if (!raw || !CANONICAL_USER_STATES.has(raw)) {
    return null;
  }
  return raw;
}

export function middleware(request: NextRequest) {
  const userState = getUserState(request);
  const hasSession = hasAuthSessionCookie(request);
  const isUnauthenticated = !hasSession || !userState || userState === "public";

  if (!isUnauthenticated) {
    return NextResponse.next();
  }

  const sourceRoute = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("source_route", sourceRoute);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/portal",
    "/morning",
    "/micro-joy",
    "/account",
    "/assessment/:path*",
    "/results",
    "/reports",
    "/growth",
    "/reps",
    "/energy",
    "/toolkit",
    "/weekly",
    "/reflect",
    "/welcome",
  ],
};
