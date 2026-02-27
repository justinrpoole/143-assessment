'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface CounterProps {
  /** Final number to count up to */
  value: number;
  /** Label shown after the number */
  label: string;
  /** Duration of count animation in ms */
  duration?: number;
  /** Suffix after number (e.g. "+", "%") */
  suffix?: string;
  /** Prefix before number (e.g. "$") */
  prefix?: string;
}

function AnimatedNumber({
  value,
  duration = 2000,
  suffix = '',
  prefix = '',
}: Omit<CounterProps, 'label'>) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * SocialProofCounter — Animated count-up metrics strip.
 * Shows key social proof numbers with scroll-triggered animation.
 *
 * Usage:
 *   <SocialProofCounter
 *     metrics={[
 *       { value: 2847, label: 'Leaders assessed', suffix: '+' },
 *       { value: 9, label: 'Capacities measured' },
 *       { value: 36, label: 'Light Signatures' },
 *       { value: 89, label: 'Report clarity', suffix: '%' },
 *     ]}
 *   />
 */
export default function SocialProofCounter({
  metrics,
  className = '',
}: {
  metrics: CounterProps[];
  className?: string;
}) {
  return (
    <div
      className={`glass-card mx-auto max-w-3xl px-6 py-5 ${className}`}
      style={{
        background: 'rgba(248, 208, 17, 0.03)',
        borderColor: 'rgba(248, 208, 17, 0.12)',
      }}
    >
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <p
              className="text-2xl font-bold sm:text-3xl"
              style={{
                color: '#F8D011',
                textShadow: '0 0 24px rgba(248, 208, 17, 0.3)',
              }}
            >
              <AnimatedNumber
                value={m.value}
                suffix={m.suffix}
                prefix={m.prefix}
                duration={m.duration}
              />
            </p>
            <p
              className="mt-1 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
