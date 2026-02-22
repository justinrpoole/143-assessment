import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  getEveningReflectionForDate,
  upsertEveningReflection,
} from "@/lib/db/evening-reflection";
import { currentLocalDateIso } from "@/lib/retention/morning";

interface PostBody {
  entry_date?: string;
  what_happened?: string;
  what_i_did?: string;
  what_next?: string;
}

function normalizeEntryDate(value: unknown): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return currentLocalDateIso();
}

function normalizeText(value: unknown): string {
  if (typeof value === "string") return value.trim().slice(0, 1000);
  return "";
}

/**
 * Score reflection quality 0-3.
 * 0 = empty/too short, 1 = surface, 2 = specific, 3 = actionable + specific.
 * Simple heuristic: word count + presence of specific detail.
 */
function scoreReflectionQuality(texts: string[]): number {
  const totalWords = texts.join(" ").split(/\s+/).filter(Boolean).length;
  const filled = texts.filter((t) => t.length > 10).length;

  if (filled === 0) return 0;
  if (filled < 3 || totalWords < 15) return 1;
  if (totalWords < 30) return 2;
  return 3;
}

export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const entryDate = normalizeEntryDate(url.searchParams.get("entry_date"));

  try {
    const existing = await getEveningReflectionForDate({
      userId: auth.userId,
      entryDate,
    });

    if (existing) {
      return NextResponse.json({
        entry_date: entryDate,
        has_reflection: true,
        what_happened: existing.what_happened,
        what_i_did: existing.what_i_did,
        what_next: existing.what_next,
        quality_score: existing.quality_score,
      });
    }

    return NextResponse.json({
      entry_date: entryDate,
      has_reflection: false,
      what_happened: null,
      what_i_did: null,
      what_next: null,
      quality_score: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "evening_reflection_fetch_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const entryDate = normalizeEntryDate(body.entry_date);
  const whatHappened = normalizeText(body.what_happened);
  const whatIDid = normalizeText(body.what_i_did);
  const whatNext = normalizeText(body.what_next);

  if (!whatHappened || !whatIDid || !whatNext) {
    return NextResponse.json(
      { error: "missing_fields", detail: "All three reflection prompts are required." },
      { status: 400 },
    );
  }

  const qualityScore = scoreReflectionQuality([whatHappened, whatIDid, whatNext]);

  try {
    const row = await upsertEveningReflection({
      userId: auth.userId,
      entryDate,
      whatHappened,
      whatIDid,
      whatNext,
      qualityScore,
    });

    emitEvent({
      eventName: "evening_reflection_complete",
      sourceRoute: "/api/evening-reflection",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        entry_date: entryDate,
        quality_score: qualityScore,
      },
    });

    return NextResponse.json({
      status: "ok",
      entry_date: row.entry_date,
      has_reflection: true,
      what_happened: row.what_happened,
      what_i_did: row.what_i_did,
      what_next: row.what_next,
      quality_score: qualityScore,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "evening_reflection_save_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
