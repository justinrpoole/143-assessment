'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface RaySpectrumStripProps {
  height?: number;
  className?: string;
}

const SPECTRUM = [
  '#60A5FA', '#F4C430', '#8E44AD', '#C0392B', '#D4770B',
  '#2ECC71', '#E74C8B', '#1ABC9C', '#F8D011',
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
            '0 0 8px 2px rgba(96,165,250,0.7)',
            '0 0 16px 4px rgba(244,196,48,0.5)',
            '0 0 24px 6px rgba(142,68,173,0.4)',
            '0 0 32px 8px rgba(248,208,17,0.3)',
          ].join(', '),
        }}
        initial={prefersReduced ? false : { scaleX: 0, opacity: 0 }}
        animate={prefersReduced || isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </div>
  );
}
