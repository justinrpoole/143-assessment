import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BackToTopButton from "@/components/ui/BackToTopButton";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import ConicBorderCard from "@/components/ui/ConicBorderCard";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import RayDivider from "@/components/ui/RayDivider";
import { rayHex, cycleRay } from "@/lib/ui/ray-colors";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { NEON, neonText, neonHalo } from '@/lib/ui/neon';

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The 143 Standard — What Every Leadership Assessment Should Be",
  description:
    "10 principles that define the next generation of leadership assessment. Dynamic measurement. Daily practice. Compassion-based. Transparent methodology. Designed to be outgrown.",
};

/* ── The 10 Principles ──────────────────────────────────────── */

const PRINCIPLES = [
  {
    number: "01",
    name: "Dynamic, Not Static",
    description:
      "Scores should reflect your current state, not a permanent label. A score that never changes is measuring the wrong thing.",
    standard:
      "The assessment measures energy states and trainable capacities — not personality traits. Retake is the design, not the exception.",
  },
  {
    number: "02",
    name: "Includes a Daily Practice System",
    description:
      "Knowing what to change and changing it are different problems. An assessment without a practice system is a diagnosis without treatment.",
    standard:
      "Every score maps to a specific daily practice. The assessment and the practice system are one integrated operating system.",
  },
  {
    number: "03",
    name: "Measures Change Over Time",
    description:
      "If you cannot retake it and see movement, it is not measuring growth. It is giving you a label.",
    standard:
      "Weekly retake is built into the design. Score movement is the evidence that practice is landing.",
  },
  {
    number: "04",
    name: "Compassion-Based, Not Shame-Based",
    description:
      "A regulated nervous system sustains high standards. A shamed one collapses. The language of assessment shapes the outcome of development.",
    standard:
      "Eclipse is coverage, not damage. Gaps are temporary load, not permanent weakness. 143 means I love you — that is the design philosophy.",
  },
  {
    number: "05",
    name: "Transparent Methodology",
    description:
      "If you cannot audit the assessment, why would you trust it with your development? Black boxes breed skepticism, not growth.",
    standard:
      "Deterministic scoring. Published confidence bands. Known limitations stated clearly. No AI interpretation. The math is auditable.",
  },
  {
    number: "06",
    name: "Accessible Pricing",
    description:
      "Leadership development should not be locked behind enterprise contracts and $6,000 coaching fees.",
    standard:
      "Start free. Go deeper at $14.33/month. The most important tools are the most accessible ones.",
  },
  {
    number: "07",
    name: "Self-Directed",
    description:
      "A tool that requires a coach to interpret it is a tool that does not trust you. The best assessment empowers you to act on your own data.",
    standard:
      "Your report is readable without a debrief. Your practices are actionable without a coach. A coach adds depth — but is never required.",
  },
  {
    number: "08",
    name: "Neurodivergent-Inclusive",
    description:
      "Traditional assessments are 60 to 240 items, no breaks, abstract language, one sitting. That is not rigorous. That is exclusionary.",
    standard:
      "Built for ADHD first. Short practices. Clear structure. Immediate feedback. Visible progress. No willpower required to start. Better design for every brain.",
  },
  {
    number: "09",
    name: "Trainable Capacities, Not Fixed Traits",
    description:
      "You are not a type. You are a pattern of energy that shifts with practice, stress, rest, and intention.",
    standard:
      "9 trainable capacities measured across Shine, Access, and Eclipse. Scores are designed to move — because you are.",
  },
  {
    number: "10",
    name: "Designed to Be Outgrown",
    description:
      "The best assessment expects you to outgrow it. When your scores change, that is not inconsistency. That is evidence of growth.",
    standard:
      "We built for the truth that capacities are trainable. Your score should change. That is the whole point.",
  },
];

const COMPARISON_ROWS = [
  { dimension: "Measurement type", legacy: "Static snapshot", standard: "Dynamic energy state" },
  { dimension: "Retake model", legacy: "Once (or pay again)", standard: "Weekly by design" },
  { dimension: "Practice system", legacy: "None included", standard: "Daily loop integrated" },
  { dimension: "Language", legacy: "Deficits and risks", standard: "Coverage and restoration" },
  { dimension: "Scoring", legacy: "Proprietary black box", standard: "Deterministic, auditable" },
  { dimension: "Pricing", legacy: "$425–$6,000/person", standard: "Free to start, $14.33/mo" },
  { dimension: "Coach required", legacy: "Yes, for interpretation", standard: "No — self-directed" },
  { dimension: "Neurodivergent design", legacy: "Not considered", standard: "Built for it first" },
  { dimension: "Score changes", legacy: "Means instrument is unreliable", standard: "Means practice is working" },
  { dimension: "Philosophy", legacy: "You ARE this type", standard: "You are showing this RIGHT NOW" },
];

/* ── Page ────────────────────────────────────────────────────── */

