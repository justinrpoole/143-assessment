'use client';

import IlluminateDashboard from '@/components/cosmic/IlluminateDashboard';
import StarChart from '@/components/portal/StarChart';
import { useState, useEffect, useCallback, type FormEvent } from 'react';
import Link from 'next/link';
import RetroFrame from '@/components/ui/RetroFrame';
import { FadeInSection } from '@/components/ui/FadeInSection';
import '@/app/(portal)/light-dashboard/dashboard.css';

// ── Constants ──

// Rays 1-8: Trainable leadership capacities displayed as track sliders
const RAY_META = [
  { id: 'R1', label: 'Intention', phase: 'Reconnect' },
  { id: 'R2', label: 'Joy', phase: 'Reconnect' },
  { id: 'R3', label: 'Presence', phase: 'Reconnect' },
  { id: 'R4', label: 'Power', phase: 'Radiate' },
  { id: 'R5', label: 'Purpose', phase: 'Radiate' },
  { id: 'R6', label: 'Authenticity', phase: 'Radiate' },
  { id: 'R7', label: 'Connection', phase: 'Become' },
  { id: 'R8', label: 'Possibility', phase: 'Become' },
  // Ray 9 (Be The Light) is NOT in this array — it's a STATE, not a trainable ray.
  // It's displayed separately as the Radiance Indicator (see below).
] as const;

// Ray 9 is the overflow state — evidence that Rays 1-8 are aligned.
// Displayed as a separate "Radiance Indicator" rather than a regular track slider.
const RADIANCE_META = { id: 'R9', label: 'Be The Light', phase: 'Radiance' } as const;

const CONTRACTIONS = [
  { value: 'control', label: 'I do not have control', reframe: 'Not control. Range.', line: 'Name it. I do not have control. Then reframe: I can choose range.' },
  { value: 'seen', label: 'I do not want to be seen', reframe: 'Not exposure. Witness.', line: 'Name it. I do not want to be seen. Then reframe: I choose witness.' },
  { value: 'alone', label: 'I am carrying it alone', reframe: 'Not alone. In orbit.', line: 'Name it. I am carrying it alone. Then reframe: I am in orbit with support.' },
  { value: 'behind', label: 'I am behind and tight', reframe: 'Not behind. In repair.', line: 'Name it. I am behind and tight. Then reframe: I am in repair.' },
] as const;

const BODY_SIGNALS = [
  { value: 'chest', label: 'Tight chest', rep: 'Stand. Open your chest. 6 slow breaths. Exhale longer than inhale.' },
  { value: 'breath', label: 'Shallow breath', rep: 'Breathe in for 4, hold for 2, out for 6. Repeat 6 rounds.' },
  { value: 'heavy', label: 'Heavy limbs', rep: 'Shake out your arms and legs for 60 seconds. No story. Just movement.' },
  { value: 'spin', label: 'Spinning thoughts', rep: 'Look at a fixed point. Name 5 things you see. Let the system land.' },
] as const;

const NEEDS = [
  { value: 'movement', label: 'Movement', rep: 'Do 20 slow squats or a 90 second walk. Get blood to the front brain.' },
  { value: 'clarity', label: 'Clarity', rep: 'Write 3 lines: what is true, what is needed, what is next.' },
  { value: 'contact', label: 'Contact', rep: 'Send a two line text. I am in it. I am moving. That is enough.' },
  { value: 'structure', label: 'Structure', rep: 'Set a 6 minute timer. One task. One rep. Then stop.' },
] as const;

// ── Types ──

interface PortalSummary {
  has_completed_run: boolean;
  last_run_id: string | null;
  reps_this_week: number;
  streak_days: number;
  total_reps: number;
  bottom_ray_name: string | null;
  eclipse_level: "low" | "medium" | "high" | null;
}

interface ResultsData {
  ray_scores: Record<string, number>;
  top_rays: string[];
}

type PanelMode = 'watch' | 'go' | 'reps' | null;
type PanelStep = 'questions' | 'prompt';

interface CoachingAnswers {
  contraction: string;
  body: string;
  need: string;
}

interface CoachingPrompt {
  header: string;
  steps: string[];
}

// ── Helpers ──

