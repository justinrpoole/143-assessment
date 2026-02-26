import Link from "next/link";

import { GlossaryClient } from "@/components/glossary/GlossaryClient";
import { FadeInSection } from "@/components/ui/FadeInSection";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Glossary — 143 Leadership",
  description:
    "Every term used in the 143 Leadership assessment and Gravitational Stability Report, defined and searchable.",
};

/* ── page ───────────────────────────────────────────────────── */

export default async function GlossaryPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_glossary",
    sourceRoute: "/glossary",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16 space-y-12">

        {/* ─── HEADER ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <p className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Reference
          </p>
          <h1
            className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Glossary
          </h1>
          <p
            className="mx-auto max-w-[540px] text-base leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Every term used in the 143 Leadership assessment and report,
            defined and searchable.
          </p>
        </section>

        <GoldDividerAnimated />

        {/* ─── GLOSSARY CLIENT ─────────────────────────────────── */}
        <GlossaryClient />

        <GoldDividerAnimated />

        <GoldHeroBanner
          kicker="Language Shapes Perception"
          title="When you name it, you can train it."
          description="Every term in this glossary maps to a measurable capacity. The words are not metaphors — they are coordinates."
        />

        <GoldDividerAnimated />

        {/* ─── CTA ─────────────────────────────────────────────── */}
        <FadeInSection>
          <section>
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Ready to see these concepts mapped to your own leadership
                pattern?
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/assessment">
                  Take the Assessment
                </NeonGlowButton>
                <LiquidFillButton href="/preview">
                  Try the Free Stability Check
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
