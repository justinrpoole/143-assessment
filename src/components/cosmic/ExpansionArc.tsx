'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface Milestone {
  id: string;
  label: string;
  rayColor?: string;
  icon?: string;
}

interface ExpansionArcProps {
  /** Timeline milestones from oldest to newest */
  milestones: Milestone[];
  /** Current expansion phase (0-1 where 1 = fully expanded) */
  expansion?: number;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

const DEFAULT_RAY_COLORS = ['#1ABC9C', '#D4770B', '#F4C430', '#C0392B', '#8E44AD'];

/**
 * Expansion Arc Timeline (#12) — Personal Growth Journey
 *
 * Horizontal timeline showing orbit system expanding from tight past (left)
 * to spacious present (right). Milestones appear as glowing markers.
 * v3 branded: cool-compressed past to warm-expanded present on purple canvas.
 */
export default function ExpansionArc({ milestones, expansion = 0.8 }: ExpansionArcProps) {
  const reducedMotion = useReducedMotion();
  const W = 900;
  const H = 320;

  // Three stages along the timeline
  const stages = useMemo(() => {
    const past = { x: 100, y: H / 2, sunR: 5, orbitScale: 0.3, warmth: 0.2 };
    const mid = { x: W / 2, y: H / 2, sunR: 12, orbitScale: 0.7, warmth: 0.6 };
    const present = { x: W - 100, y: H / 2, sunR: 20, orbitScale: 1, warmth: 1 };
    return [past, mid, present];
  }, []);

  // Place milestones along the timeline
  const milestonePositions = useMemo(() => {
    return milestones.map((m, i) => {
      const t = milestones.length > 1 ? i / (milestones.length - 1) : 0.5;
      const x = 130 + t * (W - 260);
      const y = H / 2 + (seededRandom(i * 7) - 0.5) * 60;
      return { ...m, x, y, color: m.rayColor ?? DEFAULT_RAY_COLORS[i % DEFAULT_RAY_COLORS.length] };
    });
  }, [milestones]);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Expansion Arc
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Personal expansion arc timeline">
        <defs>
          <linearGradient id="ea-bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3A0A5E" />
            <stop offset="50%" stopColor="#4A0E78" />
            <stop offset="100%" stopColor="#5B2C8E" />
          </linearGradient>
          <filter id="ea-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} rx="12" fill="url(#ea-bg)" />

        {/* Warm golden haze on the right (present) */}
        <rect x={W * 0.6} y={0} width={W * 0.4} height={H} rx="0" fill="#F4C430" opacity={0.04} />

        {/* Timeline axis */}
        <line x1={60} y1={H - 30} x2={W - 60} y2={H - 30} stroke="#FFFFFF" strokeWidth={0.5} strokeOpacity={0.1} />
        {/* Tick marks */}
        {Array.from({ length: 10 }).map((_, i) => {
          const x = 60 + (i / 9) * (W - 120);
          return <line key={i} x1={x} y1={H - 33} x2={x} y2={H - 27} stroke="#FFFFFF" strokeWidth={0.5} strokeOpacity={0.08} />;
        })}

        {/* Three orbit systems at past / middle / present */}
        {stages.map((stage, si) => {
          const ringCount = 3;
          const orbitGap = 15 + stage.orbitScale * 25;
          const goldOpacity = stage.warmth;

          return (
            <g key={si}>
              {/* Orbit rings */}
              {Array.from({ length: ringCount }).map((_, ri) => {
                const r = (ri + 1) * orbitGap;
                return (
                  <ellipse
                    key={ri}
                    cx={stage.x}
                    cy={stage.y}
                    rx={r}
                    ry={r * 0.5}
                    fill="none"
                    stroke={goldOpacity > 0.5 ? '#F4C430' : '#FFFFFF'}
                    strokeWidth={0.6}
                    strokeOpacity={0.1 + goldOpacity * 0.15}
                    strokeDasharray="3 5"
                  />
                );
              })}

              {/* Central sun */}
              <motion.circle
                cx={stage.x}
                cy={stage.y}
                r={stage.sunR}
                fill="#F4C430"
                opacity={0.3 + goldOpacity * 0.5}
                filter={si === 2 ? 'url(#ea-glow)' : undefined}
                initial={false}
                animate={
                  si === 2 && !reducedMotion
                    ? { opacity: [0.6, 0.85, 0.6] }
                    : undefined
                }
                transition={
                  !reducedMotion ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined
                }
              />

              {/* Sun beams on present sun */}
              {si === 2 && Array.from({ length: 12 }).map((_, bi) => {
                const angle = (bi / 12) * Math.PI * 2;
                const innerR = stage.sunR + 2;
                const outerR = stage.sunR + 10;
                return (
                  <line
                    key={bi}
                    x1={stage.x + Math.cos(angle) * innerR}
                    y1={stage.y + Math.sin(angle) * innerR}
                    x2={stage.x + Math.cos(angle) * outerR}
                    y2={stage.y + Math.sin(angle) * outerR}
                    stroke="#F4C430"
                    strokeWidth={1.5}
                    strokeOpacity={0.5}
                  />
                );
              })}

              {/* Stage label */}
              <text
                x={stage.x}
                y={H - 12}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="9"
                fontWeight="500"
                opacity={0.3}
              >
                {si === 0 ? 'Past' : si === 1 ? 'Growing' : 'Present'}
              </text>
            </g>
          );
        })}

        {/* Gold light threads connecting stages */}
        {stages.map((stage, si) => {
          if (si === 0) return null;
          const prev = stages[si - 1];
          return (
            <line
              key={`thread-${si}`}
              x1={prev.x}
              y1={prev.y}
              x2={stage.x}
              y2={stage.y}
              stroke="#F4C430"
              strokeWidth={0.8}
              strokeOpacity={0.15}
              strokeDasharray="6 8"
            />
          );
        })}

        {/* Milestones */}
        {milestonePositions.map((m, i) => (
          <g key={m.id}>
            {/* Glow */}
            <circle cx={m.x} cy={m.y} r={8} fill={m.color} opacity={0.15} />
            {/* Star dot */}
            <motion.circle
              cx={m.x}
              cy={m.y}
              r={4}
              fill={m.color}
              initial={false}
              animate={
                !reducedMotion
                  ? { r: [3.5, 4.5, 3.5], opacity: [0.7, 1, 0.7] }
                  : undefined
              }
              transition={
                !reducedMotion
                  ? { duration: 2 + seededRandom(i * 3) * 2, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
            />
            {/* Annotation line */}
            <line x1={m.x} y1={m.y + 6} x2={m.x} y2={m.y + 18} stroke={m.color} strokeWidth={0.5} strokeOpacity={0.3} />
            {/* Label */}
            <text x={m.x} y={m.y + 26} textAnchor="middle" fill={m.color} fontSize="7" fontWeight="500" opacity={0.6}>
              {m.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
