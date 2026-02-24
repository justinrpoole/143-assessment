'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface MoonToSunArcProps {
  /** Overall score 0-100 */
  score: number;
  /** Optional label */
  label?: string;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

// Layout constants (stable across renders)
const MSA_W = 320;
const MSA_H = 480;
const MSA_HORIZON_Y = MSA_H * 0.65;
const MSA_ARC_LEFT_X = 30;
const MSA_ARC_RIGHT_X = MSA_W - 30;
const MSA_ARC_PEAK_Y = 50;
const MSA_ARC_CX = MSA_W / 2;
const MSA_ARC_RX = (MSA_ARC_RIGHT_X - MSA_ARC_LEFT_X) / 2;
const MSA_ARC_RY = MSA_HORIZON_Y - MSA_ARC_PEAK_Y;

// Get point on arc at position t (0 = left horizon, 1 = right horizon, 0.5 = apex)
// Parametric ellipse: x = cx + rx*cos(angle), y = cy - ry*sin(angle)
// angle goes from PI (left) to 0 (right)
function arcPoint(t: number): { x: number; y: number } {
  const angle = Math.PI * (1 - t);
  return {
    x: MSA_ARC_CX + MSA_ARC_RX * Math.cos(angle),
    y: MSA_HORIZON_Y - MSA_ARC_RY * Math.sin(angle),
  };
}

/**
 * Moon-to-Sun Arc — Vertical Sunrise Score Meter (#15)
 *
 * Vertical composition showing a sunrise arc from horizon upward.
 * Moon rests below the horizon, sun sits at the arc's apex. The sky
 * transforms along the arc from deep purple through rose-pink to
 * warm gold. Indicator dot shows progress along the dawn arc.
 * v3 branded: royal purple sky, golden sunrise, dark landscape.
 */
