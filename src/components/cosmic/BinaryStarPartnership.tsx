'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface BinaryStarPartnershipProps {
  /** Alignment score 0-100 (0 = drifting, 100 = perfectly aligned) */
  alignment: number;
  /** Names or labels for the two stars */
  starA?: string;
  starB?: string;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

// Infinity path points for aligned state (pure helper — no component-scope deps)
function infinityPoint(t: number, cx: number, cy: number, rx: number, ry: number): { x: number; y: number } {
  const angle = t * Math.PI * 2;
  const denom = 1 + Math.sin(angle) * Math.sin(angle);
  return {
    x: cx + (rx * Math.cos(angle)) / denom,
    y: cy + (ry * Math.sin(angle) * Math.cos(angle)) / denom,
  };
}

/**
 * Binary Star Partnership (#27) — Relationship Visualization
 *
 * Two states: Aligned (figure-eight infinity path, merged glow) vs
 * Drifting (wider asymmetric orbits, no combined glow).
 * v3 branded: gold + teal-gold stars on royal purple.
 */
export default function BinaryStarPartnership({
  alignment,
  starA = 'You',
  starB = 'Partner',
}: BinaryStarPartnershipProps) {
  const reducedMotion = useReducedMotion();
  const W = 800;
  const H = 380;
  const half = W / 2 - 4;

  const isAligned = alignment >= 55;

  // Generate flow particles for aligned state
  const flowParticles = useMemo(() => {
    const pts: Array<{ t: number; offset: number }> = [];
    for (let i = 0; i < 12; i++) {
      pts.push({ t: i / 12, offset: seededRandom(i * 7) * 4 - 2 });
    }
    return pts;
  }, []);

  // Build infinity SVG path
  const infinityPath = useMemo(() => {
    const cx = half / 2;
    const cy = H / 2;
    const rx = 80;
    const ry = 50;
    const steps = 60;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const p = infinityPoint(t, cx, cy, rx, ry);
      pts.push(`${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`);
    }
    pts.push('Z');
    return pts.join(' ');
  }, [half, H]);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Binary Star Partnership
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={`Binary star partnership — ${isAligned ? 'aligned' : 'drifting'}`}>
        <defs>
          <filter id="bsp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* LEFT — Aligned */}
        <g>
          <rect x={0} y={0} width={half} height={H} rx="12" fill="var(--cosmic-svg-bg)" />

          {/* Infinity path */}
          <path
            d={infinityPath}
            fill="none"
            stroke="#F4C430"
            strokeWidth={1.5}
            strokeOpacity={0.35}
          />

          {/* Star A (gold) */}
          <motion.circle
            cx={half / 2 - 55}
            cy={H / 2}
            r={14}
            fill="#F4C430"
            opacity={0.85}
            filter="url(#bsp-glow)"
            initial={false}
            animate={!reducedMotion ? { opacity: [0.75, 0.9, 0.75] } : undefined}
            transition={!reducedMotion ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
          />
          {/* Mini beam points */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={half / 2 - 55 + Math.cos(angle) * 16}
                y1={H / 2 + Math.sin(angle) * 16}
                x2={half / 2 - 55 + Math.cos(angle) * 22}
                y2={H / 2 + Math.sin(angle) * 22}
                stroke="#F4C430"
                strokeWidth={1.5}
                strokeOpacity={0.3}
              />
            );
          })}

          {/* Star B (teal-gold) */}
          <motion.circle
            cx={half / 2 + 55}
            cy={H / 2}
            r={13}
            fill="#1ABC9C"
            opacity={0.8}
            filter="url(#bsp-glow)"
            initial={false}
            animate={!reducedMotion ? { opacity: [0.7, 0.85, 0.7] } : undefined}
            transition={!reducedMotion ? { duration: 3, delay: 0.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
          />

          {/* Combined glow bloom at crossing point */}
          <circle cx={half / 2} cy={H / 2} r={20} fill="#FFFFFF" opacity={0.08} filter="url(#bsp-glow)" />

          {/* Flow particles along infinity path */}
          {flowParticles.map((fp, i) => {
            const p = infinityPoint(fp.t, half / 2, H / 2, 80, 50);
            return (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y + fp.offset}
                r={1.5}
                fill="#F4C430"
                initial={false}
                animate={!reducedMotion ? { opacity: [0.2, 0.5, 0.2] } : { opacity: 0.3 }}
                transition={!reducedMotion ? { duration: 2, delay: fp.t * 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
              />
            );
          })}

          <text x={half / 2 - 55} y={H / 2 + 28} textAnchor="middle" fill="#F4C430" fontSize="8" opacity={0.5}>{starA}</text>
          <text x={half / 2 + 55} y={H / 2 + 28} textAnchor="middle" fill="#1ABC9C" fontSize="8" opacity={0.5}>{starB}</text>
          <text x={half / 2} y={H - 16} textAnchor="middle" fill="#F4C430" fontSize="10" fontWeight="600" opacity={0.5}>ALIGNED</text>
        </g>

        {/* Divider */}
        <rect x={half} y={0} width={8} height={H} fill="#2C0A3E" />

        {/* RIGHT — Drifting */}
        <g transform={`translate(${half + 8}, 0)`}>
          <rect x={0} y={0} width={half} height={H} rx="12" fill="#3A0A5E" />

          {/* Wider asymmetric orbit paths */}
          <ellipse cx={half / 2 - 30} cy={H / 2} rx={55} ry={40} fill="none" stroke="#FFFFFF" strokeWidth={0.5} strokeOpacity={0.1} />
          <ellipse cx={half / 2 + 40} cy={H / 2} rx={70} ry={50} fill="none" stroke="#FFFFFF" strokeWidth={0.5} strokeOpacity={0.08} transform={`rotate(15 ${half / 2 + 40} ${H / 2})`} />

          {/* Star A — same position, same brightness */}
          <circle cx={half / 2 - 70} cy={H / 2 - 10} r={14} fill="#F4C430" opacity={0.65} />

          {/* Star B — dimmer, farther */}
          <circle cx={half / 2 + 90} cy={H / 2 + 20} r={12} fill="#1ABC9C" opacity={0.45} />

          {/* Empty purple gap where combined glow used to be */}
          <circle cx={half / 2} cy={H / 2} r={15} fill="none" stroke="#FFFFFF" strokeWidth={0.3} strokeOpacity={0.05} strokeDasharray="2 4" />

          <text x={half / 2 - 70} y={H / 2 + 28} textAnchor="middle" fill="#F4C430" fontSize="8" opacity={0.4}>{starA}</text>
          <text x={half / 2 + 90} y={H / 2 + 42} textAnchor="middle" fill="#1ABC9C" fontSize="8" opacity={0.3}>{starB}</text>
          <text x={half / 2} y={H - 16} textAnchor="middle" fill="#888888" fontSize="10" fontWeight="600" opacity={0.35}>DRIFTING</text>
        </g>
      </svg>

      {/* Current alignment indicator */}
      <div className="mt-3 flex items-center gap-3">
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--surface-glass)', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', borderRadius: 2, background: isAligned ? '#F4C430' : '#A78BFA' }}
            initial={false}
            animate={{ width: `${alignment}%` }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </div>
        <span style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600 }}>
          {alignment}%
        </span>
      </div>
    </div>
  );
}
