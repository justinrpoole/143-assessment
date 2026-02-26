import Link from 'next/link';
import type { ReactNode } from 'react';

interface CtaAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface CtaBlockProps {
  /** Gold uppercase kicker above the heading */
  kicker?: string;
  /** Main heading */
  title: string | ReactNode;
  /** Description paragraph */
  subtitle?: string | ReactNode;
  /** Primary CTA button */
  primaryCta: CtaAction;
  /** Optional secondary CTA button */
  secondaryCta?: CtaAction;
  className?: string;
}

/**
 * Standardized CTA section used at the bottom of marketing pages.
 * Glass card with centered content, gold kicker, heading, subtitle,
 * and one or two buttons (btn-primary + btn-watch).
 */
export default function CtaBlock({
  kicker,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
}: CtaBlockProps) {
  return (
    <section className={`mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8 ${className ?? ''}`}>
      <div className="glass-card p-8">
        {kicker && (
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--brand-gold, #F8D011)' }}
          >
            {kicker}
          </p>
        )}

        <h2
          className={`${kicker ? 'mt-3' : ''} text-2xl font-bold sm:text-3xl`}
          style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed"
            style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}
          >
            {subtitle}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={primaryCta.href}
            className={primaryCta.variant === 'secondary' ? 'btn-watch' : 'btn-primary'}
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className={secondaryCta.variant === 'primary' ? 'btn-primary' : 'btn-watch'}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
