'use client';

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { ExecutiveSignal } from '@/lib/types';

// ── Signal definitions from exec_tag_map.json (inlined for zero-fetch rendering) ──
const SIGNAL_DEFS: Record<string, { name: string; definition: string; category: 'Core 18' | 'Exec 6' }> = {
  M001: { name: 'Daily Intentionality', definition: 'Proactively setting clear direction and top priorities each day before reactive demands take over', category: 'Core 18' },
  M002: { name: 'Time/Attention Architecture', definition: 'Structuring schedule, boundaries, and focus blocks to protect what matters', category: 'Core 18' },
  M003: { name: 'Joy Access', definition: 'Accessing moments of joy independent of external conditions', category: 'Core 18' },
  M004: { name: 'Gratitude Practice', definition: 'Regularly recognizing and appreciating positive aspects and contributions', category: 'Core 18' },
  M005: { name: 'Attention Stability', definition: 'Sustaining focus on present task or person without fragmenting', category: 'Core 18' },
  M006: { name: 'Interoception', definition: 'Tuning into internal body signals to guide response', category: 'Core 18' },
  M007: { name: 'Fear Naming', definition: 'Identifying and labeling fears without letting them dictate actions', category: 'Core 18' },
  M008: { name: 'Agency/Control Focus', definition: 'Concentrating effort on actions within one\'s control', category: 'Core 18' },
  M009: { name: 'Values Clarity', definition: 'Knowing and articulating what truly matters (core values)', category: 'Core 18' },
  M010: { name: 'Decision Alignment', definition: 'Ensuring choices consistently reflect values and long-term vision', category: 'Core 18' },
  M011: { name: 'Identity Coherence', definition: 'Maintaining the same authentic self across different roles and contexts', category: 'Core 18' },
  M012: { name: 'Boundary Setting', definition: 'Establishing and communicating warm, firm limits on time and energy', category: 'Core 18' },
  M013: { name: 'Attunement', definition: 'Reading social and emotional cues accurately and responding appropriately', category: 'Core 18' },
  M014: { name: 'Conversation Agility', definition: 'Navigating discussions fluidly by balancing practical, emotional, and social needs', category: 'Core 18' },
  M015: { name: 'Openness', definition: 'Adopting a flexible, curious mindset that welcomes new ideas', category: 'Core 18' },
  M016: { name: 'Opportunity Recognition', definition: 'Noticing and seizing viable opportunities using attention filters', category: 'Core 18' },
  M017: { name: 'Modeling', definition: 'Leading by example through visibly practicing standards', category: 'Core 18' },
  M018: { name: 'Ripple Effect', definition: 'Creating positive impact on others\' behavior and culture', category: 'Core 18' },
  M019: { name: 'Burnout Risk', definition: 'Level of output without recovery indicating risk of exhaustion', category: 'Exec 6' },
  M020: { name: 'Reliability Under Pressure', definition: 'Consistency and dependability when conditions are difficult', category: 'Exec 6' },
  M021: { name: 'Decision Quality', definition: 'Tendency to make sound, well-informed decisions vs impulsive or rigid ones', category: 'Exec 6' },
  M022: { name: 'Psychological Safety', definition: 'Degree to which presence cultivates a safe environment for truth and risk', category: 'Exec 6' },
  M023: { name: 'Engagement', definition: 'Genuine enthusiasm and involvement correlating with retention', category: 'Exec 6' },
  M024: { name: 'Leadership Readiness', definition: 'Indicator of future leadership potential', category: 'Exec 6' },
};

const LEVEL_CONFIG: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  HIGH: { color: '#34D399', bg: 'rgba(52, 211, 153, 0.12)', dot: 'rgba(52, 211, 153, 0.9)', label: 'Strong' },
  ELEVATED: { color: '#F8D011', bg: 'rgba(248, 208, 17, 0.10)', dot: 'rgba(248, 208, 17, 0.9)', label: 'Building' },
  MODERATE: { color: '#FB923C', bg: 'rgba(251, 146, 60, 0.10)', dot: 'rgba(251, 146, 60, 0.9)', label: 'Emerging' },
  LOW: { color: '#F87171', bg: 'rgba(248, 113, 113, 0.10)', dot: 'rgba(248, 113, 113, 0.9)', label: 'Training Edge' },
};

