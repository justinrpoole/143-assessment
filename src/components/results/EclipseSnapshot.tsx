'use client';

import { useState } from 'react';
import type { EclipseOutput } from '@/lib/types';
import { getEclipseExplanation, getGateExplanation } from '@/lib/cosmic-copy';

interface Props {
  eclipse: EclipseOutput;
}

const LEVEL_CONFIG: Record<string, { label: string; level: string; width: string; message: string; color: string }> = {
  LOW: {
    label: 'Low Load',
    level: 'low',
    width: '25%',
    message: 'Your system is stable. Energy is available for growth work.',
    color: 'var(--status-low)',
  },
  MODERATE: {
    label: 'Moderate Load',
    level: 'moderate',
    width: '50%',
    message: 'Normal operating range. Stay aware but keep building.',
    color: 'var(--status-moderate)',
  },
  ELEVATED: {
    label: 'Elevated Load',
    level: 'elevated',
    width: '75%',
    message: 'Your system is under meaningful pressure. Capacity is partially eclipsed. Prioritize recovery.',
    color: 'var(--status-elevated)',
  },
  HIGH: {
    label: 'High Load',
    level: 'high',
    width: '95%',
    message: 'Your system is conserving energy. Eclipsed capacity is not lost — stabilization first.',
    color: 'var(--status-high)',
  },
};

const GATE_LABELS: Record<string, string> = {
  STABILIZE: 'Your system is asking for stability before expansion.',
  BUILD_RANGE: 'You have room to build — stay intentional about load.',
  STRETCH: 'Clear for progressive development work.',
};

export default function EclipseSnapshot({ eclipse }: Props) {
  const [showDetail, setShowDetail] = useState(false);
  const config = LEVEL_CONFIG[eclipse.level] || LEVEL_CONFIG.MODERATE;
  const gateLabel = GATE_LABELS[eclipse.gating.mode] || eclipse.gating.reason;
  const explanation = getEclipseExplanation(eclipse.level);
  const gateExplanation = getGateExplanation(eclipse.gating.mode);

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>Eclipse Snapshot</h3>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        This shows how much of your range is covered right now. It&apos;s weather, not identity.
      </p>

      <div className="glass-card p-6 space-y-5">
        {/* Load Gauge */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className={`status-pill status-pill--${config.level}`}>{config.label}</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-glass)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: config.width, background: `linear-gradient(90deg, var(--brand-purple), ${config.color})` }}
            />
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-on-dark-secondary)' }}>{config.message}</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="metric-chip">
            <span className="metric-chip__value">{eclipse.derived_metrics.recovery_access}%</span>
            <span className="metric-chip__label">Recovery Access</span>
          </div>
          <div className="metric-chip">
            <span className="metric-chip__value">{eclipse.derived_metrics.load_pressure}%</span>
            <span className="metric-chip__label">Load Pressure</span>
          </div>
        </div>

        {/* Gate */}
        <div className="pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{gateLabel}</p>
          {gateExplanation && (
            <p className="text-xs mt-2" style={{ color: 'var(--text-on-dark-muted)' }}>{gateExplanation}</p>
          )}
        </div>

        {/* Expandable insight */}
        <div className="pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
          <button
            type="button"
            onClick={() => setShowDetail(!showDetail)}
            aria-expanded={showDetail}
            className="flex items-center gap-2 text-sm font-medium w-full text-left"
            style={{ color: 'var(--brand-gold)' }}
          >
            <span
              className="inline-block transition-transform"
              style={{ transform: showDetail ? 'rotate(90deg)' : 'rotate(0deg)' }}
              aria-hidden="true"
            >
              &#9654;
            </span>
            What this means — science, real life, and what to do next
          </button>

          {showDetail && (
            <div className="space-y-4 mt-3">
              {/* Science */}
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: 'var(--brand-gold)' }}>
                  The Science
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {explanation.science}
                </p>
              </div>

              {/* Real Life */}
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: 'var(--brand-gold)' }}>
                  What This Might Look Like
                </p>
                <ul className="space-y-1.5">
                  {explanation.realLife.map((ex, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                      <span className="mt-0.5 shrink-0" style={{ color: 'var(--text-on-dark-muted)' }}>&#9679;</span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Coaching */}
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-1.5" style={{ color: 'var(--brand-gold)' }}>
                  Where to Start
                </p>
                <ul className="space-y-1.5">
                  {explanation.coaching.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                      <span className="font-bold shrink-0" style={{ color: 'var(--brand-gold)' }}>{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