function formatWeekLabel(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  return `Week of ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

function computeInsight(avg: number): string {
  if (avg >= 80) return 'You are close to the west edge. Radiance is rising. Keep the reps steady.';
  if (avg >= 65) return 'Not gone. Covered. The light responds to clean reps, not hype.';
  if (avg >= 50) return 'The light is still there. Start with one rep and let the system move.';
  return 'Eclipse is active. That is data, not a verdict. One rep changes the trajectory.';
}

function buildPrompt(mode: PanelMode, answers: CoachingAnswers): CoachingPrompt {
  const contraction = CONTRACTIONS.find((c) => c.value === answers.contraction) ?? CONTRACTIONS[0];
  const body = BODY_SIGNALS.find((b) => b.value === answers.body) ?? BODY_SIGNALS[0];
  const need = NEEDS.find((n) => n.value === answers.need) ?? NEEDS[0];

  const header = mode === 'watch'
    ? `Watch Me: ${contraction.reframe}`
    : `Go First: ${contraction.reframe}`;

  return {
    header,
    steps: [
      contraction.line,
      body.rep,
      need.rep,
      'Do it now. The prefrontal cortex comes back online when physiology shifts.',
    ],
  };
}

// ── Component ──

export default function LightDashboardClient() {
  const [loading, setLoading] = useState(true);
  const [rayScores, setRayScores] = useState<Record<string, number>>({});
  const [topRays, setTopRays] = useState<string[]>([]);
  const [repsToday, setRepsToday] = useState(0);
  const [repsThisWeek, setRepsThisWeek] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const [lastRunId, setLastRunId] = useState<string | null>(null);
  const [bottomRayName, setBottomRayName] = useState<string | null>(null);
  const [eclipseLevel, setEclipseLevel] = useState<string | null>(null);

  // Coaching panel state
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [panelStep, setPanelStep] = useState<PanelStep>('questions');
  const [answers, setAnswers] = useState<CoachingAnswers>({ contraction: 'control', body: 'chest', need: 'movement' });
  const [prompt, setPrompt] = useState<CoachingPrompt | null>(null);

  // Rep logging
  const [repNote, setRepNote] = useState('');
  const [recentReps, setRecentReps] = useState<Array<{ ts: string; note: string }>>([]);
  const [repLogging, setRepLogging] = useState(false);

  // ── Data Fetching ──

  const fetchData = useCallback(async () => {
    try {
      const summaryRes = await fetch('/api/portal/summary');
      if (!summaryRes.ok) return;
      const summary: PortalSummary = await summaryRes.json();

      setHasRun(summary.has_completed_run);
      setRepsThisWeek(summary.reps_this_week);
      setStreakDays(summary.streak_days);
      setLastRunId(summary.last_run_id ?? null);
      setBottomRayName(summary.bottom_ray_name ?? null);
      setEclipseLevel(summary.eclipse_level ?? null);

      if (summary.has_completed_run && summary.last_run_id) {
        const resultsRes = await fetch(`/api/runs/${summary.last_run_id}/results`);
        if (resultsRes.ok) {
          const results: ResultsData = await resultsRes.json();
          setRayScores(results.ray_scores ?? {});
          setTopRays(results.top_rays ?? []);
        }
      }

      // Fetch recent reps for today count
      const repsRes = await fetch('/api/reps?limit=20');
      if (repsRes.ok) {
        const { reps } = await repsRes.json() as { reps: Array<{ logged_at: string; reflection_note: string | null; tool_name: string }> };
        const today = new Date().toDateString();
        const todayCount = reps.filter((r) => new Date(r.logged_at).toDateString() === today).length;
        setRepsToday(todayCount);
        setRecentReps(
          reps.slice(0, 5).map((r) => ({
            ts: r.logged_at,
            note: r.reflection_note ?? r.tool_name.replace(/_/g, ' '),
          })),
        );
      }
    } catch {
      // Fail silently — dashboard degrades gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // ── Panel Handlers ──

  function openPanel(mode: PanelMode) {
    setPanelMode(mode);
    setPanelStep('questions');
    setPrompt(null);
    setAnswers({ contraction: 'control', body: 'chest', need: 'movement' });
  }

  function closePanel() {
    setPanelMode(null);
    setPanelStep('questions');
    setPrompt(null);
  }

  function handleQuestionSubmit(e: FormEvent) {
    e.preventDefault();
    const result = buildPrompt(panelMode, answers);
    setPrompt(result);
    setPanelStep('prompt');
  }

  async function handleRepDone() {
    if (repLogging) return;
    setRepLogging(true);
    const toolName = panelMode === 'watch' ? 'watch_me' : 'go_first';
    const triggerType = panelMode === 'watch' ? 'watch_me' : 'go_first';
    try {
      await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_name: toolName,
          trigger_type: triggerType,
          reflection_note: prompt?.header ?? 'Rep completed',
        }),
      });
      setRepsToday((p) => p + 1);
      setRepsThisWeek((p) => p + 1);
      closePanel();
    } catch {
      // Fail silently
    } finally {
      setRepLogging(false);
    }
  }

  async function handleManualRep() {
    if (repLogging || !repNote.trim()) return;
    setRepLogging(true);
    try {
      await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_name: 'full_reps',
          trigger_type: 'ad_hoc',
          reflection_note: repNote.trim(),
        }),
      });
      setRepsToday((p) => p + 1);
      setRepsThisWeek((p) => p + 1);
      setRecentReps((prev) => [
        { ts: new Date().toISOString(), note: repNote.trim() },
        ...prev.slice(0, 4),
      ]);
      setRepNote('');
    } catch {
      // Fail silently
    } finally {
      setRepLogging(false);
    }
  }

  // ── Derived Values ──

  const scores = RAY_META.map((ray) => ({
    ...ray,
    score: rayScores[ray.id] ?? 0,
  }));

  const avg = scores.length > 0
    ? Math.round(scores.reduce((sum, r) => sum + r.score, 0) / scores.length)
    : 0;

  const insightText = computeInsight(avg);
  const topTwoLabels = topRays.slice(0, 2).map((rayId) => {
    const meta = RAY_META.find((r) => r.id === rayId) ?? (rayId === 'R9' ? RADIANCE_META : null);
    return meta?.label ?? rayId;
  });
  const topTwoLine = topTwoLabels.length === 2 ? `${topTwoLabels[0]} + ${topTwoLabels[1]}` : '—';

  // ── Loading State ──

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card animate-pulse rounded-xl"
            style={{ height: i === 2 ? 320 : 120 }}
          />
        ))}
      </div>
    );
  }

  // ── No Assessment State ──

  if (!hasRun) {
    return (
    <RetroFrame label="LIGHT DASHBOARD" accent="var(--brand-gold)">
        <div className="py-12 text-center space-y-4">
          <h2 className="ld-heading text-xl" style={{ color: 'var(--text-on-dark)' }}>
            No light data yet
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Complete the assessment to see your nine rays mapped east to west. The dashboard responds to what you build.
          </p>
          <Link href="/assessment" className="btn-primary inline-block mt-4">
            Take the Assessment
          </Link>
        </div>
      </RetroFrame>
    );
  }

  // ── Main Dashboard ──

  // Map scores from portal data format to R1-R9
  const illuminateScores: Partial<Record<string,number>> = {};
  scores.forEach((s: { id: string; score: number }) => { illuminateScores[s.id] = s.score ?? 0; });

  return (
    <div className="space-y-6">
      {/* ── Illuminate Dashboard v2 ── */}
      <IlluminateDashboard
        scores={illuminateScores}
        eclipseLevel={eclipseLevel === 'high' ? 70 : eclipseLevel === 'medium' ? 40 : eclipseLevel === 'low' ? 20 : 0}
        phase={
          (illuminateScores['R9'] ?? 0) >= 70 ? 'RADIANT' :
          (illuminateScores['R9'] ?? 0) >= 40 ? 'DAWN' : 'ECLIPSE'
        }
        repsToday={repsToday ?? 0}
        className="mb-8"
      />

      <FadeInSection delay={0.02}>
        <StarChart />
      </FadeInSection>
      {/* Hero Header */}
      <FadeInSection>
        <div className="flex flex-wrap gap-6 items-end justify-between">
          <div>
            <p className="ld-kicker">143 Leadership</p>
            <h1 className="ld-heading text-2xl sm:text-3xl mt-2" style={{ color: 'var(--text-on-dark)' }}>
              Light Dashboard
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
              Your daily home for clarity, reps, and range. Start here.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="ld-score-ring" style={{ '--avg': avg } as React.CSSProperties}>
              <div className="ld-score-value">{avg}</div>
              <div className="ld-score-label">Average</div>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
              {formatWeekLabel()}
            </p>
          </div>
        </div>
      </FadeInSection>

      {/* Start Here */}
      <FadeInSection delay={0.05}>
        <RetroFrame label="START HERE" accent="var(--brand-gold)">
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              This is your weekly anchor. Start with your Top Two, then train the next skill. One rep changes the range.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-4">
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>Top Two</p>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark)' }}>{topTwoLine}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>Eclipse</p>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark)' }}>
                  {eclipseLevel ? `${eclipseLevel.charAt(0).toUpperCase()}${eclipseLevel.slice(1)}` : 'Unknown'}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>Next Skill</p>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark)' }}>{bottomRayName ?? 'See report'}</p>
              </div>
            </div>
            {lastRunId && (
              <div className="flex flex-wrap gap-3">
                <Link href={`/results?run_id=${encodeURIComponent(lastRunId)}`} className="ld-action-btn secondary">
                  Open Interactive Report
                </Link>
                <Link href={`/reports?run_id=${encodeURIComponent(lastRunId)}`} className="ld-action-btn primary">
                  Download Full Report
                </Link>
              </div>
            )}
          </div>
        </RetroFrame>
      </FadeInSection>

      {/* Action Buttons */}
      <FadeInSection delay={0.1}>
        <div className="glass-card p-5 flex flex-wrap items-center gap-4">
          <button type="button" className="ld-action-btn primary" onClick={() => openPanel('watch')}>
            Watch Me
          </button>
          <button type="button" className="ld-action-btn secondary" onClick={() => openPanel('go')}>
            Go First
          </button>
          <button type="button" className="ld-action-btn ghost" onClick={() => openPanel('reps')}>
            Log Reps
          </button>
          <div className="ml-auto flex flex-col items-end gap-0.5 px-3 py-2 rounded-lg" style={{ background: 'rgba(10, 5, 28, 0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="ld-reps-count">{repsToday}</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
              Reps today
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Insight Card */}
      <FadeInSection delay={0.2}>
        <div className="glass-card p-5" style={{ borderColor: 'rgba(96, 5, 141, 0.35)' }}>
          <div className="ld-insight-label">This week</div>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark)' }}>
            {insightText}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            <span>{repsThisWeek} reps this week</span>
            <span>·</span>
            <span>{streakDays} day streak</span>
          </div>
        </div>
      </FadeInSection>

      {/* Ray Tracks */}
      <FadeInSection delay={0.25}>
        <RetroFrame label="NINE RAYS OF LIGHT" accent="var(--brand-gold)">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
              The farther west, the more you radiate. The light is still there.
            </p>
            <div className="hidden sm:flex gap-3 text-xs uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
              <span>East</span>
              <span>West</span>
            </div>
          </div>

          <div className="space-y-1">
            {scores.map((ray, idx) => {
              const prevPhase = idx > 0 ? scores[idx - 1].phase : null;
              const showDivider = ray.phase !== prevPhase;
              const power = Math.min(Math.max(ray.score / 100, 0), 1);
              const isTop = topRays.includes(ray.id);

              return (
                <div key={ray.id}>
                  {showDivider && (
    <div className="ld-phase-divider mt-3 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
                        {ray.phase}
                      </span>
                    </div>
                  )}
                  <div
                    className="ld-ray-row grid items-center gap-4 py-1.5"
                    style={{ gridTemplateColumns: 'minmax(120px, 180px) 1fr minmax(50px, 70px)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wide" style={{ color: isTop ? 'var(--brand-gold)' : 'var(--text-on-dark-muted)' }}>
                        {ray.label}
                      </span>
                      {isTop && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wide" style={{ background: 'rgba(248,208,17,0.15)', color: 'var(--brand-gold)' }}>
                          top
                        </span>
                      )}
                    </div>
                    <div className="ld-ray-track">
                      <div
                        className="ld-ray-star"
                        style={{ '--score': ray.score, '--power': power } as React.CSSProperties}
                      />
                    </div>
                    <div className="ld-ray-score text-right">{ray.score}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </RetroFrame>
      </FadeInSection>

      {/* Quick Nav */}
      <FadeInSection delay={0.3}>
        <div className="flex flex-wrap gap-3">
          <Link href="/portal" className="glass-card px-4 py-3 text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Portal
          </Link>
          {lastRunId ? (
            <Link href={`/results?run_id=${encodeURIComponent(lastRunId)}`} className="glass-card px-4 py-3 text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Open Report
            </Link>
          ) : (
            <Link href="/results" className="glass-card px-4 py-3 text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Open Report
            </Link>
          )}
          <Link href="/reps" className="glass-card px-4 py-3 text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Rep History
          </Link>
        </div>
      </FadeInSection>

      {/* ── Coaching Panel Overlay ── */}
      {panelMode && (
        <div
          className="ld-panel-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closePanel(); }}
          role="dialog"
          aria-modal="true"
          aria-label={panelMode === 'reps' ? 'Log a rep' : `${panelMode === 'watch' ? 'Watch Me' : 'Go First'} coaching`}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(10, 5, 28, 0.96), rgba(15, 8, 35, 0.94))',
              border: '1px solid rgba(248, 208, 17, 0.25)',
              boxShadow: '0 0 40px rgba(248, 208, 17, 0.12)',
            }}
          >
            {/* Panel Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="ld-kicker text-xs">
                  {panelMode === 'reps' ? 'Reps' : panelMode === 'watch' ? 'Watch Me' : 'Go First'}
                </div>
                <h3 className="ld-heading text-lg mt-1" style={{ color: 'var(--text-on-dark)' }}>
                  {panelMode === 'reps' ? 'Log the rep' : 'Find the contraction underneath'}
                </h3>
              </div>
              <button type="button" className="ld-action-btn ghost text-xs py-2 px-3" onClick={closePanel}>
                Close
              </button>
            </div>

            {/* Panel Body */}
            {panelMode === 'reps' ? (
              <div className="space-y-5">
                <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
                  Log the rep. Build the range. The light responds.
                </p>
                <div>
                  <label htmlFor="rep-note" className="block text-sm mb-2" style={{ color: 'var(--text-on-dark-secondary)' }}>
                    What did you do?
                  </label>
                  <textarea
                    id="rep-note"
                    rows={3}
                    value={repNote}
                    onChange={(e) => setRepNote(e.target.value)}
                    placeholder="One line. Name the rep."
                    className="w-full rounded-lg px-3 py-2.5 text-sm resize-none"
                    style={{
                      background: 'rgba(10, 5, 28, 0.8)',
                      border: '1px solid rgba(248, 208, 17, 0.2)',
                      color: 'var(--text-on-dark)',
                    }}
                  />
                  <button
                    type="button"
                    className="ld-action-btn primary w-full mt-3"
                    onClick={() => void handleManualRep()}
                    disabled={repLogging || !repNote.trim()}
                  >
                    {repLogging ? 'Logging...' : 'Add Rep'}
                  </button>
                </div>
                {recentReps.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-on-dark-muted)' }}>
                      Latest reps
                    </p>
                    <ul className="space-y-1.5">
                      {recentReps.map((rep, i) => (
                        <li
                          key={i}
                          className="text-xs px-3 py-2 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-on-dark-muted)' }}
                        >
                          {new Date(rep.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} — {rep.note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : panelStep === 'questions' ? (
              <form onSubmit={handleQuestionSubmit} className="space-y-5">
                {/* Q1: Contraction */}
                <div>
                  <p className="ld-kicker text-[10px] mb-2">The contraction underneath</p>
                  <div className="ld-choices">
                    {CONTRACTIONS.map((c) => (
                      <label key={c.value} className="ld-choice-label">
                        <input
                          type="radio"
                          name="contraction"
                          value={c.value}
                          checked={answers.contraction === c.value}
                          onChange={(e) => setAnswers((a) => ({ ...a, contraction: e.target.value }))}
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q2: Body signal */}
                <div>
                  <p className="ld-kicker text-[10px] mb-2">Body signal right now</p>
                  <div className="ld-choices">
                    {BODY_SIGNALS.map((b) => (
                      <label key={b.value} className="ld-choice-label">
                        <input
                          type="radio"
                          name="body"
                          value={b.value}
                          checked={answers.body === b.value}
                          onChange={(e) => setAnswers((a) => ({ ...a, body: e.target.value }))}
                        />
                        {b.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q3: Need */}
                <div>
                  <p className="ld-kicker text-[10px] mb-2">What you need in 5 minutes</p>
                  <div className="ld-choices">
                    {NEEDS.map((n) => (
                      <label key={n.value} className="ld-choice-label">
                        <input
                          type="radio"
                          name="need"
                          value={n.value}
                          checked={answers.need === n.value}
                          onChange={(e) => setAnswers((a) => ({ ...a, need: e.target.value }))}
                        />
                        {n.label}
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="ld-action-btn primary w-full">
                  Get Coaching Prompt
                </button>
              </form>
            ) : prompt ? (
              <div className="space-y-4">
                <div className="ld-prompt-header">{prompt.header}</div>
                <ul className="space-y-3">
                  {prompt.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-on-dark)' }}>
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold" style={{ background: 'rgba(248,208,17,0.15)', color: 'var(--brand-gold)' }}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="ld-action-btn secondary w-full mt-2"
                  onClick={() => void handleRepDone()}
                  disabled={repLogging}
                >
                  {repLogging ? 'Logging...' : 'I Did The Rep'}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
