"use client";

import { useCountUp } from "@/lib/motion/use-count-up";

interface ScoreNumberProps {
  /** The target number to animate to */
  value: number;
  /** Decimal places (default: 0) */
  decimals?: number;
  /** Suffix appended after the number (e.g., "%") */
  suffix?: string;
  /** Prefix prepended before the number (e.g., "$") */
  prefix?: string;
  /** Animation duration in ms (default: 1200) */
  duration?: number;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Animated number display that counts up from 0 to the target value
 * when scrolled into view. Respects prefers-reduced-motion.
 *
 * Usage:
 * ```tsx
 * <ScoreNumber value={87} suffix="%" className="text-3xl font-bold" />
 * ```
 */
export function ScoreNumber({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1200,
  className,
  style,
}: ScoreNumberProps) {
  const { ref, value: display } = useCountUp({
    end: value,
    decimals,
    suffix,
    prefix,
    duration,
  });

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
