'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';

interface StardustCheckinsProps {
  /** Number of completed streak days (0-30+) */
  streakDays: number;
  /** Callback when the user taps the stardust field */
  onTap?: () => void;
  /** Total constellation points to complete */
  constellationSize?: number;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

/**
 * Stardust Check-ins (#7) — Meditative Instinct Check-in
 *
 * A calm purple field of ~200 stars. Tapping creates concentric gold ripples.
 * Bottom-right shows a constellation forming from completed streak days.
 * v3 branded: royal purple background, gold ripple, gold constellation lines.
 */
export default function StardustCheckins({
  streakDays,
  onTap,
  constellationSize = 12,
}: StardustCheckinsProps) {
  const reducedMotion = useReducedMotion();
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const W = 400;
  const H = 600;

  // Generate ~200 stars with seeded positions
  const stars = useMemo(() => {
    const s: Array<{ x: number; y: number; size: number; opacity: number; color: string; delay: number }> = [];
    for (let i = 0; i < 200; i++) {
      const x = seededRandom(i * 3) * W;
      const y = seededRandom(i * 3 + 1) * H;
      const size = seededRandom(i * 3 + 2) < 0.85 ? 0.8 : seededRandom(i * 3 + 2) < 0.95 ? 1.4 : 2;
      const colorRoll = seededRandom(i * 7);
      const color = colorRoll < 0.8 ? '#FFFFFF' : colorRoll < 0.95 ? '#F4C430' : '#C39BD3';
      const opacity = 0.15 + seededRandom(i * 7 + 1) * 0.55;
      s.push({ x, y, size, opacity, color, delay: seededRandom(i * 7 + 2) * 6 });
    }
    return s;
  }, []);

  // Constellation: positions for streak tracker
  const constellation = useMemo(() => {
    const pts: Array<{ x: number; y: number }> = [];
    const cx = W - 70;
    const cy = H - 70;
    for (let i = 0; i < constellationSize; i++) {
      const angle = (i / constellationSize) * Math.PI * 1.8 - Math.PI * 0.3;
      const r = 20 + seededRandom(i * 11) * 25;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  }, [constellationSize]);

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * W;
      const y = ((e.clientY - rect.top) / rect.height) * H;
      setRipple({ x, y, id: Date.now() });
      onTap?.();
    },
    [onTap],
  );

  const litCount = Math.min(streakDays, constellationSize);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Stardust Check-in
      </p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ borderRadius: 'var(--radius-xl)', cursor: 'pointer' }}
        onClick={handleClick}
        aria-label="Stardust check-in field. Tap anywhere to create a ripple."
        role="button"
        tabIndex={0}
      >
        {/* Purple background */}
        <rect width={W} height={H} rx="12" fill="var(--cosmic-svg-bg)" />

        {/* Subtle compass rose at center */}
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1={W / 2}
            y1={H / 2}
            x2={W / 2 + Math.cos((deg * Math.PI) / 180) * 60}
            y2={H / 2 + Math.sin((deg * Math.PI) / 180) * 60}
            stroke="#FFFFFF"
            strokeWidth={0.5}
            strokeOpacity={0.12}
          />
        ))}

        {/* Star field */}
        {stars.map((star, i) => (
          <motion.circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill={star.color}
            initial={false}
            animate={
              !reducedMotion
                ? { opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5] }
                : { opacity: star.opacity }
            }
            transition={
              !reducedMotion
                ? { duration: 3 + star.delay, repeat: Infinity, ease: 'easeInOut' }
                : undefined
            }
          />
        ))}

        {/* Ripple effect */}
        {ripple && (
          <g key={ripple.id}>
            {[0.6, 0.3, 0.1].map((opacity, ri) => (
              <motion.circle
                key={ri}
                cx={ripple.x}
                cy={ripple.y}
                fill="none"
                stroke="#F4C430"
                strokeWidth={1.5 - ri * 0.4}
                initial={{ r: 4, opacity: 0 }}
                animate={{ r: 40 + ri * 25, opacity: [0, opacity, 0] }}
                transition={{
                  duration: reducedMotion ? 0.01 : 1.2,
                  delay: ri * 0.15,
                  ease: 'easeOut',
                }}
              />
            ))}
          </g>
        )}

        {/* Constellation progress (bottom-right) */}
        <g>
          {/* Connection lines for lit stars */}
          {constellation.map((pt, i) => {
            if (i === 0 || i >= litCount) return null;
            const prev = constellation[i - 1];
            return (
              <line
                key={`line-${i}`}
                x1={prev.x}
                y1={prev.y}
                x2={pt.x}
                y2={pt.y}
                stroke="#F4C430"
                strokeWidth={0.8}
                strokeOpacity={0.5}
              />
            );
          })}

          {/* Star points */}
          {constellation.map((pt, i) => {
            const lit = i < litCount;
            return (
              <circle
                key={`star-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={lit ? 3 : 2}
                fill={lit ? '#F4C430' : 'none'}
                stroke={lit ? '#F4C430' : '#FFFFFF'}
                strokeWidth={lit ? 0 : 0.8}
                strokeOpacity={lit ? 1 : 0.25}
              />
            );
          })}
        </g>

        {/* Streak count */}
        <text
          x={W - 70}
          y={H - 18}
          textAnchor="middle"
          fill="#F4C430"
          fontSize="9"
          fontWeight="600"
          opacity={0.6}
        >
          {streakDays} day streak
        </text>
      </svg>
    </div>
  );
}
