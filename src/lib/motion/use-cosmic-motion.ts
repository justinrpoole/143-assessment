'use client';

import { useReducedMotion } from 'framer-motion';

/**
 * Unified motion preferences hook for all cosmic components.
 *
 * Returns `shouldAnimate` — true when motion is allowed.
 * Components should check this before running animations,
 * SVG filter effects, or CSS transitions beyond instant state changes.
 *
 * Usage:
 *   const shouldAnimate = useCosmicMotion();
 *   if (!shouldAnimate) return <StaticFallback />;
 */
export function useCosmicMotion(): boolean {
  const prefersReduced = useReducedMotion();
  return !prefersReduced;
}
