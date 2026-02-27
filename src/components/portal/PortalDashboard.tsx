'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import TodaysRep from './TodaysRep';
import DailyStackCard from './DailyStackCard';
import QuickRepFAB from './QuickRepFAB';
import DailyLoopClient from '@/components/retention/DailyLoopClient';
import StreakFire, { StreakDimensions } from './StreakFire';
import PhaseCheckInClient from '@/components/retention/PhaseCheckInClient';
import CueBasedNudge from '@/components/retention/CueBasedNudge';
import ContextualActions from './ContextualActions';
import { RasPrimeCard } from '@/components/retention/RasPrimeCard';
import RasCheckIn from '@/components/retention/RasCheckIn';
import MicroWinsLedger from '@/components/retention/MicroWinsLedger';
import FearReframe from '@/components/retention/FearReframe';
import CoachQuestion from '@/components/retention/CoachQuestion';
import { FadeInSection } from '@/components/ui/FadeInSection';
import CosmicSkeleton from '@/components/ui/CosmicSkeleton';
import CosmicEmptyState from '@/components/ui/CosmicEmptyState';
import TimezoneSync from '@/components/TimezoneSync';
import NotificationToggle from './NotificationToggle';
import BadgeShowcase from './BadgeShowcase';
import WeeklyRepBreakdown from './WeeklyRepBreakdown';
import SignalPickerCard from './SignalPickerCard';
import RepReceiptCard from './RepReceiptCard';
import { RAY_NAMES } from '@/lib/types';
import { rayRamp } from '@/lib/ui/ray-colors';
import MorningMirrorOverlay from './MorningMirrorOverlay';
import EclipseCalendarHeatmap from './EclipseCalendarHeatmap';
import InviteColleagueCard from './InviteColleagueCard';
import JournalBrowser from '@/components/retention/JournalBrowser';
import ChallengeProgress from '@/components/retention/ChallengeProgress';

const PatternInterruptHub = dynamic(() => import('@/components/PatternInterruptHub'), { ssr: false });

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
}

type SignalModal = 'watch_me' | 'go_first' | 'i_rise' | null;
type SignalPrefill = {
  watchMe?: { target?: string | null; move?: string | null };
  goFirst?: { action?: string | null };
};

function ResumeBanner({ runId, answered, total }: { runId: string; answered: number; total: number }) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  return (
    <Link
      href={`/assessment?run_id=${encodeURIComponent(runId)}`}
      className="glass-card block p-5 transition-all hover:scale-[1.01]"
      style={{ borderColor: 'rgba(248, 208, 17, 0.4)' }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
        Continue Assessment
      </p>
      <p className="mt-1.5 text-sm font-medium" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
        You left off at question {answered}/{total}. Pick up where you stopped.
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
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
      border: 'rgba(248, 208, 17, 0.4)',
      label: 'Subscription Ending',
      labelColor: 'var(--brand-gold, #F8D011)',
      message: `Your subscription was canceled. You still have full access through ${graceDateLabel ?? 'your current period'}. Renew anytime to keep going.`,
    },
    expired: {
      border: 'rgba(251, 146, 60, 0.4)',
      label: 'Subscription Expired',
      labelColor: 'rgb(251, 146, 60)',
      message: 'Your subscription has ended. Your report and progress are still here. Renew to continue your coaching tools and retakes.',
    },
    past_due: {
      border: 'rgba(251, 146, 60, 0.4)',
      label: 'Payment Needs Attention',
      labelColor: 'rgb(251, 146, 60)',
      message: 'Your last payment didn\u2019t go through. Update your billing to continue your coaching without interruption.',
    },
  } as const;

  const c = config[state];

  return (
    <div
      className="glass-card p-5 space-y-3"
      style={{ borderColor: c.border }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: c.labelColor }}>
        {c.label}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.7))' }}>
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