export default function MoonToSunArc({ score, label }: MoonToSunArcProps) {
  const reducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, score));

  // Layout (aliases for module-level constants)
  const W = MSA_W;
  const H = MSA_H;
  const HORIZON_Y = MSA_HORIZON_Y;

  // Arc path: semicircle from left horizon to right horizon, peaking at top
  const ARC_LEFT_X = MSA_ARC_LEFT_X;
  const ARC_RIGHT_X = MSA_ARC_RIGHT_X;
  const ARC_RX = MSA_ARC_RX;
  const ARC_RY = MSA_ARC_RY;

  // Score maps to arc position: 0% = left, 100% = apex (0.5),
  // but we use full range 0-1 where score maps to 0-0.5 (left-to-apex)
  const scoreT = (clamped / 100) * 0.5; // 0 = left horizon, 0.5 = apex
  const indicator = arcPoint(scoreT);

  // Sun position at apex
  const sun = arcPoint(0.5);

  // Moon position below horizon
  const MOON_CX = W / 2;
  const MOON_CY = HORIZON_Y + 50;
  const MOON_R = 14;

  // Arc path SVG for the full arc
  const fullArcPath = `M ${ARC_LEFT_X} ${HORIZON_Y} A ${ARC_RX} ${ARC_RY} 0 0 1 ${ARC_RIGHT_X} ${HORIZON_Y}`;

  // Lit arc path (up to indicator position)
  const litArcPoints = useMemo(() => {
    const points: string[] = [];
    const steps = 40;
    const endT = scoreT;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * endT;
      const pt = arcPoint(t);
      points.push(`${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`);
    }
    return points.join(' ');
  }, [scoreT]);

  // Stars
  const stars = useMemo(() => {
    const result: Array<{ x: number; y: number; r: number; o: number }> = [];
    for (let i = 0; i < 20; i++) {
      const x = seededRandom(i * 5 + 1) * W;
      const y = seededRandom(i * 5 + 2) * (HORIZON_Y - 20);
      result.push({
        x,
        y,
        r: 0.4 + seededRandom(i * 5 + 3) * 0.7,
        o: 0.15 + seededRandom(i * 5 + 4) * 0.3,
      });
    }
    return result;
  }, [W, HORIZON_Y]);

  // Horizon dawn clouds
  const cloudPoints = useMemo(() => {
    const pts: string[] = [];
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * W;
      const y = HORIZON_Y - 5 + Math.sin(i * 1.2) * 3 + Math.cos(i * 0.7) * 2;
      pts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    pts.push(`L ${W} ${HORIZON_Y + 5} L 0 ${HORIZON_Y + 5} Z`);
    return pts.join(' ');
  }, [W, HORIZON_Y]);

  return (
    <div
      className="glass-card p-5"
      role="img"
      aria-label={`Sunrise arc score: ${Math.round(clamped)} out of 100`}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto" aria-hidden="true">
        <defs>
          {/* Sky gradient — deep purple top to warmer purple at horizon */}
          <linearGradient id="msa-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A0A5E" />
            <stop offset="40%" stopColor="var(--cosmic-svg-bg)" />
            <stop offset="70%" stopColor="var(--cosmic-purple-vivid)" />
            <stop offset="90%" stopColor="#7B4FA2" />
            <stop offset="100%" stopColor="#C39BD3" stopOpacity="0.3" />
          </linearGradient>

          {/* Dawn glow at horizon */}
          <radialGradient id="msa-dawn" cx="50%" cy="100%" rx="60%" ry="30%">
            <stop offset="0%" stopColor="#E8A317" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#F4C430" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
          </radialGradient>

          {/* Landscape gradient — dark silhouette */}
          <linearGradient id="msa-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="100%" stopColor="#0A0A0A" />
          </linearGradient>

          {/* Sun at apex */}
          <radialGradient id="msa-sun" cx="42%" cy="38%" r="56%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="30%" stopColor="#F4C430" />
            <stop offset="70%" stopColor="#E8A317" />
            <stop offset="100%" stopColor="#A8820A" />
          </radialGradient>

          <radialGradient id="msa-sun-glow">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
          </radialGradient>

          {/* Moon glow */}
          <radialGradient id="msa-moon-glow">
            <stop offset="0%" stopColor="#BDC3C7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#BDC3C7" stopOpacity="0" />
          </radialGradient>

          {/* Indicator glow */}
          <radialGradient id="msa-dot-glow">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#F4C430" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
          </radialGradient>

          {/* Lit arc gradient */}
          <linearGradient id="msa-arc-lit" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#C39BD3" />
            <stop offset="30%" stopColor="#E8A317" />
            <stop offset="60%" stopColor="#F4C430" />
            <stop offset="100%" stopColor="#FFF8E7" />
          </linearGradient>

          <filter id="msa-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <rect width={W} height={HORIZON_Y} fill="url(#msa-sky)" />

        {/* Dawn glow at horizon */}
        <rect width={W} y={HORIZON_Y - 80} height={80} fill="url(#msa-dawn)" />

        {/* Stars */}
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#F0F0FF" opacity={s.o}>
            {!reducedMotion && (
              <animate
                attributeName="opacity"
                values={`${s.o};${s.o * 0.3};${s.o}`}
                dur={`${2 + seededRandom(i) * 3}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}

        {/* Landscape silhouette — gentle rolling hills */}
        <path
          d={`M 0 ${HORIZON_Y} Q ${W * 0.15} ${HORIZON_Y - 15} ${W * 0.3} ${HORIZON_Y - 8} Q ${W * 0.5} ${HORIZON_Y + 5} ${W * 0.7} ${HORIZON_Y - 12} Q ${W * 0.85} ${HORIZON_Y - 20} ${W} ${HORIZON_Y - 5} L ${W} ${H} L 0 ${H} Z`}
          fill="url(#msa-land)"
        />

        {/* Dawn cloud wisps at horizon */}
        <path d={cloudPoints} fill="#C39BD3" opacity={0.1} />

        {/* Thin gold horizon line */}
        <line
          x1={0}
          y1={HORIZON_Y}
          x2={W}
          y2={HORIZON_Y}
          stroke="#F4C430"
          strokeWidth={0.5}
          strokeOpacity={0.15}
        />

        {/* ── Moon below horizon ── */}
        <circle cx={MOON_CX} cy={MOON_CY} r={MOON_R * 2} fill="url(#msa-moon-glow)" />
        <circle cx={MOON_CX} cy={MOON_CY} r={MOON_R} fill="#BDC3C7" opacity={0.5} />
        <circle cx={MOON_CX + 5} cy={MOON_CY - 1} r={MOON_R - 2} fill="#1A1A1A" />

        {/* ── Full arc path (dim) ── */}
        <path
          d={fullArcPath}
          fill="none"
          stroke="#F0F0FF"
          strokeWidth={1}
          strokeOpacity={0.08}
          strokeDasharray="4 6"
        />

        {/* ── Lit arc (up to indicator) ── */}
        <path
          d={litArcPoints}
          fill="none"
          stroke="url(#msa-arc-lit)"
          strokeWidth={2}
          strokeOpacity={0.6}
          filter="url(#msa-glow)"
        />

        {/* ── Sun at apex ── */}
        <circle cx={sun.x} cy={sun.y} r={18 * 2.5} fill="url(#msa-sun-glow)" />
        {/* Sun beams */}
        {Array.from({ length: 10 }, (_, i) => {
          const angle = (i * 36 * Math.PI) / 180;
          const inner = 16 * 0.9;
          const outer = 16 * 1.6;
          const hw = (7 * Math.PI) / 180;
          return (
            <polygon
              key={`beam-${i}`}
              points={`${sun.x + inner * Math.cos(angle - hw)},${sun.y + inner * Math.sin(angle - hw)} ${sun.x + outer * Math.cos(angle)},${sun.y + outer * Math.sin(angle)} ${sun.x + inner * Math.cos(angle + hw)},${sun.y + inner * Math.sin(angle + hw)}`}
              fill="#F4C430"
              opacity={clamped > 80 ? 0.7 : 0.25}
            />
          );
        })}
        <circle cx={sun.x} cy={sun.y} r={16} fill="url(#msa-sun)" opacity={clamped > 80 ? 1 : 0.4} />

        {/* ── Indicator dot on arc ── */}
        <motion.circle
          cx={indicator.x}
          cy={indicator.y}
          r={12}
          fill="url(#msa-dot-glow)"
          initial={false}
          animate={!reducedMotion ? { r: [11, 13, 11] } : undefined}
          transition={!reducedMotion ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
        <circle cx={indicator.x} cy={indicator.y} r={5} fill="#FFF8E7" filter="url(#msa-glow)" />
        <circle cx={indicator.x} cy={indicator.y} r={3} fill="#F4C430" />

        {/* Score text near indicator */}
        <text
          x={indicator.x + 14}
          y={indicator.y + 4}
          fill="#F0F0FF"
          fontSize="12"
          fontWeight="700"
          fontFamily="var(--font-body)"
          opacity={0.8}
        >
          {Math.round(clamped)}
        </text>
      </svg>

      {label && (
        <p
          className="text-center mt-2"
          style={{ color: 'var(--text-on-dark-secondary)', fontSize: 13 }}
        >
          {label}
        </p>
      )}
    </div>
  );
}
