'use client';

import { useState, useEffect } from 'react';

interface RunSnapshot {
  run_id: string;
  run_number: number;
  ray_scores: Record<string, number>;
  computed_at: string;
}

const RAY_NAMES: Record<string, string> = {
  R1: 'Intention', R2: 'Joy', R3: 'Presence', R4: 'Power', R5: 'Purpose',
  R6: 'Authenticity', R7: 'Connection', R8: 'Possibility', R9: 'Be The Light',
};

const RAY_IDS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'];

/**
 * TrajectoryView — multi-run ray trend visualization.
 *
 * Shows how each ray's score has changed across all completed runs.
 * Renders inline sparklines per ray and overall trajectory direction
 * (growing, stabilizing, or declining).
 *
 * Only renders when user has 3+ completed runs (2 runs → use ResultsStabilityScore instead).
 */
export default function TrajectoryView({ currentRunId }: { currentRunId: string }) {
  const [runs, setRuns] = useState<RunSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRay, setSelectedRay] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const res = await fetch('/api/runs/history');
        if (!res.ok) return;
        const data = (await res.json()) as { runs?: RunSnapshot[] };
        if (canceled) return;
        setRuns(data.runs ?? []);
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    void load();
    return () => { canceled = true; };
  }, [currentRunId]);

  if (loading || runs.length < 3) return null;

  const sorted = [...runs].sort((a, b) => a.run_number - b.run_number);

  // Compute per-ray trajectory
  const trajectories = RAY_IDS.map((rayId) => {
    const values = sorted.map((r) => r.ray_scores[rayId] ?? 0);
    const first = values[0];
    const last = values[values.length - 1];
    const totalDelta = last - first;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;

    // Simple linear trend: positive = growing, negative = declining
    let direction: 'growing' | 'stable' | 'declining' = 'stable';
    if (totalDelta > 0.2) direction = 'growing';
    else if (totalDelta < -0.2) direction = 'declining';

    return {
      rayId,
      name: RAY_NAMES[rayId],
      values,
      first: Math.round(first * 100) / 100,
      last: Math.round(last * 100) / 100,
      totalDelta: Math.round(totalDelta * 100) / 100,
      range: Math.round(range * 100) / 100,
      direction,
    };
  });

  // Overall trajectory
  const growingCount = trajectories.filter((t) => t.direction === 'growing').length;
  const decliningCount = trajectories.filter((t) => t.direction === 'declining').length;
  const overallDirection = growingCount > decliningCount ? 'Growing' : decliningCount > growingCount ? 'Shifting' : 'Stabilizing';

  const selected = selectedRay ? trajectories.find((t) => t.rayId === selectedRay) : null;

  return (
    <section className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Growth Trajectory
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
            {sorted.length} assessments over time
          </p>
        </div>
        <div className="text-center">
          <p
            className="text-sm font-bold"
            style={{
              color: overallDirection === 'Growing'
                ? '#34D399'
                : overallDirection === 'Shifting'
                  ? '#FB923C'
                  : 'var(--brand-gold)',
            }}
          >
            {overallDirection}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            {growingCount} growing · {decliningCount} shifting
          </p>
        </div>
      </div>

      {/* Ray sparklines */}
      <div className="space-y-1.5">
        {trajectories.map((t) => (
          <button
            key={t.rayId}
            type="button"
            onClick={() => setSelectedRay(selectedRay === t.rayId ? null : t.rayId)}
            className="w-full flex items-center gap-3 py-1 px-1 rounded-lg transition-colors"
            style={{
              background: selectedRay === t.rayId ? 'rgba(248, 208, 17, 0.06)' : 'transparent',
            }}
          >
            <span
              className="text-xs font-medium w-[80px] shrink-0 text-left"
              style={{
                color: t.direction === 'growing'
                  ? '#34D399'
                  : t.direction === 'declining'
                    ? '#FB923C'
                    : 'var(--text-on-dark-muted)',
              }}
            >
              {t.name}
            </span>

            {/* Inline sparkline */}
            <div className="flex-1 h-4">
              <svg width="100%" height="16" preserveAspectRatio="none" viewBox={`0 0 ${t.values.length - 1} 1`}>
                <polyline
                  fill="none"
                  strokeWidth="0.06"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    stroke: t.direction === 'growing'
                      ? '#34D399'
                      : t.direction === 'declining'
                        ? '#FB923C'
                        : 'rgba(248, 208, 17, 0.5)',
                  }}
                  points={t.values
                    .map((v, i) => {
                      const maxV = Math.max(...t.values, 0.01);
                      return `${i},${1 - v / (maxV * 1.1)}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>

            <span
              className="text-xs font-medium w-[50px] text-right shrink-0"
              style={{
                color: t.totalDelta > 0
                  ? '#34D399'
                  : t.totalDelta < 0
                    ? '#FB923C'
                    : 'var(--text-on-dark-muted)',
              }}
            >
              {t.totalDelta > 0 ? '+' : ''}{t.totalDelta.toFixed(1)}
            </span>
          </button>
        ))}
      </div>

      {/* Selected ray detail */}
      {selected && (
        <div
          className="rounded-xl p-3 space-y-2"
          style={{ background: 'rgba(248, 208, 17, 0.04)', border: '1px solid rgba(248, 208, 17, 0.08)' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'var(--brand-gold)' }}>
            {selected.name} — Detail
          </p>
          <div className="flex gap-4">
            <div>
              <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>First</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>{selected.first.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>Latest</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>{selected.last.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>Range</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>{selected.range.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>Trend</p>
              <p
                className="text-sm font-medium capitalize"
                style={{
                  color: selected.direction === 'growing' ? '#34D399' : selected.direction === 'declining' ? '#FB923C' : 'var(--brand-gold)',
                }}
              >
                {selected.direction}
              </p>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {selected.direction === 'growing'
              ? `Your ${selected.name} capacity has increased by ${selected.totalDelta.toFixed(1)} across ${sorted.length} assessments. This growth pattern is real.`
              : selected.direction === 'declining'
                ? `Your ${selected.name} access has shifted by ${selected.totalDelta.toFixed(1)}. This may reflect changing context, not lost capacity.`
                : `Your ${selected.name} access is consistent across assessments. This stability suggests a reliable baseline.`}
          </p>
        </div>
      )}

      <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
        Tap any ray to see detail. Trends based on {sorted.length} completed assessments.
      </p>
    </section>
  );
}
