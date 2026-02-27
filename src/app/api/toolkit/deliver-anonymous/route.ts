import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { queueEmailJob } from "@/lib/email/scheduler";

interface DeliverBody {
  email?: string;
  source_route?: string;
  toolkit_version?: string;
}

const ANON_USER_ID = "00000000-0000-0000-0000-000000000000";

export async function POST(request: Request) {
  let body: DeliverBody = {};
  try {
    body = (await request.json()) as DeliverBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const sourceRoute =
    typeof body.source_route === "string" && body.source_route.startsWith("/")
      ? body.source_route
      : "/143";

  const toolkitVersion =
    typeof body.toolkit_version === "string" &&
    body.toolkit_version.trim().length > 0
      ? body.toolkit_version.trim()
      : "v1";

  try {
    // 1. Capture the email (upsert — safe for duplicates)
    await supabaseRestFetch({
      restPath: "/email_captures",
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: {
        email,
        source: "143_challenge_kit",
        captured_at: new Date().toISOString(),
      },
    });

    // 2. Queue the challenge kit delivery email
    const job = await queueEmailJob({
      userId: ANON_USER_ID,
      type: "challenge_kit_delivery",
      payload: {
        to_email: email,
        source_route: sourceRoute,
        toolkit_version: toolkitVersion,
        next_route: "/143",
      },
    });

    // 3. Analytics (fire-and-forget)
    void emitEvent({
      eventName: "toolkit_delivery_anonymous",
      sourceRoute,
      userState: "public",
      extra: {
        toolkit_version: toolkitVersion,
        email_domain: email.split("@")[1] ?? "unknown",
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
