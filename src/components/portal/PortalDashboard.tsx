'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import QuickRepFAB from './QuickRepFAB';
import DailyLoopClient from '@/components/retention/DailyLoopClient';
import PhaseCheckInClient from '@/components/retention/PhaseCheckInClient';
import StreakRecovery from '@/components/retention/StreakRecovery';
import CelebrationToast from '@/components/ui/CelebrationToast';
import { streakMilestone, type CelebrationTrigger } from '@/lib/celebrations/triggers';
import { haptic } from '@/lib/haptics';
import ContextualActions from './ContextualActions';
import { FadeInSection } from '@/components/ui/FadeInSection';
import CosmicSkeleton from '@/components/ui/CosmicSkeleton';
import TimezoneSync from '@/components/TimezoneSync';
import NotificationToggle from './NotificationToggle';
import BadgeShowcase from './BadgeShowcase';
import MorningMirrorOverlay from './MorningMirrorOverlay';
import EclipseCalendarHeatmap from './EclipseCalendarHeatmap';
import InviteColleagueCard from './InviteColleagueCard';
import EntryLogOverTime from './EntryLogOverTime';
import RetakeInsights from './RetakeInsights';
import ArchetypeHeroCard from './ArchetypeHeroCard';
import ArchetypeCoachingCard from './ArchetypeCoachingCard';
import GrowthSignalCard from './GrowthSignalCard';
import EclipseAnchorCard from './EclipseAnchorCard';
import NoRunOnboardingCard from './NoRunOnboardingCard';
import { RAY_NAMES } from '@/lib/types';
import type { RayOutput, EclipseOutput } from '@/lib/types';

const PatternInterruptHub = dynamic(() => import('@/components/PatternInterruptHub'), { ssr: false });
const EnergyStarChart = dynamic(() => import('@/components/cosmic/EnergyStarChart'), { ssr: false });

/* ── Inline utilities ── */

function SignOutButton() {
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    setBusy(true);
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      window.location.href = '/';
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      disabled={busy}
      className="text-xs hover:text-white transition-colors disabled:opacity-50"
      style={{ color: 'var(--text-on-dark-muted)' }}
    >
      {busy ? 'Signing out...' : 'Sign out'}
    </button>
  );
}

/* ── Types ── */

interface PortalSummary {
  has_completed_run: boolean;
  last_run_id: string | null;
  run_number: number | null;
  eclipse_level: 'low' | 'medium' | 'high' | null;
  bottom_ray_id: string | null;
  bottom_ray_name: string | null;
  top_ray_ids: string[];
  reps_this_week: number;
  streak_days: number;
  total_reps: number;
  most_practiced_tool: string | null;
  loop_streak: number;
  reflection_streak: number;
  in_progress_run_id: string | null;
  in_progress_answered: number;
  in_progress_total: number;
  subscription_state: 'active' | 'grace' | 'expired' | 'past_due' | 'none';
  grace_period_end: string | null;
  archetype: {
    name: string;
    pair_code: string;
    tagline: string;
    identity_code: string;
    neon_color: string;
    the_line: string;
    first_rep: string;
    vibe: string;
    rays: string[];
    starting_tools: string;
    micro_reps: string;
    coaching_logic: string;
    stress_distortion: string;
    reflection_prompts: string;
  } | null;
  ray_scores: Record<string, number> | null;
}

type SignalModal = 'watch_me' | 'go_first' | 'i_rise' | null;
type SignalPrefill = {
  watchMe?: { target?: string | null; move?: string | null };
  goFirst?: { action?: string | null };
};

/* ── Sub-components ── */

function ResumeBanner({ runId, answered, total }: { runId: string; answered: number; total: number }) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  return (
    <Link
      href={`/assessment?run_id=${encodeURIComponent(runId)}`}
      className="glass-card card-border-gold-mid block p-5 transition-all hover:scale-[1.01]"
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold-primary)' }}>
        Continue Assessment
      </p>
      <p className="mt-1.5 text-sm font-medium" style={{ color: 'var(--text-body)' }}>
        You left off at question {answered}/{total}. Pick up where you stopped.
      </p>
      <div className="surface-track-mid mt-3 h-2 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
        {pct}% complete — your answers are saved
      </p>
    </Link>
  );
}

