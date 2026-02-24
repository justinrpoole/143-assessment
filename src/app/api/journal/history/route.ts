import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

interface ReflectionRow {
  id: string;
  entry_date: string;
  what_happened: string;
  what_i_did: string;
  what_next: string;
  quality_score: number;
  created_at: string;
}

/**
 * GET /api/journal/history?limit=30&offset=0
 *
 * Returns paginated evening reflections for the authenticated user.
 * Used by the JournalBrowser component.
 */
export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(1, parseInt(url.searchParams.get("limit") ?? "30", 10)),
    100,
  );
  const offset = Math.max(
    0,
    parseInt(url.searchParams.get("offset") ?? "0", 10),
  );

  try {
    const res = await supabaseRestFetch<ReflectionRow[]>({
      restPath: "evening_reflections",
      query: {
        select:
          "id,entry_date,what_happened,what_i_did,what_next,quality_score,created_at",
        user_id: `eq.${auth.userId}`,
        order: "entry_date.desc",
        limit,
        offset,
      },
    });

    const entries = res.data ?? [];
    return NextResponse.json({
      entries,
      hasMore: entries.length === limit,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "journal_history_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
