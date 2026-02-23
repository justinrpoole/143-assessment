"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import dynamic from "next/dynamic";
import WelcomeDisclaimer from "@/components/results/WelcomeDisclaimer";
import IdentityStory from "@/components/results/IdentityStory";
import LightSignature from "@/components/results/LightSignature";
import WhyThisMatters from "@/components/results/WhyThisMatters";
import WeekOneChecklist from "@/components/results/WeekOneChecklist";
import BottomRay from "@/components/results/BottomRay";
import CosmicSkeleton from "@/components/ui/CosmicSkeleton";
import CosmicEmptyState from "@/components/ui/CosmicEmptyState";

const SolarCoreScore = dynamic(() => import("@/components/cosmic/SolarCoreScore"), { ssr: false });
const EclipseMeter = dynamic(() => import("@/components/cosmic/EclipseMeter"), { ssr: false });
const MoonToSunSlider = dynamic(() => import("@/components/cosmic/MoonToSunSlider"), { ssr: false });
const MagneticFieldRing = dynamic(() => import("@/components/cosmic/MagneticFieldRing"), { ssr: false });
const BlackHoleFlags = dynamic(() => import("@/components/cosmic/BlackHoleFlags"), { ssr: false });
const OrbitMap = dynamic(() => import("@/components/cosmic/OrbitMap"), { ssr: false });
import PPDConditional from "@/components/results/PPDConditional";
import ToolReadiness from "@/components/results/ToolReadiness";
import ThirtyDayPlan from "@/components/results/ThirtyDayPlan";
import CoachingQuestions from "@/components/results/CoachingQuestions";
import ConfidenceBandSection from "@/components/results/ConfidenceBandSection";
import Closing from "@/components/results/Closing";
import { RepsRasActions } from "@/components/results/RepsRasActions";
import { ShareCardButton } from "@/components/sharecards/ShareCardButton";
import { MetricTooltip } from "@/components/ui/MetricTooltip";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { ScienceToggle } from "@/components/results/ScienceToggle";
import type { AssessmentOutputV1, ConfidenceBand, RayOutput } from "@/lib/types";

interface ResultsClientProps {
  runId: string;
}

interface RawResultsPayload {
  run_id: string;
  computed_at: string;
  top_rays: string[];
  ray_pair_id: string;
  ray_scores: Record<string, number>;
  results_payload?: AssessmentOutputV1 | null;
}

/** Average net_energy across all rays (0-100) */
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

