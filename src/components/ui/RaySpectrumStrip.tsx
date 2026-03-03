'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface RaySpectrumStripProps {
  height?: number;
  className?: string;
}

const SPECTRUM = [
  'var(--text-body)', 'var(--gold-primary)', 'var(--neon-violet)', 'var(--text-body)', 'var(--neon-amber)',
  'var(--text-body)', 'var(--text-body)', 'var(--text-body)', 'var(--gold-primary)',
];

const GRADIENT = `linear-gradient(90deg, ${SPECTRUM.join(', ')})`;

export default function RaySpectrumStrip({ height = 4, className }: RaySpectrumStripProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const prefersReduced = useReducedMotion();

  return (
    <div ref={ref} className={`w-full ${className ?? ''}`}>
      <motion.div
        style={{
          height,
          width: '100%',
          background: GRADIENT,
          borderRadius: 9999,
          boxShadow: [
            '0 0 8px 2px var(--surface-border)',
            '0 0 16px 4px var(--surface-border)',
            '0 0 24px 6px var(--surface-border)',
            '0 0 32px 8px color-mix(in srgb, var(--gold-primary) 30%, transparent)',
          ].join(', '),
        }}
        initial={prefersReduced ? false : { scaleX: 0, opacity: 0 }}
        animate={prefersReduced || isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </div>
  );
}
