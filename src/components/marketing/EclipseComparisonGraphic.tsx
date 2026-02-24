'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Side-by-side eclipsed vs full sun.
 * Left: dim, ~70% covered. Right: all rays blazing.
 * Captions reinforce identity psychology — past tense on the Light-Online side
 * puts the visitor in the identity of someone who already made the change.
 */
export default function EclipseComparisonGraphic({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const animate = !prefersReduced;

  return (
    <div className={`grid grid-cols-2 gap-6 sm:gap-10 ${className ?? ''}`} aria-hidden="true">
      {/* Eclipsed Sun */}
      <div className="flex flex-col items-center">
        <MiniSun
          uid="comp-eclipsed"
          eclipsePercent={0.7}
          brightness={0.4}
          animate={animate}
        />
        <p
          className="mt-4 text-center text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)', opacity: 0.5 }}
        >
          Eclipsed Monday
        </p>
        <p
          className="mt-2 max-w-[220px] text-center text-sm leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.70))' }}
        >
          You run the meeting well. Nobody knows the cost.
        </p>
      </div>

      {/* Full Sun */}
      <div className="flex flex-col items-center">
        <MiniSun
          uid="comp-full"
          eclipsePercent={0}
          brightness={1}
          animate={animate}
        />
        <p
          className="mt-4 text-center text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          Light-Online Monday
        </p>
        <p
          className="mt-2 max-w-[220px] text-center text-sm leading-relaxed"
          style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.70))' }}
        >
          You chose what to give, not what was taken.
        </p>
      </div>
    </div>
  );
}

/* ── Mini Sun (internal) ─────────────────────────────────── */

function MiniSun({
  uid,
  eclipsePercent,
  brightness,
  animate,
}: {
  uid: string;
  eclipsePercent: number;
  brightness: number;
  animate: boolean;
}) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 32;

  // Moon offset based on eclipse percent
  const moonCx = cx + r * (0.3 + eclipsePercent * 0.3);
  const moonCy = cy - r * 0.2;
  const moonR = r * 0.95;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: size }}>
      <defs>
        <radialGradient id={`${uid}-photo`} cx="46%" cy="44%" r="52%">
          <stop offset="0%" stopColor="#FFFEF5" />
          <stop offset="30%" stopColor="#FFEC80" />
          <stop offset="55%" stopColor="#F8D011" />
          <stop offset="80%" stopColor="#E89D0C" />
          <stop offset="100%" stopColor="#D4770B" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={`${uid}-corona`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.45" />
          <stop offset="25%" stopColor="#F8D011" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#F0B800" stopOpacity="0.06" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        <radialGradient id={`${uid}-outer`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F8D011" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#F0B800" stopOpacity="0.05" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        <filter id={`${uid}-bloom`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b2" />
          <feMerge>
            <feMergeNode in="b1" />
            <feMergeNode in="b2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {eclipsePercent > 0 && (
          <mask id={`${uid}-mask`}>
            <rect width={size} height={size} fill="white" />
            <circle cx={moonCx} cy={moonCy} r={moonR} fill="black" />
          </mask>
        )}
      </defs>

      {/* Outer bloom */}
      <motion.circle
        cx={cx} cy={cy} r={r * 3}
        fill={`url(#${uid}-outer)`}
        opacity={brightness}
        initial={false}
        animate={animate ? {
          opacity: [brightness * 0.6, brightness, brightness * 0.6],
        } : undefined}
        transition={animate ? { duration: 7, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />

      {/* Corona */}
      <circle cx={cx} cy={cy} r={r * 2} fill={`url(#${uid}-corona)`} opacity={brightness} />

      {/* Sun body */}
      <g mask={eclipsePercent > 0 ? `url(#${uid}-mask)` : undefined}>
        <motion.circle
          cx={cx} cy={cy} r={r}
          fill={`url(#${uid}-photo)`}
          filter={`url(#${uid}-bloom)`}
          opacity={brightness}
          initial={false}
          animate={animate ? { scale: [1, 1.015, 1] } : undefined}
          transition={animate ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : undefined}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      </g>

      {/* Moon */}
      {eclipsePercent > 0 && (
        <circle
          cx={moonCx}
          cy={moonCy}
          r={moonR}
          fill="var(--bg-deep, #1A0A2E)"
          opacity={0.97}
        />
      )}
    </svg>
  );
}
