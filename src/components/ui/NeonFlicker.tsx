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
            0%,  19%  { opacity: 1; filter: brightness(1) drop-shadow(0 0 8px rgba(248,208,17,0.5)); }
            20%       { opacity: 0.82; filter: brightness(0.88); }
            21%       { opacity: 1;    filter: brightness(1.15) drop-shadow(0 0 18px rgba(248,208,17,0.9)); }
            22%       { opacity: 0.9;  filter: brightness(0.95); }
            23%       { opacity: 1;    filter: brightness(1.08) drop-shadow(0 0 12px rgba(248,208,17,0.7)); }
            24%, 79%  { opacity: 1;    filter: brightness(1)    drop-shadow(0 0 8px rgba(248,208,17,0.5)); }
            80%       { opacity: 0.88; filter: brightness(0.92); }
            81%       { opacity: 1;    filter: brightness(1.12) drop-shadow(0 0 16px rgba(248,208,17,0.85)); }
            82%, 100% { opacity: 1;    filter: brightness(1)    drop-shadow(0 0 8px rgba(248,208,17,0.5)); }
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
