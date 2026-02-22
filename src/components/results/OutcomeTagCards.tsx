'use client';

import { useState } from 'react';
import type { OutcomeTag, ConfidenceBand } from '@/lib/types';

interface Props {
  outcomeTags: OutcomeTag[];
}

const CONFIDENCE_STYLES: Record<ConfidenceBand, { color: string; bg: string }> = {
  HIGH: { color: '#34D399', bg: 'rgba(52, 211, 153, 0.12)' },
  MODERATE: { color: '#F8D011', bg: 'rgba(248, 208, 17, 0.10)' },
  LOW: { color: '#FB923C', bg: 'rgba(251, 146, 60, 0.10)' },
};

/**
 * Displays applied outcome tags from the scoring engine.
 * These are pattern labels like "EXPENSIVE_STRENGTH" with evidence chains.
 */
export default function OutcomeTagCards({ outcomeTags }: Props) {
  if (outcomeTags.length === 0) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
        Outcome Patterns
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        Behavioral patterns detected across your full assessment. Each pattern has an evidence chain
        showing which data points contributed to the finding.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {outcomeTags.map((tag) => (
          <OutcomeCard key={tag.tag_id} tag={tag} />
        ))}
      </div>
    </section>
  );
}

function OutcomeCard({ tag }: { tag: OutcomeTag }) {
  const [expanded, setExpanded] = useState(false);
  const conf = CONFIDENCE_STYLES[tag.confidence] ?? CONFIDENCE_STYLES.MODERATE;

  // Convert tag_id to human-readable label
  const displayLabel = tag.label || tag.tag_id
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left rounded-xl border transition-colors"
      style={{
        background: 'rgba(96, 5, 141, 0.12)',
        borderColor: expanded ? `${conf.color}40` : 'rgba(148, 80, 200, 0.2)',
        padding: '14px 16px',
      }}
      aria-expanded={expanded}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          {displayLabel}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: conf.bg, color: conf.color }}
          >
            {tag.confidence}
          </span>
          <span
            className="text-xs transition-transform"
            style={{
              color: 'var(--text-on-dark-muted)',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            aria-hidden="true"
          >
            &#9660;
          </span>
        </div>
      </div>

      {/* Evidence chain */}
      {expanded && tag.evidence.length > 0 && (
        <div className="mt-3 pt-3 space-y-1.5" style={{ borderTop: '1px solid rgba(148, 80, 200, 0.15)' }}>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--brand-gold)' }}>
            Evidence
          </p>
          {tag.evidence.map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs mt-0.5 shrink-0" style={{ color: conf.color }}>&#8226;</span>
              <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>{ev}</p>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
