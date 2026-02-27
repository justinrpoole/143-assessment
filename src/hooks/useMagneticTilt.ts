'use client';

import { useRef, useCallback, useEffect } from 'react';

/**
 * useMagneticTilt — Drives 3D perspective tilt on glass-card--magnetic elements.
 * Tracks mouse position relative to the card and sets CSS custom properties
 * (--tilt-x, --tilt-y) that the existing CSS uses for transform.
 *
 * Also adds a subtle magnetic pull toward the card center on nearby hover.
 */
export function useMagneticTilt<T extends HTMLElement = HTMLDivElement>(
  maxTilt = 4,
  scale = 1.02,
) {
  const ref = useRef<T>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Map 0-1 to -maxTilt..+maxTilt (inverted for natural feel)
      const tiltX = (0.5 - y) * maxTilt * 2;
      const tiltY = (x - 0.5) * maxTilt * 2;

      el.style.setProperty('--tilt-x', `${tiltX}deg`);
      el.style.setProperty('--tilt-y', `${tiltY}deg`);
      el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
    },
    [maxTilt, scale],
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}
