import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  getEnergyAuditForWeek,
  upsertEnergyAudit,
  listRecentEnergyAudits,
} from "@/lib/db/energy-audit";
import {
  ENERGY_DIMENSIONS,
  computeLoadBand,
  LOAD_GUIDANCE,
  currentWeekMonday,
} from "@/lib/retention/energy-audit";

interface PostBody {
  week_of?: string;
  scores?: Record<string, number>;
  notes?: string;
}

function normalizeWeekOf(value: unknown): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return currentWeekMonday();
}

function normalizeScore(value: unknown): number {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 3) {
    return value;
  }
  return 0;
}

export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const weekOf = normalizeWeekOf(url.searchParams.get("week_of"));
  const history = url.searchParams.get("history") === "true";

  try {
    if (history) {
      const audits = await listRecentEnergyAudits({ userId: auth.userId });
      return NextResponse.json({ audits });
    }

    const existing = await getEnergyAuditForWeek({
      userId: auth.userId,
      weekOf,
    });

    if (existing) {
      const band = computeLoadBand(existing.total_load);
      return NextResponse.json({
        week_of: weekOf,
        has_audit: true,
        scores: {
          sleep_debt: existing.sleep_debt,
          recovery_quality: existing.recovery_quality,
          fog: existing.fog,
          irritability: existing.irritability,
          impulsivity: existing.impulsivity,
          numbness: existing.numbness,
          somatic_signals: existing.somatic_signals,
          compulsion: existing.compulsion,
        },
        total_load: existing.total_load,
        load_band: band,
        guidance: LOAD_GUIDANCE[band],
        notes: existing.notes,
      });
    }

    return NextResponse.json({
      week_of: weekOf,
      has_audit: false,
      scores: null,
      total_load: null,
      load_band: null,
      guidance: null,
      notes: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "energy_audit_fetch_failed",
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

  const weekOf = normalizeWeekOf(body.week_of);

  if (!body.scores || typeof body.scores !== "object") {
    return NextResponse.json(
      { error: "missing_scores", detail: "Scores object is required." },
      { status: 400 },
    );
  }

  const normalizedScores: Record<string, number> = {};
  let totalLoad = 0;

  for (const dim of ENERGY_DIMENSIONS) {
    const score = normalizeScore(body.scores[dim.id]);
    normalizedScores[dim.id] = score;
    totalLoad += score;
  }

  try {
    const row = await upsertEnergyAudit({
      userId: auth.userId,
      weekOf,
      scores: normalizedScores,
      totalLoad,
      notes: typeof body.notes === "string" ? body.notes.trim().slice(0, 500) : null,
    });

    const band = computeLoadBand(totalLoad);

    emitEvent({
      eventName: "energy_audit_complete",
      sourceRoute: "/api/energy-audit",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        week_of: weekOf,
        total_load: totalLoad,
        load_band: band,
      },
    });

    return NextResponse.json({
      status: "ok",
      week_of: row.week_of,
      has_audit: true,
      scores: normalizedScores,
      total_load: totalLoad,
      load_band: band,
      guidance: LOAD_GUIDANCE[band],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "energy_audit_save_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
