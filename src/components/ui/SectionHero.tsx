import type { ReactNode } from 'react';

interface SectionHeroProps {
  /** Gold uppercase kicker text above the heading */
  kicker: string;
  /** Main heading (h1 by default, h2 if nested) */
  heading: string | ReactNode;
  /** Subtitle paragraph below the heading */
  subtitle: string | ReactNode;
  /** Optional secondary muted paragraph */
  secondarySubtitle?: string | ReactNode;
  /** Center-align all text (default: false — left-aligned) */
  center?: boolean;
  /** Render as h2 instead of h1 (for sections below the page hero) */
  as?: 'h1' | 'h2';
  /** Max width of the container (default: 720px) */
  maxWidth?: number;
  /** Optional children rendered below subtitle (CTAs, images, etc.) */
  children?: ReactNode;
  className?: string;
}

/**
 * Reusable hero/section header for marketing pages.
 * Renders the standard pattern: gold kicker → heading → subtitle.
 * Used across 20+ pages to ensure visual consistency.
 */
export default function SectionHero({
  kicker,
  heading,
  subtitle,
  secondarySubtitle,
  center = false,
  as: HeadingTag = 'h1',
  maxWidth = 720,
  children,
  className,
}: SectionHeroProps) {
  return (
    <div
      className={`mx-auto space-y-5 ${center ? 'text-center' : ''} ${className ?? ''}`}
      style={{ maxWidth }}
    >
      <p
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--gold-primary)' }}
      >
        {kicker}
      </p>

      <HeadingTag
        className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl"
        style={{ color: 'var(--text-body)' }}
      >
        {heading}
      </HeadingTag>

      <p
        className="text-base leading-relaxed"
        style={{
          color: 'var(--text-secondary)',
          maxWidth: center ? 560 : undefined,
          marginInline: center ? 'auto' : undefined,
        }}
      >
        {subtitle}
      </p>

      {secondarySubtitle && (
        <p
          className="text-sm leading-relaxed"
          style={{
            color: 'var(--text-muted)',
            maxWidth: center ? 560 : undefined,
            marginInline: center ? 'auto' : undefined,
          }}
        >
          {secondarySubtitle}
        </p>
      )}

      {children}
    </div>
  );
}
