'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FadeInSection } from '@/components/ui/FadeInSection';
import type { EclipseOutput } from '@/lib/types';

const EclipseMeter = dynamic(() => import('@/components/cosmic/EclipseMeter'), { ssr: false });

// ── Scenario Data ──────────────────────────────────────────────
interface Scenario {
  phase: string;
  phaseLabel: string;
  rayId: string;
  rayName: string;
  prompt: string;
  lowLabel: string;
  highLabel: string;
}

const SCENARIOS: Scenario[] = [
  {
    phase: 'RECONNECT',
    phaseLabel: 'Phase 1 — Reconnect',
    rayId: 'R3',
    rayName: 'Presence',
    prompt: "You're in a meeting and realize you haven't heard the last two minutes.",
    lowLabel: 'Rarely',
    highLabel: 'Almost always',
  },
  {
    phase: 'RADIATE',
    phaseLabel: 'Phase 2 — Radiate',
    rayId: 'R4',
    rayName: 'Power',
    prompt: 'Someone pushes back on your idea in front of the team.',
    lowLabel: 'I hold steady',
    highLabel: 'I shut down',
  },
  {
    phase: 'BECOME',
    phaseLabel: 'Phase 3 — Become',
    rayId: 'R7',
    rayName: 'Connection',
    prompt: "A colleague shares something personal and you're not sure what to say.",
    lowLabel: 'I lean in',
    highLabel: 'I deflect',
  },
];

const PATTERN_INSIGHTS: Record<string, { headline: string; detail: string }> = {
  R3: {
    headline: 'Presence — Attention fragmentation detected',
    detail:
      'When presence dims, your attention fragments under load. You show up physically but your cognitive capacity is consumed by background processing. This is your nervous system conserving energy — not a character flaw. The full assessment maps exactly where your attention breaks and what restores it.',
  },
  R4: {
    headline: 'Power — Freeze response under social pressure',
    detail:
      'When power dims, your system defaults to appease-or-withdraw under perceived threat. This is an ancient survival pattern, not a flaw. High performers with dimmed power often over-prepare to avoid confrontation. The full assessment reveals your specific power pattern and the micro-reps that rebuild it.',
  },
  R7: {
    headline: 'Connection — Relational withdrawal pattern',
    detail:
      'When connection dims, vulnerability feels unsafe and you retreat to transactional exchanges. You may be highly effective one-on-one but avoid the moments that build real trust. The full assessment maps your relational safety thresholds and shows where connection is already strong.',
  },
};

// ── Dimming Slider (draggable MoonToSun) ───────────────────────
interface DimmingSliderProps {
  value: number; // 0-100
  onChange: (v: number) => void;
  lowLabel: string;
  highLabel: string;
}

