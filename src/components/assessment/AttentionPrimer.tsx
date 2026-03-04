'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  onComplete: () => void;
}

const TOTAL_BREATHS = 3;
const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;

type Phase = 'inhale' | 'hold' | 'exhale';

/**
 * A 60-second guided breathing ritual that grounds the user
 * before the assessment. Three breath cycles: 4s inhale, 2s hold,
 * 6s exhale. Visual circle expands and contracts with the breath.
 * Instruction text changes per phase. Auto-completes after 3 cycles.
 */
export function AttentionPrimer({ onComplete }: Props) {
  const [breathCount, setBreathCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  const runCycle = useCallback(() => {
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;

      if (elapsed < INHALE_MS) {
        setPhase('inhale');
      } else if (elapsed < INHALE_MS + HOLD_MS) {
        setPhase('hold');
      } else if (elapsed < CYCLE_MS) {
        setPhase('exhale');
      } else {
        // Cycle complete
        setBreathCount((prev) => {
          const next = prev + 1;
          if (next >= TOTAL_BREATHS) {
            setDone(true);
            return next;
          }
          // Start next cycle
          startRef.current = Date.now();
          return next;
        });
      }

      if (!done) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [done]);

  useEffect(() => {
    runCycle();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [runCycle]);

  // Stop animation when done
  useEffect(() => {
    if (done && animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, [done]);

  const phaseText =
    phase === 'inhale' ? 'Breathe in...' :
    phase === 'hold' ? 'Hold...' :
    'Let it go...';

  const circleScale =
    phase === 'inhale' ? 1.35 :
    phase === 'hold' ? 1.35 :
    1.0;

  const transitionDuration =
    phase === 'inhale' ? `${INHALE_MS}ms` :
    phase === 'hold' ? `${HOLD_MS}ms` :
    `${EXHALE_MS}ms`;

  return (
    <section className="glass-card p-6">
      <div className="flex flex-col items-center text-center space-y-6">
        <p className="gold-tag inline-block">
          Attention Primer
        </p>

        {!done ? (
          <>
            {/* Breathing circle with glow ring */}
            <div className="relative flex items-center justify-center" style={{ height: 140 }}>
              {/* Outer glow ring */}
              <div
              className="absolute rounded-full"
              style={{
                width: 130,
                height: 130,
                background: 'transparent',
                border: '1px solid color-mix(in srgb, var(--neon-cyan) 15%, transparent)',
                transform: `scale(${circleScale})`,
                transition: `transform ${transitionDuration} ease-in-out`,
              }}
            />
              <div
              className="rounded-full"
              style={{
                width: 100,
                height: 100,
                background: 'radial-gradient(circle, color-mix(in srgb, var(--gold-primary) 25%, transparent) 0%, var(--surface-border) 70%, transparent 100%)',
                transform: `scale(${circleScale})`,
                transition: `transform ${transitionDuration} ease-in-out`,
              }}
            />
            </div>

            {/* Phase instruction */}
            <p
              className="text-lg font-medium"
              style={{ color: 'var(--text-body)' }}
            >
              {phaseText}
            </p>

            {/* Breath counter */}
            <p
              className="text-xs"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              Breath {Math.min(breathCount + 1, TOTAL_BREATHS)} of {TOTAL_BREATHS}
            </p>

            {/* Skip option */}
            <button
              type="button"
              onClick={onComplete}
              className="btn-ghost text-xs"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              Skip
            </button>
          </>
        ) : (
          <>
            {/* Complete state */}
            <p
              className="text-lg font-medium score-reveal"
              style={{ color: 'var(--gold-primary)' }}
            >
              Good. Your attention is here.
            </p>
            <p
              className="text-sm max-w-xs"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              Carry that clarity into the next 143 questions. Answer from where you are, not where you think you should be.
            </p>
            <button
              type="button"
              onClick={onComplete}
              className="btn-primary score-reveal"
            >
              Begin Assessment
            </button>
          </>
        )}
      </div>
    </section>
  );
}
