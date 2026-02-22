import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  createDraftRun,
  getCompletedRunsCount,
  getLatestDraftRun,
  updateDraftRunMetadata,
} from "@/lib/db/assessment-runs";
import { getEntitlementByUserId } from "@/lib/db/entitlements";
import { canStartRun } from "@/lib/entitlements/can-start-run";
import { trackEvent } from "@/lib/events";

const ALLOWED_CONTEXT_SCOPES = new Set(["work", "home", "mixed"]);
const ALLOWED_FOCUS_AREAS = new Set([
  "confidence",
  "clarity",
  "energy",
  "connection",
]);

interface DraftBody {
  context_scope?: string;
  focus_area?: string;
  source_route?: string;
}

function normalizeContextScope(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  return ALLOWED_CONTEXT_SCOPES.has(value) ? value : null;
}

function normalizeFocusArea(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  return ALLOWED_FOCUS_AREAS.has(value) ? value : null;
}

function normalizeSourceRoute(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "/assessment/setup";
  }
  return value;
}

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: DraftBody;
  try {
    body = (await request.json()) as DraftBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const contextScope = normalizeContextScope(body.context_scope);
  const focusArea = normalizeFocusArea(body.focus_area);
  if (!contextScope || !focusArea) {
    return NextResponse.json(
      { error: "invalid_setup_metadata" },
      { status: 400 },
    );
  }

  const sourceRoute = normalizeSourceRoute(body.source_route);

  try {
    const entitlement = await getEntitlementByUserId(auth.userId).catch(() => null);
    const effectiveUserState = entitlement?.user_state ?? auth.userState;
    const completedRunsCount = await getCompletedRunsCount(auth.userId);
    const gate = canStartRun({
      user_state: effectiveUserState,
      existing_completed_runs_count: completedRunsCount,
      sub_current_period_end: entitlement?.sub_current_period_end,
    });
    if (!gate.allowed) {
      return NextResponse.json(
        {
          error: "run_creation_blocked",
          reason: gate.reason,
        },
        { status: 403 },
      );
    }

    const entitlementSnapshot = {
      user_state: effectiveUserState,
      completed_runs_count: completedRunsCount,
      allowed_to_start: gate.allowed,
      source: entitlement ? "db_entitlement" : "cookie_fallback",
    };

    const latestDraft = await getLatestDraftRun(auth.userId);
    if (latestDraft) {
      const updated = await updateDraftRunMetadata({
        runId: latestDraft.id,
        userId: auth.userId,
        contextScope,
        focusArea,
        sourceRoute,
        userState: effectiveUserState,
        entitlementSnapshot,
      });

      return NextResponse.json({
        run_id: updated.id,
        run_number: updated.run_number,
        status: updated.status,
      });
    }

    const created = await createDraftRun({
      userId: auth.userId,
      userState: effectiveUserState,
      contextScope,
      focusArea,
      sourceRoute,
      entitlementSnapshot,
    });

    void trackEvent({
      userId: auth.userId,
      eventType: "assessment_started",
      eventData: {
        run_id: created.id,
        run_number: created.run_number,
        context_scope: contextScope,
        focus_area: focusArea,
      },
    });

    return NextResponse.json({
      run_id: created.id,
      run_number: created.run_number,
      status: created.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "draft_persistence_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