function DimmingSlider({ value, onChange, lowLabel, highLabel }: DimmingSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const commit = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      onChange(Math.round(pct));
    },
    [onChange],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      commit(e.clientX);
    },
    [commit],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      commit(e.clientX);
    },
    [commit],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Sun coverage: more dimming (higher value) = more moon coverage
  const moonCoverage = value / 100;

  return (
    <div className="space-y-2">
      <div
        ref={trackRef}
        className="relative h-16 rounded-xl cursor-pointer select-none touch-none overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #1a0533 0%, #2d1052 50%, #3a1a6e 100%)',
          border: '1px solid rgba(248, 208, 17, 0.15)',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label="Rate how often this happens"
        tabIndex={0}
      >
        {/* Sun (always visible, right side) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full"
          style={{
            right: 12,
            background: 'radial-gradient(circle at 40% 38%, #FFF8E7 0%, #F4C430 40%, #E8A317 70%, #A8820A 100%)',
            boxShadow: '0 0 20px rgba(244, 196, 48, 0.4)',
          }}
        />

        {/* Moon shadow (covers sun proportionally) */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full"
          style={{
            right: 12 + (1 - moonCoverage) * 16,
            background: '#1a0533',
            boxShadow: moonCoverage > 0.3 ? '0 0 12px rgba(189, 195, 199, 0.2)' : 'none',
          }}
          animate={{ right: 12 + (1 - moonCoverage) * 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* Crescent moon (left side) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-3">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="11" fill="#BDC3C7" opacity={0.6} />
            <circle cx="20" cy="13" r="10" fill="#1a0533" />
          </svg>
        </div>

        {/* Draggable thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            left: `calc(${value}% - 10px)`,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FFF8E7 0%, #F4C430 60%)',
            boxShadow: '0 0 16px rgba(244, 196, 48, 0.6), 0 0 4px rgba(255,255,255,0.8)',
            border: '2px solid rgba(255, 248, 231, 0.9)',
          }}
          animate={{ left: `calc(${value}% - 10px)` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />

        {/* Track fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full"
          style={{
            left: 40,
            width: `calc(${value}% - 40px)`,
            background: 'linear-gradient(90deg, rgba(244,196,48,0.3), rgba(244,196,48,0.6))',
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between px-1">
        <span className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>{lowLabel}</span>
        <span className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>{highLabel}</span>
      </div>
    </div>
  );
}

// ── Blurred Preview Card ───────────────────────────────────────
function BlurredPreview({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="relative rounded-xl p-4 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(248, 208, 17, 0.08)',
      }}
    >
      <div className="filter blur-[2px] opacity-40 pointer-events-none">
        <div className="h-24 rounded-lg mb-2" style={{ background: 'linear-gradient(135deg, var(--cosmic-purple-mid) 0%, var(--cosmic-purple-vivid) 100%)' }} />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mb-2 opacity-60">
          <rect x="3" y="9" width="14" height="10" rx="2" stroke="var(--brand-gold)" strokeWidth="1.5" fill="none" />
          <path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="var(--brand-gold)" strokeWidth="1.5" fill="none" />
        </svg>
        <p className="text-xs font-semibold" style={{ color: 'var(--text-on-dark)' }}>{title}</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>{description}</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
type Stage = 'intro' | 'q0' | 'q1' | 'q2' | 'breathing' | 'results';

export default function DimmingDetector() {
  const prefersReduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>('intro');
  const [answers, setAnswers] = useState<number[]>([50, 50, 50]);
  const [showInsight, setShowInsight] = useState(false);

  const motionDuration = prefersReduced ? 0 : undefined;

  // Derive scores
  const dimmingScore = useMemo(() => {
    const avg = answers.reduce((a, b) => a + b, 0) / answers.length;
    return Math.round(avg);
  }, [answers]);

  const eclipseLevel = useMemo(() => {
    if (dimmingScore < 25) return 'LOW';
    if (dimmingScore < 50) return 'MODERATE';
    if (dimmingScore < 75) return 'ELEVATED';
    return 'HIGH';
  }, [dimmingScore]);

  const primaryPattern = useMemo(() => {
    const maxIdx = answers.indexOf(Math.max(...answers));
    return SCENARIOS[maxIdx].rayId;
  }, [answers]);

  const eclipseData: EclipseOutput = useMemo(
    () => ({
      level: eclipseLevel,
      dimensions: {
        emotional_load: { score: answers[0] / 33.3, note: 'Presence fragmentation load' },
        cognitive_load: { score: answers[1] / 33.3, note: 'Power response load' },
        relational_load: { score: answers[2] / 33.3, note: 'Connection withdrawal load' },
      },
      derived_metrics: {
        recovery_access: Math.round(100 - dimmingScore * 0.8),
        load_pressure: Math.round(dimmingScore * 0.9),
        eer: parseFloat((1 + (100 - dimmingScore) / 100).toFixed(1)),
        bri: Math.round(dimmingScore / 25),
        performance_presence_delta: Math.round(dimmingScore * 0.3),
      },
      gating: {
        mode: dimmingScore < 50 ? 'BUILD_RANGE' : 'STABILIZE',
        reason:
          dimmingScore < 50
            ? 'You have room to build — the full assessment maps your growth edges.'
            : 'Your system is carrying load — the full assessment shows exactly where.',
      },
    }),
    [eclipseLevel, dimmingScore, answers],
  );

  // Persist results to localStorage for carry-forward (#11)
  useEffect(() => {
    if (stage === 'results') {
      try {
        localStorage.setItem(
          '143_dimming_result',
          JSON.stringify({
            score: dimmingScore,
            level: eclipseLevel,
            primaryRay: primaryPattern,
            primaryRayName: SCENARIOS[answers.indexOf(Math.max(...answers))]?.rayName ?? '',
            timestamp: Date.now(),
          }),
        );
      } catch { /* silent */ }
    }
  }, [stage, dimmingScore, eclipseLevel, primaryPattern, answers]);

  // Breathing timer
  useEffect(() => {
    if (stage === 'breathing') {
      const timer = setTimeout(() => setStage('results'), 2500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const qIdx = stage === 'q0' ? 0 : stage === 'q1' ? 1 : stage === 'q2' ? 2 : -1;

  const updateAnswer = useCallback(
    (val: number) => {
      if (qIdx < 0) return;
      setAnswers((prev) => {
        const next = [...prev];
        next[qIdx] = val;
        return next;
      });
    },
    [qIdx],
  );

  const nextStage = useCallback(() => {
    const order: Stage[] = ['intro', 'q0', 'q1', 'q2', 'breathing', 'results'];
    const idx = order.indexOf(stage);
    if (idx < order.length - 1) setStage(order[idx + 1]);
  }, [stage]);

  const insight = PATTERN_INSIGHTS[primaryPattern];

  return (
    <section className="glass-card p-6 sm:p-8 mb-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <p
              className="chip mb-3 inline-block"
              style={{ background: 'rgba(248, 208, 17, 0.12)', color: 'var(--brand-gold)' }}
            >
              60-Second Dimming Check
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: 'var(--text-on-dark)' }}>
              Where is your light dimming?
            </h2>
            <p className="max-w-xl mx-auto text-sm leading-relaxed mb-6" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Three quick scenarios. Real patterns. No login required.
              <br />
              See how much of your leadership capacity is temporarily eclipsed.
            </p>
            <button
              onClick={nextStage}
              className="btn-primary text-base px-8 py-3"
            >
              Start the Check
            </button>
          </motion.div>
        )}

        {/* ── QUESTIONS ── */}
        {qIdx >= 0 && (
          <motion.div
            key={`q${qIdx}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-5">
              {SCENARIOS.map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    background: i === qIdx ? 'var(--brand-gold)' : i < qIdx ? 'rgba(244,196,48,0.5)' : 'rgba(255,255,255,0.12)',
                    boxShadow: i === qIdx ? '0 0 8px rgba(244,196,48,0.5)' : 'none',
                  }}
                />
              ))}
            </div>

            <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--brand-gold)' }}>
              {SCENARIOS[qIdx].phaseLabel} — {SCENARIOS[qIdx].rayName}
            </p>

            <p className="text-lg sm:text-xl font-medium mb-6 leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
              &ldquo;{SCENARIOS[qIdx].prompt}&rdquo;
            </p>

            <DimmingSlider
              value={answers[qIdx]}
              onChange={updateAnswer}
              lowLabel={SCENARIOS[qIdx].lowLabel}
              highLabel={SCENARIOS[qIdx].highLabel}
            />

            <div className="mt-6 flex justify-end">
              <button onClick={nextStage} className="btn-primary px-6 py-2.5 text-sm">
                {qIdx < 2 ? 'Next' : 'See Results'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── BREATHING PAUSE ── */}
        {stage === 'breathing' && (
          <motion.div
            key="breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              className="w-16 h-16 rounded-full mb-6"
              style={{
                background: 'radial-gradient(circle, #F4C430 0%, #3A0A5E 72%)',
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p className="text-lg font-medium" style={{ color: 'var(--text-on-dark)' }}>
              Processing your light signature...
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-on-dark-secondary)' }}>
              One clean breath. Then your results.
            </p>
          </motion.div>
        )}

        {/* ── RESULTS ── */}
        {stage === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Dimming Score */}
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--brand-gold)' }}>
                Your Dimming Score
              </p>
              <p className="text-5xl font-bold tabular-nums" style={{ color: 'var(--text-on-dark)' }}>
                {dimmingScore}
                <span className="text-lg font-normal ml-1 opacity-50">/100</span>
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {dimmingScore < 25
                  ? 'Your system is running clear. Capacity is available.'
                  : dimmingScore < 50
                    ? 'Some dimming detected. Normal operating range.'
                    : dimmingScore < 75
                      ? 'Significant dimming. Your capacity is partially eclipsed.'
                      : 'Heavy dimming. Your system is conserving — not broken.'}
              </p>
            </div>

            {/* Eclipse Meter */}
            <FadeInSection delay={0.2}>
              <EclipseMeter eclipse={eclipseData} />
            </FadeInSection>

            {/* Primary Pattern */}
            <FadeInSection delay={0.4}>
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(248, 208, 17, 0.12)',
                }}
              >
                <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--brand-gold)' }}>
                  Primary Dimming Pattern
                </p>
                <p className="text-base font-semibold mb-2" style={{ color: 'var(--text-on-dark)' }}>
                  {insight?.headline}
                </p>
                <button
                  onClick={() => setShowInsight(!showInsight)}
                  className="text-xs underline underline-offset-2 mb-2 transition-colors"
                  style={{ color: 'var(--brand-gold)' }}
                >
                  {showInsight ? 'Hide insight' : 'What does this mean?'}
                </button>
                <AnimatePresence>
                  {showInsight && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm leading-relaxed overflow-hidden"
                      style={{ color: 'var(--text-on-dark-secondary)' }}
                    >
                      {insight?.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </FadeInSection>

            {/* Blurred Previews — Conversion Bridge */}
            <FadeInSection delay={0.6}>
              <p className="text-xs uppercase tracking-[0.15em] mb-3" style={{ color: 'var(--brand-gold)' }}>
                The full assessment also reveals
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <BlurredPreview title="Light Signature" description="Your 9-ray profile" />
                <BlurredPreview title="Power Sources" description="Your top capacities" />
                <BlurredPreview title="Energy Leaks" description="Where load hides" />
                <BlurredPreview title="Rise Path" description="Your growth map" />
              </div>
            </FadeInSection>

            {/* CTA */}
            <FadeInSection delay={0.8}>
              <div className="text-center pt-2">
                <Link href="/assessment/setup" className="btn-primary text-base px-8 py-3 inline-block">
                  Discover Your Full Light Profile
                </Link>
                <p className="text-xs mt-3" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  143 questions &middot; 12 minutes &middot; Research-backed
                </p>
              </div>
            </FadeInSection>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
