import { NextResponse } from "next/server";

import { verifyChallengeUnlockToken } from "@/lib/auth/challenge-unlock";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token")?.trim() ?? "";

  if (!token) {
    return NextResponse.json({ valid: false, error: "missing_token" }, { status: 400 });
  }

  const payload = verifyChallengeUnlockToken(token);
  if (!payload) {
    return NextResponse.json({ valid: false, error: "invalid_or_expired" }, { status: 401 });
  }

  return NextResponse.json({
    valid: true,
    source_route: payload.sourceRoute,
    email_hint: payload.email.replace(/(^.).+(@.*$)/, "$1***$2"),
  });
}

