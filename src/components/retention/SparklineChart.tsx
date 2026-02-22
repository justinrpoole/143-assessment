'use client';

import { useMemo } from 'react';
import { RAY_SHORT_NAMES } from '@/lib/types';

interface GrowthRun {
  run_id: string;
  run_number: number;
  completed_at: string;
  ray_pair_id: string;
  top_rays: string[];
  ray_scores: Record<string, number>;
}

// ── Inline SVG sparkline ──
function Sparkline({
  values,
  color,
  width = 80,
  height = 24,
}: {
  values: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 2;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * innerW;
    const y = padding + innerH - ((v - min) / range) * innerH;
    return `${x},${y}`;
  });

  const lastX = padding + innerW;
  const lastY = padding + innerH - ((values[values.length - 1] - min) / range) * innerH;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      {/* Current position dot */}
      <circle cx={lastX} cy={lastY} r="2" fill={color} />
    </svg>
  );
}

const RAY_ORDER = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'];

interface SparklineChartProps {
  runs: GrowthRun[];
}

export default function SparklineChart({ runs }: SparklineChartProps) {
  // Runs come newest-first; reverse for chronological sparklines
  const chronological = useMemo(() => [...runs].reverse(), [runs]);

  if (chronological.length < 2) {
    return (
      <p className="text-xs text-center py-3" style={{ color: 'var(--text-on-dark-muted)' }}>
        Complete two or more assessments to see score trends.
      </p>
    );
  }

  const rayTrends = useMemo(() => {
    return RAY_ORDER.map((rayId) => {
      const values = chronological.map((run) => Number(run.ray_scores?.[rayId] ?? 0));
      const first = values[0];
      const last = values[values.length - 1];
      const delta = last - first;
      return { rayId, name: RAY_SHORT_NAMES[rayId] ?? rayId, values, first, last, delta };
    });
  }, [chronological]);

  // Overall trend
  const overallValues = useMemo(() => {
    return chronological.map((run) => {
      const vals = Object.values(run.ray_scores ?? {}).map(Number);
      return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
  }, [chronological]);

  const overallDelta = overallValues[overallValues.length - 1] - overallValues[0];

  return (
    <div className="space-y-3">
      {/* Overall sparkline */}
      <div className="glass-card p-4" style={{ borderColor: 'rgba(248, 208, 17, 0.2)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
              Overall Trend
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {chronological.length} assessments over {daysBetween(chronological[0].completed_at, chronological[chronological.length - 1].completed_at)} days
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Sparkline values={overallValues} color="#F8D011" width={100} height={28} />
            <span
              className="text-sm font-bold"
              style={{ color: overallDelta >= 0 ? '#34D399' : '#F87171' }}
            >
              {overallDelta >= 0 ? '+' : ''}{overallDelta.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Per-ray sparklines */}
      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {rayTrends.map((ray) => (
          <div key={ray.rayId} className="glass-card px-3 py-2.5 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {ray.name}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
                {ray.first.toFixed(0)} &rarr; {ray.last.toFixed(0)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sparkline
                values={ray.values}
                color={ray.delta >= 0 ? '#34D399' : '#F87171'}
                width={64}
                height={20}
              />
              <span
                className="text-[11px] font-bold w-8 text-right"
                style={{ color: ray.delta >= 0 ? '#34D399' : '#F87171' }}
              >
                {ray.delta >= 0 ? '+' : ''}{ray.delta.toFixed(0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.max(1, Math.round(Math.abs(db - da) / (1000 * 60 * 60 * 24)));
}
