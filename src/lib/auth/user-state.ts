import { cookies } from "next/headers";

export const USER_STATES = [
  "public",
  "free_email",
  "paid_43",
  "sub_active",
  "sub_canceled",
  "past_due",
] as const;

export type UserState = (typeof USER_STATES)[number];

const USER_STATE_SET = new Set<string>(USER_STATES);

export function normalizeUserState(value: string | null | undefined): UserState {
  if (value && USER_STATE_SET.has(value)) {
    return value as UserState;
  }

  return "public";
}

export async function getUserStateFromRequest(): Promise<UserState> {
  const store = await cookies();
  return normalizeUserState(store.get("user_state")?.value);
}

export function hasFreeEmailAccess(userState: UserState): boolean {
  return userState !== "public";
}