function PriorityActions({ bottomRayName }: { bottomRayName?: string | null }) {
  return (
    <div className="glass-card p-5 space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
        Today
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Link
          href="/reps"
          className="flex items-center gap-3 rounded-xl p-3 transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(96, 5, 141, 0.2)', border: '1px solid rgba(148, 80, 200, 0.25)' }}
        >
          <span className="text-lg">⚡</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>Capture a moment</p>
            <p className="text-[11px]" style={{ color: 'var(--text-on-dark-muted)' }}>Log what you practiced</p>
          </div>
        </Link>
        <Link
          href="/watch-me"
          className="flex items-center gap-3 rounded-xl p-3 transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(96, 5, 141, 0.2)', border: '1px solid rgba(148, 80, 200, 0.25)' }}
        >
          <span className="text-lg">👁️</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>Take a small step</p>
            <p className="text-[11px]" style={{ color: 'var(--text-on-dark-muted)' }}>
              {bottomRayName ? `Training: ${bottomRayName}` : 'Watch Me / Go First'}
            </p>
          </div>
        </Link>
        <Link
          href="/reflect"
          className="flex items-center gap-3 rounded-xl p-3 transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(96, 5, 141, 0.2)', border: '1px solid rgba(148, 80, 200, 0.25)' }}
        >
          <span className="text-lg">✍️</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>Daily Debrief</p>
            <p className="text-[11px]" style={{ color: 'var(--text-on-dark-muted)' }}>What did you notice?</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

const WEEKLY_TARGET = 5; // reps per week

export default function PortalDashboard() {
  const [summary, setSummary] = useState<PortalSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRepLink, setShowRepLink] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [signalOpen, setSignalOpen] = useState<SignalModal>(null);
  const [signalPrefill, setSignalPrefill] = useState<SignalPrefill>({});
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (glowTimerRef.current) {
        clearTimeout(glowTimerRef.current);
      }
    };
  }, []);

  function onRepLogged() {
    void loadSummary();
    setShowRepLink(true);
    setShowGlow(true);
    if (glowTimerRef.current) {
      clearTimeout(glowTimerRef.current);
    }
    glowTimerRef.current = setTimeout(() => {
      setShowGlow(false);
      glowTimerRef.current = null;
    }, 5000);
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

  // ─── HIGH ECLIPSE: simple, grounding layout ───────────────────────────────
  if (summary?.has_completed_run && isHighEclipse) {
    return (
      <div className="space-y-6">
        <div className="text-on-dark rounded-2xl p-7 space-y-3" style={{ background: 'linear-gradient(to bottom right, var(--cosmic-deepest), var(--cosmic-purple-gradient))' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Welcome back.</h2>
            <SignOutButton />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            One thing. Right here. Start with this.
          </p>
        </div>

        {/* Subscription state banner */}
        <SubscriptionBanner state={summary.subscription_state} gracePeriodEnd={summary.grace_period_end} />

        {/* Resume banner for in-progress assessment */}
        {summary.in_progress_run_id && (
          <ResumeBanner
            runId={summary.in_progress_run_id}
            answered={summary.in_progress_answered}
            total={summary.in_progress_total}
          />
        )}

        {/* Priority Actions — Today */}
        <PriorityActions bottomRayName={summary.bottom_ray_name} />

        {/* Phase Check-In */}
        <PhaseCheckInClient />

        {/* Daily Loop — primary daily engagement */}
        <DailyLoopClient />

        {/* Presence Pause hardcoded for high Eclipse */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🌬️</span>
            <div>
              <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>Presence Pause</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>
                Feet on floor. One breath in. Longer breath out. Three things you can see, hear, or feel. That&apos;s it.
              </p>
              <p className="text-xs italic mt-2" style={{ color: 'var(--text-on-dark-muted)' }}>
                2 minutes. Nothing to solve right now.
              </p>
            </div>
          </div>
          <Link href="/reps" className="btn-primary block text-center">
            Log this rep
          </Link>
        </div>

        <p className="text-center text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
          <Link href={summary.last_run_id ? `/results?run_id=${summary.last_run_id}` : '/assessment/setup'} className="text-brand-gold underline underline-offset-2">
            When you&apos;re ready, your full plan is here →
          </Link>
        </p>

        <PatternInterruptHub
          onRepLogged={onRepLogged}
          bottomRayId={summary.bottom_ray_id}
          bottomRayName={summary.bottom_ray_name}
        />

        {/* Floating rep button */}
        <QuickRepFAB />

        {/* Morning Mirror — once-per-day opening ritual */}
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
        <div className="text-on-dark rounded-2xl p-7 space-y-3" style={{ background: 'linear-gradient(to bottom right, var(--cosmic-purple-gradient), var(--cosmic-purple-vivid))' }}>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-on-dark-muted)' }}>Your OS</p>
            <SignOutButton />
          </div>
          <h2 className="text-2xl font-bold">Let&apos;s find your signal.</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            The 143 Assessment maps your 9 leadership capacities — trainable states, not personality traits.
            143 questions. ~25 minutes. A result you can actually use.
          </p>
        </div>

        {/* Subscription state banner */}
        {summary && <SubscriptionBanner state={summary.subscription_state} gracePeriodEnd={summary.grace_period_end} />}

        {/* Priority Actions — Today */}
        <PriorityActions bottomRayName={summary?.bottom_ray_name ?? null} />

        {summary?.in_progress_run_id ? (
          <ResumeBanner
            runId={summary.in_progress_run_id}
            answered={summary.in_progress_answered}
            total={summary.in_progress_total}
          />
        ) : (
          <div className="glass-card p-6 space-y-4">
            <div className="space-y-2">
              {[
                { icon: '🎯', label: 'Your Light Signature — top 2 Rays' },
                { icon: '📈', label: 'Your training focus — Bottom Ray' },
                { icon: '⚡', label: 'Your Eclipse level — state awareness' },
                { icon: '🛠️', label: 'Your 30-day plan with specific tools' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{item.label}</p>
                </div>
              ))}
            </div>
            <Link href="/assessment/setup" className="btn-primary block text-center">
              Start your assessment →
            </Link>
          </div>
        )}

        <div className="glass-card p-5">
          <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2">Why REPs matter</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Every rep you log rewires your Reticular Activating System — training your brain to
            look for what you&apos;re practicing, not just what threatens it.
          </p>
          <Link href="/reps" className="text-xs text-brand-gold underline underline-offset-2 mt-2 block">
            Log a rep anyway →
          </Link>
        </div>

        <RasPrimeCard />

        <PatternInterruptHub
          onRepLogged={onRepLogged}
          bottomRayId={summary?.bottom_ray_id ?? null}
          bottomRayName={summary?.bottom_ray_name ?? null}
        />
      </div>
    );
  }

  // ─── FULL DASHBOARD: low/medium eclipse, completed run ────────────────────
  const progressPct = Math.min(
    Math.round((summary.reps_this_week / WEEKLY_TARGET) * 100),
    100,
  );

  return (
    <div className="space-y-6">

      {/* Welcome header */}
      <div className="text-on-dark rounded-2xl p-7 space-y-2" style={{ background: 'linear-gradient(to bottom right, var(--cosmic-purple-gradient), var(--cosmic-purple-vivid))' }}>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-on-dark-muted)' }}>
            Your OS
          </p>
          <SignOutButton />
        </div>
        <h2 className="text-xl font-semibold">
          Good to see you.
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
          {summary.streak_days > 0
            ? `${summary.streak_days} day${summary.streak_days !== 1 ? 's' : ''} in a row. Keep it going.`
            : 'Every rep counts. Start where you are.'}
        </p>
        {summary.last_run_id && (
          <Link
            href={`/results?run_id=${summary.last_run_id}`}
            className="inline-block mt-2 text-xs underline underline-offset-2 hover:text-white transition-colors"
            style={{ color: 'var(--text-on-dark-secondary)' }}
          >
            Return to your report →
          </Link>
        )}
      </div>

      {/* Subscription state banner */}
      <SubscriptionBanner state={summary.subscription_state} gracePeriodEnd={summary.grace_period_end} />

      {/* Resume banner for in-progress assessment */}
      {summary.in_progress_run_id && (
        <ResumeBanner
          runId={summary.in_progress_run_id}
          answered={summary.in_progress_answered}
          total={summary.in_progress_total}
        />
      )}

      {/* Priority Actions — Today */}
      <FadeInSection delay={0.04}>
        <PriorityActions bottomRayName={summary.bottom_ray_name} />
      </FadeInSection>

      {/* Signal Picker */}
      <FadeInSection delay={0.045}>
        <SignalPickerCard
          bottomRayId={summary.bottom_ray_id}
          bottomRayName={summary.bottom_ray_name}
          onOpenWatchMe={openWatchMe}
          onOpenGoFirst={openGoFirst}
        />
      </FadeInSection>

      {/* Daily Loop — primary daily engagement */}
      <FadeInSection delay={0.05}>
        <DailyLoopClient />
      </FadeInSection>

      {/* Phase Check-In */}
      <FadeInSection delay={0.1}>
        <PhaseCheckInClient />
      </FadeInSection>

      {/* Progress + Streak */}
      <FadeInSection delay={0.15}>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-secondary)' }}>This week</p>
              <p className="text-xs text-brand-gold font-semibold">
                {summary.reps_this_week}/{WEEKLY_TARGET}
              </p>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full bg-gradient-to-r from-brand-purple to-brand-gold rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
              {progressPct >= 100 ? 'Week complete' : `${WEEKLY_TARGET - summary.reps_this_week} more to hit target`}
            </p>
            <WeeklyRepBreakdown weeklyTarget={WEEKLY_TARGET} repsThisWeek={summary.reps_this_week} />
          </div>

          <div className="glass-card p-4 text-center space-y-1 flex flex-col items-center">
            <StreakFire days={summary.streak_days} />
            <p className="text-2xl font-bold text-brand-gold">
              {summary.streak_days > 0 ? summary.streak_days : '—'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>day streak</p>
            <StreakDimensions dimensions={[
              { label: 'Reps', days: summary.streak_days },
              { label: 'Loop', days: summary.loop_streak ?? 0 },
              { label: 'Reflect', days: summary.reflection_streak ?? 0 },
            ]} />
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>{summary.total_reps} total</p>
          </div>
        </div>
      </FadeInSection>

      {/* Eclipse Calendar Heatmap */}
      <FadeInSection delay={0.14}>
        <EclipseCalendarHeatmap />
      </FadeInSection>

      {/* Notification toggle */}
      <FadeInSection delay={0.16}>
        <NotificationToggle />
      </FadeInSection>

      {/* Badges */}
      <FadeInSection delay={0.18}>
        <BadgeShowcase
          streakDays={summary.streak_days}
          repsThisWeek={summary.reps_this_week}
          totalRuns={summary.run_number ?? 0}
          hasRetake={(summary.run_number ?? 0) >= 2}
          eclipseLevel={(summary.eclipse_level ?? '').toUpperCase()}
        />
      </FadeInSection>

      {/* Light Signature summary */}
      <FadeInSection delay={0.18}>
        {summary.top_ray_ids.length > 0 ? (
          <div className="glass-card p-4">
            <p className="text-xs text-brand-gold uppercase tracking-wider font-semibold mb-2">
              Your Light Signature
            </p>
            <div className="flex gap-2 flex-wrap">
              {summary.top_ray_ids.map((id) => {
                const ramp = rayRamp(id);
                return (
                  <span
                    key={id}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ background: ramp.badgeBg, color: ramp.full, border: `1px solid ${ramp.hoverBorder}` }}
                  >
                    {RAY_NAMES[id] ?? id}
                  </span>
                );
              })}
              {summary.bottom_ray_name && (() => {
                const ramp = rayRamp(summary.bottom_ray_id ?? summary.bottom_ray_name);
                const glowStyle = showGlow
                  ? {
                      boxShadow: '0 0 0 2px rgba(248, 208, 17, 0.6), 0 0 18px rgba(248, 208, 17, 0.35)',
                      borderColor: 'rgba(248, 208, 17, 0.8)',
                    }
                  : {};
                return (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${showGlow ? 'animate-pulse' : ''}`}
                    style={{ background: ramp.bgTint, color: ramp.full, border: `1px solid ${ramp.border}`, ...glowStyle }}
                  >
                    Training: {summary.bottom_ray_name}
                  </span>
                );
              })()}
            </div>
          </div>
        ) : (
          <CosmicEmptyState
            message="Your Light Signature is waiting."
            detail="Complete the assessment to reveal your top rays and training focus."
            actionLabel="View Your Report"
            actionHref={`/results?run_id=${summary.last_run_id ?? ''}`}
          />
        )}
      </FadeInSection>

      {/* Today's Rep */}
      <FadeInSection delay={0.2}>
        <TodaysRep
          bottomRayId={summary.bottom_ray_id}
          bottomRayName={summary.bottom_ray_name}
          eclipseLevel={summary.eclipse_level}
          onLogRep={() => {
            window.location.href = '/reps';
          }}
        />
      </FadeInSection>

      <FadeInSection delay={0.205}>
        <RepReceiptCard onLogged={onRepLogged} />
      </FadeInSection>

      <FadeInSection delay={0.22}>
        <DailyStackCard />
      </FadeInSection>

      <FadeInSection delay={0.24}>
        <RasPrimeCard />
      </FadeInSection>

      {/* RAS Check-In — morning attention focus */}
      <FadeInSection delay={0.25}>
        <RasCheckIn bottomRayId={summary.bottom_ray_id ?? undefined} />
      </FadeInSection>

      {/* Coach Question of the Day */}
      <FadeInSection delay={0.26}>
        <CoachQuestion bottomRayId={summary.bottom_ray_id ?? undefined} />
      </FadeInSection>

      {/* Evidence Board — micro-wins ledger */}
      <FadeInSection delay={0.27}>
        <MicroWinsLedger />
      </FadeInSection>

      {/* Fear Reframe — Eclipse-model reframe tool */}
      <FadeInSection delay={0.28}>
        <FearReframe />
      </FadeInSection>

      {/* Cue-Based Tool Nudges — matched to phase check-in */}
      <FadeInSection delay={0.29}>
        <CueBasedNudge />
      </FadeInSection>

      {/* 30-Day Challenge Progress */}
      <FadeInSection delay={0.3}>
        <ChallengeProgress />
      </FadeInSection>

      {/* Reflection Journal — past entries */}
      <FadeInSection delay={0.31}>
        <JournalBrowser />
      </FadeInSection>

      {/* Team Constellation — Invite a Colleague */}
      <FadeInSection delay={0.32}>
        <InviteColleagueCard />
      </FadeInSection>

      {/* Stretch nudge for streak ≥ 3 */}
      {summary.streak_days >= 3 && (
        <FadeInSection>
          <div className="glass-card p-4 flex items-start gap-3" style={{ borderColor: 'rgba(248, 208, 17, 0.3)' }}>
            <span className="text-xl">🌟</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {summary.streak_days} days. You&apos;re in it.
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                Stretch today: add a reflection note to your next rep. One sentence. What you noticed matters.
              </p>
            </div>
          </div>
        </FadeInSection>
      )}

      {/* Quick actions — contextual, time-aware */}
      <FadeInSection>
        <ContextualActions eclipseLevel={summary.eclipse_level} />
      </FadeInSection>

      {showRepLink && (
        <p className="text-center text-sm text-brand-gold">
          Rep logged ✓{' '}
          <Link href="/reps" className="underline underline-offset-2">
            See your history →
          </Link>
        </p>
      )}

      {/* Science framing for first-timers */}
      {summary.total_reps <= 3 && (
        <FadeInSection>
          <div className="glass-card p-5 space-y-2">
            <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider">How this portal works</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Your portal tracks your REPs — Recognition + Encouragement toward practice
              regardless of outcome. The more you show up, the more your nervous system learns it can.
            </p>
          </div>
        </FadeInSection>
      )}

      <PatternInterruptHub
        onRepLogged={onRepLogged}
        bottomRayId={summary.bottom_ray_id}
        bottomRayName={summary.bottom_ray_name}
        openSignal={signalOpen}
        prefill={signalPrefill}
        onSignalHandled={() => setSignalOpen(null)}
      />

      {/* Floating rep button */}
      <QuickRepFAB />

      {/* Morning Mirror — once-per-day opening ritual */}
      <MorningMirrorOverlay
        bottomRayId={summary.bottom_ray_id}
        bottomRayName={summary.bottom_ray_name}
        streakDays={summary.streak_days}
      />
    </div>
  );
}
