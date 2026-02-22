import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { queueEmailJob } from "@/lib/email/scheduler";

interface CompleteBody {
  preview_run_id?: string;
  completion_seconds?: number;
  source_route?: string;
}

function normalizeSourceRoute(value: unknown): string {
  if (typeof value === "string" && value.startsWith("/")) {
    return value;
  }
  return "/preview";
}

function normalizePreviewRunId(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }
  return value.trim();
}

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  let body: CompleteBody;
  try {
    body = (await request.json()) as CompleteBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const previewRunId = normalizePreviewRunId(body.preview_run_id);
  if (!previewRunId) {
    return NextResponse.json({ error: "preview_run_id_required" }, { status: 400 });
  }

  const completionSeconds =
    typeof body.completion_seconds === "number" && body.completion_seconds >= 0
      ? Math.round(body.completion_seconds)
      : 0;
  const sourceRoute = normalizeSourceRoute(body.source_route);

  try {
    emitEvent({
      eventName: "preview_complete",
      sourceRoute,
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        preview_run_id: previewRunId,
        completion_seconds: completionSeconds,
        assessment_version: "v1",
      },
    });

    if (auth.isAuthenticated && auth.userId) {
      await queueEmailJob({
        userId: auth.userId,
        type: "upgrade_nudge",
        sendAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        payload: {
          next_route: "/upgrade",
          offer_context: "preview_complete",
        },
      });
    }

    return NextResponse.json({
      status: "ok",
      preview_run_id: previewRunId,
      next_route: "/upgrade",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "preview_complete_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
