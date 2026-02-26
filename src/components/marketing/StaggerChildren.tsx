'use client';

import { useEffect, useRef, useState } from 'react';

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}

/**
 * StaggerChildren — Wraps children and staggers their fade-in animation
 * when the container scrolls into view. Each child appears 120ms after the previous.
 * Uses IntersectionObserver for performance.
 */
export default function StaggerChildren({
  children,
  className,
  staggerMs = 120,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      <style>{`
        .stagger-child {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .stagger-child.stagger-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              className={`stagger-child ${visible ? 'stagger-visible' : ''}`}
              style={{ transitionDelay: visible ? `${i * staggerMs}ms` : '0ms' }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
