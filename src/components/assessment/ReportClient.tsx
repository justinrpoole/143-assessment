"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import dynamic from "next/dynamic";
import WelcomeDisclaimer from "@/components/results/WelcomeDisclaimer";
import LightSignature from "@/components/results/LightSignature";
import BottomRay from "@/components/results/BottomRay";
import PPDConditional from "@/components/results/PPDConditional";
import ToolReadiness from "@/components/results/ToolReadiness";
import ThirtyDayPlan from "@/components/results/ThirtyDayPlan";
import CoachingQuestions from "@/components/results/CoachingQuestions";
import ConfidenceBandSection from "@/components/results/ConfidenceBandSection";
import EclipseSnapshot from "@/components/results/EclipseSnapshot";
import Closing from "@/components/results/Closing";
import ReportUpsell from "@/components/results/ReportUpsell";
import ExecutiveSignals from "@/components/results/ExecutiveSignals";
import GuidedTourOverlay from "@/components/results/GuidedTourOverlay";
import ReportTableOfContents from "@/components/results/ReportTableOfContents";
import RayDetailDrawer from "@/components/results/RayDetailDrawer";
import SystemHealthGauges from "@/components/results/SystemHealthGauges";
import EdgeCaseAlerts from "@/components/results/EdgeCaseAlerts";
import OutcomeTagCards from "@/components/results/OutcomeTagCards";
import SubfacetHeatmap from "@/components/results/SubfacetHeatmap";
import AssessmentSummaryCard from "@/components/results/AssessmentSummaryCard";
import ValidityForensics from "@/components/results/ValidityForensics";
import PsychometricSummary from "@/components/results/PsychometricSummary";
import CoachingBrief from "@/components/results/CoachingBrief";
import ReportShareCard from "@/components/results/ReportShareCard";
import { MetricTooltip } from "@/components/ui/MetricTooltip";
import { FadeInSection } from "@/components/ui/FadeInSection";
import type {
  AssessmentOutputV1,
  ConfidenceBand,
  RayOutput,
} from "@/lib/types";
import { RAY_SHORT_NAMES } from "@/lib/types";

// ---------------------------------------------------------------------------
// Dynamic imports for heavy cosmic SVG components (no SSR)
// ---------------------------------------------------------------------------
const SolarCoreScore = dynamic(() => import("@/components/cosmic/SolarCoreScore"), { ssr: false });
const EclipseMeter = dynamic(() => import("@/components/cosmic/EclipseMeter"), { ssr: false });
const MoonToSunSlider = dynamic(() => import("@/components/cosmic/MoonToSunSlider"), { ssr: false });
const MagneticFieldRing = dynamic(() => import("@/components/cosmic/MagneticFieldRing"), { ssr: false });
const BlackHoleFlags = dynamic(() => import("@/components/cosmic/BlackHoleFlags"), { ssr: false });
const OrbitMap = dynamic(() => import("@/components/cosmic/OrbitMap"), { ssr: false });
const PlanetaryAlignment = dynamic(() => import("@/components/cosmic/PlanetaryAlignment"), { ssr: false });
const SolarFlareJournal = dynamic(() => import("@/components/cosmic/SolarFlareJournal"), { ssr: false });
const ConstellationProgress = dynamic(() => import("@/components/cosmic/ConstellationProgress"), { ssr: false });

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------
interface ReportClientProps {
  runId: string;
}

interface ReportPayload {
  run_id: string;
  format: "html" | "pdf";
  status: "ready" | "pending" | "failed";
  html: string | null;
}

interface RawResultsPayload {
  run_id: string;
  computed_at: string;
  top_rays: string[];
  ray_pair_id: string;
  ray_scores: Record<string, number>;
  results_payload?: AssessmentOutputV1 | null;
}

interface PdfPayload {
  status?: "ready" | "pending" | "failed";
  signed_url?: string;
  error?: string;
  detail?: string;
}

// ---------------------------------------------------------------------------
// Themed loading sequence (replaces generic skeleton)
// ---------------------------------------------------------------------------
const LOADING_STEPS = [
  "Analyzing 143 data points...",
  "Mapping 36 subfacets...",
  "Calculating eclipse coverage...",
  "Generating your Light Signature...",
];

