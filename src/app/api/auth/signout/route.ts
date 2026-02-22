import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIES = [
  "auth_session",
  "session_id",
  "user_id",
  "user_state",
  "sb-access-token",
  "sb-refresh-token",
] as const;

export async function POST() {
  const store = await cookies();

  for (const name of SESSION_COOKIES) {
    store.delete(name);
  }

  return NextResponse.json({ ok: true });
}
