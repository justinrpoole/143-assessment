import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  listRecentMicroJoyEntries,
  updateMicroJoyEntrySelection,
} from "@/lib/db/retention";

interface SaveBody {
  entry_id?: string;
  notes?: string;
  save_to_favorites?: boolean;
}

function firstDatePortion(value: string): string {
  return value.slice(0, 10);
}

export async function GET() {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const entries = await listRecentMicroJoyEntries({
      userId: auth.userId,
      limit: 10,
    });
    return NextResponse.json({
      entries: entries.map((entry) => ({
        id: entry.id,
        suggestion_text: entry.suggestion_text,
        selected: entry.selected,
        notes: entry.notes,
        template_key: entry.template_key,
        local_date: entry.local_date,
        created_at: entry.created_at,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "microjoy_entries_fetch_failed",
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

  let body: SaveBody;
  try {
    body = (await request.json()) as SaveBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof body.entry_id !== "string" || body.entry_id.trim().length === 0) {
    return NextResponse.json({ error: "entry_id_required" }, { status: 400 });
  }

  const notes =
    typeof body.notes === "string" && body.notes.trim().length > 0
      ? body.notes.trim()
      : null;

  try {
    const updated = await updateMicroJoyEntrySelection({
      id: body.entry_id.trim(),
      userId: auth.userId,
      selected: true,
      notes,
    });
    if (!updated) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const localDate = firstDatePortion(updated.local_date);
    const templateKey = updated.template_key ?? "v1-default";
    emitEvent({
      eventName: "microjoy_done",
      sourceRoute: "/micro-joy",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        template_key: templateKey,
        local_date: localDate,
      },
    });

    if (body.save_to_favorites === true) {
      emitEvent({
        eventName: "microjoy_save",
        sourceRoute: "/micro-joy",
        userState: auth.userState,
        userId: auth.userId,
        extra: {
          template_key: templateKey,
          saved_to_favorites: true,
        },
      });
    }

    return NextResponse.json({
      status: "ok",
      entry: {
        id: updated.id,
        suggestion_text: updated.suggestion_text,
        selected: updated.selected,
        notes: updated.notes,
        template_key: updated.template_key,
        local_date: updated.local_date,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "microjoy_entry_save_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
