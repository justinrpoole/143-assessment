import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  listActivePlans,
  createIfThenPlan,
  incrementPlanCompletion,
  deactivatePlan,
} from "@/lib/db/if-then-plans";

interface CreateBody {
  if_cue?: string;
  then_action?: string;
  tool_name?: string | null;
}

interface ActionBody {
  action: "complete" | "deactivate";
  plan_id: string;
}

function normalizeText(value: unknown, maxLen = 300): string {
  if (typeof value === "string") return value.trim().slice(0, maxLen);
  return "";
}

export async function GET() {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const plans = await listActivePlans({ userId: auth.userId });
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json(
      {
        error: "if_then_plans_fetch_failed",
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

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const ifCue = normalizeText(body.if_cue);
  const thenAction = normalizeText(body.then_action);

  if (!ifCue || !thenAction) {
    return NextResponse.json(
      { error: "missing_fields", detail: "Both 'if' cue and 'then' action are required." },
      { status: 400 },
    );
  }

  try {
    const plan = await createIfThenPlan({
      userId: auth.userId,
      ifCue,
      thenAction,
      toolName: typeof body.tool_name === "string" ? body.tool_name.trim() : null,
    });

    emitEvent({
      eventName: "if_then_plan_created",
      sourceRoute: "/api/if-then-plans",
      userState: auth.userState,
      userId: auth.userId,
      extra: { plan_id: plan.id },
    });

    return NextResponse.json({ status: "ok", plan });
  } catch (error) {
    return NextResponse.json(
      {
        error: "if_then_plan_create_failed",
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

  let body: ActionBody;
  try {
    body = (await request.json()) as ActionBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.plan_id || typeof body.plan_id !== "string") {
    return NextResponse.json({ error: "missing_plan_id" }, { status: 400 });
  }

  try {
    if (body.action === "complete") {
      const updated = await incrementPlanCompletion({
        id: body.plan_id,
        userId: auth.userId,
      });

      emitEvent({
        eventName: "if_then_plan_completed",
        sourceRoute: "/api/if-then-plans",
        userState: auth.userState,
        userId: auth.userId,
        extra: {
          plan_id: body.plan_id,
          completed_count: updated?.completed_count ?? 0,
        },
      });

      return NextResponse.json({ status: "ok", plan: updated });
    }

    if (body.action === "deactivate") {
      await deactivatePlan({ id: body.plan_id, userId: auth.userId });
      return NextResponse.json({ status: "ok" });
    }

    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "if_then_plan_action_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