export default async function StandardPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_standard",
    sourceRoute: "/standard",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── HERO ────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <FloatingOrbs variant="mixed" />
          <p className="gold-tag mx-auto">
            <span style={{ color: "#F8D011" }}>◆</span> Category-Defining Principles
          </p>
          <h1
            className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)", textShadow: neonText(NEON.violet) }}
          >
            The 143 Standard.
          </h1>
          <div className="mx-auto max-w-[540px]">
            <ScrollTextReveal text="10 principles that define what every leadership assessment should be. We did not just build an assessment. We defined the standard we wish existed — then held ourselves to it." />
          </div>
          <RaySpectrumStrip className="mt-4" />
        </section>

        <RayDivider />

        {/* ─── THE 10 PRINCIPLES ───────────────────────────────── */}
        <FadeInSection>
          <RadialSpotlight>
            <section className="mx-auto max-w-[720px] space-y-8">
              <div className="space-y-3 text-center">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: rayHex('R9') }}
                >
                  The 10 Principles
                </p>
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: "var(--text-on-dark, #FFFEF5)", textShadow: neonText(NEON.violet) }}
                >
                  What a leadership assessment should be.
                </h2>
              </div>

              <StaggerContainer className="space-y-4">
                {PRINCIPLES.map((p, i) => { const color = rayHex(cycleRay(i)); return (
                  <StaggerItem key={p.number}>
                    <div
                      className="glass-card glass-card--magnetic p-5"
                      style={{
                        borderLeft: `3px solid ${color}40`,
                        background: `${color}04`,
                      }}
                    >
                      <div className="flex items-baseline gap-3">
                        <span
                          className="shrink-0 text-lg font-bold"
                          style={{
                            color,
                            fontFamily: "var(--font-cosmic-display)",
                          }}
                        >
                          {p.number}
                        </span>
                        <p
                          className="text-sm font-bold"
                          style={{ color }}
                        >
                          {p.name}
                        </p>
                      </div>
                      <p
                        className="mt-2 text-sm leading-relaxed"
                        style={{
                          color:
                            "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                        }}
                      >
                        {p.description}
                      </p>
                      <p
                        className="mt-2 text-xs leading-relaxed italic"
                        style={{
                          color: `${color}66`,
                        }}
                      >
                        143 Standard: {p.standard}
                      </p>
                    </div>
                  </StaggerItem>
                );})}
              </StaggerContainer>
            </section>
          </RadialSpotlight>
        </FadeInSection>

        <RayDivider ray="R1" />

        {/* ─── LEGACY vs STANDARD ──────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-6">
            <div className="space-y-3 text-center">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R1') }}
              >
                Legacy Assessments vs. The 143 Standard
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                The industry has been measuring the wrong thing.
              </h2>
            </div>

            <div className="glass-card overflow-hidden">
              {/* Header row */}
              <div
                className="grid grid-cols-3 gap-px text-xs font-bold uppercase tracking-widest p-3"
                style={{
                  background: "rgba(248,208,17,0.06)",
                  borderBottom: "1px solid rgba(248,208,17,0.15)",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.4)" }}>
                  Dimension
                </span>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>
                  Legacy
                </span>
                <span style={{ color: "var(--brand-gold, #F8D011)" }}>
                  143 Standard
                </span>
              </div>

              {/* Data rows */}
              {COMPARISON_ROWS.map((row, i) => (
                <div
                  key={row.dimension}
                  className="grid grid-cols-3 gap-px p-3 text-xs leading-relaxed"
                  style={{
                    borderBottom:
                      i < COMPARISON_ROWS.length - 1
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "none",
                    borderLeft: `2px solid ${rayHex(cycleRay(i))}25`,
                  }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {row.dimension}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>
                    {row.legacy}
                  </span>
                  <span style={{ color: rayHex(cycleRay(i)) }}>
                    {row.standard}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </FadeInSection>

        <RayDivider />

        <GoldHeroBanner
          kicker="The Standard"
          title="We defined the criteria. Then we built the assessment that meets them."
          description="Every competitor will be measured against this framework. Not because we said so — but because leaders deserve it."
        />

        <RayDivider ray="R9" />

        {/* ─── WHY THIS MATTERS ────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card glass-card--executive p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R4') }}
              >
                Why This Matters
              </p>
              <h2
                className="text-xl font-bold sm:text-2xl"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                The leadership development industry is a $240 billion market
                built on tools that do not measure change.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                85% of leadership training fails to produce lasting behaviour
                change (Beer, Finnstrom, Schrader — HBR). Not because leaders
                are resistant. Because the tools stop at diagnosis.{" "}
                <span className="gold-highlight">
                  Knowing what to change and changing it are completely different
                  problems.
                </span>{" "}
                Every tool that stops at knowing is leaving leaders stranded
                between insight and action.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                }}
              >
                The 143 Standard is not a marketing claim. It is a set of
                principles we hold ourselves accountable to — publicly. If we
                fall short, you can point to this page and tell us. That is the
                point.
              </p>
            </div>
          </section>
        </FadeInSection>

        <RayDivider />

        {/* ─── CTA ─────────────────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <ConicBorderCard glow>
              <div
                className="glass-card p-8 text-center space-y-5"
                style={{ border: "none" }}
              >
                <h2
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                >
                  See the standard in action.
                </h2>
                <p
                  className="mx-auto max-w-[480px] text-sm leading-relaxed"
                  style={{
                    color:
                      "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                  }}
                >
                  The 143 Standard is not theory. It is live. Take the
                  assessment and experience every principle on this page — from
                  dynamic measurement to daily practice to compassion-based
                  scoring.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <NeonGlowButton href="/assessment">
                    Show Me All 9 Rays
                  </NeonGlowButton>
                  <LiquidFillButton href="/preview">
                    Check My Stability Free
                  </LiquidFillButton>
                </div>
              </div>
            </ConicBorderCard>
          </section>
        </FadeInSection>
      </div>
      <BackToTopButton />
    </main>
  );
}
