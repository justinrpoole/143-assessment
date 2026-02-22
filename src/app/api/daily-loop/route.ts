import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { trackEvent } from "@/lib/events";
import {
  getDailyLoopForDate,
  upsertDailyLoop,
} from "@/lib/db/daily-loop";
import { currentLocalDateIso } from "@/lib/retention/morning";

interface PostBody {
  entry_date?: string;
  name_it?: string;
  ground_it?: string;
  move_action?: string;
}

function normalizeEntryDate(value: unknown): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return currentLocalDateIso();
}

function normalizeText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim().slice(0, 500);
  }
  return "";
}

export async function GET(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const entryDate = normalizeEntryDate(url.searchParams.get("entry_date"));

  try {
    const existing = await getDailyLoopForDate({
      userId: auth.userId,
      entryDate,
    });

    if (existing) {
      return NextResponse.json({
        entry_date: entryDate,
        has_loop: true,
        name_it: existing.name_it,
        ground_it: existing.ground_it,
        move_action: existing.move_action,
      });
    }

    return NextResponse.json({
      entry_date: entryDate,
      has_loop: false,
      name_it: null,
      ground_it: null,
      move_action: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "daily_loop_fetch_failed",
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
  const nameIt = normalizeText(body.name_it);
  const groundIt = normalizeText(body.ground_it);
  const moveAction = normalizeText(body.move_action);

  if (!nameIt || !groundIt || !moveAction) {
    return NextResponse.json(
      { error: "missing_fields", detail: "All three steps are required." },
      { status: 400 },
    );
  }

  try {
    const row = await upsertDailyLoop({
      userId: auth.userId,
      entryDate,
      nameIt,
      groundIt,
      moveAction,
    });

    emitEvent({
      eventName: "daily_loop_complete",
      sourceRoute: "/api/daily-loop",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        entry_date: entryDate,
      },
    });

    void trackEvent({
      userId: auth.userId,
      eventType: "daily_loop_completed",
      eventData: { entry_date: entryDate },
    });

    return NextResponse.json({
      status: "ok",
      entry_date: row.entry_date,
      has_loop: true,
      name_it: row.name_it,
      ground_it: row.ground_it,
      move_action: row.move_action,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "daily_loop_save_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
