import Link from 'next/link';
import { PAGE_COPY_V1 } from '@/content/page_copy.v1';

const ACCENTS = [
  'var(--gold-primary)',
  'var(--neon-violet)',
  'var(--neon-blue)',
] as const;

/**
 * ThreeBoxes — Homepage wayfinding strip.
 * Three minimal entry-point cards: Watch me → Go first → Be the light.
 * Appears right after the hero proof strip to orient the visitor fast.
 */
export default function ThreeBoxes() {
  const { boxes, tagline } = PAGE_COPY_V1.threeBoxes;

  return (
    <section className="content-wrap py-10 sm:py-14">
      <div className="grid gap-4 sm:grid-cols-3">
        {boxes.map((box, i) => (
          <Link
            key={box.label}
            href={box.href}
            className="glass-card glass-card--lift card-border-left-accent-soft card-surface-accent-subtle flex items-center justify-center p-7 text-center"
            style={{ '--card-accent': ACCENTS[i] } as React.CSSProperties}
          >
            <span
              className="text-base font-bold uppercase tracking-[0.18em]"
              style={{ color: ACCENTS[i] }}
            >
              {box.label}
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-secondary">
        {tagline}
      </p>
    </section>
  );
}
