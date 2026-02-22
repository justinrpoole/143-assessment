import fs from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import { renderReportHtml } from "@/lib/report/render-report-html.mjs";
import { renderReportPdf } from "@/lib/report/render-report-pdf.mjs";
import { scoreAssessment } from "@/lib/scoring/score-assessment.mjs";
import { getSignedUrl, uploadBytes } from "@/lib/storage/supabase-storage";

export const runtime = "nodejs";

type SeedFixture = {
  profile_id: string;
  responses: Record<string, number>;
  expected?: {
    top_rays?: string[];
    ray_pair?: string;
  };
};

type RayPairEntry = {
  pair_id: string;
  rays: string[];
};

const FIXTURES_PATH = path.resolve(process.cwd(), "test_fixtures/seed_profiles.json");
const RAY_PAIRS_PATH = path.resolve(process.cwd(), "src/content/ray_pairs.json");
const CANONICAL_STATES = new Set([
  "public",
  "free_email",
  "paid_43",
  "sub_active",
  "sub_canceled",
  "past_due",
]);

function notFoundResponse() {
  return NextResponse.json({ error: "not_found" }, { status: 404 });
}

function parseJsonFile<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function sanitizePairId(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, "");
}

function ensureSpecCenterAccess(request: Request): boolean {
  const url = new URL(request.url);
  const keyFromQuery = url.searchParams.get("key");
  const requiredProdKey = process.env.ENV_SPEC_CENTER_KEY;
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    return true;
  }

  if (!requiredProdKey) {
    return false;
  }

  return keyFromQuery === requiredProdKey;
}

function readFixtures(): SeedFixture[] {
  const parsed = parseJsonFile<SeedFixture[]>(FIXTURES_PATH);
  return Array.isArray(parsed) ? parsed : [];
}

function readRayPairs(): RayPairEntry[] {
  const parsed = parseJsonFile<RayPairEntry[]>(RAY_PAIRS_PATH);
  return Array.isArray(parsed) ? parsed : [];
}

function resolveFixtureValue(rawFixture: string | null): SeedFixture | null {
  if (!rawFixture) return null;
  const fixtures = readFixtures();
  if (fixtures.length === 0) return null;

  const byId = fixtures.find((fixture) => fixture.profile_id === rawFixture);
  if (byId) return byId;

  const asIndex = Number(rawFixture);
  if (Number.isInteger(asIndex) && asIndex >= 0 && asIndex < fixtures.length) {
    return fixtures[asIndex] ?? null;
  }

  return null;
}

function resolvePairValue(rawPair: string | null): RayPairEntry | null {
  if (!rawPair) return null;
  const pairs = readRayPairs();
  if (pairs.length === 0) return null;
  return pairs.find((pair) => pair.pair_id === rawPair) ?? null;
}

function buildPairReportPayload(pair: RayPairEntry) {
  const topRayA = pair.rays[0];
  const topRayB = pair.rays[1];

  const rayScoresById: Record<string, number> = {};
  for (let i = 1; i <= 9; i += 1) {
    const ray = `R${i}`;
    rayScoresById[ray] = 1;
  }
  rayScoresById[topRayA] = 4;
  rayScoresById[topRayB] = 4;

  return {
    ray_pair_id: pair.pair_id,
    ray_pair: pair.pair_id,
    top_rays: [topRayA, topRayB],
    ray_scores_by_id: rayScoresById,
    confidence_band: "STANDARD",
    user_state: "public",
  };
}

function resolveUserState(rawValue: string | null): string {
  if (!rawValue) return "public";
  return CANONICAL_STATES.has(rawValue) ? rawValue : "public";
}

function buildFixtureReportPayload(fixture: SeedFixture, userState: string) {
  const scored = scoreAssessment({
    responses: fixture.responses,
    metadata: { user_state: userState },
  });

  return {
    ...scored,
    confidence_band: "STANDARD",
  };
}

function resolvePreviewPayload(input: {
  pair: string | null;
  fixture: string | null;
  userState: string;
}) {
  if (input.fixture) {
    const fixture = resolveFixtureValue(input.fixture);
    if (!fixture) {
      return { error: "fixture_not_found" as const };
    }
    return {
      payload: buildFixtureReportPayload(fixture, input.userState),
      source: "fixture" as const,
      source_id: fixture.profile_id,
    };
  }

  const pairId = input.pair ?? "R1-R2";
  const pair = resolvePairValue(pairId);
  if (!pair) {
    return { error: "pair_not_found" as const };
  }

  return {
    payload: buildPairReportPayload(pair),
    source: "pair" as const,
    source_id: pair.pair_id,
  };
}

function buildPdfStoragePath(sourceId: string) {
  const safeSourceId = sanitizePairId(sourceId);
  return `reports/spec-center/${safeSourceId}/preview_${Date.now()}.pdf`;
}

async function buildPdfResponse(params: { html: string; sourceId: string }) {
  let pdfBytes: Buffer;
  try {
    pdfBytes = await renderReportPdf({ html: params.html });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("playwright_not_installed")) {
      return NextResponse.json(
        { error: "pdf_renderer_not_available", detail: message },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "pdf_generation_failed", detail: message },
      { status: 500 },
    );
  }

  const storagePath = buildPdfStoragePath(params.sourceId);
  const upload = await uploadBytes({
    bucket: "reports",
    path: storagePath,
    contentType: "application/pdf",
    bytes: pdfBytes,
  });
  if (!upload.ok) {
    if (upload.error === "storage_not_configured") {
      return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
    }
    return NextResponse.json(
      { error: "pdf_upload_failed", detail: upload.error },
      { status: 500 },
    );
  }

  const signed = await getSignedUrl({
    bucket: "reports",
    path: storagePath,
    expiresSeconds: 60 * 60 * 24,
  });
  if (!signed.ok) {
    if (signed.error === "storage_not_configured") {
      return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
    }
    return NextResponse.json(
      { error: "signed_url_failed", detail: signed.error },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    format: "pdf",
    storage_path: storagePath,
    signed_url: signed.signedUrl,
    expires_in: signed.expiresSeconds,
  });
}

export async function GET(request: Request) {
  if (!ensureSpecCenterAccess(request)) {
    return notFoundResponse();
  }

  const url = new URL(request.url);
  const pair = url.searchParams.get("pair");
  const fixture = url.searchParams.get("fixture");
  const format = url.searchParams.get("format") ?? "html";
  const userState = resolveUserState(url.searchParams.get("user_state"));

  const resolved = resolvePreviewPayload({
    pair,
    fixture,
    userState,
  });
  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  const html = renderReportHtml({
    resultsPayload: resolved.payload,
    firstName: "Leader",
  });

  if (format === "pdf") {
    return buildPdfResponse({
      html,
      sourceId: resolved.source_id,
    });
  }

  return NextResponse.json({
    ok: true,
    format: "html",
    source: resolved.source,
    source_id: resolved.source_id,
    ray_pair_id: resolved.payload.ray_pair_id,
    top_rays: resolved.payload.top_rays,
    html,
  });
}
