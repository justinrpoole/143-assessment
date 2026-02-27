'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Decorative eclipsed sun for the hero section.
 * ~40% moon coverage — the light is still there, just covered.
 * Adapts SunCore patterns: radial gradients, bloom filters, corona wisps.
 */
export default function HeroEclipseVisual({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const animate = !prefersReduced;
  const uid = 'hero-eclipse';

  // Sun center and radius
  const cx = 200;
  const cy = 200;
  const r = 80;

  // Moon offset — covers ~40% from upper-right
  const moonCx = cx + r * 0.55;
  const moonCy = cy - r * 0.35;
  const moonR = r * 0.92;

  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 400 400"
        width="100%"
        height="100%"
        style={{ maxWidth: 320, maxHeight: 320 }}
      >
        <defs>
          {/* Photosphere — white-hot core fading through gold */}
          <radialGradient id={`${uid}-photo`} cx="46%" cy="44%" r="52%">
            <stop offset="0%" stopColor="#FFFEF5" />
            <stop offset="15%" stopColor="#FFF8D6" />
            <stop offset="30%" stopColor="#FFEC80" />
            <stop offset="50%" stopColor="#F8D011" />
            <stop offset="68%" stopColor="#F0B800" />
            <stop offset="82%" stopColor="#E89D0C" />
            <stop offset="100%" stopColor="#D4770B" stopOpacity="0" />
          </radialGradient>

          {/* Corona — warm wide haze */}
          <radialGradient id={`${uid}-corona`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.5" />
            <stop offset="15%" stopColor="#F8D011" stopOpacity="0.3" />
            <stop offset="30%" stopColor="#F8D011" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#F0B800" stopOpacity="0.06" />
            <stop offset="75%" stopColor="#E89D0C" stopOpacity="0.02" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Outer bloom */}
          <radialGradient id={`${uid}-outer`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F8D011" stopOpacity="0.18" />
            <stop offset="25%" stopColor="#F0B800" stopOpacity="0.07" />
            <stop offset="55%" stopColor="#E89D0C" stopOpacity="0.02" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Wisp gradient */}
          <radialGradient id={`${uid}-wisp`} cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#F8D011" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Eclipse rim light — that thin gold crescent where light leaks around the moon */}
          <radialGradient id={`${uid}-rim`} cx="30%" cy="60%" r="60%">
            <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.7" />
            <stop offset="30%" stopColor="#F8D011" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Bloom filter */}
          <filter id={`${uid}-bloom`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="14" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b3" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="b1" />
              <feMergeNode in="b2" />
              <feMergeNode in="b3" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Wisp blur */}
          <filter id={`${uid}-wisp-blur`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="s1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="s2" />
            <feMerge>
              <feMergeNode in="s1" />
              <feMergeNode in="s2" />
            </feMerge>
          </filter>

          {/* Moon mask — everything under the moon circle gets hidden */}
          <mask id={`${uid}-eclipse-mask`}>
            <rect width="400" height="400" fill="white" />
            <circle cx={moonCx} cy={moonCy} r={moonR} fill="black" />
          </mask>
        </defs>

        {/* Outer ambient bloom */}
        <motion.circle
          cx={cx} cy={cy} r={r * 4}
          fill={`url(#${uid}-outer)`}
          initial={false}
          animate={animate ? {
            opacity: [0.5, 0.85, 0.5],
            r: [r * 3.8, r * 4.3, r * 3.8],
          } : undefined}
          transition={animate ? { duration: 9, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />

        {/* Corona haze */}
        <motion.circle
          cx={cx} cy={cy} r={r * 2.5}
          fill={`url(#${uid}-corona)`}
          initial={false}
          animate={animate ? {
            opacity: [0.6, 1, 0.6],
            r: [r * 2.3, r * 2.7, r * 2.3],
          } : undefined}
          transition={animate ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />

        {/* Corona wisps — visible AROUND the moon, creating that eclipse halo */}
        {[
          { angle: 200, scaleX: 1.6, scaleY: 0.3, opacity: 0.4 },
          { angle: 240, scaleX: 1.5, scaleY: 0.28, opacity: 0.35 },
          { angle: 170, scaleX: 1.4, scaleY: 0.25, opacity: 0.3 },
          { angle: 130, scaleX: 1.7, scaleY: 0.32, opacity: 0.4 },
          { angle: 280, scaleX: 1.3, scaleY: 0.26, opacity: 0.3 },
          { angle: 320, scaleX: 1.5, scaleY: 0.3, opacity: 0.35 },
        ].map((wisp, i) => (
          <motion.ellipse
            key={`wisp-${i}`}
            cx={cx}
            cy={cy - r * 0.6}
            rx={r * wisp.scaleX}
            ry={r * wisp.scaleY}
            fill={`url(#${uid}-wisp)`}
            filter={`url(#${uid}-wisp-blur)`}
            opacity={wisp.opacity}
            transform={`rotate(${wisp.angle}, ${cx}, ${cy})`}
            initial={false}
            animate={animate ? {
              opacity: [wisp.opacity * 0.6, wisp.opacity, wisp.opacity * 0.6],
            } : undefined}
            transition={animate ? {
              duration: 5 + (i % 3) * 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            } : undefined}
          />
        ))}

        {/* Sun body — masked by moon */}
        <g mask={`url(#${uid}-eclipse-mask)`}>
          {/* Inner glow halo */}
          <circle cx={cx} cy={cy} r={r * 1.5} fill={`url(#${uid}-corona)`} opacity={0.6} />

          {/* Main photosphere */}
          <motion.circle
            cx={cx} cy={cy} r={r}
            fill={`url(#${uid}-photo)`}
            filter={`url(#${uid}-bloom)`}
            initial={false}
            animate={animate ? { scale: [1, 1.012, 1] } : undefined}
            transition={animate ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        </g>

        {/* Eclipse rim light — thin crescent where light leaks past the moon edge */}
        <circle
          cx={moonCx - 2}
          cy={moonCy + 2}
          r={moonR + 3}
          fill="none"
          stroke="url(#${uid}-rim)"
          strokeWidth="4"
          opacity={0.35}
          mask={`url(#${uid}-eclipse-mask)`}
        />

        {/* Moon body — the eclipse itself. Dark, nearly invisible against cosmic bg */}
        <circle
          cx={moonCx}
          cy={moonCy}
          r={moonR}
          fill="var(--bg-deep, #1A0A2E)"
          opacity={0.97}
        />

        {/* Faint rim glow on the moon edge — light bleeding around */}
        <motion.circle
          cx={moonCx}
          cy={moonCy}
          r={moonR + 1}
          fill="none"
          stroke="#F8D011"
          strokeWidth="1.5"
          opacity={0.12}
          initial={false}
          animate={animate ? { opacity: [0.08, 0.15, 0.08] } : undefined}
          transition={animate ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
      </svg>
    </div>
  );
}
