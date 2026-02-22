'use client';

import { motion } from 'framer-motion';

interface CosmicRingProps {
  /** Center X */
  cx?: number;
  /** Center Y */
  cy?: number;
  /** Ring radius */
  radius: number;
  /** Stroke color */
  color?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** 0-1 smoothness: 1 = solid, 0 = very dashed (coherence indicator) */
  smoothness?: number;
  /** Whether to animate rotation */
  rotate?: boolean;
  /** Opacity */
  opacity?: number;
}

/**
 * Reusable SVG ring with configurable smoothness via dash pattern.
 * Smoothness maps to coherence — aligned rays produce smooth rings,
 * divergent rays produce dashed/shaky rings.
 */
export default function CosmicRing({
  cx = 150,
  cy = 150,
  radius,
  color = '#F8D011',
  strokeWidth = 1.5,
  smoothness = 1,
  rotate = false,
  opacity = 0.4,
}: CosmicRingProps) {
  // Map smoothness (0-1) to dash array
  // 1.0 = fully solid, 0.0 = very broken dashes
  const circumference = 2 * Math.PI * radius;
  const dashLength = smoothness >= 0.95
    ? circumference // solid
    : Math.max(4, circumference * smoothness * 0.15);
  const gapLength = smoothness >= 0.95
    ? 0
    : Math.max(2, circumference * (1 - smoothness) * 0.08);

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={smoothness >= 0.95 ? 'none' : `${dashLength} ${gapLength}`}
      strokeLinecap="round"
      opacity={opacity}
      initial={false}
      animate={rotate ? { rotate: 360 } : undefined}
      transition={rotate ? { duration: 60, repeat: Infinity, ease: 'linear' } : undefined}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    />
  );
}
