'use client';

import { useState } from 'react';
import type { EdgeCaseResult } from '@/lib/types';

interface Props {
  edgeCases: EdgeCaseResult[];
}

const EDGE_CASE_META: Record<string, {
  icon: string;
  title: string;
  coaching: string;
  severity: 'info' | 'watch' | 'action';
}> = {
  EXPENSIVE_STRENGTH: {
    icon: '\u26A1',
    title: 'Expensive Strength',
    coaching: 'You are performing at a high level — but the energy cost is elevated. This is common in leaders who over-index on output. The rep is not to do less, but to recover differently. Start with the 90-Second Window after high-output blocks.',
    severity: 'watch',
  },
  TRUTH_DETECTOR_SUPPRESSED: {
    icon: '\uD83D\uDD0D',
    title: 'Truth Detector Suppressed',
    coaching: 'Your system flagged a pattern where authenticity capacity is present but not being deployed. You know the truth — the constraint is in the saying of it. Practice the Boundary of Light tool in low-stakes conversations first.',
    severity: 'watch',
  },
  PERFECT_SELF_REPORT: {
    icon: '\u2728',
    title: 'Perfect Self-Report',
    coaching: 'All responses were at the ceiling. This sometimes indicates impression management rather than accurate self-assessment. Consider retaking with a specific recent challenge in mind — not your best week, but your real week.',
    severity: 'action',
  },
  CONTRADICTORY_RESPONSES: {
    icon: '\u21C4',
    title: 'Contradictory Responses',
    coaching: 'Some response pairs showed opposing patterns. This can mean you are in a transition period — your behavior is genuinely inconsistent as new patterns form. It can also mean fatigue affected later answers. Check which section feels less accurate.',
    severity: 'info',
  },
  FLAT_PROFILE: {
    icon: '\u2500',
    title: 'Flat Profile',
    coaching: 'Your scores are clustered tightly with little differentiation between rays. This makes it harder to identify a clear training target. Consider: are you genuinely balanced, or did you answer from your average rather than your edges?',
    severity: 'watch',
  },
  MISSING_REFLECTION: {
    icon: '\uD83D\uDCAD',
    title: 'Missing Reflection',
    coaching: 'Reflection prompts were skipped or very brief. The reflections are not graded — they exist to help the scoring engine understand context. Richer reflections give you a more personalized report. Worth revisiting.',
    severity: 'info',
  },
  PARTIAL_COMPLETION: {
    icon: '\u23F8',
    title: 'Partial Completion',
    coaching: 'Some sections have incomplete data. The report works with what it has, but confidence bands are wider where data is thin. You can improve accuracy by completing the remaining items in a retake.',
    severity: 'info',
  },
  EXTREME_POLARIZATION: {
    icon: '\u26A0',
    title: 'Extreme Polarization',
    coaching: 'Very high scores in some rays and very low in others. This can be a real pattern — you pour energy into specific areas while others get none. Or it can indicate context-dependent responding. Check if the low rays feel accurate.',
    severity: 'watch',
  },
  HIGH_LOAD_INTERFERENCE: {
    icon: '\uD83C\uDF0A',
    title: 'High Load Interference',
    coaching: 'Your eclipse load is high enough that it may be affecting capacity scores. Under real pressure, people often underperform their actual range. Consider retaking after a recovery period to see your true baseline.',
    severity: 'action',
  },
  UNRESOLVED_AMBIGUITY: {
    icon: '\u2753',
    title: 'Unresolved Ambiguity',
    coaching: 'The scoring engine found patterns that could be interpreted multiple ways. The report chose the most conservative interpretation. A coach debrief or retake with focused context (work-only or life-only) would sharpen the picture.',
    severity: 'info',
  },
};

const SEVERITY_STYLES = {
  info: {
    bg: 'rgba(96, 5, 141, 0.12)',
    border: 'rgba(148, 80, 200, 0.25)',
    badge: 'rgba(148, 80, 200, 0.2)',
    badgeText: '#B794E6',
    label: 'Note',
  },
  watch: {
    bg: 'rgba(255, 207, 0, 0.06)',
    border: 'rgba(255, 207, 0, 0.15)',
    badge: 'rgba(255, 207, 0, 0.15)',
    badgeText: '#F8D011',
    label: 'Watch',
  },
  action: {
    bg: 'rgba(251, 146, 60, 0.08)',
    border: 'rgba(251, 146, 60, 0.2)',
    badge: 'rgba(251, 146, 60, 0.15)',
    badgeText: '#FB923C',
    label: 'Action',
  },
};

/**
 * Surfaces detected edge cases from the scoring engine as coaching-styled cards.
 * Only shows edge cases where detected === true.
 */
export default function EdgeCaseAlerts({ edgeCases }: Props) {
  const detected = edgeCases.filter((ec) => ec.detected);
  if (detected.length === 0) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
        Pattern Flags
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        The scoring engine detected {detected.length} pattern{detected.length > 1 ? 's' : ''} worth noting. These are not problems — they are information about how to read your results more accurately.
      </p>

      <div className="space-y-3">
        {detected.map((ec) => (
          <EdgeCaseCard key={ec.code} edgeCase={ec} />
        ))}
      </div>
    </section>
  );
}

function EdgeCaseCard({ edgeCase }: { edgeCase: EdgeCaseResult }) {
  const [expanded, setExpanded] = useState(false);
  const meta = EDGE_CASE_META[edgeCase.code];
  const severity = SEVERITY_STYLES[meta?.severity ?? 'info'];

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left rounded-xl border transition-colors"
      style={{
        background: severity.bg,
        borderColor: severity.border,
        padding: '14px 16px',
      }}
      aria-expanded={expanded}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-lg" aria-hidden="true">{meta?.icon ?? '\u26A0'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              {meta?.title ?? edgeCase.code}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: severity.badge, color: severity.badgeText }}
            >
              {severity.label}
            </span>
          </div>
        </div>
        <span
          className="text-xs shrink-0 transition-transform"
          style={{
            color: 'var(--text-on-dark-muted)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          aria-hidden="true"
        >
          &#9660;
        </span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-3 pt-3 space-y-2" style={{ borderTop: `1px solid ${severity.border}` }}>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {meta?.coaching ?? edgeCase.restriction}
          </p>
          {edgeCase.required_next_evidence && (
            <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
              Next step: {edgeCase.required_next_evidence}
            </p>
          )}
        </div>
      )}
    </button>
  );
}
