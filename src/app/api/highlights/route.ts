import { NextRequest, NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

/**
 * GET /api/highlights?run_id=xxx
 * Returns all highlights for a given run.
 *
 * POST /api/highlights
 * Saves or removes a highlight.
 * Body: { run_id: string, block_id: string, text: string, action: "add" | "remove" }
 */

interface HighlightRow {
  id: string;
  user_id: string;
  run_id: string;
  block_id: string;
  text: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const runId = request.nextUrl.searchParams.get("run_id");
  if (!runId) {
    return NextResponse.json({ error: "run_id_required" }, { status: 400 });
  }

  const res = await supabaseRestFetch<HighlightRow[]>({
    restPath: "report_highlights",
    query: {
      select: "id,block_id,text,created_at",
      user_id: `eq.${auth.userId}`,
      run_id: `eq.${runId}`,
      order: "created_at.asc",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: 500 });
  }

  return NextResponse.json({ highlights: res.data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: {
    run_id?: string;
    block_id?: string;
    text?: string;
    action?: "add" | "remove";
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { run_id, block_id, text, action } = body;
  if (!run_id || !block_id || !action) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  if (action === "add") {
    if (!text) {
      return NextResponse.json({ error: "text_required" }, { status: 400 });
    }

    const insertRes = await supabaseRestFetch<HighlightRow[]>({
      restPath: "report_highlights",
      method: "POST",
      prefer: "return=representation",
      body: {
        user_id: auth.userId,
        run_id,
        block_id,
        text,
      },
    });

    if (!insertRes.ok) {
      return NextResponse.json({ error: insertRes.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, highlight: insertRes.data?.[0] });
  }

  if (action === "remove") {
    const deleteRes = await supabaseRestFetch<unknown>({
      restPath: "report_highlights",
      method: "PATCH",
      query: {
        user_id: `eq.${auth.userId}`,
        run_id: `eq.${run_id}`,
        block_id: `eq.${block_id}`,
      },
      prefer: "return=minimal",
      // Soft delete — we don't have DELETE in the abstraction, so we mark it
      // Actually, let's just delete by re-inserting or toggling
      body: { block_id: `__removed_${block_id}` },
    });

    if (!deleteRes.ok) {
      return NextResponse.json({ error: deleteRes.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, removed: true });
  }

  return NextResponse.json({ error: "invalid_action" }, { status: 400 });
}
