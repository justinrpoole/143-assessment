'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import type { RayOutput } from '@/lib/types';

interface SolarWindMomentumProps {
  rays: Record<string, RayOutput>;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Solar Wind Momentum (#21) — Directed Energy Flow
 *
 * Two states stacked: Strong (dense gold particle stream with wave patterns)
 * vs Weak (sparse aimless particles). Score-driven density.
 * v3 branded: gold particle river on royal purple.
 */
export default function SolarWindMomentum({ rays }: SolarWindMomentumProps) {
  const reducedMotion = useReducedMotion();
  const W = 800;
  const H = 380;
  const halfH = H / 2 - 4;

  // Compute momentum from average net_energy
  const momentum = useMemo(() => {
    const scores = Object.values(rays).map((r) => r.net_energy ?? r.score);
    if (scores.length === 0) return 50;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [rays]);

  const isStrong = momentum >= 55;

  // Generate particles for strong wind
  const strongParticles = useMemo(() => {
    const pts: Array<{ x: number; y: number; speed: number; size: number }> = [];
    for (let i = 0; i < 120; i++) {
      const t = seededRandom(i * 3);
      pts.push({
        x: 80 + t * (W - 120),
        y: 10 + seededRandom(i * 3 + 1) * (halfH - 20),
        speed: 1 + seededRandom(i * 3 + 2) * 2,
        size: 1 + seededRandom(i * 3 + 2) * 2,
      });
    }
    return pts;
  }, []);

  // Generate particles for weak wind
  const weakParticles = useMemo(() => {
    const pts: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];
    for (let i = 0; i < 25; i++) {
      pts.push({
        x: 80 + seededRandom(i * 5) * (W - 120),
        y: 10 + seededRandom(i * 5 + 1) * (halfH - 20),
        vx: (seededRandom(i * 5 + 2) - 0.3) * 20,
        vy: (seededRandom(i * 5 + 3) - 0.5) * 15,
        size: 1.5 + seededRandom(i * 5 + 4),
      });
    }
    return pts;
  }, []);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Solar Wind Momentum
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={`Solar wind momentum — ${isStrong ? 'strong' : 'weak'}`}>
        <defs>
          <filter id="swm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* TOP — Strong Wind */}
        <g>
          <rect x={0} y={0} width={W} height={halfH} rx="12" fill="var(--cosmic-svg-bg)" />

          {/* Bright 143 sun */}
          <circle cx={50} cy={halfH / 2} r={18} fill="#F4C430" opacity={0.8} filter="url(#swm-glow)" />
          <circle cx={50} cy={halfH / 2} r={9} fill="#FFFFFF" opacity={0.6} />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={50 + Math.cos(angle) * 20}
                y1={halfH / 2 + Math.sin(angle) * 20}
                x2={50 + Math.cos(angle) * 28}
                y2={halfH / 2 + Math.sin(angle) * 28}
                stroke="#F4C430"
                strokeWidth={2}
                strokeOpacity={0.5}
              />
            );
          })}

          {/* Dense particle stream */}
          {strongParticles.map((p, i) => (
            <motion.ellipse
              key={i}
              cx={p.x}
              cy={p.y}
              rx={p.size * 1.8}
              ry={p.size * 0.5}
              fill={i % 3 === 0 ? '#E8A317' : '#F4C430'}
              initial={false}
              animate={
                !reducedMotion
                  ? { cx: [p.x - 10, p.x + 10], opacity: [0.3, 0.6, 0.3] }
                  : { opacity: 0.4 }
              }
              transition={
                !reducedMotion
                  ? { duration: p.speed, repeat: Infinity, ease: 'linear' }
                  : undefined
              }
            />
          ))}

          {/* Wave density bands */}
          {[0.25, 0.5, 0.75].map((t, i) => (
            <motion.rect
              key={i}
              x={80 + t * (W - 120) - 15}
              y={0}
              width={30}
              height={halfH}
              fill="#E8A317"
              initial={false}
              animate={
                !reducedMotion
                  ? { opacity: [0.02, 0.06, 0.02] }
                  : { opacity: 0.03 }
              }
              transition={
                !reducedMotion
                  ? { duration: 2, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
            />
          ))}

          <text x={W - 16} y={halfH / 2 + 4} textAnchor="end" fill="#F4C430" fontSize="10" fontWeight="600" opacity={0.5}>
            STRONG
          </text>
        </g>

        {/* Divider */}
        <rect x={0} y={halfH} width={W} height={8} fill="#2C0A3E" />

        {/* BOTTOM — Weak Wind */}
        <g transform={`translate(0, ${halfH + 8})`}>
          <rect x={0} y={0} width={W} height={halfH} rx="12" fill="#3A0A5E" />

          {/* Dim sun */}
          <circle cx={50} cy={halfH / 2} r={14} fill="#F4C430" opacity={0.3} />
          <circle cx={50} cy={halfH / 2} r={6} fill="#F4C430" opacity={0.2} />

          {/* Sparse aimless particles */}
          {weakParticles.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill="#F4C430"
              initial={false}
              animate={
                !reducedMotion
                  ? {
                      cx: [p.x, p.x + p.vx, p.x],
                      cy: [p.y, p.y + p.vy, p.y],
                      opacity: [0.15, 0.3, 0.15],
                    }
                  : { opacity: 0.2 }
              }
              transition={
                !reducedMotion
                  ? { duration: 4 + seededRandom(i * 11) * 3, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
            />
          ))}

          <text x={W - 16} y={halfH / 2 + 4} textAnchor="end" fill="#888888" fontSize="10" fontWeight="600" opacity={0.4}>
            WEAK
          </text>
        </g>
      </svg>

      {/* Current state indicator */}
      <div className="mt-3 flex items-center justify-between">
        <span style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11 }}>Your momentum</span>
        <span
          className="status-pill"
          style={{
            background: isStrong ? 'rgba(244, 196, 48, 0.12)' : 'rgba(167, 139, 250, 0.12)',
            color: isStrong ? '#F4C430' : '#A78BFA',
          }}
        >
          {isStrong ? 'Strong' : 'Building'}
        </span>
      </div>
    </div>
  );
}
