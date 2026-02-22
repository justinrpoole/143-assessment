'use client';

import { motion } from 'framer-motion';

interface SunCoreProps {
  radius?: number;
  cx?: number;
  cy?: number;
  animate?: boolean;
  className?: string;
}

/**
 * Realistic glowing sun — zero hard edges.
 * Every element is gradient-filled and heavily blurred.
 * Multi-layer radial blooms, soft corona wisps, and
 * organic surface texture. Nothing geometric.
 */
export default function SunCore({
  radius = 40,
  cx = 150,
  cy = 150,
  animate = true,
  className,
}: SunCoreProps) {
  const uid = `sun-${cx}-${cy}`;

  return (
    <g className={className}>
      <defs>
        {/* ── GRADIENTS ── */}

        {/* Photosphere — white-hot core fading through gold to amber */}
        <radialGradient id={`${uid}-photo`} cx="46%" cy="44%" r="52%">
          <stop offset="0%" stopColor="#FFFEF5" />
          <stop offset="15%" stopColor="#FFF8D6" />
          <stop offset="30%" stopColor="#FFEC80" />
          <stop offset="50%" stopColor="#F8D011" />
          <stop offset="68%" stopColor="#F0B800" />
          <stop offset="82%" stopColor="#E89D0C" />
          <stop offset="100%" stopColor="#D4770B" stopOpacity="0" />
        </radialGradient>

        {/* Inner glow — bright gold halo with feathered edge */}
        <radialGradient id={`${uid}-inner`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFEF5" stopOpacity="0.9" />
          <stop offset="25%" stopColor="#FFF8D6" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#F8D011" stopOpacity="0.3" />
          <stop offset="75%" stopColor="#F0B800" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Corona — wide warm haze */}
        <radialGradient id={`${uid}-corona`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.5" />
          <stop offset="15%" stopColor="#F8D011" stopOpacity="0.3" />
          <stop offset="30%" stopColor="#F8D011" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#F0B800" stopOpacity="0.06" />
          <stop offset="75%" stopColor="#E89D0C" stopOpacity="0.02" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Outer bloom — massive diffuse glow */}
        <radialGradient id={`${uid}-outer`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F8D011" stopOpacity="0.2" />
          <stop offset="25%" stopColor="#F0B800" stopOpacity="0.08" />
          <stop offset="55%" stopColor="#E89D0C" stopOpacity="0.02" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Chromospheric edge — warm orange rim, fully feathered */}
        <radialGradient id={`${uid}-chromo`} cx="50%" cy="50%" r="55%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="78%" stopColor="rgba(240, 160, 30, 0.18)" />
          <stop offset="90%" stopColor="rgba(230, 120, 15, 0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Ray wisp gradient — radial fade from gold to invisible */}
        <radialGradient id={`${uid}-wisp`} cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#F8D011" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* ── FILTERS ── */}

        {/* Ultra-soft body bloom — stacks multiple blur passes */}
        <filter id={`${uid}-bloom`} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="18" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b3" />
          <feMerge>
            <feMergeNode in="b1" />
            <feMergeNode in="b1" />
            <feMergeNode in="b2" />
            <feMergeNode in="b3" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Wisp blur — dissolves corona rays into soft streaks */}
        <filter id={`${uid}-wisp-blur`} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="10" result="s1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="s2" />
          <feMerge>
            <feMergeNode in="s1" />
            <feMergeNode in="s2" />
          </feMerge>
        </filter>

        {/* Outer haze — super diffuse for background wisps */}
        <filter id={`${uid}-haze`} x="-400%" y="-400%" width="900%" height="900%">
          <feGaussianBlur stdDeviation="16" />
        </filter>

        {/* Surface granulation — subtle convection texture */}
        <filter id={`${uid}-grain`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency="0.07" numOctaves="4" seed="42" result="cells">
            {animate && (
              <animate attributeName="baseFrequency" values="0.07;0.09;0.07" dur="14s" repeatCount="indefinite" />
            )}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="cells" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Surface noise — very subtle fractal overlay */}
        <filter id={`${uid}-noise`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="13" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="mono" />
          <feBlend in="SourceGraphic" in2="mono" mode="soft-light" />
        </filter>
      </defs>

      {/* ── GLOW LAYERS (back to front) ── */}

      {/* Layer 1: Outermost ambient bloom */}
      <motion.circle
        cx={cx} cy={cy} r={radius * 4.5}
        fill={`url(#${uid}-outer)`}
        initial={false}
        animate={animate ? {
          opacity: [0.5, 0.9, 0.5],
          r: [radius * 4.2, radius * 4.8, radius * 4.2],
        } : undefined}
        transition={animate ? { duration: 9, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />

      {/* Layer 2: Corona haze */}
      <motion.circle
        cx={cx} cy={cy} r={radius * 2.8}
        fill={`url(#${uid}-corona)`}
        initial={false}
        animate={animate ? {
          opacity: [0.6, 1, 0.6],
          r: [radius * 2.6, radius * 3.0, radius * 2.6],
        } : undefined}
        transition={animate ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />

      {/* Layer 3: Chromospheric haze */}
      <circle cx={cx} cy={cy} r={radius * 1.5} fill={`url(#${uid}-chromo)`} />

      {/* ── CORONA WISPS ── */}
      {/* Soft elliptical wisps rotated at natural angles — no lines, no edges */}
      {[
        { angle: 0, scaleX: 1.8, scaleY: 0.35, opacity: 0.5 },
        { angle: 40, scaleX: 1.5, scaleY: 0.3, opacity: 0.35 },
        { angle: 72, scaleX: 1.9, scaleY: 0.4, opacity: 0.45 },
        { angle: 108, scaleX: 1.4, scaleY: 0.28, opacity: 0.3 },
        { angle: 140, scaleX: 1.7, scaleY: 0.35, opacity: 0.4 },
        { angle: 180, scaleX: 1.85, scaleY: 0.38, opacity: 0.5 },
        { angle: 215, scaleX: 1.45, scaleY: 0.3, opacity: 0.35 },
        { angle: 252, scaleX: 1.6, scaleY: 0.32, opacity: 0.4 },
        { angle: 288, scaleX: 1.75, scaleY: 0.36, opacity: 0.45 },
        { angle: 320, scaleX: 1.5, scaleY: 0.3, opacity: 0.35 },
      ].map((wisp, i) => (
        <motion.ellipse
          key={`wisp-${i}`}
          cx={cx}
          cy={cy - radius * 0.7}
          rx={radius * wisp.scaleX}
          ry={radius * wisp.scaleY}
          fill={`url(#${uid}-wisp)`}
          filter={`url(#${uid}-wisp-blur)`}
          opacity={wisp.opacity}
          transform={`rotate(${wisp.angle}, ${cx}, ${cy})`}
          initial={false}
          animate={animate ? {
            opacity: [wisp.opacity * 0.6, wisp.opacity, wisp.opacity * 0.6],
          } : undefined}
          transition={animate ? {
            duration: 5 + (i % 4) * 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          } : undefined}
        />
      ))}

      {/* Background haze wisps — ultra-faint, ultra-wide */}
      {[
        { angle: 20, scaleX: 2.4, scaleY: 0.5, opacity: 0.2 },
        { angle: 90, scaleX: 2.2, scaleY: 0.45, opacity: 0.18 },
        { angle: 155, scaleX: 2.5, scaleY: 0.48, opacity: 0.2 },
        { angle: 230, scaleX: 2.1, scaleY: 0.42, opacity: 0.15 },
        { angle: 310, scaleX: 2.3, scaleY: 0.5, opacity: 0.18 },
      ].map((wisp, i) => (
        <motion.ellipse
          key={`haze-${i}`}
          cx={cx}
          cy={cy - radius * 0.5}
          rx={radius * wisp.scaleX}
          ry={radius * wisp.scaleY}
          fill="#F8D011"
          filter={`url(#${uid}-haze)`}
          opacity={wisp.opacity}
          transform={`rotate(${wisp.angle}, ${cx}, ${cy})`}
          initial={false}
          animate={animate ? {
            opacity: [wisp.opacity * 0.5, wisp.opacity, wisp.opacity * 0.5],
          } : undefined}
          transition={animate ? {
            duration: 7 + (i % 3) * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          } : undefined}
        />
      ))}

      {/* ── SUN BODY ── */}

      {/* Layer 4: Inner glow halo — feathered golden aura behind disc */}
      <circle
        cx={cx} cy={cy} r={radius * 1.6}
        fill={`url(#${uid}-inner)`}
      />

      {/* Layer 5: Main photospheric disc with heavy bloom */}
      <motion.circle
        cx={cx} cy={cy} r={radius}
        fill={`url(#${uid}-photo)`}
        filter={`url(#${uid}-bloom)`}
        initial={false}
        animate={animate ? { scale: [1, 1.015, 1] } : undefined}
        transition={animate ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Layer 6: Granulation — subtle convection wobble */}
      <circle
        cx={cx} cy={cy} r={radius * 0.88}
        fill={`url(#${uid}-photo)`}
        filter={`url(#${uid}-grain)`}
        opacity={0.25}
      />

      {/* Layer 7: Surface noise — barely-visible fractal texture */}
      <circle
        cx={cx} cy={cy} r={radius * 0.85}
        fill={`url(#${uid}-photo)`}
        filter={`url(#${uid}-noise)`}
        opacity={0.15}
      />
    </g>
  );
}
