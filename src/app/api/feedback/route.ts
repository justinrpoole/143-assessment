import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import type { UserState } from "@/lib/auth/user-state";
import { getEntitlementByUserId } from "@/lib/db/entitlements";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { isFeedbackType } from "@/lib/feedback/feedback-types";

interface FeedbackBody {
  feedback_type?: string;
  rating?: number | null;
  free_text?: string | null;
  run_id?: string | null;
  source_route?: string | null;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeFeedbackType(value: unknown): string | null {
  if (!isFeedbackType(value)) {
    return null;
  }
  return value;
}

function normalizeRating(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!Number.isInteger(value) || typeof value !== "number") {
    return null;
  }
  if (value < 1 || value > 5) {
    return null;
  }
  return value;
}

function normalizeFreeText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return trimmed.slice(0, 1000);
}

function normalizeRunId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return UUID_PATTERN.test(trimmed) ? trimmed : null;
}

function normalizeSourceRoute(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) {
    return null;
  }
  return trimmed.slice(0, 250);
}

async function resolveUserState(params: {
  isAuthenticated: boolean;
  userId: string | null;
  fallbackState: UserState;
}): Promise<UserState> {
  if (!params.isAuthenticated || !params.userId) {
    return "public";
  }

  try {
    const entitlement = await getEntitlementByUserId(params.userId);
    return entitlement?.user_state ?? params.fallbackState;
  } catch {
    return params.fallbackState;
  }
}

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();

  let body: FeedbackBody;
  try {
    body = (await request.json()) as FeedbackBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const feedbackType = normalizeFeedbackType(body.feedback_type);
  if (!feedbackType) {
    return NextResponse.json({ error: "invalid_feedback_type" }, { status: 400 });
  }

  const rating = normalizeRating(body.rating);
  if (body.rating !== undefined && body.rating !== null && rating === null) {
    return NextResponse.json({ error: "invalid_rating" }, { status: 400 });
  }

  const runId = normalizeRunId(body.run_id);
  if (body.run_id !== undefined && body.run_id !== null && runId === null) {
    return NextResponse.json({ error: "invalid_run_id" }, { status: 400 });
  }

  const sourceRoute = normalizeSourceRoute(body.source_route);
  const freeText = normalizeFreeText(body.free_text);

  const userId = auth.isAuthenticated ? auth.userId : null;
  const userState = await resolveUserState({
    isAuthenticated: auth.isAuthenticated,
    userId,
    fallbackState: auth.userState,
  });

  const insert = await supabaseRestFetch<Array<{ id: string }>>({
    restPath: "user_feedback",
    method: "POST",
    query: { select: "id" },
    prefer: "return=representation",
    body: {
      user_id: userId,
      user_state: userState,
      source_route: sourceRoute,
      run_id: runId,
      feedback_type: feedbackType,
      rating,
      free_text: freeText,
    },
  });

  if (!insert.ok) {
    if (insert.error === "db_not_configured") {
      return NextResponse.json({ error: "db_not_configured" }, { status: 503 });
    }

    return NextResponse.json(
      {
        error: "feedback_insert_failed",
        detail: insert.error,
      },
      { status: insert.status || 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
