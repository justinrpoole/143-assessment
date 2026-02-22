import { NextResponse } from "next/server";

/**
 * GET /api/notifications/vapid-key
 *
 * Returns the VAPID public key for push subscription.
 * The env var NEXT_PUBLIC_VAPID_PUBLIC_KEY must be set.
 */
export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

  if (!publicKey) {
    return NextResponse.json(
      { error: "vapid_not_configured" },
      { status: 503 },
    );
  }

  return NextResponse.json({ publicKey });
}
