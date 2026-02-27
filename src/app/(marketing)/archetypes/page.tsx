import Link from "next/link";
import type { Metadata } from "next";

import ArchetypeLibraryClient from "@/components/archetypes/ArchetypeLibraryClient";
import ArchetypeQuizClient from "@/components/quiz/ArchetypeQuizClient";
import CosmicImage from "@/components/marketing/CosmicImage";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import { FadeInSection } from "@/components/ui/FadeInSection";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import RayDivider from "@/components/ui/RayDivider";
import { rayHex } from "@/lib/ui/ray-colors";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import RayProgressionStack from "@/components/cosmic/RayProgressionStack";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BackToTopButton from "@/components/ui/BackToTopButton";
import GoldTooltip from "@/components/ui/GoldTooltip";

export const metadata: Metadata = {
  title: "36 Light Signatures — Which One Are You? | 143 Leadership",
  description:
    "36 leadership archetypes. One is yours. Browse the full Signal Library, find the pattern that makes you stop scrolling, and discover what your combination creates — and what it costs under load.",
  openGraph: {
    title: "36 Light Signatures — Which One Are You? | 143 Leadership",
    description:
      "Browse all 36 Light Signatures. One of them is going to feel uncomfortably accurate. Find yours.",
  },
};

/* ── page ───────────────────────────────────────────────────── */

export default function ArchetypesPage() {
  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 space-y-12">

        {/* ─── HERO ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <p className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> 36 Signals. One Is Yours.
          </p>
          <h1
            className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark)" }}
          >
            Your Light Signature is the pattern your leadership runs on.
          </h1>
          <p
            className="mx-auto max-w-[540px] text-base leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary)",
            }}
          >
            Nine trainable capacities. Your top two <GoldTooltip tip="One of nine trainable leadership capacities measured by the assessment.">Rays</GoldTooltip> combine into a <GoldTooltip tip="Your unique combination of top two Rays — the pattern your leadership defaults to.">Light
            Signature</GoldTooltip> — not a personality type, but the operating pattern your
            system defaults to under real conditions. It changes as you do.
            One of these 36 is going to feel uncomfortably accurate.
          </p>
        </section>

        {/* ─── 9 Signals — Vertical Progression ───────────────── */}
        <FadeInSection>
          <div className="mx-auto max-w-[720px]">
            <RayProgressionStack />
            <p
              className="mt-6 text-center text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-muted)",
              }}
            >
              Every combination has a name, a strength pattern, a stress
              signature, and a path forward. Browse them below — or take 60
              seconds to find yours first.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection>
          <CosmicImage
            src="/images/cosmic/constellation-map.png"
            alt="36 Light Signature combinations mapped as a leadership constellation"
            width={440}
            height={440}
            maxWidth="440px"
            variant="section"
          />
        </FadeInSection>

        <RayDivider ray="R9" />

        <GoldHeroBanner
          kicker="Not a Label. A Map."
          title="Your Light Signature changes as you do. That is the whole point."
          description="36 combinations of your top two Rays. Each one has a strength, a cost under load, and a training path."
        />

        <RayDivider ray="R9" />

        {/* ─── INLINE QUICK QUIZ ─────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-lg">
            <div className="text-center mb-2">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R3') }}
              >
                Find Your Signal
              </p>
            </div>
            <ArchetypeQuizClient />
          </section>
        </FadeInSection>

        <RayDivider ray="R9" />

        {/* ─── ARCHETYPE LIBRARY ─────────────────────────────── */}
        <FadeInSection>
          <ArchetypeLibraryClient />
        </FadeInSection>

        <RayDivider ray="R9" />

        {/* ─── FINAL CTA ─────────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark)" }}
              >
                Ready to see the full picture?
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary)",
                }}
              >
                The full Be The Light Assessment maps all 9 signals to reveal
                your Light Signature, Eclipse Snapshot, and Rise Path — the
                map of what is strong, what is covered, and what to do first.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/upgrade-your-os">
                  Map My Full Light Signature
                </NeonGlowButton>
                <LiquidFillButton href="/preview">
                  Check My Stability (Free)
                </LiquidFillButton>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>
      <BackToTopButton />
    </main>
  );
}