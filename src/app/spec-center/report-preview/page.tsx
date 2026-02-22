import fs from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { ReportPreviewTool } from "@/components/spec-center/ReportPreviewTool";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

type SearchParams = Record<string, string | string[] | undefined>;
type RayPairEntry = { pair_id: string };
type SeedFixture = { profile_id: string };

interface PageProps {
  searchParams?: Promise<SearchParams> | SearchParams;
}

const RAY_PAIRS_PATH = path.resolve(process.cwd(), "src/content/ray_pairs.json");
const FIXTURES_PATH = path.resolve(process.cwd(), "test_fixtures/seed_profiles.json");

function firstValue(input: string | string[] | undefined): string | null {
  if (typeof input === "string") {
    return input;
  }
  if (Array.isArray(input)) {
    return input[0] ?? null;
  }
  return null;
}

async function resolveSearchParams(value: PageProps["searchParams"]): Promise<SearchParams> {
  if (!value) {
    return {};
  }

  if (typeof (value as Promise<SearchParams>).then === "function") {
    return (await value) ?? {};
  }

  return value;
}

function parseJsonArray<T>(filePath: string): T[] {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export default async function SpecCenterReportPreviewPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const keyFromQuery = firstValue(resolvedSearchParams.key);
  const requiredProdKey = process.env.ENV_SPEC_CENTER_KEY;
  const isProd = process.env.NODE_ENV === "production";
  const hasValidKey = Boolean(requiredProdKey && keyFromQuery === requiredProdKey);
  const accessAllowed = !isProd || hasValidKey;

  if (!accessAllowed) {
    notFound();
  }

  const userState = await getUserStateFromRequest();
  emitPageView({
    eventName: "page_view_spec_center",
    sourceRoute: "/spec-center/report-preview",
    userState,
    entrySource: isProd ? "key" : "dev",
  });

  const pairIds = parseJsonArray<RayPairEntry>(RAY_PAIRS_PATH)
    .map((entry) => entry.pair_id)
    .filter((entry) => typeof entry === "string");
  const fixtureIds = parseJsonArray<SeedFixture>(FIXTURES_PATH)
    .map((entry) => entry.profile_id)
    .filter((entry) => typeof entry === "string");

  const pairFromQuery = firstValue(resolvedSearchParams.pair);
  const defaultPairId =
    pairFromQuery && pairIds.includes(pairFromQuery)
      ? pairFromQuery
      : pairIds[0] ?? "R1-R2";

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <header className="glass-card p-6 mb-6 sm:p-8">
          <p className="chip mb-3">Spec Center</p>
          <h1 className="text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
            Report Preview (Internal)
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Internal QA utility. Render report HTML and generate PDF from ray pair or fixture without running a full assessment.
          </p>
        </header>

        <ReportPreviewTool
          pairIds={pairIds}
          fixtureIds={fixtureIds}
          queryKey={keyFromQuery}
          defaultPairId={defaultPairId}
        />

        <footer className="mt-6 flex flex-wrap gap-3">
          <Link href="/spec-center" className="btn-watch">
            Back to Spec Center
          </Link>
          <Link href="/sample-report" className="btn-watch">
            Open Static Sample Report
          </Link>
        </footer>
      </div>
    </main>
  );
}
