import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { generateSharecard } from "@/lib/sharecards/generate-sharecard.mjs";
import {
  getSignedUrl,
  uploadBytes,
} from "@/lib/storage/supabase-storage";

interface RouteParams {
  params: Promise<{ type: string }> | { type: string };
}

type SharecardType = "results" | "growth" | "morning";

interface SharecardBody {
  run_id?: string;
  ray_pair_id?: string;
  top_rays?: string[];
  short_line?: string;
}

const SHARECARD_EVENT_BY_TYPE: Record<SharecardType, string> = {
  results: "results_sharecard_generate",
  growth: "growth_sharecard_generate",
  morning: "morning_sharecard_generate",
};

const EMITTABLE_SHARECARD_EVENTS = new Set([
  "results_sharecard_generate",
  "growth_sharecard_generate",
  "morning_sharecard_generate",
]);

function normalizeRunId(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "latest";
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

async function resolveType(params: RouteParams["params"]): Promise<SharecardType | null> {
  const raw =
    typeof (params as Promise<{ type: string }>).then === "function"
      ? (await (params as Promise<{ type: string }>)).type
      : (params as { type: string }).type;

  if (raw === "results" || raw === "growth" || raw === "morning") {
    return raw;
  }
  return null;
}

export async function POST(request: Request, context: RouteParams) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const type = await resolveType(context.params);
  if (!type) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body: SharecardBody = {};
  try {
    body = (await request.json()) as SharecardBody;
  } catch {
    body = {};
  }

  const runId = normalizeRunId(body.run_id);
  const generated = generateSharecard({
    type,
    payload: {
      run_id: runId,
      ray_pair_id:
        typeof body.ray_pair_id === "string" ? body.ray_pair_id : undefined,
      top_rays: Array.isArray(body.top_rays)
        ? body.top_rays.slice(0, 2).map((entry) => String(entry))
        : undefined,
      short_line:
        typeof body.short_line === "string" ? body.short_line : undefined,
    },
  });

  const storagePath = `sharecards/${auth.userId}/${type}/${runId}.${generated.extension}`;
  const upload = await uploadBytes({
    bucket: "sharecards",
    path: storagePath,
    contentType: generated.contentType,
    bytes: generated.bytes,
  });

  if (!upload.ok) {
    if (upload.error === "storage_not_configured") {
      return NextResponse.json(
        { error: "storage_not_configured" },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "sharecard_upload_failed", detail: upload.error },
      { status: 500 },
    );
  }

  const signed = await getSignedUrl({
    bucket: "sharecards",
    path: storagePath,
    expiresSeconds: 60 * 60 * 24,
  });
  if (!signed.ok) {
    if (signed.error === "storage_not_configured") {
      return NextResponse.json(
        { error: "storage_not_configured" },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "sharecard_sign_failed", detail: signed.error },
      { status: 500 },
    );
  }

  const eventName = SHARECARD_EVENT_BY_TYPE[type];
  if (EMITTABLE_SHARECARD_EVENTS.has(eventName)) {
    const sourceRoute =
      type === "results" ? "/results" : type === "growth" ? "/growth" : "/morning";
    emitEvent({
      eventName,
      sourceRoute,
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        share_card_id: storagePath,
        run_id: runId,
        tier: auth.userState,
        template_version: "v1",
      },
    });
  }

  return NextResponse.json({
    type,
    storage_path: storagePath,
    signed_url: signed.signedUrl,
    expires_in: signed.expiresSeconds,
  });
}
