'use client';

import { useMemo, useState } from 'react';
import { RAY_SHORT_NAMES } from '@/lib/types';

interface GrowthRun {
  run_id: string;
  run_number: number;
  completed_at: string;
  ray_pair_id: string;
  top_rays: string[];
  ray_scores: Record<string, number>;
}

interface RayDelta {
  rayId: string;
  name: string;
  before: number;
  after: number;
  delta: number;
}

const RAY_ORDER = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'];

function deltaColor(delta: number): string {
  if (delta >= 5) return 'var(--neon-teal)';     // Strong improvement
  if (delta > 0) return 'var(--text-body)';      // Mild improvement
  if (delta === 0) return 'var(--text-on-dark-muted)';
  if (delta > -5) return 'var(--ray-power)';     // Mild decline
  return 'var(--ray-power)';                      // Notable decline
}

function deltaArrow(delta: number): string {
  if (delta >= 5) return '\u2191\u2191';  // ↑↑
  if (delta > 0) return '\u2191';         // ↑
  if (delta === 0) return '\u2014';       // —
  if (delta > -5) return '\u2193';        // ↓
  return '\u2193\u2193';                   // ↓↓
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface RunComparisonViewProps {
  runs: GrowthRun[];
}

export default function RunComparisonView({ runs }: RunComparisonViewProps) {
  // Default: compare latest (runs[0]) vs previous (runs[1])
  const [beforeIdx, setBeforeIdx] = useState(1);
  const [afterIdx, setAfterIdx] = useState(0);

  const beforeRun = runs[beforeIdx] ?? runs[1] ?? runs[0];
  const afterRun = runs[afterIdx] ?? runs[0];

  const deltas: RayDelta[] = useMemo(() => {
    return RAY_ORDER.map((rayId) => ({
      rayId,
      name: RAY_SHORT_NAMES[rayId] ?? rayId,
      before: beforeRun.ray_scores?.[rayId] ?? 0,
      after: afterRun.ray_scores?.[rayId] ?? 0,
      delta: (afterRun.ray_scores?.[rayId] ?? 0) - (beforeRun.ray_scores?.[rayId] ?? 0),
    }));
  }, [beforeRun, afterRun]);

  const overallBefore = useMemo(() => {
    const vals = Object.values(beforeRun.ray_scores ?? {}).map(Number);
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }, [beforeRun]);

  const overallAfter = useMemo(() => {
    const vals = Object.values(afterRun.ray_scores ?? {}).map(Number);
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }, [afterRun]);

  if (runs.length < 2) {
    return (
      <div className="glass-card p-5 text-center space-y-2">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Complete a second assessment to unlock before/after comparison.
        </p>
        <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          Your scores, deltas, and growth direction — all mapped visually.
        </p>
      </div>
    );
  }

  const overallDelta = overallAfter - overallBefore;
  const improved = deltas.filter((d) => d.delta > 0).length;
  const declined = deltas.filter((d) => d.delta < 0).length;
  const biggestGain = [...deltas].sort((a, b) => b.delta - a.delta)[0];

  return (
    <div className="space-y-4">
      {/* Run selectors */}
      {runs.length > 2 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
              Before
            </span>
            <select
              value={beforeIdx}
              onChange={(e) => setBeforeIdx(Number(e.target.value))}
              className="text-xs rounded-lg px-2 py-1"
              style={{
                background: 'color-mix(in srgb, var(--violet-650) 30%, transparent)',
                color: 'var(--text-on-dark-secondary)',
                border: '1px solid color-mix(in srgb, var(--stroke-400) 20%, transparent)',
              }}
            >
              {runs.map((run, i) => (
                <option key={run.run_id} value={i} disabled={i === afterIdx}>
                  Run #{run.run_number} ({formatDate(run.completed_at)})
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>&rarr;</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
              After
            </span>
            <select
              value={afterIdx}
              onChange={(e) => setAfterIdx(Number(e.target.value))}
              className="text-xs rounded-lg px-2 py-1"
              style={{
                background: 'color-mix(in srgb, var(--violet-650) 30%, transparent)',
                color: 'var(--text-on-dark-secondary)',
                border: '1px solid color-mix(in srgb, var(--stroke-400) 20%, transparent)',
              }}
            >
              {runs.map((run, i) => (
                <option key={run.run_id} value={i} disabled={i === beforeIdx}>
                  Run #{run.run_number} ({formatDate(run.completed_at)})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Overall summary card */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
              Overall Shift
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: deltaColor(overallDelta) }}>
              {overallDelta > 0 ? '+' : ''}{overallDelta.toFixed(1)}
            </p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {improved} rays up &middot; {declined} rays down
            </p>
            {biggestGain && biggestGain.delta > 0 && (
              <p className="text-xs" style={{ color: 'var(--neon-teal)' }}>
                Biggest gain: {biggestGain.name} (+{biggestGain.delta.toFixed(1)})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ray-by-ray comparison bars */}
      <div className="space-y-1.5">
        {deltas.map((d) => (
          <div key={d.rayId} className="glass-card px-4 py-2.5">
            <div className="flex items-center gap-3">
              {/* Ray name */}
              <span className="text-xs font-medium w-20 shrink-0" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {d.name}
              </span>

              {/* Before/after bar visualization */}
              <div className="flex-1 min-w-0">
                <div className="relative h-4">
                  {/* Before bar (muted) */}
                  <div
                    className="absolute top-0 left-0 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(d.before, 100)}%`,
                      background: 'color-mix(in srgb, var(--stroke-400) 35%, transparent)',
                    }}
                  />
                  {/* After bar (colored by delta) */}
                  <div
                    className="absolute bottom-0 left-0 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(d.after, 100)}%`,
                      background: d.delta >= 0
                        ? 'linear-gradient(90deg, var(--surface-border) 0%, var(--surface-border) 100%)'
                        : 'linear-gradient(90deg, var(--surface-border) 0%, var(--surface-border) 100%)',
                    }}
                  />
                </div>
              </div>

              {/* Scores + delta */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] w-8 text-right" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {d.before.toFixed(0)}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>&rarr;</span>
                <span className="text-[10px] w-8" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  {d.after.toFixed(0)}
                </span>
                <span
                  className="text-xs font-bold w-10 text-right"
                  style={{ color: deltaColor(d.delta) }}
                >
                  {deltaArrow(d.delta)} {Math.abs(d.delta).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-4 rounded-full" style={{ background: 'color-mix(in srgb, var(--stroke-400) 35%, transparent)' }} />
          <span className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            Run #{beforeRun.run_number} ({formatDate(beforeRun.completed_at)})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-4 rounded-full" style={{ background: 'var(--surface-border)' }} />
          <span className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            Run #{afterRun.run_number} ({formatDate(afterRun.completed_at)})
          </span>
        </div>
      </div>
    </div>
  );
}