export function ResultsClient({ runId }: ResultsClientProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<RawResultsPayload | null>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/runs/${encodeURIComponent(runId)}/results`);
        const payload = (await response.json().catch(() => ({}))) as
          | RawResultsPayload
          | { error?: string };
        if (!response.ok) {
          throw new Error(
            "error" in payload && typeof payload.error === "string"
              ? payload.error
              : "results_fetch_failed",
          );
        }
        if (!canceled) {
          setRaw(payload as RawResultsPayload);
        }
      } catch (requestError) {
        if (!canceled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Results could not be loaded.",
          );
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      canceled = true;
    };
  }, [runId]);

  if (loading) {
    return <CosmicSkeleton rows={4} height="h-32" />;
  }

  if (error) {
    return (
      <div className="glass-card p-6" style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }}>
        <p className="text-sm text-rose-400" role="alert">
          {error}
        </p>
        <Link href="/assessment/setup" className="btn-watch mt-4 inline-block">
          Start a new run
        </Link>
      </div>
    );
  }

  if (!raw) {
    return (
      <CosmicEmptyState
        message="No results found for this assessment."
        detail="The data may still be processing, or the run may be incomplete."
        actionLabel="Return to Portal"
        actionHref="/portal"
      />
    );
  }

  const output = raw.results_payload;
  const dataQuality = output?.data_quality;
  const confidenceBand = toConfidenceBand(
    dataQuality?.confidence_band as string | undefined,
  );
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

  // ---------------------------------------------------------------------------
  // Layout: STORY FIRST — identity narrative above fold, data below
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8">

      {/* ═══ ABOVE THE FOLD: Your Story ═══ */}

      {/* 1. Welcome + Confidence */}
      <FadeInSection>
        <WelcomeDisclaimer
          confidence={confidenceBand}
          qualityNotes={qualityNotes}
        />
      </FadeInSection>

      {/* 2. Identity Story — Who You Are Right Now */}
      {lightSignature && (
        <FadeInSection delay={0.15}>
          <IdentityStory
            lightSignature={lightSignature}
            eclipse={eclipse}
            rays={output?.rays}
          />
        </FadeInSection>
      )}

      {/* 3. Rise Path — What Comes Next */}
      {justInRay && (
        <FadeInSection delay={0.2}>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              <MetricTooltip metricId="rise_path">Rise Path</MetricTooltip>
            </h2>
            <BottomRay justInRay={justInRay} />
            <ScienceToggle
              mechanism="Your Rise Path is selected by ranking all 9 Rays by net energy and identifying the lowest. The Move Score (0.45 * Access + 0.35 * Tool Readiness + 0.20 * Reflection Depth) determines coaching intensity. Implementation intentions (Gollwitzer, 1999) show that pre-decided responses significantly increase follow-through under pressure."
              citation="Gollwitzer (1999); Fogg (2019)"
              anchor="scoring-model"
            />
          </div>
        </FadeInSection>
      )}

      {/* 4. Week 1 Installation Plan */}
      {lightSignature && (
        <FadeInSection>
          <WeekOneChecklist lightSignature={lightSignature} />
        </FadeInSection>
      )}

      {/* 5. Primary Action — Your Next Move */}
      <FadeInSection>
        <div className="glass-card p-6 space-y-4" style={{ borderColor: 'rgba(248, 208, 17, 0.2)' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              Your Next Move
            </p>
            <h3 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              {justInRay ? `Start with ${justInRay.ray_name}` : 'Start building your reps'}
            </h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {justInRay
                ? `Your Rise Path points to ${justInRay.ray_name}. One rep today teaches your brain that change is underway.`
                : 'One rep today teaches your brain that change is underway. Pick a tool and begin.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={justInRay ? `/reps?tool=${encodeURIComponent(justInRay.ray_id)}` : '/reps'} className="btn-primary">
              Log your first rep{justInRay ? ` — ${justInRay.ray_name}` : ''}
            </Link>
            <Link href={`/reports?run_id=${encodeURIComponent(runId)}`} className="btn-watch">
              Open full report
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 pt-3" style={{ borderTop: '1px solid var(--surface-border)' }}>
            <Link href="/toolkit" className="text-xs font-medium hover:underline" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Tool library &rarr;
            </Link>
            <Link href="/growth" className="text-xs font-medium hover:underline" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Track growth &rarr;
            </Link>
          </div>
        </div>
      </FadeInSection>

      {/* ═══ BELOW THE FOLD: Your Data ═══ */}

      {/* Divider */}
      <div className="py-2">
        <div
          className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold, #F8D011), transparent)' }}
        />
        <p
          className="mt-3 text-center text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          The data — your 9 Rays, Eclipse, and visualizations
        </p>
      </div>

      {/* 6. Eclipse — System Load */}
      {eclipse && (
        <FadeInSection>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              <MetricTooltip metricId="eclipse_percentage">Eclipse</MetricTooltip>
            </h2>
            <EclipseMeter eclipse={eclipse} />
          </div>
        </FadeInSection>
      )}

      {/* 6a. Eclipse Coaching Reframe */}
      {eclipse && (
        <FadeInSection>
          <div className="glass-card p-5" style={{ borderColor: 'var(--surface-border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              Coaching Note
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
              {eclipse.level === 'LOW' || eclipse.level === 'MODERATE'
                ? 'Your system is holding steady. That means your capacity for growth work is high right now — the tools will land deeper when your nervous system is not in protection mode.'
                : 'Your capacity is 100% intact. What you are seeing is load, not limitation. Eclipse is temporary — it means your system is working hard to protect you. Recovery is the rep right now.'}
            </p>
            {eclipse.gating && (
              <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
                Current mode: <strong style={{ color: 'var(--text-on-dark-secondary)' }}>{eclipse.gating.mode.replace(/_/g, ' ').toLowerCase()}</strong> — {eclipse.gating.reason}
              </p>
            )}
            <ScienceToggle
              mechanism="Eclipse is adapted from Maslach's three-dimensional burnout model, measuring emotional, cognitive, and relational load as temporary capacity reducers. McEwen's allostatic load research (2008) shows that sustained stress has measurable, cumulative costs to executive function and recovery capacity."
              citation="Maslach (1981); McEwen (2008)"
              anchor="research-pillars"
            />
          </div>
        </FadeInSection>
      )}

      {/* 7. Why This Matters — Per-Ray State-Aware Context */}
      {output?.rays && (
        <FadeInSection>
          <WhyThisMatters rays={output.rays} eclipse={eclipse} />
        </FadeInSection>
      )}

      {/* 8. Gravitational Stability — Nine-Ray Radial Visualization */}
      {output?.rays && lightSignature && (
        <FadeInSection>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              <MetricTooltip metricId="gravitational_stability">Gravitational Stability</MetricTooltip>
            </h2>
            <SolarCoreScore
              rays={output.rays}
              topTwo={lightSignature.top_two.map((r) => r.ray_id)}
              bottomRay={lightSignature.just_in_ray?.ray_id ?? ''}
            />
          </div>
        </FadeInSection>
      )}

      {/* 8a. Moon-to-Sun Slider — Overall Score */}
      {output?.rays && (
        <FadeInSection>
          <MoonToSunSlider
            score={computeOverallScore(output.rays)}
            label="Your stability today"
          />
        </FadeInSection>
      )}

      {/* 8b. Magnetic Field Ring — Coherence */}
      {output?.rays && (
        <FadeInSection>
          <MagneticFieldRing rays={output.rays} />
        </FadeInSection>
      )}

      {/* 8c. Orbit Map — Ray Alignment */}
      {output?.rays && lightSignature && (
        <FadeInSection>
          <OrbitMap
            rays={output.rays}
            topTwo={lightSignature.top_two.map((r) => r.ray_id)}
            bottomRay={lightSignature.just_in_ray?.ray_id ?? ''}
          />
        </FadeInSection>
      )}

      {/* 8d. Black Hole Flags — Energy Leaks */}
      {output?.rays && eclipse && (
        <FadeInSection>
          <BlackHoleFlags rays={output.rays} eclipse={eclipse} />
        </FadeInSection>
      )}

      {/* 9. Light Signature Detail — Archetype Expressions, Strengths, Tools */}
      {lightSignature && (
        <FadeInSection>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              <MetricTooltip metricId="light_signature">Light Signature Detail</MetricTooltip>
            </h2>
            <LightSignature lightSignature={lightSignature} />
          </div>
        </FadeInSection>
      )}

      {/* 10. PPD / Acting vs Capacity */}
      {acting && acting.status !== 'CLEAR' && (
        <FadeInSection>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              <MetricTooltip metricId="ppd">Performance-Presence Delta</MetricTooltip>
            </h2>
            <PPDConditional acting={acting} />
          </div>
        </FadeInSection>
      )}
      {acting && acting.status === 'CLEAR' && (
        <FadeInSection>
          <PPDConditional acting={acting} />
        </FadeInSection>
      )}

      {/* 11. Tool Readiness */}
      {recommendations && (
        <FadeInSection>
          <ToolReadiness recommendations={recommendations} />
        </FadeInSection>
      )}

      {/* 12. 30-Day Plan */}
      {recommendations && (
        <FadeInSection>
          <ThirtyDayPlan
            recommendations={recommendations}
            whatNotToDo={whatNotToDo}
            rayName={justInRay?.ray_name}
            runId={runId}
          />
        </FadeInSection>
      )}

      {/* 13. Coaching Questions */}
      {coachingQs.length > 0 && (
        <FadeInSection>
          <CoachingQuestions questions={coachingQs} />
        </FadeInSection>
      )}

      {/* 13b. REPs + RAS */}
      {output && (
        <FadeInSection>
          <RepsRasActions />
        </FadeInSection>
      )}

      {/* 14. Confidence Band Detail */}
      {dataQuality && (
        <FadeInSection>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              <MetricTooltip metricId="confidence_band">Confidence Band</MetricTooltip>
            </h2>
            <ConfidenceBandSection dataQuality={dataQuality} />
          </div>
        </FadeInSection>
      )}

      {/* 15. Closing */}
      {output && (
        <FadeInSection>
          <Closing output={output} />
        </FadeInSection>
      )}

      <FadeInSection>
        <ShareCardButton
          type="results"
          runId={runId}
          rayPairId={raw.ray_pair_id}
          topRays={raw.top_rays}
          shortLine="I know you are the type of person who follows through."
          buttonLabel="Generate Results Share Card"
        />
      </FadeInSection>
    </div>
  );
}
