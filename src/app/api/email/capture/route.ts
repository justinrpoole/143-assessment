import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { NextResponse } from "next/server";

import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import { trackEvent } from "@/lib/events";

async function persistLocalCapture(payload: { email: string; source: string; captured_at: string }) {
  const outPath = process.env.EMAIL_CAPTURE_FALLBACK_PATH ?? join(process.cwd(), ".next", "email-captures-fallback.jsonl");
  await mkdir(dirname(outPath), { recursive: true });
  await appendFile(outPath, `${JSON.stringify(payload)}\n`, "utf8");
}

function isValidEmail(email: string) {
  if (!email || !email.includes("@") || email.length > 254) return false;
  if (/[\u200B\u200C\u200D\u2060\uFEFF]/.test(email)) return false;

  const [local, domain, ...rest] = email.split("@");
  if (rest.length > 0 || !local || !domain) return false;
  if (local.length > 64) return false;
  if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/i.test(local)) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..") || /\s/.test(local)) return false;
  if (local.startsWith("+") || local.endsWith("+") || local.includes("++") || local.endsWith("-")) return false;
  if (/\s/.test(domain)) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;
  for (const label of labels) {
    if (!label || label.length > 63) return false;
    if (label.startsWith("-") || label.endsWith("-")) return false;
    if (!/^[a-z0-9-]+$/i.test(label)) return false;
  }

  return true;
}

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

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const source = name ? `${tag}:${name}` : tag;

    const capturedAt = new Date().toISOString();
    const record = {
      email,
      source,
      captured_at: capturedAt,
    };

    const forceFallback =
      process.env.NODE_ENV !== "production" &&
      request.headers.get("x-force-capture-fallback") === "1";

    try {
      if (forceFallback) {
        throw new Error("forced_capture_fallback");
      }

      await supabaseRestFetch({
        restPath: "/email_captures",
        method: "POST",
        prefer: "resolution=merge-duplicates",
        body: record,
      });
    } catch {
      await persistLocalCapture(record);
    }

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
