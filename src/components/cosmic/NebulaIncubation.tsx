'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface IncubatingGoal {
  id: string;
  label: string;
  progress: number; // 0-1
}

interface NebulaIncubationProps {
  goals: IncubatingGoal[];
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Nebula Incubation Zone (#23) — Goals Forming, Not Yet Ignited
 *
 * Swirling nebula cloud on purple canvas with proto-star at center.
 * Dense knots, filaments, bright ridges. Beautiful on its own.
 * v3 branded: violet/teal/amber/rose clouds on royal purple.
 */
export default function NebulaIncubation({ goals }: NebulaIncubationProps) {
  const reducedMotion = useReducedMotion();
  const W = 500;
  const H = 500;
  const cx = W / 2;
  const cy = H / 2;

  // Nebula cloud layers
  const clouds = useMemo(() => {
    const layers: Array<{ x: number; y: number; rx: number; ry: number; color: string; opacity: number; rotation: number }> = [];
    const colors = ['#5B2C8E', '#1ABC9C', '#C39BD3', '#E8A317', '#8E44AD'];

    for (let i = 0; i < 25; i++) {
      const angle = seededRandom(i * 7) * Math.PI * 2;
      const dist = seededRandom(i * 7 + 1) * 150;
      layers.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        rx: 30 + seededRandom(i * 7 + 2) * 60,
        ry: 20 + seededRandom(i * 7 + 3) * 40,
        color: colors[i % colors.length],
        opacity: 0.05 + seededRandom(i * 7 + 4) * 0.15,
        rotation: seededRandom(i * 7 + 5) * 360,
      });
    }
    return layers;
  }, [cx, cy]);

  // Bright ridges (filament-like structures)
  const ridges = useMemo(() => {
    const r: Array<{ x1: number; y1: number; x2: number; y2: number; color: string }> = [];
    for (let i = 0; i < 8; i++) {
      const angle = seededRandom(i * 11) * Math.PI * 2;
      const dist1 = 40 + seededRandom(i * 11 + 1) * 80;
      const dist2 = dist1 + 30 + seededRandom(i * 11 + 2) * 50;
      r.push({
        x1: cx + Math.cos(angle) * dist1,
        y1: cy + Math.sin(angle) * dist1,
        x2: cx + Math.cos(angle + 0.3) * dist2,
        y2: cy + Math.sin(angle + 0.3) * dist2,
        color: seededRandom(i * 11 + 3) > 0.5 ? '#F4C430' : '#C39BD3',
      });
    }
    return r;
  }, [cx, cy]);

  // Proto-star brightness based on average goal progress
  const avgProgress = goals.length > 0 ? goals.reduce((a, g) => a + g.progress, 0) / goals.length : 0.3;

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Nebula Incubation
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Nebula incubation zone — goals forming">
        <defs>
          <filter id="ni-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="ni-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} rx="12" fill="var(--cosmic-svg-bg)" />

        {/* Nebula cloud layers */}
        {clouds.map((cloud, i) => (
          <motion.ellipse
            key={i}
            cx={cloud.x}
            cy={cloud.y}
            rx={cloud.rx}
            ry={cloud.ry}
            fill={cloud.color}
            opacity={cloud.opacity}
            transform={`rotate(${cloud.rotation} ${cloud.x} ${cloud.y})`}
            filter="url(#ni-blur)"
            initial={false}
            animate={
              !reducedMotion
                ? { opacity: [cloud.opacity * 0.7, cloud.opacity, cloud.opacity * 0.7] }
                : undefined
            }
            transition={
              !reducedMotion
                ? { duration: 6 + seededRandom(i * 13) * 4, repeat: Infinity, ease: 'easeInOut' }
                : undefined
            }
          />
        ))}

        {/* Dark dust lanes */}
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = seededRandom(i * 19) * Math.PI * 2;
          const d = 50 + seededRandom(i * 19 + 1) * 100;
          return (
            <line
              key={i}
              x1={cx + Math.cos(angle) * d}
              y1={cy + Math.sin(angle) * d}
              x2={cx + Math.cos(angle + 0.5) * (d + 60)}
              y2={cy + Math.sin(angle + 0.5) * (d + 60)}
              stroke="#2C0A3E"
              strokeWidth={8 + seededRandom(i * 19 + 2) * 12}
              strokeOpacity={0.4}
              strokeLinecap="round"
              filter="url(#ni-blur)"
            />
          );
        })}

        {/* Bright ridges */}
        {ridges.map((r, i) => (
          <line
            key={i}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke={r.color}
            strokeWidth={2}
            strokeOpacity={0.15}
            strokeLinecap="round"
          />
        ))}

        {/* Proto-star at center */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={12}
          fill="#F4C430"
          opacity={0.3 + avgProgress * 0.4}
          filter="url(#ni-glow)"
          initial={false}
          animate={
            !reducedMotion
              ? { opacity: [0.3 + avgProgress * 0.3, 0.3 + avgProgress * 0.5, 0.3 + avgProgress * 0.3] }
              : undefined
          }
          transition={!reducedMotion ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
        <circle cx={cx} cy={cy} r={5} fill="#F4C430" opacity={0.55} />

        {/* Orbiting material fragments */}
        {goals.map((goal, i) => {
          const angle = (i / goals.length) * Math.PI * 2 + seededRandom(i * 23);
          const dist = 25 + i * 12;
          const gx = cx + Math.cos(angle) * dist;
          const gy = cy + Math.sin(angle) * dist;
          return (
            <motion.circle
              key={goal.id}
              cx={gx}
              cy={gy}
              r={2 + goal.progress * 2}
              fill="#E8A317"
              opacity={0.3 + goal.progress * 0.3}
              initial={false}
              animate={
                !reducedMotion
                  ? { cx: [gx - 3, gx + 3], cy: [gy - 2, gy + 2] }
                  : undefined
              }
              transition={
                !reducedMotion
                  ? { duration: 5 + i * 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
                  : undefined
              }
            />
          );
        })}
      </svg>

      {/* Goal labels */}
      {goals.length > 0 && (
        <div className="mt-3 space-y-2">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center gap-3">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8A317', opacity: 0.3 + goal.progress * 0.5 }} />
              <span style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, flex: 1 }}>{goal.label}</span>
              <span style={{ color: 'var(--text-on-dark-muted)', fontSize: 10 }}>{Math.round(goal.progress * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
