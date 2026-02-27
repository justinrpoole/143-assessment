import Image from "next/image";
import Link from "next/link";

import CosmicImage from "@/components/marketing/CosmicImage";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import RayDivider from "@/components/ui/RayDivider";
import { rayHex, cycleRay } from "@/lib/ui/ray-colors";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BackToTopButton from "@/components/ui/BackToTopButton";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Go First — 143 Leadership",
  description:
    "You keep waiting for permission, certainty, or the perfect time. Go First is the practice that proves confidence shows up after you start — not before. The assessment shows you which capacity is holding you at the edge.",
};

/* ── static data ───────────────────────────────────────────── */

const RECOGNITION_SIGNALS = [
  "You plan and prepare, then hesitate at the edge. Every time.",
  "You tell yourself you will go when it feels clear. It never feels clear. So you wait.",
  "You watch someone else do the thing you almost did. And you think: I knew that. I had that.",
  "You have 14 tabs open, three drafts saved, and zero things shipped.",
  "You mistake preparation for progress. The notebook is full. The move is unmade.",
];

const SIGNATURE_PATTERNS = [
  {
    signature: "A Charismatic Connector",
    pattern:
      "hesitates on the thing that might disappoint someone. The relationship feels more fragile than it is, so they wait for unanimous approval that never comes.",
  },
  {
    signature: "A Truth Beacon",
    pattern:
      "hesitates on the thing that might be wrong. Precision matters so much that imperfect action feels reckless — even when inaction costs more.",
  },
  {
    signature: "A Visionary Servant",
    pattern:
      "hesitates because the vision is so clear that any imperfect first step feels like a betrayal of it. The gap between the picture and the draft is paralyzing.",
  },
];

/* ── page ───────────────────────────────────────────────────── */

