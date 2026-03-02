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
        <line key={r} x1={0} x2={width} y1={height * r} y2={height * r} stroke="rgba(37,246,255,0.06)" />
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
    return <p className="text-xs text-center py-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Complete two or more assessments to see score trends.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl p-4" style={{ background: '#060014', border: '1px solid rgba(37,246,255,0.2)' }}>
        <div className="flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-[0.14em]" style={{ color: '#25F6FF', fontFamily: 'var(--font-cosmic-display)' }}>Overall Trend</p>
          <span className="text-[9px]" style={{ color: 'rgba(37,246,255,0.75)', fontFamily: 'var(--font-cosmic-display)' }}>WEEKLY</span>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rayTrends.map((ray) => {
          const color = ray.delta >= 0 ? '#25F6FF' : '#FF3FB4';
          return (
            <div key={ray.rayId} className="px-3 py-2.5 rounded-xl" style={{ background: '#0A0018', border: '1px solid rgba(37,246,255,0.2)' }}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase" style={{ color: '#25F6FF', fontFamily: 'var(--font-cosmic-display)' }}>{ray.name}</p>
                  <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-cosmic-display)' }}>{ray.first.toFixed(0)} → {ray.last.toFixed(0)}</p>
                </div>
                <Sparkline values={ray.values} color={color} width={72} height={24} />
                <span className="text-[11px] font-bold w-8 text-right" style={{ color, textShadow: `0 0 10px ${color}`, fontFamily: 'var(--font-cosmic-display)' }}>
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
