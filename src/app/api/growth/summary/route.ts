import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { listGrowthSummaryRuns } from "@/lib/db/growth";

export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "12");
  const safeLimit =
    Number.isInteger(limit) && limit > 0 && limit <= 30 ? limit : 12;

  try {
    const runs = await listGrowthSummaryRuns({
      userId: auth.userId,
      limit: safeLimit,
    });
    return NextResponse.json({
      runs,
      count: runs.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "growth_summary_fetch_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
