'use client';

import type { ReactNode } from 'react';
import { FadeInSection } from '@/components/ui/FadeInSection';

interface GoldHeroBannerProps {
  /** Gold uppercase kicker above the title */
  kicker?: string;
  /** Main heading text */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Optional CTA button */
  cta?: { label: string; href: string };
  /** Extra content rendered after the description */
  children?: ReactNode;
  /** Override default className */
  className?: string;
}

/**
 * Full-width gold accent banner that breaks up dark purple sections.
 * Gold gradient background with dark text for high contrast (14.8:1 ratio).
 */
export default function GoldHeroBanner({
  kicker,
  title,
  description,
  cta,
  children,
  className = '',
}: GoldHeroBannerProps) {
  return (
    <FadeInSection>
      <section
        className={`gold-hero-banner relative overflow-hidden rounded-2xl px-6 py-10 sm:px-8 sm:py-14 ${className}`}
        style={{
          background: 'linear-gradient(135deg, #F8D011 0%, #E89D0C 50%, #F8D011 100%)',
        }}
      >
        {/* Inner radial highlight */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)',
          }}
        />

        {/* Neon edge accent */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px]"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(90deg, transparent 5%, var(--neon-cyan, #25f6ff) 30%, var(--neon-pink, #ff3fb4) 70%, transparent 95%)',
            opacity: 0.4,
          }}
        />

        {/* Subtle 143 watermark */}
        <span
          className="pointer-events-none absolute bottom-[-20px] right-[-10px] select-none"
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-cosmic-display)',
            fontSize: '140px',
            color: 'rgba(0,0,0,0.04)',
            lineHeight: 1,
          }}
        >
          143
        </span>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[720px] text-center">
          {kicker && (
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'rgba(2,2,2,0.6)' }}
            >
              {kicker}
            </p>
          )}
          <h2
            className={`${kicker ? 'mt-2' : ''} text-2xl font-bold leading-tight sm:text-3xl`}
            style={{ color: '#020202' }}
          >
            {title}
          </h2>
          {description && (
            <p
              className="mx-auto mt-3 max-w-[560px] text-sm leading-relaxed sm:text-base"
              style={{ color: 'rgba(2,2,2,0.7)' }}
            >
              {description}
            </p>
          )}
          {cta && (
            <div className="mt-6">
              <a
                href={cta.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold transition-all hover:brightness-110"
                style={{
                  background: '#020202',
                  color: '#F8D011',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                }}
              >
                {cta.label}
              </a>
            </div>
          )}
          {children}
        </div>
      </section>
    </FadeInSection>
  );
}
