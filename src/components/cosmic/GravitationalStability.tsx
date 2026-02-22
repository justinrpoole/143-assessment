'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import type { RayOutput } from '@/lib/types';

interface GravitationalStabilityProps {
  rays: Record<string, RayOutput>;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

const RAY_COLORS: Record<string, string> = {
  R1: '#F4C430', R2: '#F4C430', R3: '#8E44AD',
  R4: '#C0392B', R5: '#D4770B', R6: '#E8A317',
  R7: '#1ABC9C', R8: '#1ABC9C', R9: '#F4C430',
};

/**
 * Gravitational Stability (#16) — Dual State Comparison
 *
 * Left: chaotic orbits, tangled paths, sputtering sun, collision debris.
 * Right: steady orbits, clean coplanar paths, brilliant sun.
 * v3 branded: gold orbits on royal purple, warm interaction zones.
 */
export default function GravitationalStability({ rays }: GravitationalStabilityProps) {
  const reducedMotion = useReducedMotion();
  const W = 800;
  const H = 380;
  const half = W / 2 - 4;

  // Compute stability from ray score variance
  const stability = useMemo(() => {
    const scores = Object.values(rays).map((r) => r.net_energy ?? r.score);
    if (scores.length === 0) return 0.5;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, s) => a + (s - mean) ** 2, 0) / scores.length;
    return Math.max(0, Math.min(1, 1 - Math.sqrt(variance) / 40));
  }, [rays]);

  const rayEntries = useMemo(() => Object.entries(rays).slice(0, 9), [rays]);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Gravitational Stability
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Gravitational stability comparison — unstable vs stable">
        <defs>
          <filter id="gs-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* LEFT — Unstable */}
        <g>
          <rect x={0} y={0} width={half} height={H} rx="12" fill="#3A0A5E" />
          {/* Noise texture overlay */}
          <rect x={0} y={0} width={half} height={H} rx="12" fill="#2C0A3E" opacity={0.3} />

          {/* Sputtering sun */}
          <circle cx={half / 2} cy={H / 2} r={12} fill="#F4C430" opacity={0.4} />
          <circle cx={half / 2} cy={H / 2} r={6} fill="#FFFFFF" opacity={0.2} />

          {/* Chaotic orbits — tangled crossing paths */}
          {rayEntries.map(([id], idx) => {
            const cx = half / 2;
            const cy = H / 2;
            const angle = seededRandom(idx * 13) * Math.PI * 2;
            const rx = 30 + seededRandom(idx * 13 + 1) * 80;
            const ry = 20 + seededRandom(idx * 13 + 2) * 60;
            const rotation = seededRandom(idx * 13 + 3) * 120 - 60;
            const color = RAY_COLORS[id] ?? '#F4C430';

            // Orbit position
            const t = seededRandom(idx * 13 + 4) * Math.PI * 2;
            const ox = cx + Math.cos(t + angle) * rx;
            const oy = cy + Math.sin(t + angle) * ry;

            return (
              <g key={`unstable-${id}`}>
                {/* Orbit path */}
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={0.4}
                  strokeOpacity={0.12}
                  transform={`rotate(${rotation} ${cx} ${cy})`}
                />
                {/* Orbiting object */}
                <motion.circle
                  cx={ox}
                  cy={oy}
                  r={4}
                  fill={color}
                  opacity={0.6}
                  initial={false}
                  animate={
                    !reducedMotion
                      ? {
                          x: [(seededRandom(idx * 13 + 5) - 0.5) * 15, (seededRandom(idx * 13 + 6) - 0.5) * 15],
                          y: [(seededRandom(idx * 13 + 7) - 0.5) * 10, (seededRandom(idx * 13 + 8) - 0.5) * 10],
                        }
                      : undefined
                  }
                  transition={
                    !reducedMotion
                      ? { duration: 2 + seededRandom(idx * 13 + 9) * 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
                      : undefined
                  }
                />
              </g>
            );
          })}

          {/* Collision debris */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.circle
              key={`debris-${i}`}
              cx={half / 2 + (seededRandom(i * 17) - 0.5) * 120}
              cy={H / 2 + (seededRandom(i * 17 + 1) - 0.5) * 100}
              r={1 + seededRandom(i * 17 + 2)}
              fill="#F4C430"
              initial={false}
              animate={
                !reducedMotion
                  ? { opacity: [0.1, 0.3, 0.1] }
                  : { opacity: 0.15 }
              }
              transition={
                !reducedMotion
                  ? { duration: 2 + seededRandom(i * 17 + 3) * 3, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
            />
          ))}

          <text x={half / 2} y={H - 16} textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="600" opacity={0.35}>
            UNSTABLE
          </text>
        </g>

        {/* Divider */}
        <rect x={half} y={0} width={8} height={H} fill="#2C0A3E" />

        {/* RIGHT — Stable */}
        <g transform={`translate(${half + 8}, 0)`}>
          <rect x={0} y={0} width={half} height={H} rx="12" fill="#5B2C8E" />

          {/* Brilliant sun */}
          <circle cx={half / 2} cy={H / 2} r={16} fill="#F4C430" opacity={0.8} filter="url(#gs-glow)" />
          <circle cx={half / 2} cy={H / 2} r={8} fill="#FFFFFF" opacity={0.6} />

          {/* Sun beams */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={half / 2 + Math.cos(angle) * 18}
                y1={H / 2 + Math.sin(angle) * 18}
                x2={half / 2 + Math.cos(angle) * 28}
                y2={H / 2 + Math.sin(angle) * 28}
                stroke="#F4C430"
                strokeWidth={2}
                strokeOpacity={0.5}
              />
            );
          })}

          {/* Clean coplanar orbits */}
          {rayEntries.map(([id], idx) => {
            const cx = half / 2;
            const cy = H / 2;
            const r = 45 + idx * 14;
            const color = RAY_COLORS[id] ?? '#F4C430';
            const t = (idx / rayEntries.length) * Math.PI * 2;
            const ox = cx + Math.cos(t) * r;
            const oy = cy + Math.sin(t) * r * 0.45;

            return (
              <g key={`stable-${id}`}>
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={r}
                  ry={r * 0.45}
                  fill="none"
                  stroke="#F4C430"
                  strokeWidth={0.6}
                  strokeOpacity={0.2}
                />
                <motion.circle
                  cx={ox}
                  cy={oy}
                  r={4}
                  fill={color}
                  opacity={0.8}
                  initial={false}
                  animate={
                    !reducedMotion
                      ? { opacity: [0.7, 0.9, 0.7] }
                      : undefined
                  }
                  transition={
                    !reducedMotion
                      ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                      : undefined
                  }
                />
              </g>
            );
          })}

          <text x={half / 2} y={H - 16} textAnchor="middle" fill="#F4C430" fontSize="10" fontWeight="600" opacity={0.5}>
            STABLE
          </text>
        </g>
      </svg>

      {/* Current stability indicator */}
      <div className="mt-3 flex items-center gap-3">
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--surface-glass)', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', borderRadius: 2, background: stability > 0.6 ? '#F4C430' : stability > 0.35 ? '#E8A317' : '#C0392B' }}
            initial={false}
            animate={{ width: `${stability * 100}%` }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </div>
        <span style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600 }}>
          {Math.round(stability * 100)}%
        </span>
      </div>
    </div>
  );
}
