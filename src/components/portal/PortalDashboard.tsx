'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import TodaysRep from './TodaysRep';
import DailyStackCard from './DailyStackCard';
import QuickRepFAB from './QuickRepFAB';
import DailyLoopClient from '@/components/retention/DailyLoopClient';
import StreakFire, { StreakDimensions, StreakFireAccent } from './StreakFire';
import PhaseCheckInClient from '@/components/retention/PhaseCheckInClient';
import CueBasedNudge from '@/components/retention/CueBasedNudge';
import StreakRecovery from '@/components/retention/StreakRecovery';
import WeeklyGoalRing from '@/components/retention/WeeklyGoalRing';
import CelebrationToast from '@/components/ui/CelebrationToast';
import { streakMilestone, type CelebrationTrigger } from '@/lib/celebrations/triggers';
import { portalWelcome } from '@/lib/identity/identity-messages';
import { haptic } from '@/lib/haptics';
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
import RaySwitchboardCard from './RaySwitchboardCard';
import RetroBootSequence from './RetroBootSequence';
import { RAY_NAMES } from '@/lib/types';
import { rayRamp } from '@/lib/ui/ray-colors';
import MorningMirrorOverlay from './MorningMirrorOverlay';
import EclipseCalendarHeatmap from './EclipseCalendarHeatmap';
import InviteColleagueCard from './InviteColleagueCard';
import JournalBrowser from '@/components/retention/JournalBrowser';
import ChallengeProgress from '@/components/retention/ChallengeProgress';
import EntryLogOverTime from './EntryLogOverTime';
import RetakeInsights from './RetakeInsights';
import ActivityStream from './ActivityStream';
import SocialProofBadge from './SocialProofBadge';

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
      <p className="gold-underline text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
        Today
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Link
          href="/reps"
          className="neon-border-hover flex items-center gap-3 rounded-xl p-3 transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(96, 5, 141, 0.2)', border: '1px solid rgba(148, 80, 200, 0.25)' }}
        >
          <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(248, 208, 17, 0.15)' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#F8D011' }} />
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>Capture a moment</p>
            <p className="text-[11px]" style={{ color: 'var(--text-on-dark-muted)' }}>Log what you practiced</p>
          </div>
        </Link>
        <Link
          href="/watch-me"
          className="neon-border-hover flex items-center gap-3 rounded-xl p-3 transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(96, 5, 141, 0.2)', border: '1px solid rgba(148, 80, 200, 0.25)' }}
        >
          <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(139, 91, 255, 0.15)' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#8b5bff' }} />
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>Take a small step</p>
            <p className="text-[11px]" style={{ color: 'var(--text-on-dark-muted)' }}>
              {bottomRayName ? `Training: ${bottomRayName}` : 'Watch Me / Go First'}
            </p>
          </div>
        </Link>
        <Link
          href="/reflect"
          className="neon-border-hover flex items-center gap-3 rounded-xl p-3 transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(96, 5, 141, 0.2)', border: '1px solid rgba(148, 80, 200, 0.25)' }}
        >
          <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(46, 204, 113, 0.15)' }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#2ECC71' }} />
          </span>
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

const TOOL_ACCENTS: Record<string, StreakFireAccent> = {
  '90_second_window': {
    base: '#F59E0B',
    mid: '#F8D011',
    tip: '#FDE68A',
    core: '#FFFBEB',
    glow: 'rgba(245, 158, 11, 0.55)',
  },
  presence_pause: {
    base: '#7C3AED',
    mid: '#A78BFA',
    tip: '#DDD6FE',
    core: '#F5F3FF',
    glow: 'rgba(167, 139, 250, 0.55)',
  },
  watch_me: {
    base: '#E89D0C',
    mid: '#F8D011',
    tip: '#FFEC80',
    core: '#FFFEF5',
    glow: 'rgba(248, 208, 17, 0.6)',
  },
  go_first: {
    base: '#EA580C',
    mid: '#FB923C',
    tip: '#FED7AA',
    core: '#FFF7ED',
    glow: 'rgba(251, 146, 60, 0.6)',
  },
  i_rise: {
    base: '#0284C7',
    mid: '#38BDF8',
    tip: '#BAE6FD',
    core: '#F0F9FF',
    glow: 'rgba(56, 189, 248, 0.55)',
  },
  reflection_loop: {
    base: '#0F766E',
    mid: '#2DD4BF',
    tip: '#99F6E4',
    core: '#F0FDFA',
    glow: 'rgba(45, 212, 191, 0.55)',
  },
  if_then_planning: {
    base: '#059669',
    mid: '#34D399',
    tip: '#A7F3D0',
    core: '#ECFDF5',
    glow: 'rgba(52, 211, 153, 0.55)',
  },
  boundary_of_light: {
    base: '#DB2777',
    mid: '#F472B6',
    tip: '#FBCFE8',
    core: '#FFF1F2',
    glow: 'rgba(244, 114, 182, 0.55)',
  },
  ras_reset: {
    base: '#2563EB',
    mid: '#60A5FA',
    tip: '#BFDBFE',
    core: '#EFF6FF',
    glow: 'rgba(96, 165, 250, 0.55)',
  },
  question_loop: {
    base: '#7C3AED',
    mid: '#C084FC',
    tip: '#E9D5FF',
    core: '#F5F3FF',
    glow: 'rgba(192, 132, 252, 0.55)',
  },
  witness: {
    base: '#4F46E5',
    mid: '#818CF8',
    tip: '#C7D2FE',
    core: '#EEF2FF',
    glow: 'rgba(129, 140, 248, 0.55)',
  },
  '143_challenge': {
    base: '#B45309',
    mid: '#F59E0B',
    tip: '#FDE68A',
    core: '#FFFBEB',
    glow: 'rgba(245, 158, 11, 0.6)',
  },
  let_them: {
    base: '#BE123C',
    mid: '#FB7185',
    tip: '#FBCFE8',
    core: '#FFF1F2',
    glow: 'rgba(251, 113, 133, 0.55)',
  },
};

