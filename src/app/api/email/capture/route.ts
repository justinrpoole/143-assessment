import { NextResponse } from "next/server";

import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { trackEvent } from "@/lib/events";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      name?: string;
      tag?: string;
    };

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const tag = typeof body.tag === "string" && body.tag.trim().length > 0
      ? body.tag.trim()
      : "email-capture";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const source = name ? `${tag}:${name}` : tag;

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
      eventType: "email_captured",
      eventData: {
        source: tag,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "capture_failed" }, { status: 500 });
  }
}
