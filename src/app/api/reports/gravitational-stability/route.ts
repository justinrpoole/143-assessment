import { NextRequest, NextResponse } from "next/server";

import {
  createSampleAssessmentData,
  fetchGravitationalAssessmentData,
  generateGravitationalStabilityPdf,
  rankRaysAscending,
  rankRaysDescending,
} from "@/lib/report/gravitational-stability";
import { getSignedUrl, uploadBytes } from "@/lib/storage/supabase-storage";

export const runtime = "nodejs";

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;

interface TriggerBody {
  userId?: string;
}

function normalizeUserId(input: unknown): string | null {
  if (typeof input !== "string") {
    return null;
  }
  const value = input.trim();
  return value.length > 0 ? value : null;
}

function safePathSegment(input: string): string {
  return input.replace(/[^A-Za-z0-9_-]/g, "");
}

async function loadAssessmentData(userId: string) {
  const fromDb = await fetchGravitationalAssessmentData(userId);

  if (fromDb) {
    return { data: fromDb, source: "database" as const };
  }

  return {
    data: createSampleAssessmentData(userId),
    source: "sample_preview" as const,
  };
}

function buildSummaryResponse(userId: string, loaded: Awaited<ReturnType<typeof loadAssessmentData>>) {
  const ranked = rankRaysDescending(loaded.data);
  const growthEdge = rankRaysAscending(loaded.data).slice(0, 2);

  return {
    userId,
    source: loaded.source,
    assessmentData: loaded.data,
    dominantRay: ranked[0]?.label ?? null,
    topRays: ranked.slice(0, 3).map((ray) => ({
      name: ray.label,
      score: ray.score,
    })),
    growthEdge: growthEdge.map((ray) => ({
      name: ray.label,
      score: ray.score,
    })),
    generatedAt: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const userId = normalizeUserId(request.nextUrl.searchParams.get("userId"));

  if (!userId) {
    return NextResponse.json({ error: "userId_required" }, { status: 400 });
  }

  try {
    const loaded = await loadAssessmentData(userId);
    return NextResponse.json(buildSummaryResponse(userId, loaded));
  } catch (error) {
    return NextResponse.json(
      {
        error: "summary_fetch_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let body: TriggerBody;

  try {
    body = (await request.json()) as TriggerBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const userId = normalizeUserId(body.userId);
  if (!userId) {
    return NextResponse.json({ error: "userId_required" }, { status: 400 });
  }

  try {
    const loaded = await loadAssessmentData(userId);
    const pdfBytes = await generateGravitationalStabilityPdf(loaded.data);

    const fallbackDownloadUrl = new URL(
      "/api/reports/gravitational-stability/pdf",
      request.nextUrl.origin,
    );
    fallbackDownloadUrl.searchParams.set("userId", userId);

    const storagePath = `reports/${safePathSegment(userId)}/gravitational-stability/gravitational-stability-report-${Date.now()}.pdf`;

    const upload = await uploadBytes({
      bucket: "reports",
      path: storagePath,
      contentType: "application/pdf",
      bytes: pdfBytes,
    });

    if (!upload.ok) {
      return NextResponse.json({
        status: "ready",
        source: loaded.source,
        download_url: fallbackDownloadUrl.toString(),
        warning: upload.error,
      });
    }

    const signed = await getSignedUrl({
      bucket: "reports",
      path: storagePath,
      expiresSeconds: SIGNED_URL_TTL_SECONDS,
    });

    if (!signed.ok) {
      return NextResponse.json({
        status: "ready",
        source: loaded.source,
        download_url: fallbackDownloadUrl.toString(),
        warning: signed.error,
      });
    }

    return NextResponse.json({
      status: "ready",
      source: loaded.source,
      download_url: signed.signedUrl,
      storage_path: storagePath,
      expires_in: signed.expiresSeconds,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "pdf_trigger_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
