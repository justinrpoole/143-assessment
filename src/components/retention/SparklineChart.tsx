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

const POS_COLOR = "var(--neon-cyan)";
const NEG_COLOR = "var(--neon-pink)";
const CHART_BG = "var(--bg-deep)";
const CHART_BORDER = "var(--surface-border)";
const GRID_LINE = "var(--constellation-line)";

function Sparkline({ values, color, width = 90, height = 30 }: { values: number[]; color: string; width?: number; height?: number }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const p = 3;
  const innerW = width - p * 2;
  const innerH = height - p * 2;

  const points = values.map((v, i) => {
    const x = p + (i / (values.length - 1)) * innerW;
    const y = p + innerH - ((v - min) / range) * innerH;
    return { x, y };
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {[0.25, 0.5, 0.75].map((r) => (
        <line key={r} x1={0} x2={width} y1={height * r} y2={height * r} stroke={GRID_LINE} />
      ))}
      <polyline
        points={points.map((d) => `${d.x},${d.y}`).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      {points.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="2" fill={color} style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
      ))}
    </svg>
  );
}

const RAY_ORDER = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'];

interface SparklineChartProps { runs: GrowthRun[] }

export default function SparklineChart({ runs }: SparklineChartProps) {
  const chronological = useMemo(() => [...runs].reverse(), [runs]);
  const rayTrends = useMemo(() => RAY_ORDER.map((rayId) => {
    const values = chronological.map((run) => Number(run.ray_scores?.[rayId] ?? 0));
    const first = values[0];
    const last = values[values.length - 1];
    return { rayId, name: RAY_SHORT_NAMES[rayId] ?? rayId, values, first, last, delta: last - first };
  }), [chronological]);

  if (chronological.length < 2) {
    return <p className="text-xs text-center py-3 text-secondary">Complete two or more assessments to see score trends.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: CHART_BG, border: `1px solid ${CHART_BORDER}` }}>
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 2px, color-mix(in srgb, var(--ink-950) 24%, transparent) 3px)' }} />
        <div className="relative z-10 flex items-center justify-between" style={{ fontFamily: "var(--font-cosmic-display)" }}>
          <p className="text-[9px] uppercase tracking-[0.14em] text-neon-cyan" style={{ textShadow: "var(--text-glow-cyan)" }}>Overall Trend</p>
          <span className="text-[9px] text-neon-cyan" style={{ opacity: 0.85, textShadow: "var(--text-glow-cyan)" }}>WEEKLY</span>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rayTrends.map((ray) => {
          const color = ray.delta >= 0 ? POS_COLOR : NEG_COLOR;
          return (
            <div key={ray.rayId} className="px-3 py-2.5 rounded-xl relative overflow-hidden" style={{ background: CHART_BG, border: `1px solid ${CHART_BORDER}` }}>
              <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 2px, color-mix(in srgb, var(--ink-950) 24%, transparent) 3px)' }} />
              <div className="relative z-10 flex items-center justify-between gap-2" style={{ fontFamily: "var(--font-cosmic-display)" }}>
                <div>
                  <p className="text-xs uppercase text-neon-cyan" style={{ textShadow: "var(--text-glow-cyan)" }}>{ray.name}</p>
                  <p className="text-[9px] text-muted">{ray.first.toFixed(0)} → {ray.last.toFixed(0)}</p>
                </div>
                <Sparkline values={ray.values} color={color} width={72} height={24} />
                <span className="text-[11px] font-bold w-8 text-right" style={{ color, textShadow: `0 0 10px ${color}` }}>
                  {ray.delta >= 0 ? '+' : ''}{ray.delta.toFixed(0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
