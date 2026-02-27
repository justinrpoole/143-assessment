'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { rayHex, rayRamp } from '@/lib/ui/ray-colors';

interface RayHeroVisualProps {
  rayId: string;
  className?: string;
}

/**
 * RayHeroVisual — Animated SVG visualization for individual ray deep-dive pages.
 * Renders a pulsing circle with radiating beams in the ray's color.
 * The featured ray beam is longer and brighter than the surrounding 8.
 */
export default function RayHeroVisual({ rayId, className = '' }: RayHeroVisualProps) {
  const prefersReduced = useReducedMotion();
  const hex = rayHex(rayId);
  const ramp = rayRamp(rayId);
  const rayNum = parseInt(rayId.replace('R', ''), 10);

  // Deterministic beam variations (no Math.random — avoids SSR/client hydration mismatch)
  const BEAM_LENGTHS = [52, 58, 48, 63, 55, 50, 60, 45, 57];
  const BEAM_OPACITIES = [0.28, 0.32, 0.25, 0.34, 0.30, 0.27, 0.33, 0.24, 0.31];

  const beams = Array.from({ length: 9 }, (_, i) => {
    const angle = i * 40; // 360 / 9 = 40° spacing
    const isFeatured = i + 1 === rayNum;
    const length = isFeatured ? 90 : BEAM_LENGTHS[i];
    const opacity = isFeatured ? 0.9 : BEAM_OPACITIES[i];
    const width = isFeatured ? 3 : 1.5;
    return { angle, length, opacity, width, isFeatured };
  });

  const CX = 140;
  const CY = 140;

  function polarEnd(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: CX + radius * Math.cos(rad),
      y: CY + radius * Math.sin(rad),
    };
  }

  return (
    <motion.div
      className={className}
      initial={prefersReduced ? undefined : { opacity: 0, scale: 0.85 }}
      animate={prefersReduced ? undefined : { opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 60, damping: 18, mass: 1, delay: 0.3 }}
    >
      <svg
        viewBox="0 0 280 280"
        className="mx-auto w-full max-w-[260px] sm:max-w-[300px]"
        role="img"
        aria-label={`Visual representation of the ${rayId} ray`}
      >
        {/* Outer glow ring */}
        <circle
          cx={CX}
          cy={CY}
          r={120}
          fill="none"
          stroke={hex}
          strokeWidth="0.5"
          opacity={0.15}
          strokeDasharray="4 6"
        />

        {/* Middle ring */}
        <circle
          cx={CX}
          cy={CY}
          r={80}
          fill="none"
          stroke={hex}
          strokeWidth="0.5"
          opacity={0.1}
          strokeDasharray="3 5"
        />

        {/* Inner ring */}
        <circle
          cx={CX}
          cy={CY}
          r={40}
          fill="none"
          stroke={hex}
          strokeWidth="0.5"
          opacity={0.2}
        />

        {/* Radiating beams */}
        {beams.map((beam, i) => {
          const innerEnd = polarEnd(beam.angle, 30);
          const outerEnd = polarEnd(beam.angle, 30 + beam.length);
          return (
            <motion.line
              key={i}
              x1={innerEnd.x}
              y1={innerEnd.y}
              x2={outerEnd.x}
              y2={outerEnd.y}
              stroke={hex}
              strokeWidth={beam.width}
              strokeLinecap="round"
              opacity={beam.opacity}
              initial={
                prefersReduced
                  ? undefined
                  : { pathLength: 0, opacity: 0 }
              }
              animate={
                prefersReduced
                  ? undefined
                  : { pathLength: 1, opacity: beam.opacity }
              }
              transition={{
                duration: beam.isFeatured ? 0.8 : 0.5,
                delay: 0.5 + i * 0.06,
                ease: 'easeOut',
              }}
              style={
                beam.isFeatured
                  ? {
                      filter: `drop-shadow(0 0 8px ${hex}80) drop-shadow(0 0 20px ${hex}40)`,
                    }
                  : undefined
              }
            />
          );
        })}

        {/* Featured beam endpoint glow dot */}
        {(() => {
          const featuredBeam = beams.find((b) => b.isFeatured);
          if (!featuredBeam) return null;
          const dot = polarEnd(
            featuredBeam.angle,
            30 + featuredBeam.length,
          );
          return (
            <motion.circle
              cx={dot.x}
              cy={dot.y}
              r={4}
              fill={hex}
              initial={prefersReduced ? undefined : { opacity: 0, r: 0 }}
              animate={prefersReduced ? undefined : { opacity: 0.9, r: 4 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              style={{
                filter: `drop-shadow(0 0 10px ${hex}80)`,
              }}
            />
          );
        })()}

        {/* Center core */}
        <circle
          cx={CX}
          cy={CY}
          r={18}
          fill={`${hex}12`}
          stroke={`${hex}40`}
          strokeWidth="1.5"
        />
        <circle
          cx={CX}
          cy={CY}
          r={8}
          fill={`${hex}30`}
        />
        <circle cx={CX} cy={CY} r={3} fill={hex} opacity={0.8} />

        {/* Ambient glow behind center */}
        <circle
          cx={CX}
          cy={CY}
          r={50}
          fill={`url(#ray-hero-glow-${rayId})`}
        />
        <defs>
          <radialGradient id={`ray-hero-glow-${rayId}`}>
            <stop offset="0%" stopColor={hex} stopOpacity={0.12} />
            <stop offset="100%" stopColor={hex} stopOpacity={0} />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
