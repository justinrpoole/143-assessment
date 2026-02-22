"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface UseCountUpOptions {
  /** Target value to count up to */
  end: number;
  /** Starting value (default: 0) */
  start?: number;
  /** Animation duration in ms (default: 1200) */
  duration?: number;
  /** Decimal places (default: 0) */
  decimals?: number;
  /** Only animate when in view (default: true) */
  triggerOnView?: boolean;
  /** Suffix to append (e.g., "%", "x") */
  suffix?: string;
  /** Prefix to prepend (e.g., "$") */
  prefix?: string;
}

/**
 * Hook that animates a number from `start` to `end` using requestAnimationFrame.
 * Respects prefers-reduced-motion. Triggers when element scrolls into view.
 *
 * Usage:
 * ```tsx
 * const { ref, value } = useCountUp({ end: 87, suffix: "%" });
 * return <span ref={ref}>{value}</span>
 * ```
 */
export function useCountUp({
  end,
  start = 0,
  duration = 1200,
  decimals = 0,
  triggerOnView = true,
  suffix = "",
  prefix = "",
}: UseCountUpOptions) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(
    prefersReduced ? `${prefix}${end.toFixed(decimals)}${suffix}` : `${prefix}${start.toFixed(decimals)}${suffix}`,
  );
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReduced || hasAnimated.current) return;

    const element = ref.current;
    if (!element) return;

    function animate() {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const startTime = performance.now();
      const range = end - start;

      function tick(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for natural deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + range * eased;

        setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    }

    if (!triggerOnView) {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [end, start, duration, decimals, suffix, prefix, prefersReduced, triggerOnView]);

  return { ref, value: display };
}
