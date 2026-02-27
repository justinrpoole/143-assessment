'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface RaySpectrumStripProps {
  /** Height in pixels (default: 3) */
  height?: number;
  className?: string;
}

const SPECTRUM = [
  '#60A5FA', '#F4C430', '#8E44AD', '#C0392B', '#D4770B',
  '#2ECC71', '#E74C8B', '#1ABC9C', '#F8D011',
];

/**
 * Thin horizontal bar showing all 9 ray colors as a gradient strip.
 * Animates scaleX from 0 → 1 when scrolled into view.
 * Used on hero sections to signal "this system has 9 dimensions."
 */
export default function RaySpectrumStrip({
  height = 3,
  className,
}: RaySpectrumStripProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReduced = useReducedMotion();

  return (
    <div ref={ref} className={`w-full ${className ?? ''}`}>
      <motion.div
        className="rounded-full mx-auto"
        style={{
          height,
          maxWidth: '100%',
          background: `linear-gradient(90deg, ${SPECTRUM.join(', ')})`,
          transformOrigin: 'center',
        }}
        initial={prefersReduced ? false : { scaleX: 0, opacity: 0 }}
        animate={
          prefersReduced || isInView
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 0, opacity: 0 }
        }
        transition={{
          duration: 1,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      />
    </div>
  );
}
