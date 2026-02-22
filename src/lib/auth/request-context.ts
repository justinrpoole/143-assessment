import { cookies } from "next/headers";

import { normalizeUserState, type UserState } from "@/lib/auth/user-state";

const AUTH_SESSION_COOKIE_KEYS = [
  "auth_session",
  "session_id",
  "user_id",
  "sb-access-token",
  "sb-refresh-token",
] as const;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface RequestAuthContext {
  userId: string | null;
  userState: UserState;
  hasSession: boolean;
  isAuthenticated: boolean;
}

function normalizeUuid(value: string | undefined): string | null {
  if (!value) {
    return null;
  }
  return UUID_PATTERN.test(value) ? value : null;
}

export async function getRequestAuthContext(): Promise<RequestAuthContext> {
  const store = await cookies();
  const userState = normalizeUserState(store.get("user_state")?.value);
  const userId = normalizeUuid(store.get("user_id")?.value);
  const hasSession = AUTH_SESSION_COOKIE_KEYS.some((cookieName) =>
    Boolean(store.get(cookieName)?.value),
  );

  return {
    userId,
    userState,
    hasSession,
    isAuthenticated: hasSession && userState !== "public" && Boolean(userId),
  };
}
