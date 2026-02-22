import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getReportForRun, getRunForUser } from "@/lib/db/assessment-runs";

interface RouteParams {
  params: Promise<{ runId: string }> | { runId: string };
}

async function resolveRunId(params: RouteParams["params"]): Promise<string> {
  if (typeof (params as Promise<{ runId: string }>).then === "function") {
    const resolved = await (params as Promise<{ runId: string }>);
    return resolved.runId;
  }
  return (params as { runId: string }).runId;
}

export async function GET(_request: Request, context: RouteParams) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const runId = await resolveRunId(context.params);

  try {
    const run = await getRunForUser(runId, auth.userId);
    if (!run) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const report = await getReportForRun({
      runId,
      userId: auth.userId,
      format: "html",
    });
    if (!report) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    emitEvent({
      eventName: "report_download",
      sourceRoute: "/reports",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        run_id: runId,
        artifact_type: "html",
        delivery_mode: "in_app",
      },
    });

    return NextResponse.json({
      run_id: report.run_id,
      format: report.format,
      status: report.status,
      html: report.html,
      storage_path: report.storage_path,
      meta: report.meta,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "report_fetch_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