function ReportLoadingSequence() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= LOADING_STEPS.length - 1) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-brand-gold border-t-transparent" />
      <div className="space-y-2 text-center">
        {LOADING_STEPS.map((label, i) => (
          <p
            key={label}
            className="text-sm transition-all duration-500"
            style={{
              color: i <= step ? '#F8D011' : 'var(--text-on-dark-muted, rgba(255,255,255,0.3))',
              opacity: i <= step ? 1 : 0.4,
            }}
          >
            {i < step ? '\u2713' : i === step ? '\u25CB' : '\u00B7'} {label}
          </p>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function statusLabel(status: "ready" | "pending" | "failed") {
  if (status === "ready") return "Ready";
  if (status === "pending") return "Generating";
  return "Needs retry";
}

function computeOverallScore(rays: Record<string, RayOutput>): number {
  const values = Object.values(rays)
    .map((r) => r.net_energy ?? r.score)
    .filter((v) => v != null);
  if (values.length === 0) return 50;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function toConfidenceBand(raw: string | undefined | null): ConfidenceBand {
  const upper = (raw ?? "").toUpperCase();
  if (upper === "HIGH") return "HIGH";
  if (upper === "LOW") return "LOW";
  return "MODERATE";
}

/**
 * Derive solar flare events from ray assessment data.
 * Each ray's score and eclipse interaction generates a realistic "flare"
 * with magnitude proportional to performance.
 */
function deriveSolarFlares(
  rays: Record<string, RayOutput>,
  topTwo: string[],
  bottomRay: string,
) {
  const entries = Object.entries(rays);
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 30);

  return entries.map(([rayId, ray], idx) => {
    const isTop = topTwo.includes(rayId);
    const isBottom = rayId === bottomRay;

    // Top rays get large flares, bottom ray gets small ones, mid-range varies
    let magnitude: number;
    if (isTop) {
      magnitude = 0.7 + (ray.score / 100) * 0.3; // 0.7–1.0
    } else if (isBottom) {
      magnitude = 0.1 + (ray.score / 100) * 0.2; // 0.1–0.3
    } else {
      magnitude = 0.3 + (ray.score / 100) * 0.4; // 0.3–0.7
    }

    // Spread flare dates across last 30 days
    const flareDate = new Date(baseDate);
    flareDate.setDate(flareDate.getDate() + Math.round((idx / entries.length) * 28) + 1);

    return {
      id: `flare-${rayId}`,
      rayId,
      rayName: ray.ray_name ?? RAY_SHORT_NAMES[rayId] ?? rayId,
      label: isTop
        ? `${ray.ray_name} — Power Source surge`
        : isBottom
          ? `${ray.ray_name} — Growth edge spark`
          : `${ray.ray_name} — Capacity pulse`,
      date: flareDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      magnitude: Math.round(magnitude * 100) / 100,
    };
  });
}

/**
 * Derive constellation progress stars from ray subfacets.
 * Each subfacet becomes a star; "completed" if score >= 60.
 * Top-two rays have major breakthrough stars.
 */
function deriveConstellationStars(
  rays: Record<string, RayOutput>,
  topTwo: string[],
) {
  const stars: Array<{
    id: string;
    label: string;
    completed: boolean;
    major?: boolean;
  }> = [];

  for (const [rayId, ray] of Object.entries(rays)) {
    const isTop = topTwo.includes(rayId);
    const subfacets = ray.subfacets ? Object.entries(ray.subfacets) : [];

    if (subfacets.length > 0) {
      for (const [sfId, sf] of subfacets) {
        stars.push({
          id: `star-${rayId}-${sfId}`,
          label: sf.label || sfId,
          completed: sf.score >= 60,
          major: isTop && sf.score >= 75,
        });
      }
    } else {
      // No subfacets — create a single star from the ray score
      stars.push({
        id: `star-${rayId}`,
        label: ray.ray_name ?? RAY_SHORT_NAMES[rayId] ?? rayId,
        completed: ray.score >= 60,
        major: isTop && ray.score >= 75,
      });
    }
  }

  return stars;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ReportClient({ runId }: ReportClientProps) {
  // Report HTML/PDF state (original)
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [pdfStatus, setPdfStatus] = useState<"idle" | "pending" | "ready" | "failed">("idle");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Assessment results data (new — powers all cosmic visualizations)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<RawResultsPayload | null>(null);

  // View toggle: interactive (React) vs static (HTML)
  const [viewMode, setViewMode] = useState<"interactive" | "html">("interactive");

  // Ray deep-dive drawer
  const [drawerRay, setDrawerRay] = useState<RayOutput | null>(null);

  // ─── Fetch both endpoints in parallel ───
  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [resultsRes, reportRes] = await Promise.allSettled([
          fetch(`/api/runs/${encodeURIComponent(runId)}/results`),
          fetch(`/api/runs/${encodeURIComponent(runId)}/report`),
        ]);

        // Results data (required for cosmic visualizations)
        if (resultsRes.status === "fulfilled" && resultsRes.value.ok) {
          const resultsPayload = await resultsRes.value.json().catch(() => ({}));
          if (!canceled) setRaw(resultsPayload as RawResultsPayload);
        } else if (resultsRes.status === "fulfilled") {
          const errBody = await resultsRes.value.json().catch(() => ({}));
          if (!canceled) {
            setError(
              typeof errBody.error === "string" ? errBody.error : "results_fetch_failed"
            );
          }
        } else {
          if (!canceled) setError("results_fetch_failed");
        }

        // Report HTML (for PDF generation / fallback view)
        if (reportRes.status === "fulfilled" && reportRes.value.ok) {
          const reportPayload = await reportRes.value.json().catch(() => ({}));
          if (!canceled) setReport(reportPayload as ReportPayload);
        }
      } catch (err) {
        if (!canceled) {
          setError(err instanceof Error ? err.message : "Report could not be loaded.");
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    void load();
    return () => { canceled = true; };
  }, [runId]);

  // ─── PDF generation ───
  const onDownloadPdf = useCallback(async () => {
    setPdfError(null);
    setPdfStatus("pending");
    setPdfUrl(null);
    try {
      const response = await fetch(`/api/runs/${encodeURIComponent(runId)}/report/pdf`, {
        method: "POST",
      });
      const payload = (await response.json().catch(() => ({}))) as PdfPayload;
      if (!response.ok) {
        setPdfStatus("failed");
        setPdfError(payload.error ?? "pdf_generation_failed");
        return;
      }
      if (payload.status === "pending") {
        setPdfStatus("pending");
        return;
      }
      if (typeof payload.signed_url === "string") {
        setPdfStatus("ready");
        setPdfUrl(payload.signed_url);
        window.open(payload.signed_url, "_blank", "noopener,noreferrer");
        return;
      }
      setPdfStatus("failed");
      setPdfError("pdf_url_missing");
    } catch (err) {
      setPdfStatus("failed");
      setPdfError(err instanceof Error ? err.message : "pdf_generation_failed");
    }
  }, [runId]);

  // ─── Derived data ───
  const output = raw?.results_payload ?? null;
  const dataQuality = output?.data_quality;
  const confidenceBand = toConfidenceBand(dataQuality?.confidence_band as string | undefined);
  const qualityNotes =
    typeof (dataQuality as unknown as Record<string, unknown> | undefined)?.quality_notes === "string"
      ? ((dataQuality as unknown as Record<string, unknown>).quality_notes as string)
      : undefined;

  const lightSignature = output?.light_signature;
  const eclipse = output?.eclipse;
  const acting = output?.acting_vs_capacity;
  const recommendations = output?.recommendations;
  const justInRay = lightSignature?.just_in_ray;
  const coachingQs = recommendations?.coaching_questions ?? [];
  const whatNotToDo = recommendations?.what_not_to_do_yet ?? [];
  const execSignals = output?.executive_output?.signals ?? [];

  const topTwoIds = useMemo(
    () => lightSignature?.top_two?.map((r) => r.ray_id) ?? [],
    [lightSignature],
  );
  const bottomRayId = justInRay?.ray_id ?? "";

  const solarFlares = useMemo(
    () => (output?.rays ? deriveSolarFlares(output.rays, topTwoIds, bottomRayId) : []),
    [output?.rays, topTwoIds, bottomRayId],
  );

  const constellationStars = useMemo(
    () => (output?.rays ? deriveConstellationStars(output.rays, topTwoIds) : []),
    [output?.rays, topTwoIds],
  );

  const overallScore = useMemo(
    () => (output?.rays ? computeOverallScore(output.rays) : 50),
    [output?.rays],
  );

  const eclipseLoadPercent = useMemo(() => {
    if (!eclipse) return 0;
    const levelMap: Record<string, number> = { LOW: 15, MODERATE: 40, ELEVATED: 65, HIGH: 88 };
    return levelMap[eclipse.level] ?? 30;
  }, [eclipse]);

  const reportStatus = useMemo(() => {
    if (!report) return "pending" as const;
    return report.status;
  }, [report]);

  // ─── Loading & Error states ───
  if (loading) {
    return <ReportLoadingSequence />;
  }

  if (error && !raw) {
    return (
      <div className="glass-card p-6" style={{ borderColor: "rgba(244, 63, 94, 0.3)" }}>
        <p className="text-sm text-rose-400" role="alert">{error}</p>
        <Link href="/assessment/setup" className="btn-watch mt-4 inline-block">
          Start a new run
        </Link>
      </div>
    );
  }

  // ─── Render ───
  return (
    <div className="space-y-8">

      {/* ── Toolbar: PDF, view toggle, back button ── */}
      <FadeInSection>
        <section className="glass-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: "var(--text-on-dark)" }}>
                Full Interactive Report
              </h2>
              <p className="mt-1 text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
                run_id: <code>{runId}</code>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "interactive" ? "html" : "interactive")}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{
                  background: "var(--surface-glass)",
                  color: "var(--text-on-dark-secondary)",
                  border: "1px solid var(--surface-border)",
                }}
              >
                {viewMode === "interactive" ? "View Static HTML" : "View Interactive"}
              </button>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="rounded-xl p-3 text-sm mb-4" style={{ background: "var(--surface-glass)", border: "1px solid var(--surface-border)" }}>
            <div className="flex flex-wrap gap-4">
              <span style={{ color: "var(--text-on-dark-secondary)" }}>
                HTML: <strong style={{ color: "var(--text-on-dark)" }}>{statusLabel(reportStatus)}</strong>
              </span>
              <span style={{ color: "var(--text-on-dark-secondary)" }}>
                PDF: <strong style={{ color: "var(--text-on-dark)" }}>
                  {statusLabel(
                    pdfStatus === "idle" ? reportStatus
                    : pdfStatus === "ready" ? "ready"
                    : pdfStatus === "failed" ? "failed"
                    : "pending"
                  )}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-primary"
              onClick={() => void onDownloadPdf()}
              disabled={pdfStatus === "pending"}
            >
              {pdfStatus === "pending" ? "Generating PDF..." : "Generate / Download PDF"}
            </button>
            <Link href={`/results?run_id=${encodeURIComponent(runId)}`} className="btn-watch">
              Back to Results
            </Link>
          </div>

          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm underline"
              style={{ color: "var(--brand-gold)" }}
            >
              Open signed PDF link
            </a>
          )}
          {pdfError && (
            <p className="mt-2 text-sm text-rose-400" role="alert">{pdfError}</p>
          )}
        </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════════════════════════════
          INTERACTIVE REPORT — All Cosmic Visualizations
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "interactive" && output ? (
        <>
          <ReportTableOfContents entries={[
            { id: 'rpt-summary', label: 'Summary' },
            { id: 'rpt-overview', label: 'Overview' },
            { id: 'rpt-light-signature', label: 'Light Signature' },
            { id: 'rpt-solar-core', label: 'Solar Core Score' },
            { id: 'rpt-subfacets', label: 'Subfacet Map' },
            { id: 'rpt-eclipse', label: 'Eclipse Meter' },
            { id: 'rpt-health', label: 'System Health' },
            { id: 'rpt-planetary', label: 'Planetary Alignment' },
            { id: 'rpt-magnetic', label: 'Magnetic Field' },
            { id: 'rpt-orbit', label: 'Orbit Map' },
            { id: 'rpt-black-hole', label: 'Black Hole Flags' },
            { id: 'rpt-solar-flare', label: 'Solar Flare Journal' },
            { id: 'rpt-constellation', label: 'Constellation Progress' },
            { id: 'rpt-exec-signals', label: 'Executive Signals' },
            { id: 'rpt-outcomes', label: 'Outcome Patterns' },
            { id: 'rpt-edge-cases', label: 'Pattern Flags' },
            { id: 'rpt-rise-path', label: 'Rise Path' },
            { id: 'rpt-tools', label: 'Tool Readiness' },
            { id: 'rpt-30day', label: '30-Day Plan' },
            { id: 'rpt-coaching', label: 'Coaching Questions' },
            { id: 'rpt-coaching-brief', label: 'Coaching Brief' },
            { id: 'rpt-psychometric', label: 'Psychometric Foundation' },
            { id: 'rpt-closing', label: 'Closing' },
          ]} />

          {/* ── 0. Assessment Summary Card ── */}
          <FadeInSection>
            <div id="rpt-summary">
              <AssessmentSummaryCard output={output} />
            </div>
          </FadeInSection>

          {/* ── 1. Welcome + Confidence Band ── */}
          <FadeInSection>
            <WelcomeDisclaimer confidence={confidenceBand} qualityNotes={qualityNotes} />
          </FadeInSection>

          {/* ── 2. Moon-to-Sun Slider — Overall Score Panorama ── */}
          {output.rays && (
            <FadeInSection delay={0.1}>
              <div id="rpt-overview" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  <MetricTooltip metricId="overall_score">Overall Stability</MetricTooltip>
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  Your score mapped from crescent moon (low capacity) to radiant sun (full capacity).
                  The indicator shows where your system is operating right now.
                </p>
                <MoonToSunSlider score={overallScore} label="Your gravitational stability today" />
              </div>
            </FadeInSection>
          )}

          {/* ── 3. Light Signature — Archetype + Top Two ── */}
          {lightSignature && (
            <FadeInSection delay={0.15}>
              <div id="rpt-light-signature" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  <MetricTooltip metricId="light_signature">Light Signature</MetricTooltip>
                </h2>
                <LightSignature lightSignature={lightSignature} />
              </div>
            </FadeInSection>
          )}

          {/* ── 4. Solar Core Score — Nine-Ray Radial Sunburst ── */}
          {output.rays && lightSignature && (
            <FadeInSection delay={0.1}>
              <div id="rpt-solar-core" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  <MetricTooltip metricId="gravitational_stability">Gravitational Stability — Solar Core</MetricTooltip>
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  Each ray radiates outward from your core. Longer beams mean stronger capacity.
                  Hover any ray for detailed metrics. The eclipse shadow arc shows your current system load.
                </p>
                <SolarCoreScore
                  rays={output.rays}
                  topTwo={topTwoIds}
                  bottomRay={bottomRayId}
                  loadPercent={eclipseLoadPercent}
                  onRaySelected={(rayId) => setDrawerRay(rayId && output.rays[rayId] ? output.rays[rayId] : null)}
                />
              </div>
            </FadeInSection>
          )}

          {/* ── 4b. Subfacet Heatmap ── */}
          {output.rays && (
            <FadeInSection>
              <div id="rpt-subfacets">
                <SubfacetHeatmap rays={output.rays} />
              </div>
            </FadeInSection>
          )}

          {/* ── 5. Eclipse Meter — Gravitational Stability Load ── */}
          {eclipse && (
            <FadeInSection>
              <div id="rpt-eclipse" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  <MetricTooltip metricId="eclipse_percentage">Eclipse — System Load</MetricTooltip>
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  The moon covering the sun shows how much of your range is temporarily eclipsed.
                  Expand the metrics below for recovery access and load pressure breakdowns.
                </p>
                <EclipseMeter eclipse={eclipse} />
              </div>
            </FadeInSection>
          )}

          {/* ── 6. Eclipse Snapshot — Detailed Load Gauge ── */}
          {eclipse && (
            <FadeInSection>
              <EclipseSnapshot eclipse={eclipse} />
            </FadeInSection>
          )}

          {/* ── 6b. System Health Gauges (EER, BRI, LSI) ── */}
          {output.indices && (
            <FadeInSection>
              <div id="rpt-health">
                <SystemHealthGauges indices={output.indices} />
              </div>
            </FadeInSection>
          )}

          {/* ── 7. Planetary Alignment — Five-Planet Ray Coherence ── */}
          {output.rays && (
            <FadeInSection>
              <div id="rpt-planetary" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  <MetricTooltip metricId="ray_coherence">Planetary Alignment — Ray Coherence</MetricTooltip>
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  Five key rays aligned along the solar beam. When coherence exceeds 50%, the beam
                  refracts into a spectral streak. Hover each planet for individual ray metrics.
                </p>
                <PlanetaryAlignment rays={output.rays} />
              </div>
            </FadeInSection>
          )}

          {/* ── 8. Magnetic Field Ring — Coherence Dual View ── */}
          {output.rays && (
            <FadeInSection>
              <div id="rpt-magnetic" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  Magnetic Field — System Coherence
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  Side-by-side comparison: low coherence (scattered energy) vs. high coherence (contained field).
                  Your actual coherence determines which side glows brighter.
                </p>
                <MagneticFieldRing rays={output.rays} />
              </div>
            </FadeInSection>
          )}

          {/* ── 9. Orbit Map — Personal Solar System ── */}
          {output.rays && lightSignature && (
            <FadeInSection>
              <div id="rpt-orbit" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  Orbit Map — Your Solar System
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  Inner orbit = power sources. Middle orbit = transitioning rays. Outer orbit = training focus.
                  Hover each ray chip for score details.
                </p>
                <OrbitMap
                  rays={output.rays}
                  topTwo={topTwoIds}
                  bottomRay={bottomRayId}
                />
              </div>
            </FadeInSection>
          )}

          {/* ── 10. Black Hole Flags — Energy Leak Detection ── */}
          {output.rays && eclipse && (
            <FadeInSection>
              <div id="rpt-black-hole" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  Black Hole Flags — Energy Leaks
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  Rays with high eclipse scores appear as gravity wells draining energy.
                  Tap any black hole for intervention actions: Reframe, Boundary, or Swap Habit.
                </p>
                <BlackHoleFlags rays={output.rays} eclipse={eclipse} />
              </div>
            </FadeInSection>
          )}

          {/* ── 11. Solar Flare Journal — Breakthrough Timeline ── */}
          {solarFlares.length > 0 && (
            <FadeInSection>
              <div id="rpt-solar-flare" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  Solar Flare Journal — Capacity Timeline
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  Flare height represents capacity magnitude. Power source rays produce massive solar eruptions.
                  Growth-edge rays show early sparks. Each flare is positioned by date along the sun&apos;s surface.
                </p>
                <SolarFlareJournal flares={solarFlares} />
              </div>
            </FadeInSection>
          )}

          {/* ── 12. Constellation Progress — Personal Mythology ── */}
          {constellationStars.length > 0 && (
            <FadeInSection>
              <div id="rpt-constellation" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  Constellation Progress — Your Star Map
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  Each star represents a subfacet skill. Gold lit stars are active capacities (score 60+).
                  Larger stars mark major breakthroughs in your top two rays. Click any star for details.
                </p>
                <ConstellationProgress
                  stars={constellationStars}
                  constellationName={lightSignature?.archetype?.name ?? "The Lightkeeper"}
                  dateRange="Last 30 days"
                />
              </div>
            </FadeInSection>
          )}

          {/* ── 12b. Executive Signals — Leadership Behavioral Signals ── */}
          {execSignals.length > 0 && (
            <FadeInSection>
              <div id="rpt-exec-signals" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  Executive Signals
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  24 behavioral signals derived from your assessment data. These map raw scores to
                  real-world leadership behaviors — where you lead naturally and where to build next.
                </p>
                <ExecutiveSignals signals={execSignals} />
              </div>
            </FadeInSection>
          )}

          {/* ── 12c. Outcome Patterns ── */}
          {output.outcome_tags?.applied && output.outcome_tags.applied.length > 0 && (
            <FadeInSection>
              <div id="rpt-outcomes">
                <OutcomeTagCards outcomeTags={output.outcome_tags.applied} />
              </div>
            </FadeInSection>
          )}

          {/* ── 12d. Edge Case / Pattern Flags ── */}
          {output.edge_cases && output.edge_cases.length > 0 && (
            <FadeInSection>
              <div id="rpt-edge-cases">
                <EdgeCaseAlerts edgeCases={output.edge_cases} />
              </div>
            </FadeInSection>
          )}

          {/* ── 13. Rise Path — Bottom Ray / Next Skill ── */}
          {justInRay && (
            <FadeInSection>
              <div id="rpt-rise-path" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  <MetricTooltip metricId="rise_path">Rise Path</MetricTooltip>
                </h2>
                <BottomRay justInRay={justInRay} selectionBasis={lightSignature?.bottom_ray_selection_basis} />
              </div>
            </FadeInSection>
          )}

          {/* ── 14. Performance–Presence Delta ── */}
          {acting && acting.status !== "CLEAR" && (
            <FadeInSection>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  <MetricTooltip metricId="ppd">Performance–Presence Delta</MetricTooltip>
                </h2>
                <PPDConditional acting={acting} />
              </div>
            </FadeInSection>
          )}
          {acting && acting.status === "CLEAR" && (
            <FadeInSection>
              <PPDConditional acting={acting} />
            </FadeInSection>
          )}

          {/* ── 15. Tool Readiness ── */}
          {recommendations && (
            <FadeInSection>
              <div id="rpt-tools">
                <ToolReadiness recommendations={recommendations} />
              </div>
            </FadeInSection>
          )}

          {/* ── 16. 30-Day Plan ── */}
          {recommendations && (
            <FadeInSection>
              <div id="rpt-30day">
                <ThirtyDayPlan recommendations={recommendations} whatNotToDo={whatNotToDo} rayName={justInRay?.ray_name} runId={runId} />
              </div>
            </FadeInSection>
          )}

          {/* ── 17. Coaching Questions ── */}
          {coachingQs.length > 0 && (
            <FadeInSection>
              <div id="rpt-coaching">
                <CoachingQuestions questions={coachingQs} runId={runId} />
              </div>
            </FadeInSection>
          )}

          {/* ── 17b. Coaching Brief — Printable 1-Page Summary for Coaches ── */}
          {output && (
            <FadeInSection>
              <div id="rpt-coaching-brief" className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  Coaching Brief
                </h2>
                <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                  One-page summary for coaching session preparation. Print or save as PDF.
                </p>
                <CoachingBrief output={output} runId={runId} />
              </div>
            </FadeInSection>
          )}

          {/* ── 18. Confidence Band Detail ── */}
          {dataQuality && (
            <FadeInSection>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                  <MetricTooltip metricId="confidence_band">Confidence Band</MetricTooltip>
                </h2>
                <ConfidenceBandSection dataQuality={dataQuality} />
              </div>
            </FadeInSection>
          )}

          {/* ── 18b. Validity Forensics ── */}
          {dataQuality && (
            <FadeInSection>
              <ValidityForensics dataQuality={dataQuality} />
            </FadeInSection>
          )}

          {/* ── 18c. Psychometric Foundation — Enterprise Credibility ── */}
          <FadeInSection>
            <div id="rpt-psychometric" className="space-y-2">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
                Psychometric Foundation
              </h2>
              <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                Research pillars, measurement model, and construct design behind the 143 Leadership Assessment.
              </p>
              <PsychometricSummary />
            </div>
          </FadeInSection>

          {/* ── 19. Closing ── */}
          {output && (
            <FadeInSection>
              <div id="rpt-closing">
                <Closing output={output} />
              </div>
            </FadeInSection>
          )}

          {/* ── 19b. Share Your Light Signature ── */}
          {lightSignature && (
            <FadeInSection>
              <ReportShareCard
                lightSignature={lightSignature}
                eclipse={eclipse}
                overallScore={overallScore}
              />
            </FadeInSection>
          )}

          {/* ── 20. Coaching OS Upsell ── */}
          <FadeInSection>
            <ReportUpsell />
          </FadeInSection>
        </>
      ) : null}

      {/* ══════════════════════════════════════════════════════════════════
          STATIC HTML FALLBACK — Original report rendering
          ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "html" ? (
        <FadeInSection>
          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-on-dark)" }}>
              Static HTML Report
            </h2>
            {report?.status === "ready" && report.html ? (
              <article
                className="rounded-2xl border p-4 text-sm"
                style={{ borderColor: "var(--surface-border)" }}
                dangerouslySetInnerHTML={{ __html: report.html }}
              />
            ) : (
              <p className="text-sm" style={{ color: "var(--text-on-dark-muted)" }}>
                Report artifact is still processing. Switch to Interactive view for live cosmic visualizations,
                or keep this tab open while the HTML version generates.
              </p>
            )}
          </section>
        </FadeInSection>
      ) : null}

      {/* Ray deep-dive drawer */}
      <RayDetailDrawer ray={drawerRay} onClose={() => setDrawerRay(null)} />

      {/* Guided tour for first-time report viewers */}
      {viewMode === "interactive" && output && (
        <GuidedTourOverlay />
      )}
    </div>
  );
}
