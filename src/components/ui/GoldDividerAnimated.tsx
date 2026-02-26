'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface GoldDividerAnimatedProps {
  /** Max width of the divider line (default: 200px) */
  maxWidth?: number;
  className?: string;
}

/**
 * Scroll-triggered gold gradient divider line.
 * Animates scaleX from 0 → 1 when scrolled into view.
 * Replaces the inline gold divider pattern used across 21+ marketing pages.
 */
export default function GoldDividerAnimated({
  maxWidth = 200,
  className,
}: GoldDividerAnimatedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className={`mx-auto ${className ?? ''}`}
      style={{ maxWidth }}
    >
      <motion.div
        className="h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--brand-gold, #F8D011), transparent)',
          transformOrigin: 'center',
        }}
        initial={prefersReduced ? false : { scaleX: 0 }}
        animate={
          prefersReduced || isInView
            ? { scaleX: 1 }
            : { scaleX: 0 }
        }
        transition={{
          duration: 0.8,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      />
    </div>
  );
}