export default function PortalDashboard() {
  const [summary, setSummary] = useState<PortalSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRepLink, setShowRepLink] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [signalOpen, setSignalOpen] = useState<SignalModal>(null);
  const [signalPrefill, setSignalPrefill] = useState<SignalPrefill>({});
  const [celebration, setCelebration] = useState<CelebrationTrigger | null>(null);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Streak milestone celebration — fires once per page load
  useEffect(() => {
    if (!summary || streakCheckedRef.current) return;
    streakCheckedRef.current = true;
    const milestone = streakMilestone(summary.streak_days);
    if (milestone) {
      setCelebration(milestone);
      if (milestone.haptic) haptic('strong');
    }
  }, [summary]);

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
  const streakAccent = summary?.most_practiced_tool ? TOOL_ACCENTS[summary.most_practiced_tool] : undefined;

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

        {/* Entry + Log Momentum */}
        <EntryLogOverTime days={28} />

        <RetakeInsights />

        <ActivityStream />

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

        <EntryLogOverTime days={28} />

        <RetakeInsights />

        <ActivityStream />

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

      <CelebrationToast
        message={celebration?.message ?? ''}
        show={!!celebration}
        duration={celebration?.duration ?? 2500}
        onDone={() => setCelebration(null)}
      />

      {/* Welcome header — identity-based language */}
      <div className="text-on-dark rounded-2xl p-7 space-y-2" style={{ background: 'linear-gradient(to bottom right, var(--cosmic-purple-gradient), var(--cosmic-purple-vivid))' }}>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-on-dark-muted)' }}>
            Your OS
          </p>
          <SignOutButton />
        </div>
        <h2 className="text-shimmer text-xl font-semibold">
          Good to see you.
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
          {portalWelcome(summary.streak_days)}
        </p>
        <SocialProofBadge />
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

      {/* Streak recovery — warm comeback when streak lost */}
      <StreakRecovery streakDays={summary.streak_days} totalReps={summary.total_reps} />

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
            <div className="flex items-center gap-3">
              <WeeklyGoalRing current={summary.reps_this_week} target={WEEKLY_TARGET} />
              <div className="flex-1 space-y-1.5">
                <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-secondary)' }}>Weekly reps</p>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div
                    className="h-full bg-gradient-to-r from-brand-purple to-brand-gold rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {progressPct >= 100 ? 'Week complete' : `${WEEKLY_TARGET - summary.reps_this_week} more to hit target`}
                </p>
              </div>
            </div>
            <WeeklyRepBreakdown weeklyTarget={WEEKLY_TARGET} repsThisWeek={summary.reps_this_week} />
          </div>

          <div className="glass-card p-4 text-center space-y-1 flex flex-col items-center">
            <StreakFire days={summary.streak_days} accent={streakAccent} />
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

      {/* Entry over Entry + Log over Log + Retake cadence */}
      <FadeInSection delay={0.155}>
        <EntryLogOverTime days={28} />
      </FadeInSection>

      <FadeInSection delay={0.158}>
        <RetakeInsights />
      </FadeInSection>

      <FadeInSection delay={0.16}>
        <ActivityStream />
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

      <FadeInSection delay={0.19}>
        <RaySwitchboardCard
          bottomRayId={summary.bottom_ray_id}
          topRayIds={summary.top_ray_ids}
          onOpenWatchMe={openWatchMe}
          onOpenGoFirst={openGoFirst}
        />
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

      <RetroBootSequence trainingRayName={summary.bottom_ray_name} />

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