export default async function GoFirstPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_go_first",
    sourceRoute: "/go-first",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="relative mx-auto max-w-[720px] space-y-5">
          <div
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl"
            aria-hidden="true"
          >
            <Image
              src="/images/cosmic/trajectory-arc.png"
              alt=""
              fill
              className="object-cover opacity-[0.15]"
              sizes="720px"
              style={{
                maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
              }}
            />
          </div>
          <CosmicImage
            src="/images/logo-justin-ray-transparent.png"
            alt="Justin Ray"
            width={48}
            height={48}
            maxWidth="48px"
            variant="decorative"
          />
          <p className="gold-tag">
            <span style={{ color: '#F8D011' }}>◆</span> The Second Commitment
          </p>
          <h1
            className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Go First.
          </h1>
          <p
            className="text-lg leading-relaxed max-w-[560px]"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            I see you with 14 tabs open, three drafts saved, and zero things
            shipped. You are not lazy. You are waiting for a feeling that comes
            after the move, not before.
          </p>
          <p
            className="text-sm leading-relaxed max-w-[560px]"
            style={{
              color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
            }}
          >
            Confidence is not born. It is built. And it only shows up after you
            start.
          </p>
          <RaySpectrumStrip className="mt-6" />
        </section>

        <RayDivider ray="R1" />

        {/* ─── SECTION 2 · SELF-RECOGNITION ───────────────────── */}
        <FadeInSection blur>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-5">
              <p
                className="text-sm font-semibold leading-relaxed"
                style={{ color: rayHex('R1') }}
              >
                When was the last time you were fully prepared and still did not
                move?
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                You had the plan. You had the words. You had the time. But you
                told yourself you would do it tomorrow. And tomorrow you told
                yourself the same thing.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Not because you are undisciplined. Because the gap between knowing
                and doing is not a knowledge problem. It is a capacity problem.
                When the ray responsible for initiation is eclipsed, readiness
                cannot convert to action. The assessment shows you which ray —
                and gives you the rep to restore it.
              </p>
            </div>
          </section>
        </FadeInSection>

        <RayDivider ray="R4" />

        {/* ─── SECTION 3 · SOUND FAMILIAR ─────────────────────── */}
        <FadeInSection>
          <section className="relative mx-auto max-w-[720px] gold-dot-grid">
            <div className="glass-card p-6 sm:p-8">
              <p
                className="mb-5 text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R4') }}
              >
                Sound Familiar?
              </p>
              <StaggerContainer className="space-y-3">
                {RECOGNITION_SIGNALS.map((signal, i) => (
                  <StaggerItem key={signal}>
                    <div
                      className="flex items-start gap-3 text-sm leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                      }}
                    >
                      <span
                        className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: rayHex(cycleRay(i)) }}
                      />
                      {signal}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </FadeInSection>

        <RayDivider ray="R5" />

        {/* ─── SECTION 4 · THE REAL PROBLEM ───────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-8">
            <div className="space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R5') }}
              >
                Why This Happens
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                It is not a motivation gap. It is a trust gap.
              </h2>
            </div>

            <div className="glass-card p-6 sm:p-8 space-y-4">
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Your operating system protects capacities it does not trust yet.
                When a ray is eclipsed — carrying stress it was not designed to
                carry alone — the system withholds permission to act. Not because
                you cannot. Because the cost of failure feels higher than it is.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                You do not need a motivational speech. You need to see which
                capacity is holding you at the edge and which rep restores the
                trust your system requires to move.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                }}
              >
                That is what the assessment maps. Not what is missing. What is
                eclipsed — and what to do about it.
              </p>
            </div>
          </section>
        </FadeInSection>

        <RayDivider ray="R6" />

        <GoldHeroBanner
          kicker="Not a Motivation Gap"
          title="Confidence is not born. It is built. And it only shows up after you start."
          description="The gap between knowing and doing is not a knowledge problem. It is a capacity problem."
        />

        <RayDivider ray="R8" />

        {/* ─── SECTION 5 · SIGNATURE PATTERNS ─────────────────── */}
        <FadeInSection>
          <RadialSpotlight>
            <section className="mx-auto max-w-[720px] space-y-8">
              <div className="space-y-3">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: rayHex('R8') }}
                >
                  Where You Hesitate Depends on How You Lead
                </p>
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                >
                  Your hesitation is not random. It follows your Light Signature.
                </h2>
              </div>

              <StaggerContainer className="space-y-4">
                {SIGNATURE_PATTERNS.map((item, i) => (
                  <StaggerItem key={item.signature}>
                    <div
                      className="glass-card glass-card--magnetic p-5"
                      style={{
                        borderLeft: `3px solid ${rayHex(cycleRay(i))}`,
                      }}
                    >
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color:
                            "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                        }}
                      >
                        <strong
                          style={{ color: rayHex(cycleRay(i)) }}
                        >
                          {item.signature}
                        </strong>{" "}
                        {item.pattern}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                }}
              >
                There are 36 Light Signatures. Each one has a Go First edge. The
                assessment reveals yours — and gives you the specific rep to start
                this week.
              </p>
            </section>
          </RadialSpotlight>
        </FadeInSection>

        <RayDivider ray="R9" />

        {/* ─── SECTION 6 · CTA ────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R9') }}
              >
                The Practice
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                The first move is finding out where you stand.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                The assessment names the specific capacity holding you at the
                edge and gives you the rep to start this week. Not a pep talk. A
                map with a first step on it.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/assessment">
                  Show Me All 9 Rays
                </NeonGlowButton>
                <LiquidFillButton href="/preview">
                  Check My Stability Free
                </LiquidFillButton>
              </div>
              <p
                className="text-xs"
                style={{
                  color:
                    "var(--text-on-dark-muted, rgba(255,255,255,0.45))",
                }}
              >
                143 questions. 15 minutes. Your map shows what is eclipsed and
                what to do first.
              </p>
            </div>
          </section>
        </FadeInSection>
      </div>
      <BackToTopButton />
    </main>
  );
}
