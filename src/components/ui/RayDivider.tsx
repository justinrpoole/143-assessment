'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { rayHex } from '@/lib/ui/ray-colors';

interface RayDividerProps {
  /** Single ray color for the divider, or "spectrum" for all 9 rays */
  ray?: string | 'spectrum';
  /** Max width (default: responsive clamp) */
  maxWidth?: number | string;
  className?: string;
}

const SPECTRUM_COLORS = [
  '#60A5FA', '#F4C430', '#8E44AD', '#C0392B', '#D4770B',
  '#2ECC71', '#E74C8B', '#1ABC9C', '#F8D011',
];

/**
 * Animated divider line using ray color(s).
 * Single ray mode: gradient from transparent → ray color → transparent.
 * Spectrum mode: horizontal gradient through all 9 ray colors.
 */
export default function RayDivider({
  ray = 'spectrum',
  maxWidth = 'clamp(100px, 60%, 200px)',
  className,
}: RayDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReduced = useReducedMotion();

  const gradient =
    ray === 'spectrum'
      ? `linear-gradient(90deg, ${SPECTRUM_COLORS.join(', ')})`
      : `linear-gradient(90deg, transparent, ${rayHex(ray)}, transparent)`;

  return (
    <div
      ref={ref}
      className={`mx-auto ${className ?? ''}`}
      style={{ maxWidth }}
    >
      <motion.div
        className="h-px"
        style={{
          background: gradient,
          transformOrigin: 'center',
        }}
        initial={prefersReduced ? false : { scaleX: 0 }}
        animate={
          prefersReduced || isInView ? { scaleX: 1 } : { scaleX: 0 }
        }
        transition={{
          duration: 0.8,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      />
    </div>
  );
}
