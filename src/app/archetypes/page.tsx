import Link from "next/link";
import type { Metadata } from "next";

import ArchetypeLibraryClient from "@/components/archetypes/ArchetypeLibraryClient";
import CosmicImage from "@/components/marketing/CosmicImage";
import { FadeInSection } from "@/components/ui/FadeInSection";

export const metadata: Metadata = {
  title: "36 Light Signatures — 9 Rays, One Map | 143 Leadership",
  description:
    "Your Light Signature is the unique combination of your top two rays out of nine trainable leadership capacities. Browse all 36 patterns. Find yours. Understand what each combination creates — and what it costs under load.",
  openGraph: {
    title: "36 Light Signatures — 9 Rays, One Map | 143 Leadership",
    description:
      "Browse all 36 Light Signatures. Discover how your top two rays combine into a unique leadership pattern that changes as you do.",
  },
};

/* ── static data ───────────────────────────────────────────── */

const NINE_RAYS = [
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

        {/* ─── HERO · 9 Rays Context ──────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            9 Rays. 36 Combinations. Your Map.
          </p>
          <h1
            className="text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Your Light Signature is the combination of your two strongest rays.
          </h1>
          <p
            className="mx-auto max-w-[540px] text-base leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Nine trainable capacities. Three developmental phases. Your top two
            rays combine into one of 36 Light Signatures — not a personality
            type, but a pattern your system defaults to under real conditions.
            It changes as you do.
          </p>
        </section>

        {/* ─── 9 Rays Grid ────────────────────────────────────── */}
        <FadeInSection>
          <div className="mx-auto max-w-[720px]">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {NINE_RAYS.map((ray) => (
                <div
                  key={ray.name}
                  className="glass-card p-3 text-center"
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      color: "var(--brand-gold, #F8D011)",
                      opacity: 0.6,
                    }}
                  >
                    Ray of
                  </p>
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                  >
                    {ray.name}
                  </p>
                  <p
                    className="mt-0.5 text-[10px] uppercase tracking-widest"
                    style={{
                      color: "var(--text-on-dark-muted, rgba(255,255,255,0.4))",
                    }}
                  >
                    {ray.phase}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="mt-4 text-center text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
              }}
            >
              C(9,2) = 36 unique combinations. Each one has a name, a strength
              pattern, a stress distortion, and a coaching path. Browse them
              below.
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

        {/* ─── ARCHETYPE LIBRARY ──────────────────────────────── */}
        <FadeInSection>
          <ArchetypeLibraryClient />
        </FadeInSection>

        <GoldDivider />

        {/* ─── CTA ────────────────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Find out which one is yours.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                143 questions. 15 minutes. Your Light Signature, Eclipse
                Snapshot, and Rise Path — the map of what is strong, what is
                covered, and what to do first.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/assessment" className="btn-primary">
                  Take the Assessment
                </Link>
                <Link href="/preview" className="btn-watch">
                  Try the Free Stability Check
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
