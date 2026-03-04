import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { queueEmailJob } from "@/lib/email/scheduler";

interface DeliverBody {
  source_route?: string;
  toolkit_version?: string;
}

function normalizeSourceRoute(value: unknown): string {
  if (typeof value === "string" && value.startsWith("/")) {
    return value;
  }
  return "/toolkit";
}

function normalizeToolkitVersion(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return "v1";
}

function getBaseUrl(request: Request): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: DeliverBody = {};
  try {
    body = (await request.json()) as DeliverBody;
  } catch {
    body = {};
  }

  const sourceRoute = normalizeSourceRoute(body.source_route);
  const toolkitVersion = normalizeToolkitVersion(body.toolkit_version);
  const baseUrl = getBaseUrl(request);

  try {
    emitEvent({
      eventName: "toolkit_delivery_confirmed",
      sourceRoute,
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        toolkit_version: toolkitVersion,
        confirmation_method: "receipt_confirm",
      },
    });

    const job = await queueEmailJob({
      userId: auth.userId,
      type: "challenge_kit_delivery",
      payload: {
        source_route: sourceRoute,
        toolkit_version: toolkitVersion,
        next_route: "/143?gate=1",
        unlock_url: `${baseUrl}/143?gate=1`,
        pdf_url: `${baseUrl}/marketing/143-challenge-workbook.pdf`,
      },
    });

    return NextResponse.json({
      status: "ok",
      email_job_id: job.id,
      toolkit_version: toolkitVersion,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "toolkit_delivery_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
