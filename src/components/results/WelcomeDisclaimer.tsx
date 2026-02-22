'use client';

import type { ConfidenceBand } from '@/lib/types';

interface Props {
  confidence: ConfidenceBand;
  qualityNotes?: string;
}

const CONFIDENCE_BADGE: Record<ConfidenceBand, { label: string; bg: string; color: string; description: string }> = {
  HIGH: {
    label: 'Strong',
    bg: 'rgba(167, 139, 250, 0.12)',
    color: 'var(--status-low)',
    description: 'Your responses were consistent, engaged, and thorough. These results reflect you well.',
  },
  MODERATE: {
    label: 'Moderate',
    bg: 'rgba(255, 207, 0, 0.10)',
    color: 'var(--brand-gold)',
    description: 'These results are directional — they point in the right direction, but some areas may need a second look.',
  },
  LOW: {
    label: 'Preliminary',
    bg: 'rgba(245, 158, 11, 0.12)',
    color: 'var(--status-elevated)',
    description: 'Some response patterns suggest these results should be treated as a starting point, not a final answer.',
  },
};

export default function WelcomeDisclaimer({ confidence, qualityNotes }: Props) {
  const badge = CONFIDENCE_BADGE[confidence];

  return (
    <section className="space-y-6">
      <div className="text-center space-y-3">
        <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
          This is not a test you pass. This is a mirror you can use.
        </p>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Nothing here will label you. Everything here will orient you.
          What you see below measures where you are <em>right now</em> — not who you are forever.
        </p>
      </div>

      {/* Confidence Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
        style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color}33` }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: badge.color }} />
        {badge.label} Confidence
      </div>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{badge.description}</p>

      {qualityNotes && (
        <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>{qualityNotes}</p>
      )}
    </section>
  );
}
