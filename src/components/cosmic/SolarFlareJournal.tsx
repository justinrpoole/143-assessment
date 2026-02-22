'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface FlareEvent {
  id: string;
  rayId: string;
  rayName: string;
  label: string;
  date?: string;
  magnitude: number; // 0-1 (small wisp to massive CME)
}

interface SolarFlareJournalProps {
  flares: FlareEvent[];
}

const RAY_COLORS: Record<string, string> = {
  R1: '#F4C430', R2: '#F4C430', R3: '#8E44AD',
  R4: '#C0392B', R5: '#D4770B', R6: '#E8A317',
  R7: '#1ABC9C', R8: '#1ABC9C', R9: '#F4C430',
};

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Solar Flare Journal (#25) — Breakthrough Timeline
 *
 * Close-up sun surface with granulation cells. Solar flares erupt
 * in ray colors at different heights. Timeline axis along surface.
 * v3 branded: gold-orange surface, ray-colored flares against purple sky.
 */
export default function SolarFlareJournal({ flares }: SolarFlareJournalProps) {
  const reducedMotion = useReducedMotion();
  const W = 900;
  const H = 350;
  const surfaceY = H * 0.65;

  // Granulation cells on sun surface
  const granules = useMemo(() => {
    const cells: Array<{ x: number; y: number; r: number }> = [];
    for (let i = 0; i < 40; i++) {
      cells.push({
        x: seededRandom(i * 5) * W,
        y: surfaceY + seededRandom(i * 5 + 1) * (H - surfaceY),
        r: 6 + seededRandom(i * 5 + 2) * 12,
      });
    }
    return cells;
  }, []);

  // Position flares along the surface
  const flarePositions = useMemo(() => {
    const spacing = W / (flares.length + 1);
    return flares.map((flare, i) => ({
      ...flare,
      x: spacing * (i + 1),
      height: 30 + flare.magnitude * 120,
      color: RAY_COLORS[flare.rayId] ?? '#F4C430',
    }));
  }, [flares]);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Solar Flare Journal
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Solar flare journal timeline">
        <defs>
          {/* Deep space sky */}
          <linearGradient id="sfj-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050210" />
            <stop offset="30%" stopColor="#0a0318" />
            <stop offset="60%" stopColor="#1a0a35" />
            <stop offset="100%" stopColor="#E8A317" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="sfj-surface" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4C430" />
            <stop offset="50%" stopColor="#E8A317" />
            <stop offset="100%" stopColor="#D4770B" />
          </linearGradient>
          <filter id="sfj-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Scanline pattern */}
          <pattern id="sfj-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="rgba(0,0,0,0.04)" />
          </pattern>
        </defs>

        {/* Deep space sky */}
        <rect width={W} height={H} rx="12" fill="url(#sfj-sky)" />

        {/* Background stars in sky area */}
        {Array.from({ length: 20 }).map((_, i) => (
          <circle
            key={`bgstar-${i}`}
            cx={seededRandom(i * 41) * W}
            cy={seededRandom(i * 41 + 1) * surfaceY * 0.8}
            r={0.3 + seededRandom(i * 41 + 2) * 0.5}
            fill="#FFFFFF"
            opacity={0.05 + seededRandom(i * 41 + 3) * 0.1}
          />
        ))}

        {/* Sun surface */}
        <rect x={0} y={surfaceY} width={W} height={H - surfaceY} fill="url(#sfj-surface)" rx="0" />

        {/* Granulation cells */}
        {granules.map((g, i) => (
          <circle
            key={i}
            cx={g.x}
            cy={g.y}
            r={g.r}
            fill="#F4C430"
            opacity={0.15 + seededRandom(i * 13) * 0.2}
            stroke="#D4770B"
            strokeWidth={0.5}
            strokeOpacity={0.15}
          />
        ))}

        {/* Timeline axis along surface */}
        <line x1={20} y1={surfaceY + 2} x2={W - 20} y2={surfaceY + 2} stroke="#FFFFFF" strokeWidth={0.5} strokeOpacity={0.2} />

        {/* CRT scanline overlay — bottom layer behind flares for subtle effect */}
        <rect width={W} height={H} rx="12" fill="url(#sfj-scanlines)" opacity={0.35} />

        {/* Flares */}
        {flarePositions.map((flare, idx) => {
          const flarePeakY = surfaceY - flare.height;

          // Flare arc path
          const controlX1 = flare.x - 8 - flare.magnitude * 12;
          const controlY1 = surfaceY - flare.height * 0.6;
          const controlX2 = flare.x + 8 + flare.magnitude * 12;
          const controlY2 = surfaceY - flare.height * 0.4;
          const tipX = flare.x + flare.magnitude * 5;

          const flarePath = `M ${flare.x - 4} ${surfaceY} Q ${controlX1} ${controlY1} ${flare.x} ${flarePeakY} Q ${controlX2} ${controlY2} ${tipX + 4} ${surfaceY}`;

          return (
            <g key={flare.id}>
              {/* Flare body */}
              <motion.path
                d={flarePath}
                fill={flare.color}
                fillOpacity={0.2}
                stroke={flare.color}
                strokeWidth={1.5}
                strokeOpacity={0.6}
                initial={false}
                animate={
                  !reducedMotion
                    ? { strokeOpacity: [0.4, 0.7, 0.4] }
                    : undefined
                }
                transition={
                  !reducedMotion
                    ? { duration: 2 + seededRandom(idx * 9) * 2, repeat: Infinity, ease: 'easeInOut' }
                    : undefined
                }
              />

              {/* Flare tip */}
              <circle cx={flare.x} cy={flarePeakY} r={3} fill={flare.color} opacity={0.7} filter="url(#sfj-glow)" />

              {/* Scatter particles at tip */}
              {flare.magnitude > 0.5 && Array.from({ length: 4 }).map((_, pi) => {
                const angle = seededRandom(idx * 100 + pi * 7) * Math.PI - Math.PI / 2;
                const dist = 6 + seededRandom(idx * 100 + pi * 7 + 1) * 10;
                return (
                  <circle
                    key={pi}
                    cx={flare.x + Math.cos(angle) * dist}
                    cy={flarePeakY + Math.sin(angle) * dist}
                    r={1}
                    fill={flare.color}
                    opacity={0.4}
                  />
                );
              })}

              {/* Date tick */}
              <line x1={flare.x} y1={surfaceY + 2} x2={flare.x} y2={surfaceY + 8} stroke="#FFFFFF" strokeWidth={0.5} strokeOpacity={0.3} />

              {/* Labels */}
              <text x={flare.x} y={surfaceY + 18} textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="500" opacity={0.4}>
                {flare.date ?? ''}
              </text>
              <text x={flare.x} y={surfaceY + 28} textAnchor="middle" fill={flare.color} fontSize="7" fontWeight="500" opacity={0.5}>
                {flare.rayName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
