import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import { RAY_PAGES, getRayPageBySlug } from '@/data/ray-pages';
import { RAY_COLORS, rayHex, rayRamp } from '@/lib/ui/ray-colors';
import {
  getRayExplanation,
  getRayCosmicLabel,
  getPhaseLabel,
  getPhaseExplanation,
} from '@/lib/cosmic-copy';

import ScrollProgress from '@/components/marketing/ScrollProgress';
import BackToTopButton from '@/components/ui/BackToTopButton';
import { FadeInSection } from '@/components/ui/FadeInSection';
import RayDivider from '@/components/ui/RayDivider';
import NeonGlowButton from '@/components/marketing/NeonGlowButton';
import FloatingOrbs from '@/components/marketing/FloatingOrbs';
import StaggerChildren from '@/components/marketing/StaggerChildren';
import RayHeroVisual from '@/components/marketing/RayHeroVisual';
import { emitPageView } from '@/lib/analytics/emitter';
import type { PageViewEvent } from '@/lib/analytics/taxonomy';
import { getUserStateFromRequest } from '@/lib/auth/user-state';

export const dynamic = 'force-dynamic';

/* ── Dynamic metadata per ray ──────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ray = getRayPageBySlug(slug);
  if (!ray) return { title: 'Ray Not Found' };

  const explanation = getRayExplanation(ray.rayId);

  return {
    title: `${ray.name} — Ray ${ray.rayId.replace('R', '')} of 9 | 143 Leadership`,
    description:
      explanation?.definition ??
      `Explore the ${ray.name} ray — one of 9 trainable leadership capacities in the Be The Light system.`,
  };
}

/* ── Page ───────────────────────────────────────────────────────── */