function SubscriptionBanner({ state, gracePeriodEnd }: { state: PortalSummary['subscription_state']; gracePeriodEnd: string | null }) {
  if (state === 'active' || state === 'none') return null;

  const graceDateLabel = gracePeriodEnd
    ? new Date(gracePeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  const config = {
    grace: {
      stroke: 'color-mix(in srgb, var(--gold-primary) 40%, transparent)',
      label: 'Subscription Ending',
      labelColor: 'var(--gold-primary)',
      message: `Your subscription was canceled. You still have full access through ${graceDateLabel ?? 'your current period'}. Renew anytime to keep going.`,
    },
    expired: {
      stroke: 'var(--surface-border)',
      label: 'Subscription Expired',
      labelColor: 'var(--surface-border)',
      message: 'Your subscription has ended. Your report and progress are still here. Renew to continue your coaching tools and retakes.',
    },
    past_due: {
      stroke: 'var(--surface-border)',
      label: 'Payment Needs Attention',
      labelColor: 'var(--surface-border)',
      message: 'Your last payment didn\u2019t go through. Update your billing to continue your coaching without interruption.',
    },
  } as const;

  const c = config[state];

  return (
    <div
      className="glass-card card-border-accent p-5 space-y-3"
      style={{ '--card-accent': c.stroke } as { ['--card-accent']: string }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: c.labelColor }}>
        {c.label}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 70%, transparent))' }}>
        {c.message}
      </p>
      <Link
        href="/upgrade"
        className="btn-primary inline-block text-center text-sm px-5 py-2"
      >
        {state === 'past_due' ? 'Update billing' : 'Renew subscription'}
      </Link>
    </div>
  );
}

/** Build minimal RayOutput objects from ray_scores for the EnergyStarChart preview. */
function buildChartRays(rayScores: Record<string, number>): Record<string, RayOutput> {
  const rays: Record<string, RayOutput> = {};
  for (const [id, score] of Object.entries(rayScores)) {
    rays[id] = {
      ray_id: id,
      ray_name: RAY_NAMES[id] ?? id,
      score,
      net_energy: score,
      eclipse_modifier: 'NONE',
      subfacets: {},
    };
  }
  return rays;
}

const CHART_ECLIPSE_PLACEHOLDER: EclipseOutput = {
  level: 'LOW',
  dimensions: {},
  derived_metrics: { recovery_access: 80, load_pressure: 20, bri: 0, eer: 0 },
  gating: { mode: 'STRETCH', reason: 'Portal preview' },
};

/* ── Main Component ── */

