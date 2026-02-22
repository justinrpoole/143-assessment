import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getRepsSummary } from "@/lib/db/reps";

export async function GET() {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const summary = await getRepsSummary({ userId: auth.userId });
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      {
        error: "summary_load_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
