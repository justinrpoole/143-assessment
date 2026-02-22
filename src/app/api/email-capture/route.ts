import { NextResponse } from "next/server";

import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { trackEvent } from "@/lib/events";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      source?: string;
    };

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source =
      typeof body.source === "string" ? body.source : "unknown";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    // Upsert — don't fail on duplicate
    await supabaseRestFetch({
      restPath: "/email_captures",
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: {
        email,
        source,
        captured_at: new Date().toISOString(),
      },
    });

    void trackEvent({
      userId: "anonymous",
      eventType: "portal_visited" as Parameters<typeof trackEvent>[0]["eventType"],
      eventData: { email, source, action: "email_captured" },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "capture_failed" }, { status: 500 });
  }
}
