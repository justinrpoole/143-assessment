import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { queueEmailJob } from "@/lib/email/scheduler";

interface StartBody {
  source_route?: string;
}

function normalizeSourceRoute(value: unknown): string {
  if (typeof value === "string" && value.startsWith("/")) {
    return value;
  }
  return "/preview";
}

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  let body: StartBody = {};
  try {
    body = (await request.json()) as StartBody;
  } catch {
    body = {};
  }

  const sourceRoute = normalizeSourceRoute(body.source_route);
  const previewRunId = randomUUID();

  try {
    emitEvent({
      eventName: "preview_start",
      sourceRoute,
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        preview_run_id: previewRunId,
        assessment_version: "v1",
      },
    });
    emitEvent({
      eventName: "snapshot_preview_rendered",
      sourceRoute,
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        preview_run_id: previewRunId,
        snapshot_version: "v1",
      },
    });

    if (auth.isAuthenticated && auth.userId) {
      await queueEmailJob({
        userId: auth.userId,
        type: "preview_nudge",
        sendAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
        payload: {
          preview_run_id: previewRunId,
          next_route: "/preview",
          delay_hours: 6,
        },
      });
    }

    return NextResponse.json({
      preview_run_id: previewRunId,
      snapshot: {
        signal: "You are running with real momentum.",
        next_step: "Upgrade when you want full map depth.",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "preview_start_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
