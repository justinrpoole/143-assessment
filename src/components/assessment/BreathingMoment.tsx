'use client';

import { useState } from 'react';

interface BreathingMomentProps {
  /** Phase name entering */
  phaseName: string;
  /** Brief encouragement for the transition */
  message: string;
}

/**
 * Optional breathing pause inserted at phase transitions in the assessment.
 * Expanding/contracting circle with 4-second inhale / 4-second exhale.
 * User can skip immediately or let it auto-dismiss after 15 seconds.
 */
export default function BreathingMoment({ phaseName, message }: BreathingMomentProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="glass-card flex flex-col items-center gap-4 py-8 px-6 text-center"
      style={{ borderColor: 'color-mix(in srgb, var(--gold-primary) 20%, transparent)' }}
    >
      {/* Breathing circle */}
      <div
        className="h-16 w-16 rounded-full"
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--gold-primary) 25%, transparent) 0%, color-mix(in srgb, var(--violet-650) 30%, transparent) 100%)',
          border: '2px solid color-mix(in srgb, var(--gold-primary) 30%, transparent)',
          animation: 'breathe 8s ease-in-out infinite',
        }}
      />

      <p
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--gold-primary)' }}
      >
        {phaseName}
      </p>

      <p
        className="max-w-sm text-sm leading-relaxed"
        style={{ color: 'var(--text-on-dark, color-mix(in srgb, var(--text-body) 92%, transparent))' }}
      >
        {message}
      </p>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="mt-1 text-xs font-medium transition-colors"
        style={{ color: 'var(--text-on-dark-muted, color-mix(in srgb, var(--text-body) 42%, transparent))' }}
      >
        Continue
      </button>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.35); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
