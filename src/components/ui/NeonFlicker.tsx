'use client';

import { useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface NeonFlickerProps {
  children: ReactNode;
  className?: string;
}

/**
 * NeonFlicker — wraps any CTA with a hover-triggered neon flicker animation.
 * Uses CSS keyframes for performance. Respects `prefers-reduced-motion`.
 */
export default function NeonFlicker({ children, className = '' }: NeonFlickerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <>
      {!reducedMotion && (
        <style>{`
          @keyframes neon-flicker {
            0%,  19%  { opacity: 1; filter: brightness(1) drop-shadow(0 0 8px color-mix(in srgb, var(--gold-primary) 50%, transparent)); }
            20%       { opacity: 0.82; filter: brightness(0.88); }
            21%       { opacity: 1;    filter: brightness(1.15) drop-shadow(0 0 18px color-mix(in srgb, var(--gold-primary) 90%, transparent)); }
            22%       { opacity: 0.9;  filter: brightness(0.95); }
            23%       { opacity: 1;    filter: brightness(1.08) drop-shadow(0 0 12px color-mix(in srgb, var(--gold-primary) 70%, transparent)); }
            24%, 79%  { opacity: 1;    filter: brightness(1)    drop-shadow(0 0 8px color-mix(in srgb, var(--gold-primary) 50%, transparent)); }
            80%       { opacity: 0.88; filter: brightness(0.92); }
            81%       { opacity: 1;    filter: brightness(1.12) drop-shadow(0 0 16px color-mix(in srgb, var(--gold-primary) 85%, transparent)); }
            82%, 100% { opacity: 1;    filter: brightness(1)    drop-shadow(0 0 8px color-mix(in srgb, var(--gold-primary) 50%, transparent)); }
          }
          .neon-flicker-wrap:hover {
            animation: neon-flicker 1.6s linear infinite;
          }
        `}</style>
      )}
      <span className={`neon-flicker-wrap inline-flex ${className}`}>
        {children}
      </span>
    </>
  );
}
