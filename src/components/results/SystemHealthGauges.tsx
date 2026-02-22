'use client';

import { useReducedMotion } from 'framer-motion';
import type { AssessmentIndices } from '@/lib/types';

interface Props {
  indices: AssessmentIndices;
}

/**
 * Three animated gauge cards for the core system indices:
 * - EER: Energy Efficiency Ratio (shine vs eclipse)
 * - BRI: Burnout Risk Index (rays where eclipse > shine)
 * - LSI: Load Snapshot Index (system load 0-100)
 */
export default function SystemHealthGauges({ indices }: Props) {
  const prefersReduced = useReducedMotion();

  const eer = indices.eer;
  const bri = indices.bri;
  const lsi = indices.lsi_0_100;

  // EER interpretation
  const eerLevel = eer == null ? 'unknown'
    : eer >= 2.5 ? 'strong'
    : eer >= 1.5 ? 'balanced'
    : eer >= 1.0 ? 'strained'
    : 'depleted';

  const eerConfig: Record<string, { color: string; label: string; message: string }> = {
    strong: { color: '#34D399', label: 'Strong', message: 'Your energy output far exceeds your load. System is generating surplus.' },
    balanced: { color: '#F8D011', label: 'Balanced', message: 'Healthy ratio between output and load. Continue current patterns.' },
    strained: { color: '#FB923C', label: 'Strained', message: 'Load is approaching output levels. Recovery access is narrowing.' },
    depleted: { color: '#F87171', label: 'Depleted', message: 'Load exceeds output capacity. Stabilization before growth work.' },
    unknown: { color: '#94A3B8', label: 'N/A', message: 'Insufficient data to calculate.' },
  };

  // BRI interpretation (0-9 rays)
  const briLevel = bri === 0 ? 'clear'
    : bri <= 2 ? 'watch'
    : bri <= 4 ? 'elevated'
    : 'high';

  const briConfig: Record<string, { color: string; label: string; message: string }> = {
    clear: { color: '#34D399', label: 'Clear', message: 'No rays showing eclipse dominance. Full range available.' },
    watch: { color: '#F8D011', label: 'Watch', message: `${bri} ray${bri > 1 ? 's' : ''} with eclipse exceeding shine. Monitor but not urgent.` },
    elevated: { color: '#FB923C', label: 'Elevated', message: `${bri} rays under eclipse pressure. Targeted recovery recommended.` },
    high: { color: '#F87171', label: 'High Risk', message: `${bri} rays dominated by eclipse. Stabilization is priority one.` },
  };

  // LSI interpretation (0-100)
  const lsiLevel = lsi == null ? 'unknown'
    : lsi <= 25 ? 'low'
    : lsi <= 50 ? 'moderate'
    : lsi <= 75 ? 'elevated'
    : 'high';

  const lsiConfig: Record<string, { color: string; label: string; message: string }> = {
    low: { color: '#34D399', label: 'Low', message: 'System is running light. Full capacity for growth and stretch work.' },
    moderate: { color: '#F8D011', label: 'Moderate', message: 'Normal operating load. Stay aware of cumulative stress.' },
    elevated: { color: '#FB923C', label: 'Elevated', message: 'Meaningful system pressure. Prioritize tools over reps.' },
    high: { color: '#F87171', label: 'High', message: 'System under significant load. Stabilize before adding new challenges.' },
    unknown: { color: '#94A3B8', label: 'N/A', message: 'Insufficient data.' },
  };

  const eerCfg = eerConfig[eerLevel];
  const briCfg = briConfig[briLevel];
  const lsiCfg = lsiConfig[lsiLevel];

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
        System Health
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        Three core indices that measure your system&apos;s operating condition. These combine across all nine rays to show whether your system has surplus, is balanced, or needs recovery.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* EER Gauge */}
        <GaugeCard
          title="Energy Efficiency"
          abbrev="EER"
          value={eer != null ? eer.toFixed(1) + 'x' : '—'}
          percent={eer != null ? Math.min((eer / 4) * 100, 100) : 0}
          color={eerCfg.color}
          label={eerCfg.label}
          message={eerCfg.message}
          tooltip="Ratio of total shine to total eclipse across all rays. Higher = more energy available."
          prefersReduced={!!prefersReduced}
        />

        {/* BRI Gauge */}
        <GaugeCard
          title="Burnout Risk"
          abbrev="BRI"
          value={`${bri}/9`}
          percent={(bri / 9) * 100}
          color={briCfg.color}
          label={briCfg.label}
          message={briCfg.message}
          tooltip="Count of rays where eclipse score exceeds shine score. Lower = healthier."
          prefersReduced={!!prefersReduced}
          invertFill
        />

        {/* LSI Gauge */}
        <GaugeCard
          title="Load Snapshot"
          abbrev="LSI"
          value={lsi != null ? Math.round(lsi).toString() : '—'}
          percent={lsi ?? 0}
          color={lsiCfg.color}
          label={lsiCfg.label}
          message={lsiCfg.message}
          tooltip="Overall system load from 0 (unloaded) to 100 (max pressure). Combines eclipse dimensions."
          prefersReduced={!!prefersReduced}
          invertFill
        />
      </div>
    </section>
  );
}

// ── Individual Gauge Card ──
function GaugeCard({
  title, abbrev, value, percent, color, label, message, tooltip, prefersReduced, invertFill,
}: {
  title: string;
  abbrev: string;
  value: string;
  percent: number;
  color: string;
  label: string;
  message: string;
  tooltip: string;
  prefersReduced: boolean;
  invertFill?: boolean;
}) {
  // SVG arc gauge (180-degree arc)
  const radius = 40;
  const cx = 50;
  const cy = 50;
  const startAngle = Math.PI;
  const endAngle = 0;
  const fillAngle = startAngle - (percent / 100) * Math.PI;

  const arcPath = (angle: number) => {
    const x = cx + radius * Math.cos(angle);
    const y = cy - radius * Math.sin(angle);
    return `${x} ${y}`;
  };

  const bgArc = `M ${arcPath(startAngle)} A ${radius} ${radius} 0 0 1 ${arcPath(endAngle)}`;
  const fillArc = `M ${arcPath(startAngle)} A ${radius} ${radius} 0 ${percent > 50 ? 1 : 0} 1 ${arcPath(fillAngle)}`;

  return (
    <div
      className="glass-card p-5 text-center space-y-3"
      title={tooltip}
    >
      {/* Mini arc gauge */}
      <svg viewBox="0 0 100 55" className="w-full max-w-[140px] mx-auto" aria-hidden="true">
        {/* Background arc */}
        <path
          d={bgArc}
          fill="none"
          stroke="rgba(148, 80, 200, 0.2)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Fill arc */}
        {percent > 0 && (
          <path
            d={fillArc}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 4px ${color}50)`,
              transition: prefersReduced ? 'none' : 'stroke-dashoffset 1s ease-out',
            }}
          />
        )}
        {/* Center value */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill={color}
          fontSize="14"
          fontWeight="700"
          fontFamily="var(--font-inter, system-ui)"
        >
          {value}
        </text>
      </svg>

      {/* Labels */}
      <div>
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--brand-gold)' }}>
          {title}
        </p>
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1"
          style={{ background: `${color}18`, color }}
        >
          {label}
        </span>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
        {message}
      </p>
    </div>
  );
}