export default async function RayDeepDivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ray = getRayPageBySlug(slug);
  if (!ray) notFound();

  const explanation = getRayExplanation(ray.rayId);
  if (!explanation) notFound();

  const cosmicLabel = getRayCosmicLabel(ray.rayId);
  const phaseLabel = getPhaseLabel(ray.phase);
  const phaseExplanation = getPhaseExplanation(ray.phase);
  const hex = rayHex(ray.rayId);
  const ramp = rayRamp(ray.rayId);
  const rayNumber = ray.rayId.replace('R', '');

  const userState = await getUserStateFromRequest();
  emitPageView({
    eventName: `page_view_ray_${slug}` as PageViewEvent,
    sourceRoute: `/rays/${slug}`,
    userState,
  });

  return (
    <main className="cosmic-page-bg relative">
      <ScrollProgress />

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative z-10 mx-auto max-w-[960px] px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16"
      >
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Text side */}
          <div>
            <span
              className="gold-tag mb-3 block w-fit"
              style={{ color: hex, borderColor: `${hex}30` }}
            >
              <span style={{ color: hex }}>◆</span> Ray {rayNumber} of 9
            </span>

            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: hex, opacity: 0.7 }}
            >
              {ray.phase} Phase
            </p>

            <h1
              className="heading-hero mt-3"
              style={{ color: 'var(--text-on-dark)' }}
            >
              <span style={{ color: hex }}>{ray.name}</span>
            </h1>

            <p
              className="mt-2 text-base italic"
              style={{ color: `${hex}cc` }}
            >
              {cosmicLabel}
            </p>

            <p
              className="mt-5 max-w-[480px] text-base leading-relaxed"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              {explanation.definition}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <NeonGlowButton href="/preview">
                Check My {ray.name} Score
              </NeonGlowButton>
              <span
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                Free during beta
              </span>
            </div>
          </div>

          {/* Visual side — animated ray burst */}
          <div className="flex items-center justify-center">
            <RayHeroVisual rayId={ray.rayId} />
          </div>
        </div>
      </section>

      <RayDivider ray={ray.rayId} />

      {/* ── THE SCIENCE ── */}
      <FadeInSection>
        <section className="relative z-10 mx-auto max-w-[720px] px-5 py-16 sm:px-8 sm:py-20">
          <FloatingOrbs variant="purple" />
          <div className="relative z-10">
            <span className="gold-tag mb-3 block w-fit">
              <span style={{ color: hex }}>◆</span> The Science
            </span>
            <h2
              className="heading-section"
              style={{ color: 'var(--text-on-dark)' }}
            >
              Why{' '}
              <span style={{ color: hex }}>{ray.name}</span>{' '}
              matters
            </h2>
            <div
              className="glass-card glass-card--lift mt-6 p-6 sm:p-8"
              style={{
                borderLeft: `3px solid ${ramp.hoverBorder}`,
                background: ramp.bgTint,
              }}
            >
              <p
                className="text-sm leading-relaxed sm:text-base"
                style={{ color: 'var(--text-on-dark-secondary)' }}
              >
                {explanation.science}
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      <RayDivider ray={ray.rayId} />

      {/* ── WHEN THIS RAY IS STRONG ── */}
      <FadeInSection>
        <section className="section-alt-dark relative z-10 mx-auto max-w-[960px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-8 text-center">
            <span className="gold-tag mx-auto">
              <span style={{ color: hex }}>◆</span> When{' '}
              {ray.name} Is Online
            </span>
            <h2
              className="heading-section mt-3"
              style={{ color: 'var(--text-on-dark)' }}
            >
              What it looks like when this ray is{' '}
              <span style={{ color: hex }}>resourced</span>
            </h2>
          </div>
          <StaggerChildren className="grid gap-4 sm:grid-cols-3">
            {explanation.whenStrong.map((item, i) => (
              <div
                key={i}
                className="glass-card glass-card--lift p-5 sm:p-6"
                style={{
                  borderTop: `3px solid ${hex}50`,
                  background: `${hex}06`,
                }}
              >
                <span
                  className="mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: `${hex}15`,
                    color: hex,
                    border: `1px solid ${hex}30`,
                  }}
                >
                  {i + 1}
                </span>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-on-dark-secondary)' }}
                >
                  {item}
                </p>
              </div>
            ))}
          </StaggerChildren>
        </section>
      </FadeInSection>

      {/* ── WHEN THIS RAY IS ECLIPSED ── */}
      <FadeInSection>
        <section className="relative z-10 mx-auto max-w-[960px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-8 text-center">
            <span className="gold-tag mx-auto">
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>◇</span>{' '}
              When {ray.name} Is Eclipsed
            </span>
            <h2
              className="heading-section mt-3"
              style={{ color: 'var(--text-on-dark)' }}
            >
              What it looks like when stress{' '}
              <span style={{ color: 'var(--text-on-dark-muted)' }}>
                covers
              </span>{' '}
              this ray
            </h2>
            <p
              className="mx-auto mt-2 max-w-[520px] text-sm"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              Eclipse is not failure. It is your system conserving energy.
              The capacity is still there — it is temporarily covered.
            </p>
          </div>
          <StaggerChildren className="grid gap-4 sm:grid-cols-3">
            {explanation.whenEclipsed.map((item, i) => (
              <div
                key={i}
                className="glass-card glass-card--lift p-5 sm:p-6"
                style={{
                  borderTop: '3px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <span
                  className="mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {i + 1}
                </span>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-on-dark-muted)' }}
                >
                  {item}
                </p>
              </div>
            ))}
          </StaggerChildren>
        </section>
      </FadeInSection>

      <RayDivider ray={ray.rayId} />

      {/* ── COACHING REPS ── */}
      <FadeInSection>
        <section className="section-alt-dark gold-dot-grid relative mx-auto max-w-[720px] px-5 py-16 sm:px-8 sm:py-20">
          <FloatingOrbs variant="gold" />
          <div className="relative z-10 mb-8 text-center">
            <span className="gold-tag mx-auto">
              <span style={{ color: '#F8D011' }}>◆</span> Your Reps
            </span>
            <h2
              className="heading-section mt-3"
              style={{ color: 'var(--text-on-dark)' }}
            >
              Train your{' '}
              <span style={{ color: hex }}>{ray.name}</span>{' '}
              this week
            </h2>
            <p
              className="mx-auto mt-2 max-w-[480px] text-sm"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              Not goals. Not homework. Micro-reps — small enough to do
              today, specific enough to change the pattern.
            </p>
          </div>
          <StaggerChildren className="relative z-10 space-y-4">
            {explanation.coachingReps.map((rep, i) => (
              <div
                key={i}
                className="glass-card glass-card--lift glass-card--magnetic p-5 sm:p-6"
                style={{
                  borderLeft: `3px solid ${hex}50`,
                  background: `${hex}06`,
                }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
                    style={{
                      background: `${hex}12`,
                      color: hex,
                      border: `1px solid ${hex}25`,
                      boxShadow: `0 0 12px ${hex}15`,
                    }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="text-sm leading-relaxed sm:text-base"
                    style={{ color: 'var(--text-on-dark-secondary)' }}
                  >
                    {rep}
                  </p>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </section>
      </FadeInSection>

      <RayDivider ray={ray.rayId} />

      {/* ── WHERE THIS RAY LIVES ── */}
      <FadeInSection>
        <section className="relative z-10 mx-auto max-w-[720px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-8 text-center">
            <span className="gold-tag mx-auto">
              <span style={{ color: hex }}>◆</span> The System
            </span>
            <h2
              className="heading-section mt-3"
              style={{ color: 'var(--text-on-dark)' }}
            >
              Where {ray.name} lives in the 9-Ray system
            </h2>
          </div>

          {/* Phase card */}
          <div
            className="glass-card glass-card--executive p-6 sm:p-8"
            style={{
              borderLeft: `3px solid ${hex}50`,
              background: `${hex}04`,
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: hex }}
            >
              {phaseLabel}
            </p>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              {phaseExplanation}
            </p>

            {/* Related rays */}
            <div className="mt-6">
              <p
                className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Rays in this phase
              </p>
              <div className="flex flex-wrap gap-2">
                {/* Current ray (highlighted) */}
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    background: `${hex}20`,
                    color: hex,
                    border: `1px solid ${hex}40`,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: hex }}
                  />
                  {ray.name}
                </span>
                {/* Related rays (linked) */}
                {ray.relatedRays.map((relId) => {
                  const relColor = RAY_COLORS[relId];
                  const relSlug = RAY_PAGES.find(
                    (r) => r.rayId === relId,
                  )?.slug;
                  if (!relColor || !relSlug) return null;
                  return (
                    <Link
                      key={relId}
                      href={`/rays/${relSlug}`}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200"
                      style={{
                        background: `${relColor.hex}10`,
                        color: `${relColor.hex}cc`,
                        border: `1px solid ${relColor.hex}20`,
                      }}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: relColor.hex }}
                      />
                      {relColor.label}
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* All 9 rays mini-nav */}
          <div className="mt-8">
            <p
              className="mb-3 text-center text-xs font-bold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              All 9 Rays
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {RAY_PAGES.map((r) => {
                const isActive = r.rayId === ray.rayId;
                const c = RAY_COLORS[r.rayId];
                return (
                  <Link
                    key={r.rayId}
                    href={`/rays/${r.slug}`}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-200"
                    style={{
                      background: isActive
                        ? `${c.hex}25`
                        : 'rgba(255,255,255,0.04)',
                      color: isActive ? c.hex : 'rgba(255,255,255,0.5)',
                      border: `1px solid ${isActive ? `${c.hex}40` : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: isActive
                          ? c.hex
                          : 'rgba(255,255,255,0.3)',
                      }}
                    />
                    {c.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </FadeInSection>

      <RayDivider ray="R9" />

      {/* ── FINAL CTA ── */}
      <FadeInSection>
        <section className="relative mx-auto max-w-[720px] px-5 py-16 sm:px-8 sm:py-20">
          <FloatingOrbs variant="gold" />
          <div className="glass-card glass-card--hero relative z-10 p-8 text-center sm:p-10">
            <h2 className="text-shimmer heading-section">
              Find out where your{' '}
              <span style={{ color: hex }}>{ray.name}</span> stands
            </h2>
            <p
              className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              The Be The Light Assessment measures all 9 rays — including{' '}
              {ray.name}. See your score, your pattern, and what to train
              first.
            </p>
            <div className="mt-6">
              <NeonGlowButton href="/preview">
                Discover your Rays — free Stability Check
              </NeonGlowButton>
            </div>
            <p
              className="mt-4 text-xs"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Free during beta · No credit card required
            </p>
          </div>

          {/* Prev / Next navigation */}
          <div className="mt-8 flex items-center justify-between">
            {ray.prevRay ? (
              <Link
                href={`/rays/${ray.prevRay}`}
                className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:brightness-125"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <span aria-hidden="true">&larr;</span>
                {RAY_PAGES.find((r) => r.slug === ray.prevRay)?.name ??
                  'Previous'}
              </Link>
            ) : (
              <span />
            )}
            {ray.nextRay ? (
              <Link
                href={`/rays/${ray.nextRay}`}
                className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:brightness-125"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {RAY_PAGES.find((r) => r.slug === ray.nextRay)?.name ??
                  'Next'}{' '}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            ) : (
              <Link
                href="/upgrade-your-os"
                className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:brightness-125"
                style={{ color: '#F8D011' }}
              >
                See the full system <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </section>
      </FadeInSection>

      <BackToTopButton />
    </main>
  );
}
