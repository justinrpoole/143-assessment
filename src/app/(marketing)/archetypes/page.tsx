import Link from "next/link";
import type { Metadata } from "next";

import ArchetypeLibraryClient from "@/components/archetypes/ArchetypeLibraryClient";
import ArchetypeQuizClient from "@/components/quiz/ArchetypeQuizClient";
import CosmicImage from "@/components/marketing/CosmicImage";
import { FadeInSection } from "@/components/ui/FadeInSection";

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

/* ── static data ───────────────────────────────────────────── */

const NINE_SIGNALS = [
  { name: "Intention", phase: "Reconnect" },
  { name: "Joy", phase: "Reconnect" },
  { name: "Presence", phase: "Reconnect" },
  { name: "Power", phase: "Expand" },
  { name: "Purpose", phase: "Expand" },
  { name: "Authenticity", phase: "Expand" },
  { name: "Connection", phase: "Become" },
  { name: "Possibility", phase: "Become" },
  { name: "Be The Light", phase: "Become" },
];

/* ── page ───────────────────────────────────────────────────── */

export default function ArchetypesPage() {
  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 space-y-12">

        {/* ─── HERO ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold)" }}
          >
            36 Signals. One Is Yours.
          </p>
          <h1
            className="text-3xl font-bold leading-tight sm:text-4xl"
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
            Nine trainable capacities. Your top two combine into a Light
            Signature — not a personality type, but the operating pattern your
            system defaults to under real conditions. It changes as you do.
            One of these 36 is going to feel uncomfortably accurate.
          </p>
        </section>

        {/* ─── 9 Signals Grid ────────────────────────────────── */}
        <FadeInSection>
          <div className="mx-auto max-w-[720px]">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {NINE_SIGNALS.map((signal) => (
                <div
                  key={signal.name}
                  className="glass-card p-3 text-center"
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      color: "var(--brand-gold)",
                      opacity: 0.6,
                    }}
                  >
                    Signal
                  </p>
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: "var(--text-on-dark)" }}
                  >
                    {signal.name}
                  </p>
                  <p
                    className="mt-0.5 text-[10px] uppercase tracking-widest"
                    style={{
                      color: "var(--text-on-dark-muted)",
                    }}
                  >
                    {signal.phase}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="mt-4 text-center text-sm leading-relaxed"
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

        <GoldDivider />

        {/* ─── INLINE QUICK QUIZ ─────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-lg">
            <div className="text-center mb-2">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold)" }}
              >
                Find Your Signal
              </p>
            </div>
            <ArchetypeQuizClient />
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── ARCHETYPE LIBRARY ─────────────────────────────── */}
        <FadeInSection>
          <ArchetypeLibraryClient />
        </FadeInSection>

        <GoldDivider />

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
                <Link href="/upgrade-your-os" className="btn-primary">
                  Map My Full Light Signature
                </Link>
                <Link href="/preview" className="btn-watch">
                  Check My Stability (Free)
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>
    </main>
  );
}

/* ── utility ───────────────────────────────────────────────── */

function GoldDivider() {
  return (
    <div className="mx-auto max-w-[200px]">
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--brand-gold), transparent)",
        }}
      />
    </div>
  );
}
