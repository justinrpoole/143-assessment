'use client';

import { useRef, useState, useEffect } from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Take the Assessment',
    description: '143 questions. 15 minutes. Not who you are. What you can build.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="18" stroke="color-mix(in srgb, var(--gold-primary) 30%, transparent)" strokeWidth="1.5" />
        <path d="M14 20l4 4 8-8" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Get Your Map',
    description: 'Your Light Signature. Your 9 Ray scores. Your Eclipse. Your Nova.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="18" stroke="color-mix(in srgb, var(--gold-primary) 30%, transparent)" strokeWidth="1.5" />
        <path d="M20 12v6l4 4" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="8" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Train Your Reps',
    description: 'Daily practices. Measurable change. Retake and see the delta.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="18" stroke="color-mix(in srgb, var(--gold-primary) 30%, transparent)" strokeWidth="1.5" />
        <path d="M12 28l5-8 5 4 6-10" stroke="var(--gold-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/**
 * HowItWorks — 3-step visual walkthrough of the assessment flow.
 * Steps reveal with staggered animation on scroll.
 */
export default function HowItWorks() {
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
    <div ref={ref}>
      <div className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold-primary)' }}>
          How It Works
        </p>
        <h2 className="heading-section mt-3" style={{ color: 'var(--text-body)' }}>
          Three steps. One system. Proof it is working.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            className="glass-card glass-card--lift relative overflow-hidden p-7 sm:p-8 text-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${i * 120}ms, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 120}ms`,
            }}
          >
            {/* Step number watermark */}
            <span
              className="absolute right-3 top-2 select-none"
              style={{
                fontFamily: 'var(--font-cosmic-display)',
                fontSize: '72px',
                color: 'color-mix(in srgb, var(--gold-primary) 5%, transparent)',
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              {step.number}
            </span>

            <div className="relative z-10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: 'color-mix(in srgb, var(--gold-primary) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--gold-primary) 20%, transparent)', boxShadow: '0 0 16px color-mix(in srgb, var(--gold-primary) 6%, transparent)' }}
              >
                {step.icon}
              </div>

              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold-primary)' }}>
                Step {step.number}
              </p>
              <h3 className="mt-2 text-lg font-bold" style={{ color: 'var(--text-body)' }}>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {step.description}
              </p>
            </div>

            {/* Connector line (not on last card) */}
            {i < STEPS.length - 1 && (
              <div
                className="absolute -right-3 top-1/2 hidden h-px w-6 md:block"
                style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--gold-primary) 30%, transparent), color-mix(in srgb, var(--gold-primary) 5%, transparent))' }}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