function SignalCard({ signal }: { signal: ExecutiveSignal }) {
  const [expanded, setExpanded] = useState(false);
  const prefersReduced = useReducedMotion();
  const def = SIGNAL_DEFS[signal.signal_id];
  const config = LEVEL_CONFIG[signal.level] ?? LEVEL_CONFIG.MODERATE;

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left rounded-xl border transition-all"
      style={{
        background: expanded ? config.bg : 'rgba(96, 5, 141, 0.15)',
        borderColor: expanded ? config.color + '40' : 'rgba(148, 80, 200, 0.2)',
        padding: '14px 16px',
        transitionDuration: prefersReduced ? '0ms' : '200ms',
      }}
      aria-expanded={expanded}
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        {/* Status dot */}
        <span
          className="shrink-0 h-2.5 w-2.5 rounded-full"
          style={{ background: config.dot }}
          aria-hidden="true"
        />

        {/* Signal name + level badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              {signal.label}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: config.bg, color: config.color }}
            >
              {config.label}
            </span>
          </div>
          {def && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
              {def.definition}
            </p>
          )}
        </div>

        {/* Expand chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-transform"
          style={{
            color: 'var(--text-on-dark-muted)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transitionDuration: prefersReduced ? '0ms' : '200ms',
          }}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 space-y-3 pt-3" style={{ borderTop: '1px solid rgba(148, 80, 200, 0.15)' }}>
          {/* Drivers */}
          {signal.drivers.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                Key Drivers
              </p>
              <div className="flex flex-wrap gap-1.5">
                {signal.drivers.map((d) => (
                  <span
                    key={d}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(148, 80, 200, 0.2)', color: 'var(--text-on-dark-secondary)' }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Eclipse / validity moderators */}
          {(signal.moderators.eclipse || signal.moderators.validity) && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                Moderators
              </p>
              <div className="space-y-0.5">
                {signal.moderators.eclipse && (
                  <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
                    Eclipse: {signal.moderators.eclipse}
                  </p>
                )}
                {signal.moderators.validity && (
                  <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
                    Validity: {signal.moderators.validity}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* First tools to try */}
          {signal.tools_first.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#F8D011' }}>
                Start Here
              </p>
              <ul className="space-y-0.5">
                {signal.tools_first.map((t) => (
                  <li key={t} className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
                    <span style={{ color: '#F8D011' }}>&#9656;</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended reps */}
          {signal.reps.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                Coaching Reps
              </p>
              <ul className="space-y-0.5">
                {signal.reps.map((r) => (
                  <li key={r} className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
                    <span style={{ color: 'rgba(148, 80, 200, 0.7)' }}>&#9656;</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence */}
          <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            Confidence: {signal.confidence_band}
          </p>
        </div>
      )}
    </button>
  );
}

interface ExecutiveSignalsProps {
  signals: ExecutiveSignal[];
}

export default function ExecutiveSignals({ signals }: ExecutiveSignalsProps) {
  const [activeTab, setActiveTab] = useState<'exec' | 'core'>('exec');

  if (!signals || signals.length === 0) return null;

  // Split into Exec 6 (M019-M024) and Core 18 (M001-M018)
  const execSignals = signals.filter((s) => {
    const def = SIGNAL_DEFS[s.signal_id];
    return def?.category === 'Exec 6';
  });
  const coreSignals = signals.filter((s) => {
    const def = SIGNAL_DEFS[s.signal_id];
    return def?.category === 'Core 18';
  });

  const displayed = activeTab === 'exec' ? execSignals : coreSignals;

  // Summary counts
  const allSignals = activeTab === 'exec' ? execSignals : coreSignals;
  const counts = {
    strong: allSignals.filter((s) => s.level === 'HIGH').length,
    building: allSignals.filter((s) => s.level === 'ELEVATED').length,
    emerging: allSignals.filter((s) => s.level === 'MODERATE').length,
    edge: allSignals.filter((s) => s.level === 'LOW').length,
  };

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('exec')}
          className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
          style={{
            background: activeTab === 'exec' ? 'rgba(248, 208, 17, 0.15)' : 'rgba(96, 5, 141, 0.15)',
            color: activeTab === 'exec' ? '#F8D011' : 'var(--text-on-dark-muted)',
            border: `1px solid ${activeTab === 'exec' ? 'rgba(248, 208, 17, 0.3)' : 'rgba(148, 80, 200, 0.2)'}`,
          }}
        >
          Executive ({execSignals.length})
        </button>
        <button
          onClick={() => setActiveTab('core')}
          className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
          style={{
            background: activeTab === 'core' ? 'rgba(248, 208, 17, 0.15)' : 'rgba(96, 5, 141, 0.15)',
            color: activeTab === 'core' ? '#F8D011' : 'var(--text-on-dark-muted)',
            border: `1px solid ${activeTab === 'core' ? 'rgba(248, 208, 17, 0.3)' : 'rgba(148, 80, 200, 0.2)'}`,
          }}
        >
          Core ({coreSignals.length})
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-4 flex-wrap">
        {counts.strong > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: LEVEL_CONFIG.HIGH.dot }} />
            <span className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {counts.strong} Strong
            </span>
          </div>
        )}
        {counts.building > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: LEVEL_CONFIG.ELEVATED.dot }} />
            <span className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {counts.building} Building
            </span>
          </div>
        )}
        {counts.emerging > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: LEVEL_CONFIG.MODERATE.dot }} />
            <span className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {counts.emerging} Emerging
            </span>
          </div>
        )}
        {counts.edge > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: LEVEL_CONFIG.LOW.dot }} />
            <span className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {counts.edge} Training Edge
            </span>
          </div>
        )}
      </div>

      {/* Signal cards */}
      <div className="space-y-2">
        {displayed.map((signal) => (
          <SignalCard key={signal.signal_id} signal={signal} />
        ))}
      </div>

      {displayed.length === 0 && (
        <p className="text-xs text-center py-4" style={{ color: 'var(--text-on-dark-muted)' }}>
          No {activeTab === 'exec' ? 'executive' : 'core'} signals computed for this assessment.
        </p>
      )}
    </div>
  );
}
