import Link from "next/link";

import CosmicHeroStatic from "@/components/marketing/CosmicHeroStatic";
import HeroProofStrip from "@/components/marketing/HeroProofStrip";
import ThreeBoxes from "@/components/marketing/ThreeBoxes";
import ScrollProgress from "@/components/marketing/ScrollProgress";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import NeonStarField from "@/components/cosmic/NeonStarField";
import StaggerChildren from "@/components/marketing/StaggerChildren";
import RadarMockup from "@/components/marketing/RadarMockup";
import EmailCaptureBanner from "@/components/marketing/EmailCaptureBanner";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import BackToTopButton from "@/components/ui/BackToTopButton";
import SectionTOC from "@/components/ui/SectionTOC";
import { FadeInSection } from "@/components/ui/FadeInSection";
import RayDivider from "@/components/ui/RayDivider";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The 143 Challenge | See Your Filter Reprogram in 3 Days",
  description:
    "Your light was never gone. It was only eclipsed. In 3 days, you'll see 143 everywhere—proof that your Reticular Activating System (attention filter) works exactly as we're about to reprogram it. Free challenge. Self-directed. Evidence-based.",
  openGraph: {
    title: "The 143 Challenge | See Your Filter Reprogram in 3 Days",
    description:
      "Your light was never gone. It was only eclipsed. In 3 days, you'll see 143 everywhere—proof that your Reticular Activating System (attention filter) works exactly as we're about to reprogram it. Free challenge. Self-directed. Evidence-based.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 143 Challenge | See Your Filter Reprogram in 3 Days",
    description:
      "Your light was never gone. It was only eclipsed. In 3 days, you'll see 143 everywhere—proof that your Reticular Activating System (attention filter) works exactly as we're about to reprogram it. Free challenge. Self-directed. Evidence-based.",
  },
};

