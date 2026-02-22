import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  countMicroJoyEntriesForDate,
  createMicroJoyEntry,
} from "@/lib/db/retention";
import { resolveMicroJoySuggestion } from "@/lib/retention/micro-joy";

interface SuggestionBody {
  category?: string;
  local_date?: string;
  previous_template_key?: string;
}

const MAX_GENERATES_PER_DAY = 1;
const MAX_SWAPS_PER_DAY = 3;
const MAX_TOTAL_SUGGESTIONS = MAX_GENERATES_PER_DAY + MAX_SWAPS_PER_DAY;

function normalizeLocalDate(value: unknown): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return new Date().toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: SuggestionBody = {};
  try {
    body = (await request.json()) as SuggestionBody;
  } catch {
    body = {};
  }

  const localDate = normalizeLocalDate(body.local_date);
  const category = typeof body.category === "string" ? body.category : null;
  const previousTemplateKey =
    typeof body.previous_template_key === "string"
      ? body.previous_template_key
      : null;

  try {
    const existingCount = await countMicroJoyEntriesForDate({
      userId: auth.userId,
      localDate,
    });
    if (existingCount >= MAX_TOTAL_SUGGESTIONS) {
      return NextResponse.json(
        {
          error: "daily_limit_reached",
          remaining_generates: 0,
          remaining_swaps: 0,
        },
        { status: 429 },
      );
    }

    const generationIndex = existingCount + 1;
    const suggestion = resolveMicroJoySuggestion({
      userId: auth.userId,
      localDate,
      generationIndex,
      category,
    });

    const entry = await createMicroJoyEntry({
      userId: auth.userId,
      suggestionText: suggestion.suggestionText,
      selected: false,
      category: suggestion.category,
      templateKey: suggestion.templateKey,
      localDate,
    });

    emitEvent({
      eventName: "microjoy_generate",
      sourceRoute: "/micro-joy",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        template_key: suggestion.templateKey,
        local_date: localDate,
        generation_index: generationIndex,
      },
    });

    if (
      previousTemplateKey &&
      previousTemplateKey !== suggestion.templateKey &&
      generationIndex > 1
    ) {
      emitEvent({
        eventName: "microjoy_swap",
        sourceRoute: "/micro-joy",
        userState: auth.userState,
        userId: auth.userId,
        extra: {
          from_template_key: previousTemplateKey,
          to_template_key: suggestion.templateKey,
          swap_index: generationIndex - 1,
          local_date: localDate,
        },
      });
    }

    const remainingTotal = Math.max(0, MAX_TOTAL_SUGGESTIONS - generationIndex);
    return NextResponse.json({
      entry_id: entry.id,
      local_date: localDate,
      suggestion_text: suggestion.suggestionText,
      template_key: suggestion.templateKey,
      category: suggestion.category,
      generation_index: generationIndex,
      remaining_generates: generationIndex === 1 ? 0 : 0,
      remaining_swaps: remainingTotal,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "microjoy_generate_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
