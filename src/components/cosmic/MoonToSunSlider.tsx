'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface MoonToSunSliderProps {
  /** Overall score 0-100 */
  score: number;
  /** Optional label below the slider */
  label?: string;
}

// Seeded random for reproducible star positions
function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Moon-to-Sun Slider — Overall Score Bar (#14)
 *
 * Panoramic horizontal slider that transforms from crescent moon (left)
 * to radiant 143 brand sun (right). Indicator dot sits at the user's
 * overall score position. Background transitions from deep purple to
 * warm golden atmosphere. v3 branded: royal purple, gold accents.
 */
export default function MoonToSunSlider({ score, label }: MoonToSunSliderProps) {
  const reducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, score));

  // Layout constants
  const W = 800;
  const H = 180;
  const BAR_Y = H * 0.5;
  const BAR_H = 14;
  const BAR_X0 = 80;
  const BAR_X1 = W - 80;
  const BAR_W = BAR_X1 - BAR_X0;
  const indicatorX = BAR_X0 + (clamped / 100) * BAR_W;

  // Moon
  const MOON_CX = 40;
  const MOON_CY = BAR_Y;
  const MOON_R = 20;

  // Sun
  const SUN_CX = W - 40;
  const SUN_CY = BAR_Y;
  const SUN_R = 20;

  // Stars (sparse, warm)
  const stars = useMemo(() => {
    const result: Array<{ x: number; y: number; r: number; o: number; d: number }> = [];
    for (let i = 0; i < 25; i++) {
      result.push({
        x: seededRandom(i * 7 + 1) * W,
        y: seededRandom(i * 7 + 2) * H,
        r: 0.4 + seededRandom(i * 7 + 3) * 0.8,
        o: 0.15 + seededRandom(i * 7 + 4) * 0.35,
        d: 1.5 + seededRandom(i * 7 + 5) * 3,
      });
    }
    return result;
  }, []);

  // Sun beam geometry (12 beams)
  const beams = useMemo(() => {
    const BEAM_COUNT = 12;
    const HALF_W = 8; // degrees
    const BASE_R = SUN_R * 0.95;
    const TIP_R = SUN_R * 1.65;

    return Array.from({ length: BEAM_COUNT }, (_, i) => {
      const angle = i * (360 / BEAM_COUNT);
      const centerRad = (angle * Math.PI) / 180;
      const b1Rad = ((angle - HALF_W) * Math.PI) / 180;
      const b2Rad = ((angle + HALF_W) * Math.PI) / 180;

      return [
        `${SUN_CX + BASE_R * Math.cos(b1Rad)},${SUN_CY + BASE_R * Math.sin(b1Rad)}`,
        `${SUN_CX + TIP_R * Math.cos(centerRad)},${SUN_CY + TIP_R * Math.sin(centerRad)}`,
        `${SUN_CX + BASE_R * Math.cos(b2Rad)},${SUN_CY + BASE_R * Math.sin(b2Rad)}`,
      ].join(' ');
    });
  }, []);

  return (
    <div
      className="glass-card p-5"
      role="img"
      aria-label={`Overall score: ${Math.round(clamped)} out of 100`}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
        <defs>
          {/* Background gradient — deep purple left to warm purple right */}
          <linearGradient id="mts-bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3A0A5E" />
            <stop offset="40%" stopColor="var(--cosmic-svg-bg)" />
            <stop offset="70%" stopColor="var(--cosmic-purple-vivid)" />
            <stop offset="100%" stopColor="var(--cosmic-purple-vivid)" />
          </linearGradient>

          {/* Warm atmospheric haze on the right */}
          <linearGradient id="mts-atmo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0" />
            <stop offset="60%" stopColor="#F4C430" stopOpacity="0" />
            <stop offset="100%" stopColor="#E8A317" stopOpacity="0.08" />
          </linearGradient>

          {/* Bar gradient — moon silver through lavender → rose → amber → gold */}
          <linearGradient id="mts-bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#BDC3C7" />
            <stop offset="12%" stopColor="#C39BD3" />
            <stop offset="28%" stopColor="#D4A0B9" />
            <stop offset="45%" stopColor="#E8A317" />
            <stop offset="70%" stopColor="#F4C430" />
            <stop offset="100%" stopColor="#FFF8E7" />
          </linearGradient>

          {/* Dimmed bar gradient */}
          <linearGradient id="mts-bar-dim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#BDC3C7" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#E8A317" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0.12" />
          </linearGradient>

          {/* Moon glow */}
          <radialGradient id="mts-moon-glow">
            <stop offset="0%" stopColor="#BDC3C7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#BDC3C7" stopOpacity="0" />
          </radialGradient>

          {/* Sun glow */}
          <radialGradient id="mts-sun-glow">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#E8A317" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#E8A317" stopOpacity="0" />
          </radialGradient>

          {/* Sun core gradient */}
          <radialGradient id="mts-sun-core" cx="42%" cy="38%" r="56%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="30%" stopColor="#F4C430" />
            <stop offset="70%" stopColor="#E8A317" />
            <stop offset="100%" stopColor="#A8820A" />
          </radialGradient>

          {/* Indicator glow */}
          <radialGradient id="mts-dot-glow">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#F4C430" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
          </radialGradient>

          {/* Soft glow filter */}
          <filter id="mts-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip for lit bar portion */}
          <clipPath id="mts-lit-clip">
            <rect
              x={BAR_X0}
              y={BAR_Y - BAR_H / 2}
              width={Math.max(0, indicatorX - BAR_X0)}
              height={BAR_H}
              rx={BAR_H / 2}
            />
          </clipPath>

          {/* Clip for dim bar portion */}
          <clipPath id="mts-dim-clip">
            <rect
              x={indicatorX}
              y={BAR_Y - BAR_H / 2}
              width={Math.max(0, BAR_X1 - indicatorX)}
              height={BAR_H}
              rx={BAR_H / 2}
            />
          </clipPath>
        </defs>

        {/* Background */}
        <rect width={W} height={H} rx="12" fill="url(#mts-bg)" />
        <rect width={W} height={H} rx="12" fill="url(#mts-atmo)" />

        {/* Stars */}
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#F0F0FF" opacity={s.o}>
            {!reducedMotion && (
              <animate
                attributeName="opacity"
                values={`${s.o};${s.o * 0.3};${s.o}`}
                dur={`${s.d}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}

        {/* ── Moon (left) ── */}
        <circle cx={MOON_CX} cy={MOON_CY} r={MOON_R * 2} fill="url(#mts-moon-glow)" />
        {/* Moon body */}
        <circle cx={MOON_CX} cy={MOON_CY} r={MOON_R} fill="#BDC3C7" />
        {/* Moon crescent — dark circle offset to create crescent shape */}
        <circle cx={MOON_CX + 9} cy={MOON_CY - 1} r={MOON_R - 2} fill="#3A0A5E" />

        {/* ── Bar — lit portion (left of indicator) ── */}
        <rect
          x={BAR_X0}
          y={BAR_Y - BAR_H / 2}
          width={BAR_W}
          height={BAR_H}
          rx={BAR_H / 2}
          fill="url(#mts-bar)"
          clipPath="url(#mts-lit-clip)"
        />

        {/* ── Bar — dim portion (right of indicator) ── */}
        <rect
          x={BAR_X0}
          y={BAR_Y - BAR_H / 2}
          width={BAR_W}
          height={BAR_H}
          rx={BAR_H / 2}
          fill="url(#mts-bar-dim)"
          clipPath="url(#mts-dim-clip)"
        />

        {/* ── Sun (right) ── */}
        {/* Outer glow */}
        <circle cx={SUN_CX} cy={SUN_CY} r={SUN_R * 2.5} fill="url(#mts-sun-glow)" />

        {/* Beams */}
        {beams.map((pts, i) => (
          <motion.polygon
            key={i}
            points={pts}
            fill="#F4C430"
            initial={false}
            animate={
              !reducedMotion
                ? { opacity: [0.85, 1, 0.85] }
                : undefined
            }
            transition={
              !reducedMotion
                ? {
                    duration: 3 + (i % 3) * 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.1,
                  }
                : undefined
            }
          />
        ))}

        {/* Sun body */}
        <circle cx={SUN_CX} cy={SUN_CY} r={SUN_R} fill="url(#mts-sun-core)" />
        {/* White-hot center */}
        <circle cx={SUN_CX - 3} cy={SUN_CY - 3} r={SUN_R * 0.3} fill="white" opacity={0.25} />

        {/* ── Indicator dot ── */}
        {/* Outer glow */}
        <motion.circle
          cx={indicatorX}
          cy={BAR_Y}
          r={14}
          fill="url(#mts-dot-glow)"
          initial={false}
          animate={!reducedMotion ? { r: [13, 15, 13] } : undefined}
          transition={!reducedMotion ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
        {/* Inner dot */}
        <circle
          cx={indicatorX}
          cy={BAR_Y}
          r={6}
          fill="#FFF8E7"
          filter="url(#mts-glow)"
        />
        {/* Core */}
        <circle cx={indicatorX} cy={BAR_Y} r={3.5} fill="#F4C430" opacity={0.9} />

        {/* Trailing wake — faint line from left showing journey */}
        <line
          x1={BAR_X0}
          y1={BAR_Y}
          x2={indicatorX - 16}
          y2={BAR_Y}
          stroke="#F4C430"
          strokeWidth={0.5}
          strokeOpacity={0.15}
        />

        {/* Score number */}
        <text
          x={indicatorX}
          y={BAR_Y + BAR_H / 2 + 22}
          textAnchor="middle"
          fill="#F0F0FF"
          fontSize="13"
          fontWeight="700"
          fontFamily="var(--font-body)"
          opacity={0.85}
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
