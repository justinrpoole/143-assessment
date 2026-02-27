'use client';

import { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const STEPS = [
  {
    eyebrow: 'Step 1 of 3',
    headline: 'Your brain has a filter.',
    body: 'Right now, your Reticular Activating System is deciding what you notice and what you ignore. It processes millions of signals per second and shows you only what it thinks matters. Most of the time, you do not choose what it scans for — it runs on autopilot.',
  },
  {
    eyebrow: 'Step 2 of 3',
    headline: 'The filter can be trained.',
    body: 'Every time you pay attention to something on purpose — a capacity, a strength, a moment of courage — your RAS updates its filter. This is not motivation. It is neuroscience. Deliberate attention rewires what your brain defaults to scanning for.',
  },
  {
    eyebrow: 'Step 3 of 3',
    headline: 'This assessment primes the filter.',
    body: 'The next 143 questions are not a test. They are a mirror — a structured way to direct your attention toward 9 specific capacities. By the time you finish, your RAS will already be looking for evidence of what is working. That is the first rep.',
  },
];

/**
 * A 3-step "RAS Reset" mini-lesson that primes the user's attention
 * before taking the assessment. Designed to take ~90 seconds to read.
 * Teaches: what RAS is, that it can be trained, how the assessment primes it.
 */
export function RasResetLesson({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <section className="relative glass-card p-6 space-y-5">
      {/* Subtle dot grid texture */}
      <div className="gold-dot-grid absolute inset-0 rounded-[inherit] pointer-events-none" aria-hidden="true" />

      {/* Progress dots */}
      <div className="relative flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === step ? 24 : 8,
              background: i <= step ? 'var(--neon-cyan, #25f6ff)' : 'var(--surface-border)',
              boxShadow: i <= step ? '0 0 8px rgba(37, 246, 255, 0.3)' : 'none',
            }}
          />
        ))}
      </div>

      <p
        className="relative gold-tag inline-block"
      >
        {current.eyebrow}
      </p>

      <h2
        className="relative text-neon-bloom text-xl font-bold leading-tight"
        style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
      >
        {current.headline}
      </h2>

      <div className="relative gold-accent-left">
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}
        >
          {current.body}
        </p>
      </div>

      <div className="relative flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary"
        >
          {step < STEPS.length - 1 ? 'Next' : 'I am ready'}
        </button>
        {step === 0 && (
          <button
            type="button"
            onClick={onComplete}
            className="btn-ghost text-xs"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            Skip — I know this
          </button>
        )}
      </div>
    </section>
  );
}
