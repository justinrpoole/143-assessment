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

/**
 * Results Stability Score — multi-run comparison.
 *
 * Fetches all completed assessment results for the current user,
 * computes per-ray stability (how consistent each ray is across runs),
 * and shows an overall stability coefficient.
 *
 * Only renders when the user has 2+ completed runs.
 */
export default function ResultsStabilityScore({ currentRunId }: { currentRunId: string }) {
  const [runs, setRuns] = useState<RunSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading || runs.length < 2) return null;

  // Sort by run_number ascending
  const sorted = [...runs].sort((a, b) => a.run_number - b.run_number);
  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];

  // Compute per-ray stability
  const rayIds = Object.keys(RAY_NAMES);
  const rayStability: Array<{
    id: string;
    name: string;
    current: number;
    previous: number;
    delta: number;
    stable: boolean;
  }> = rayIds.map((id) => {
    const current = latest.ray_scores[id] ?? 0;
    const prev = previous.ray_scores[id] ?? 0;
    const delta = current - prev;
    return {
      id,
      name: RAY_NAMES[id],
      current: Math.round(current * 100) / 100,
      previous: Math.round(prev * 100) / 100,
      delta: Math.round(delta * 100) / 100,
      stable: Math.abs(delta) < 0.3,
    };
  });

  // Overall stability coefficient: 1 - (mean absolute delta / max possible delta)
  const meanAbsDelta = rayStability.reduce((sum, r) => sum + Math.abs(r.delta), 0) / rayStability.length;
  const stabilityCoeff = Math.max(0, Math.min(1, 1 - (meanAbsDelta / 2)));
  const stabilityPct = Math.round(stabilityCoeff * 100);
  const stableCount = rayStability.filter((r) => r.stable).length;

  const stabilityLabel = stabilityPct >= 85
    ? 'Highly stable'
    : stabilityPct >= 65
      ? 'Moderately stable'
      : 'Evolving';

  return (
    <section className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Results Stability
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
            Comparing run {previous.run_number} → run {latest.run_number}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: stabilityPct >= 85 ? '#34D399' : stabilityPct >= 65 ? 'var(--brand-gold)' : '#FB923C' }}>
            {stabilityPct}%
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>{stabilityLabel}</p>
        </div>
      </div>

      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        {stableCount} of 9 rays are reliably consistent across your last two assessments.
        {stableCount >= 7
          ? ' Your profile is settling — these patterns are real.'
          : stableCount >= 4
            ? ' Some rays are stabilizing while others are still developing. This is normal during active growth.'
            : ' Your profile is evolving significantly. This suggests real change, context shifts, or assessment conditions that differed.'}
      </p>

      {/* Per-ray deltas */}
      <div className="space-y-2">
        {rayStability.map((ray) => (
          <div key={ray.id} className="flex items-center gap-3">
            <span
              className="text-xs font-medium w-[80px] shrink-0"
              style={{ color: ray.stable ? 'var(--text-on-dark-muted)' : 'var(--brand-gold)' }}
            >
              {ray.name}
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.max(5, (ray.current / 4) * 100))}%`,
                  background: ray.stable
                    ? 'rgba(52, 211, 153, 0.5)'
                    : ray.delta > 0
                      ? 'rgba(248, 208, 17, 0.5)'
                      : 'rgba(251, 146, 60, 0.5)',
                }}
              />
            </div>
            <span
              className="text-xs font-medium w-[50px] text-right shrink-0"
              style={{
                color: ray.stable
                  ? 'var(--text-on-dark-muted)'
                  : ray.delta > 0
                    ? '#34D399'
                    : '#FB923C',
              }}
            >
              {ray.delta > 0 ? '+' : ''}{ray.delta.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      {runs.length >= 3 && (
        <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          Based on {runs.length} completed assessments. Stability improves with more data points.
        </p>
      )}
    </section>
  );
}