export default async function UpgradeYourOsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_home_143_challenge",
    sourceRoute: "/",
    userState,
  });

  return (
    <main className="cosmic-page-bg page-shell relative">
      <ScrollProgress />
      <SectionTOC items={[
        { id: "hero", label: "Hero" },
        { id: "proof", label: "Proof" },
        { id: "meaning", label: "Meaning" },
        { id: "eclipse-concept", label: "Eclipse" },
        { id: "tools", label: "Tools" },
        { id: "sample-report-teaser", label: "Map" },
        { id: "final-cta", label: "Start" },
      ]} />

      <div id="hero" className="relative z-10">
        <CosmicHeroStatic />
      </div>

      <div className="relative z-10">
        <HeroProofStrip />
      </div>

      <div className="relative z-10">
        <ThreeBoxes />
      </div>

      <FadeInSection>
        <section id="proof" className="relative z-10 content-wrap py-16 sm:py-20">
          <div className="mb-8 text-center">
            <span className="gold-tag mx-auto">
              <span style={{ color: "var(--gold-primary)" }}>◆</span> The Proof
            </span>
            <h2 className="heading-section mt-4 text-body">
              SEE 143 EVERYWHERE IN 72 HOURS
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-card p-5" style={{ "--card-accent": "var(--gold-primary)" } as { ["--card-accent"]: string }}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-body">ATTENTION SHIFT</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                Your filter starts selecting signal over noise. 143 shows up in ordinary moments and gives you fast proof your attention can be retrained.
              </p>
            </div>
            <div className="glass-card p-5" style={{ "--card-accent": "var(--neon-violet)" } as { ["--card-accent"]: string }}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-body">SELF-LOVE SIGNAL</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                You notice your inner tone in real time and shift from pressure to respect. That is where sustainable leadership actually starts.
              </p>
            </div>
            <div className="glass-card p-5" style={{ "--card-accent": "var(--neon-blue)" } as { ["--card-accent"]: string }}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-body">STABILITY EVIDENCE</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                You leave with evidence your system can move. The workbook carries the full reps and sequence; this page keeps the signal clear.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LiquidFillButton href="/challenge">START THE 143 CHALLENGE</LiquidFillButton>
            <Link href="/preview" className="btn-secondary">
              Check My Stability
            </Link>
          </div>
        </section>
      </FadeInSection>

      <RayDivider ray="R9" />

      <FadeInSection>
        <section id="meaning" className="relative content-wrap py-16 sm:py-20">
          <FloatingOrbs variant="purple" />
          <div className="relative z-10 mx-auto max-w-[840px] glass-card card-border-left-accent-soft card-surface-accent-subtle p-7 sm:p-9 text-center" style={{ "--card-accent": "var(--gold-primary)" } as { ["--card-accent"]: string }}>
            <span className="gold-tag mx-auto">
              <span style={{ color: "var(--gold-primary)" }}>◆</span> 143 MEANS I LOVE YOU
            </span>
            <h2 className="heading-section mt-4 text-body">
              THIS IS THE I LOVE CHALLENGE.
            </h2>
            <p className="mx-auto mt-3 max-w-[650px] text-sm leading-relaxed text-secondary">
              We are not teaching steps on this page. We are giving you proof that your attention can be retrained and your inner tone can soften without losing standards.
              The workbook is where the exact sequence lives.
            </p>
          </div>
        </section>
      </FadeInSection>

      <RayDivider ray="R6" />

      <FadeInSection>
        <RadialSpotlight>
          <section id="eclipse-concept" className="relative content-wrap py-16 sm:py-20">
            <NeonStarField showConstellations />
            <div className="relative z-10 grid items-start gap-8 md:grid-cols-2">
              <div>
                <span className="gold-tag">
                  <span style={{ color: "var(--gold-primary)" }}>◆</span> Live Measurement
                </span>
                <h2 className="heading-section mt-3 text-gold-gradient">
                  YOUR LIGHT IS NOT GONE. IT IS COVERED.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-secondary">
                  This is not a label. It is a live read of the pattern your system is running right now.
                </p>
              </div>
              <StaggerChildren className="grid gap-4">
                <div className="glass-card glass-card--lift card-border-left-accent-soft card-surface-accent-subtle p-5" style={{ "--card-accent": "var(--gold-primary)" } as { ["--card-accent"]: string }}>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold-primary)" }}>
                    ECLIPSED MONDAY
                  </h3>
                  <p className="text-sm leading-relaxed text-secondary">
                    You execute the day, but it drains you. Outcomes land while your nervous system pays the bill.
                  </p>
                </div>
                <div className="glass-card glass-card--lift card-border-left-accent-soft card-surface-accent-subtle p-5" style={{ "--card-accent": "var(--neon-violet)" } as { ["--card-accent"]: string }}>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold-primary)" }}>
                    LIGHT-ONLINE MONDAY
                  </h3>
                  <p className="text-sm leading-relaxed text-secondary">
                    You carry responsibility with less internal drag. Your signal stays available and your range stays intact.
                  </p>
                </div>
              </StaggerChildren>
              <div className="col-span-full">
                <p className="mx-auto max-w-[760px] text-center text-sm leading-relaxed text-secondary">
                  Running on survival mode can look productive from the outside while reducing your creativity, emotional range, and recovery.
                  The stability map shows where that pattern is active.
                </p>
                <div className="mt-4 text-center">
                  <NeonGlowButton href="/preview">
                    SHOW ME WHERE THIS SHOWS UP
                  </NeonGlowButton>
                </div>
              </div>
            </div>
          </section>
        </RadialSpotlight>
      </FadeInSection>

      <RayDivider ray="R4" />

      <FadeInSection>
        <section id="tools" className="relative content-wrap py-16 sm:py-20">
          <div className="mb-10 text-center">
            <span className="gold-tag mx-auto">
              <span style={{ color: "var(--gold-primary)" }}>◆</span> The Tools
            </span>
            <h2 className="heading-section mt-4 text-body">
              WATCH ME • GO FIRST • BE THE LIGHT
            </h2>
            <p className="mx-auto mt-3 max-w-[620px] text-sm leading-relaxed text-secondary">
              These are the three fast pathways to reprogram your brain in live situations.
            </p>
          </div>
          <StaggerChildren className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "WATCH ME",
                body: "Redirect attention fast when you feel noise, urgency, or emotional spin.",
                href: "/watch-me",
                accent: "var(--gold-primary)",
              },
              {
                title: "GO FIRST",
                body: "Break hesitation loops with one clean move that restores agency.",
                href: "/go-first",
                accent: "var(--neon-violet)",
              },
              {
                title: "BE THE LIGHT",
                body: "Hold your signal under pressure so your presence does not collapse.",
                href: "/be-the-light",
                accent: "var(--neon-blue)",
              },
            ].map((tool) => (
              <div
                key={tool.title}
                className="glass-card glass-card--lift card-border-left-accent-soft card-surface-accent-subtle p-6"
                style={{ "--card-accent": tool.accent } as { ["--card-accent"]: string }}
              >
                <h3 className="text-sm font-bold uppercase tracking-widest text-body">{tool.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">{tool.body}</p>
                <div className="mt-5">
                  <Link href={tool.href} className="text-sm font-semibold" style={{ color: tool.accent }}>
                    Explore {tool.title} →
                  </Link>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </section>
      </FadeInSection>

      <RayDivider ray="R5" />

      <FadeInSection blur>
        <section id="sample-report-teaser" className="relative content-wrap py-16 sm:py-20 overflow-hidden">
          <NeonStarField showConstellations />
          <div className="relative z-10 mb-10 text-center">
            <span className="gold-tag mx-auto">
              <span style={{ color: "var(--gold-primary)" }}>◆</span> Your Map Preview
            </span>
            <h2 className="heading-section mt-4 text-body">
              SEE THE MAP AFTER YOU SEE THE SIGNAL.
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed text-secondary">
              The preview stays gated so the full sequence remains in the workbook and your report flow.
            </p>
          </div>

          <div className="relative z-10 content-wrap--narrow max-w-[680px]">
            <div
              className="glass-card glass-card--glow card-border-left-accent-soft card-surface-accent-subtle relative overflow-hidden rounded-2xl"
              style={{ "--card-accent": "var(--gold-primary)" } as { ["--card-accent"]: string }}
            >
              <div className="space-y-5 p-6 sm:p-8" style={{ filter: "blur(14px)", userSelect: "none", pointerEvents: "none", opacity: 0.58 }} aria-hidden="true">
                <RadarMockup className="flex flex-col items-center" />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {["R1", "R2", "R3", "R4", "R5", "R6"].map((ray, i) => (
                    <div key={ray} className="glass-card p-3 text-center" style={{ "--card-accent": i % 2 === 0 ? "var(--gold-primary)" : "var(--neon-violet)" } as { ["--card-accent"]: string }}>
                      <div className="h-2 rounded-full mb-2" style={{ background: "color-mix(in srgb, var(--gold-primary) 62%, transparent)", width: `${56 + i * 6}%` }} />
                      <p className="text-xs text-muted">{ray}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-5"
                style={{ background: "color-mix(in srgb, var(--ink-950) 52%, transparent)", backdropFilter: "blur(18px)" }}
              >
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold-primary)" }}>
                    ◆ Unlock Your Full Map
                  </p>
                  <p className="text-sm text-secondary">
                    See where your light is online and where eclipse is still active.
                  </p>
                </div>
                <NeonGlowButton href="/preview">CHECK MY STABILITY</NeonGlowButton>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "color-mix(in srgb, var(--gold-primary) 84%, transparent)" }}>
                  I LOVE CHALLENGE
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <RayDivider ray="R8" />

      <FadeInSection>
        <section id="final-cta" className="relative content-wrap--narrow py-16 sm:py-20">
          <div className="glass-card glass-card--hero p-8 sm:p-10 text-center">
            <span className="gold-tag mx-auto">◆ Final Step</span>
            <h2 className="heading-section mt-4 text-shimmer">
              SELF-LOVE IS A TRAINABLE LEADERSHIP SKILL.
            </h2>
            <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed text-secondary">
              Start with the I Love Challenge. Use the workbook for steps. Use the stability map for evidence.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <NeonGlowButton href="/challenge">START THE 143 CHALLENGE</NeonGlowButton>
              <LiquidFillButton href="/preview">CHECK MY STABILITY</LiquidFillButton>
            </div>
            <p className="mt-4 text-xs" style={{ color: "color-mix(in srgb, var(--text-body) 35%, transparent)" }}>
              143 means I love you. That is where this starts.
            </p>
          </div>
          <EmailCaptureBanner />
        </section>
      </FadeInSection>

      <BackToTopButton />
    </main>
  );
}
