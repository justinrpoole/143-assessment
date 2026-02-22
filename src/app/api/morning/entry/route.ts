import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  getMorningEntryForDate,
  upsertMorningEntry,
} from "@/lib/db/retention";
import {
  currentLocalDateIso,
  resolveDailyAffirmation,
} from "@/lib/retention/morning";

interface UpsertBody {
  entry_date?: string;
  affirmation_text?: string;
  reps_logged?: number;
}

function normalizeEntryDate(value: unknown): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return currentLocalDateIso();
}

function normalizeRepsLogged(value: unknown): number {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return value;
  }
  return 1;
}

export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const entryDate = normalizeEntryDate(url.searchParams.get("entry_date"));

  try {
    const existing = await getMorningEntryForDate({
      userId: auth.userId,
      entryDate,
    });
    const affirmation = resolveDailyAffirmation({
      userId: auth.userId,
      entryDate,
    });

    return NextResponse.json({
      entry_date: entryDate,
      affirmation_text: existing?.affirmation_text ?? affirmation,
      reps_logged: existing?.reps_logged ?? 0,
      entry_id: existing?.id ?? null,
      is_saved: Boolean(existing),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "morning_entry_fetch_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: UpsertBody;
  try {
    body = (await request.json()) as UpsertBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const entryDate = normalizeEntryDate(body.entry_date);
  const fallbackAffirmation = resolveDailyAffirmation({
    userId: auth.userId,
    entryDate,
  });
  const affirmationText =
    typeof body.affirmation_text === "string" && body.affirmation_text.trim().length > 0
      ? body.affirmation_text.trim()
      : fallbackAffirmation;
  const repsLogged = normalizeRepsLogged(body.reps_logged);

  try {
    const entry = await upsertMorningEntry({
      userId: auth.userId,
      entryDate,
      affirmationText,
      repsLogged,
    });

    emitEvent({
      eventName: "morning_log_complete",
      sourceRoute: "/morning",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        template_key: "v1-default",
        local_date: entryDate,
        has_optional_prompt: false,
      },
    });

    return NextResponse.json({
      status: "ok",
      entry: {
        id: entry.id,
        entry_date: entry.entry_date,
        affirmation_text: entry.affirmation_text,
        reps_logged: entry.reps_logged,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "morning_entry_upsert_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
