/**
 * /results/rays/[rayId] — Authenticated Ray Detail Page
 *
 * Shows a user's deep-dive results for one specific Ray.
 * URL: /results/rays/R3?run_id=abc123
 *
 * Data source: GET /api/runs/[runId]/results
 * Gate: auth required (redirects to login if not authenticated)
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { getResultForRun, getRunForUser } from "@/lib/db/assessment-runs";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { emitPageView } from "@/lib/analytics/emitter";
import { RAY_COLORS } from "@/lib/ui/ray-colors";
import type { AssessmentOutputV1, RayOutput, SubfacetOutput } from "@/lib/types";
import RayDetailClient from "./RayDetailClient";

export const dynamic = "force-dynamic";

// The order Rays appear when navigating prev/next
const RAY_ORDER = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9"];

const RAY_FULL_NAMES: Record<string, string> = {
  R1: "Intention", R2: "Joy", R3: "Presence", R4: "Power",
  R5: "Purpose", R6: "Authenticity", R7: "Connection",
  R8: "Possibility", R9: "Be The Light",
};

type SearchParams = { run_id?: string };
type Params = { rayId: string };

interface PageProps {
  params: Promise<Params> | Params;
  searchParams?: Promise<SearchParams> | SearchParams;
}

async function resolveParams<T>(value: Promise<T> | T): Promise<T> {
  // Next.js 16 may pass params as a Promise
  if (value && typeof (value as Promise<T>).then === "function") {
    return await (value as Promise<T>);
  }
  return value as T;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rayId } = await resolveParams(params);
  const rayName = RAY_FULL_NAMES[rayId.toUpperCase()] ?? rayId;
  return {
    title: `${rayId} ${rayName} — Your Results | 143 Leadership`,
    description: `Your detailed ${rayName} Ray results — Shine, Eclipse, tools, and your micro-rep for today.`,
  };
}

export default async function RayDetailPage({ params, searchParams }: PageProps) {
  // ── Auth gate ──────────────────────────────────────────────────────────────
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    redirect("/login");
  }

  const userState = await getUserStateFromRequest();
  const { rayId: rawRayId } = await resolveParams(params);
  const { run_id: runId } = await resolveParams(searchParams ?? {});

  // Normalize rayId to uppercase (R1, R2 … R9)
  const rayId = rawRayId.toUpperCase();

  // Validate rayId
  if (!RAY_ORDER.includes(rayId)) {
    redirect("/results");
  }

  // ── Load data ──────────────────────────────────────────────────────────────
  let rayData: RayOutput | null = null;
  let pipelineOutput: AssessmentOutputV1 | null = null;
  let resolvedRunId = runId ?? null;

  if (runId) {
    try {
      const run = await getRunForUser(runId, auth.userId);
      if (run) {
        const result = await getResultForRun({ runId, userId: auth.userId });
        if (result?.results_payload) {
          const payload = result.results_payload as Record<string, unknown>;
          const po = payload.pipeline_output as AssessmentOutputV1 | undefined;
          if (po?.rays?.[rayId]) {
            pipelineOutput = po;
            rayData = po.rays[rayId];
          }
        }
      }
    } catch {
      // Non-fatal — show empty state below
    }
  }

  emitPageView({
    eventName: "ray_detail_view",
    sourceRoute: `/results/rays/${rayId}`,
    userState,
  });

  // ── Prev / Next navigation ─────────────────────────────────────────────────
  const currentIndex = RAY_ORDER.indexOf(rayId);
  const prevRayId = RAY_ORDER[currentIndex - 1] ?? RAY_ORDER[RAY_ORDER.length - 1];
  const nextRayId = RAY_ORDER[currentIndex + 1] ?? RAY_ORDER[0];

  const runParam = resolvedRunId ? `?run_id=${resolvedRunId}` : "";
  const prevHref = `/results/rays/${prevRayId}${runParam}`;
  const nextHref = `/results/rays/${nextRayId}${runParam}`;
  const backHref = `/results${runParam}`;

  const rayColor = RAY_COLORS[rayId] ?? RAY_COLORS.R9;
  const rayName = RAY_FULL_NAMES[rayId] ?? rayId;

  // ── No data state ──────────────────────────────────────────────────────────
  if (!rayData) {
    return (
      <main className="cosmic-page-bg min-h-screen flex items-center justify-center px-5">
        <div className="text-center max-w-sm space-y-5">
          <p className="gold-tag inline-block">{rayId} — {rayName}</p>
          <h1 className="text-xl font-bold text-white">No results found</h1>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            Complete the assessment to see your {rayName} Ray results.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/assessment/setup" className="btn-primary px-6 py-3 text-sm">
              Take Assessment
            </Link>
            <Link href="/results" className="btn-secondary px-6 py-3 text-sm">
              Back to Results
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Pass to client component for interactive elements ──────────────────────
  return (
    <RayDetailClient
      rayId={rayId}
      rayName={rayName}
      rayColor={rayColor.hex}
      rayData={rayData}
      pipelineOutput={pipelineOutput}
      prevHref={prevHref}
      nextHref={nextHref}
      backHref={backHref}
      prevRayName={RAY_FULL_NAMES[prevRayId] ?? prevRayId}
      nextRayName={RAY_FULL_NAMES[nextRayId] ?? nextRayId}
    />
  );
}
