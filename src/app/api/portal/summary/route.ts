import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { getRepsSummary } from "@/lib/db/reps";
import { getAppUserById } from "@/lib/db/app-users";
import { getEntitlementByUserId } from "@/lib/db/entitlements";
import { trackEvent } from "@/lib/events";
import { questionsFromItemIds } from "@/lib/item-selection-runner";

// Canonical Ray names (constitution §5)
const RAY_NAMES: Record<string, string> = {
  R1: "Intention",
  R2: "Joy",
  R3: "Presence",
  R4: "Power",
  R5: "Purpose",
  R6: "Authenticity",
  R7: "Connection",
  R8: "Possibility",
  R9: "Be The Light",
};

interface RunRow {
  id: string;
  status: string;
  run_number: number;
  created_at: string;
  item_ids: string[] | null;
}

interface ResultRow {
  run_id: string;
  ray_scores: Record<string, number> | null;
  top_rays: string[] | null;
  results_payload: {
    eclipse?: { band?: string; level?: string };
    [key: string]: unknown;
  } | null;
}

export interface PortalSummary {
  has_completed_run: boolean;
  last_run_id: string | null;
  run_number: number | null;
  eclipse_level: "low" | "medium" | "high" | null;
  bottom_ray_id: string | null;
  bottom_ray_name: string | null;
  top_ray_ids: string[];
  reps_this_week: number;
  streak_days: number;
  total_reps: number;
  most_practiced_tool: string | null;
  in_progress_run_id: string | null;
  in_progress_answered: number;
  in_progress_total: number;
  subscription_state: "active" | "grace" | "expired" | "past_due" | "none";
  grace_period_end: string | null;
}

const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

function deriveSubscriptionState(
  userState: string | null | undefined,
  periodEnd: string | null | undefined,
): { state: PortalSummary["subscription_state"]; gracePeriodEnd: string | null } {
  if (userState === "sub_active") {
    return { state: "active", gracePeriodEnd: null };
  }
  if (userState === "past_due") {
    return { state: "past_due", gracePeriodEnd: null };
  }
  if (userState === "sub_canceled") {
    if (periodEnd) {
      const endMs = new Date(periodEnd).getTime();
      if (!isNaN(endMs)) {
        const graceEnd = new Date(endMs + GRACE_PERIOD_MS).toISOString();
        if (Date.now() < endMs + GRACE_PERIOD_MS) {
          return { state: "grace", gracePeriodEnd: graceEnd };
        }
      }
    }
    return { state: "expired", gracePeriodEnd: null };
  }
  // paid_43, free_email, public — no subscription concept
  return { state: "none", gracePeriodEnd: null };
}

function extractEclipseLevel(
  payload: ResultRow["results_payload"],
): "low" | "medium" | "high" | null {
  if (!payload) return null;
  const eclipse = payload.eclipse;
  if (!eclipse) return null;
  const raw = (eclipse.band ?? eclipse.level ?? "").toString().toLowerCase();
  if (raw.includes("low")) return "low";
  if (raw.includes("high")) return "high";
  if (raw.includes("med")) return "medium";
  return null;
}

function findBottomRay(
  rayScores: Record<string, number> | null,
): string | null {
  if (!rayScores) return null;
  let minKey: string | null = null;
  let minVal = Infinity;
  for (const [key, val] of Object.entries(rayScores)) {
    if (typeof val === "number" && val < minVal) {
      minVal = val;
      minKey = key;
    }
  }
  return minKey;
}

export async function GET() {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // Look up user timezone, then fetch runs + reps in parallel
    const appUser = await getAppUserById(auth.userId).catch(() => null);
    const userTimezone = appUser?.timezone ?? "UTC";

    const [runRes, inProgressRes, repsSummary, entitlement] = await Promise.all([
      supabaseRestFetch<RunRow[]>({
        restPath: "assessment_runs",
        query: {
          select: "id,status,run_number,created_at,item_ids",
          user_id: `eq.${auth.userId}`,
          status: "eq.completed",
          order: "created_at.desc",
          limit: 1,
        },
      }),
      supabaseRestFetch<RunRow[]>({
        restPath: "assessment_runs",
        query: {
          select: "id,status,run_number,created_at,item_ids",
          user_id: `eq.${auth.userId}`,
          status: "eq.in_progress",
          order: "created_at.desc",
          limit: 1,
        },
      }),
      getRepsSummary({ userId: auth.userId, timezone: userTimezone }).catch(() => ({
        total_count: 0,
        count_this_week: 0,
        streak_days: 0,
        most_practiced_tool: null,
      })),
      getEntitlementByUserId(auth.userId).catch(() => null),
    ]);

    const latestRun = runRes.data?.[0] ?? null;
    const inProgressRun = inProgressRes.data?.[0] ?? null;

    let resultRow: ResultRow | null = null;
    if (latestRun) {
      const resultRes = await supabaseRestFetch<ResultRow[]>({
        restPath: "assessment_results",
        query: {
          select: "run_id,ray_scores,top_rays,results_payload",
          run_id: `eq.${latestRun.id}`,
          user_id: `eq.${auth.userId}`,
          limit: 1,
        },
      });
      resultRow = resultRes.data?.[0] ?? null;
    }

    // Count responses for in-progress run
    let inProgressAnswered = 0;
    let inProgressTotal = 0;
    if (inProgressRun) {
      const responsesRes = await supabaseRestFetch<Array<{ question_id: string }>>({
        restPath: "assessment_responses",
        query: {
          select: "question_id",
          run_id: `eq.${inProgressRun.id}`,
          user_id: `eq.${auth.userId}`,
        },
      });
      inProgressAnswered = responsesRes.data?.length ?? 0;

      if (inProgressRun.item_ids && inProgressRun.item_ids.length > 0) {
        const questions = questionsFromItemIds(inProgressRun.item_ids);
        inProgressTotal = questions.filter((q) => q.required).length;
      } else {
        // Fallback: full 143 for run 1, 43 for retakes
        inProgressTotal = inProgressRun.run_number > 1 ? 43 : 143;
      }
    }

    const bottomRayId = findBottomRay(resultRow?.ray_scores ?? null);
    const eclipseLevel = extractEclipseLevel(resultRow?.results_payload ?? null);

    const effectiveUserState = entitlement?.user_state ?? auth.userState;
    const subState = deriveSubscriptionState(
      effectiveUserState,
      entitlement?.sub_current_period_end,
    );

    const summary: PortalSummary = {
      has_completed_run: !!latestRun,
      last_run_id: latestRun?.id ?? null,
      run_number: latestRun?.run_number ?? null,
      eclipse_level: eclipseLevel,
      bottom_ray_id: bottomRayId,
      bottom_ray_name: bottomRayId ? (RAY_NAMES[bottomRayId] ?? bottomRayId) : null,
      top_ray_ids: resultRow?.top_rays ?? [],
      reps_this_week: repsSummary.count_this_week,
      streak_days: repsSummary.streak_days,
      total_reps: repsSummary.total_count,
      most_practiced_tool: repsSummary.most_practiced_tool,
      in_progress_run_id: inProgressRun?.id ?? null,
      in_progress_answered: inProgressAnswered,
      in_progress_total: inProgressTotal,
      subscription_state: subState.state,
      grace_period_end: subState.gracePeriodEnd,
    };

    void trackEvent({
      userId: auth.userId,
      eventType: "portal_visited",
      eventData: {
        has_completed_run: summary.has_completed_run,
        streak_days: summary.streak_days,
        subscription_state: summary.subscription_state,
      },
    });

    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      {
        error: "portal_summary_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