export default function PortalDashboard() {
  const [summary, setSummary] = useState<PortalSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [signalOpen, setSignalOpen] = useState<SignalModal>(null);
  const [signalPrefill, setSignalPrefill] = useState<SignalPrefill>({});
  const [celebration, setCelebration] = useState<CelebrationTrigger | null>(null);
  const streakCheckedRef = useRef(false);

  const loadSummary = useCallback(async () => {
    try {
      const res = await fetch('/api/portal/summary');
      if (res.ok) {
        const data = await res.json() as PortalSummary;
        setSummary(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  // Streak milestone celebration
  useEffect(() => {
    if (!summary || streakCheckedRef.current) return;
    streakCheckedRef.current = true;
    const milestone = streakMilestone(summary.streak_days);
    if (milestone) {
      setCelebration(milestone);
      if (milestone.haptic) haptic('strong');
    }
  }, [summary]);

  function onRepLogged() {
    void loadSummary();
  }

  function openWatchMe(target: string, move: string) {
    setSignalPrefill({ watchMe: { target, move } });
    setSignalOpen('watch_me');
  }

  function openGoFirst(action: string) {
    setSignalPrefill({ goFirst: { action } });
    setSignalOpen('go_first');
  }

  if (loading) {
    return (
      <>
        <TimezoneSync />
        <CosmicSkeleton rows={3} height="h-24" />
      </>
    );
  }

  const isHighEclipse = summary?.eclipse_level === 'high';

  // ─── HIGH ECLIPSE: grounding-focused layout ──────────────────────────────
  if (summary?.has_completed_run && isHighEclipse) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <SignOutButton />
        </div>

        <EclipseAnchorCard
          archetypeName={summary.archetype?.name ?? null}
          stressDistortion={summary.archetype?.stress_distortion ?? null}
          theLine={summary.archetype?.the_line ?? null}
          neonColor={summary.archetype?.neon_color ?? null}
          lastRunId={summary.last_run_id}
        />

        <SubscriptionBanner state={summary.subscription_state} gracePeriodEnd={summary.grace_period_end} />

        {summary.in_progress_run_id && (
          <ResumeBanner runId={summary.in_progress_run_id} answered={summary.in_progress_answered} total={summary.in_progress_total} />
        )}

        <PhaseCheckInClient />
        <DailyLoopClient />
        <EntryLogOverTime days={28} />

        <PatternInterruptHub
          onRepLogged={onRepLogged}
          bottomRayId={summary.bottom_ray_id}
          bottomRayName={summary.bottom_ray_name}
        />
        <QuickRepFAB />
        <MorningMirrorOverlay
          bottomRayId={summary.bottom_ray_id}
          bottomRayName={summary.bottom_ray_name}
          streakDays={summary.streak_days}
        />
      </div>
    );
  }

  // ─── NO COMPLETED RUN: onboarding ─────────────────────────────────────────
  if (!summary?.has_completed_run) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <SignOutButton />
        </div>

        <NoRunOnboardingCard
          inProgressRunId={summary?.in_progress_run_id ?? null}
          inProgressAnswered={summary?.in_progress_answered ?? 0}
          inProgressTotal={summary?.in_progress_total ?? 0}
        />

        {summary && <SubscriptionBanner state={summary.subscription_state} gracePeriodEnd={summary.grace_period_end} />}

        <PatternInterruptHub
          onRepLogged={onRepLogged}
          bottomRayId={summary?.bottom_ray_id ?? null}
          bottomRayName={summary?.bottom_ray_name ?? null}
        />
      </div>
    );
  }

  // ─── FULL DASHBOARD: story-driven, archetype-personalized ─────────────────
  const chartRays = summary.ray_scores ? buildChartRays(summary.ray_scores) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <SignOutButton />
      </div>

      <CelebrationToast
        message={celebration?.message ?? ''}
        show={!!celebration}
        duration={celebration?.duration ?? 2500}
        onDone={() => setCelebration(null)}
      />

      <SubscriptionBanner state={summary.subscription_state} gracePeriodEnd={summary.grace_period_end} />
      <StreakRecovery streakDays={summary.streak_days} totalReps={summary.total_reps} />

      {summary.in_progress_run_id && (
        <ResumeBanner runId={summary.in_progress_run_id} answered={summary.in_progress_answered} total={summary.in_progress_total} />
      )}

      {/* ── Section 1: Identity Anchor ── */}
      {summary.archetype ? (
        <FadeInSection delay={0.04}>
          <ArchetypeHeroCard
            name={summary.archetype.name}
            tagline={summary.archetype.tagline}
            identityCode={summary.archetype.identity_code}
            neonColor={summary.archetype.neon_color}
            rays={summary.archetype.rays}
            theLine={summary.archetype.the_line}
            eclipseLevel={summary.eclipse_level}
            streakDays={summary.streak_days}
            lastRunId={summary.last_run_id}
          />
        </FadeInSection>
      ) : (
        <FadeInSection delay={0.04}>
          <div className="panel-gradient-mid text-on-dark rounded-2xl p-7 space-y-2">
            <h2 className="text-shimmer text-xl font-semibold">Good to see you.</h2>
            {summary.last_run_id && (
              <Link
                href={`/results?run_id=${summary.last_run_id}`}
                className="inline-block text-xs underline underline-offset-2 hover:text-white transition-colors"
                style={{ color: 'var(--text-on-dark-secondary)' }}
              >
                Return to your report →
              </Link>
            )}
          </div>
        </FadeInSection>
      )}

      {/* ── Section 2: Energy Star Chart ── */}
      {chartRays && (
        <FadeInSection delay={0.08}>
          <div className="glass-card rounded-2xl p-4 overflow-hidden">
            <EnergyStarChart
              mode="preview"
              rays={chartRays}
              eclipse={CHART_ECLIPSE_PLACEHOLDER}
            />
            <div className="text-center mt-3">
              <Link
                href="/energy-star-chart"
                className="text-xs underline underline-offset-2 hover:text-white transition-colors"
                style={{ color: 'var(--text-on-dark-secondary)' }}
              >
                View full chart →
              </Link>
            </div>
          </div>
        </FadeInSection>
      )}

      {/* ── Section 3: Today's Coaching ── */}
      {summary.archetype && (
        <FadeInSection delay={0.12}>
          <ArchetypeCoachingCard
            archetypeName={summary.archetype.name}
            startingTools={summary.archetype.starting_tools}
            bottomRayName={summary.bottom_ray_name}
            onOpenWatchMe={openWatchMe}
            onOpenGoFirst={openGoFirst}
          />
        </FadeInSection>
      )}

      <FadeInSection delay={0.14}>
        <ContextualActions eclipseLevel={summary.eclipse_level} />
      </FadeInSection>

      {/* ── Section 4: Growth Signal ── */}
      <FadeInSection delay={0.16}>
        <GrowthSignalCard
          streakDays={summary.streak_days}
          repsThisWeek={summary.reps_this_week}
          totalReps={summary.total_reps}
          loopStreak={summary.loop_streak}
          reflectionStreak={summary.reflection_streak}
          mostPracticedTool={summary.most_practiced_tool}
          runNumber={summary.run_number}
        />
      </FadeInSection>

      <FadeInSection delay={0.18}>
        <BadgeShowcase
          streakDays={summary.streak_days}
          repsThisWeek={summary.reps_this_week}
          totalRuns={summary.run_number ?? 0}
          hasRetake={(summary.run_number ?? 0) >= 2}
          eclipseLevel={(summary.eclipse_level ?? '').toUpperCase()}
        />
      </FadeInSection>

      {/* ── Section 5: Deep Dive (progressive disclosure) ── */}
      <FadeInSection delay={0.2}>
        <EclipseCalendarHeatmap />
      </FadeInSection>

      <FadeInSection delay={0.22}>
        <EntryLogOverTime days={28} />
      </FadeInSection>

      <FadeInSection delay={0.24}>
        <RetakeInsights />
      </FadeInSection>

      {/* ── Section 6: Daily Practice ── */}
      <FadeInSection delay={0.26}>
        <DailyLoopClient />
      </FadeInSection>

      <FadeInSection delay={0.28}>
        <PhaseCheckInClient />
      </FadeInSection>

      {/* ── Section 7: Engagement ── */}
      <FadeInSection delay={0.3}>
        <InviteColleagueCard />
      </FadeInSection>

      <FadeInSection delay={0.32}>
        <NotificationToggle />
      </FadeInSection>

      {/* ── Persistent overlays ── */}
      <PatternInterruptHub
        onRepLogged={onRepLogged}
        bottomRayId={summary.bottom_ray_id}
        bottomRayName={summary.bottom_ray_name}
        openSignal={signalOpen}
        prefill={signalPrefill}
        onSignalHandled={() => setSignalOpen(null)}
      />
      <QuickRepFAB />
      <MorningMirrorOverlay
        bottomRayId={summary.bottom_ray_id}
        bottomRayName={summary.bottom_ray_name}
        streakDays={summary.streak_days}
      />
    </div>
  );
}
