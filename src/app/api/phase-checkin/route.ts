import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  getPhaseCheckinForDate,
  upsertPhaseCheckin,
} from "@/lib/db/phase-checkin";
import { currentLocalDateIso } from "@/lib/retention/morning";
import {
  detectPhase,
  PHASE_CHECKIN_QUESTIONS,
  PHASE_GUIDANCE,
} from "@/lib/retention/phase-checkin";

interface PostBody {
  entry_date?: string;
  answers?: number[];
}

function normalizeEntryDate(value: unknown): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return currentLocalDateIso();
}

function normalizeScore(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 3) {
    return value;
  }
  return null;
}

export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const entryDate = normalizeEntryDate(url.searchParams.get("entry_date"));

  try {
    const existing = await getPhaseCheckinForDate({
      userId: auth.userId,
      entryDate,
    });

    if (existing) {
      const phase = existing.detected_phase as keyof typeof PHASE_GUIDANCE;
      const guidance = PHASE_GUIDANCE[phase] ?? PHASE_GUIDANCE.gravity_shift;

      return NextResponse.json({
        entry_date: entryDate,
        has_checkin: true,
        total_score: existing.total_score,
        detected_phase: existing.detected_phase,
        scores: [existing.q1_score, existing.q2_score, existing.q3_score],
        guidance,
      });
    }

    return NextResponse.json({
      entry_date: entryDate,
      has_checkin: false,
      total_score: null,
      detected_phase: null,
      scores: null,
      guidance: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "phase_checkin_fetch_failed",
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

  if (!Array.isArray(body.answers) || body.answers.length !== PHASE_CHECKIN_QUESTIONS.length) {
    return NextResponse.json(
      { error: "invalid_answers", detail: `Expected ${PHASE_CHECKIN_QUESTIONS.length} answers` },
      { status: 400 },
    );
  }

  const scores = body.answers.map(normalizeScore);
  if (scores.some((s) => s === null)) {
    return NextResponse.json(
      { error: "invalid_score", detail: "Each answer must be an integer 0-3" },
      { status: 400 },
    );
  }

  const q1 = scores[0] as number;
  const q2 = scores[1] as number;
  const q3 = scores[2] as number;
  const totalScore = q1 + q2 + q3;
  const detectedPhase = detectPhase(totalScore);
  const guidance = PHASE_GUIDANCE[detectedPhase];

  try {
    const row = await upsertPhaseCheckin({
      userId: auth.userId,
      entryDate,
      q1Score: q1,
      q2Score: q2,
      q3Score: q3,
      totalScore,
      detectedPhase,
    });

    emitEvent({
      eventName: "phase_checkin_complete",
      sourceRoute: "/api/phase-checkin",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        entry_date: entryDate,
        total_score: totalScore,
        detected_phase: detectedPhase,
      },
    });

    return NextResponse.json({
      status: "ok",
      entry_date: row.entry_date,
      has_checkin: true,
      total_score: totalScore,
      detected_phase: detectedPhase,
      scores: [q1, q2, q3],
      guidance,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "phase_checkin_save_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
