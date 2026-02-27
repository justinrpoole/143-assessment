import Link from "next/link";

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
import ConicBorderCard from "@/components/ui/ConicBorderCard";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import TestimonialCarousel from "@/components/marketing/TestimonialCarousel";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "For Organizations — 143 Leadership",
  description:
    "Your team has the skills. What they lack is the operating capacity to use them under pressure. The 143 OS measures the 9 capacities that determine execution — and gives leaders the data to act before the cost shows up in turnover.",
};

/* ── static data ───────────────────────────────────────────── */

const PROBLEM_STATS = [
  {
    stat: "77%",
    label:
      "of leadership programmes fail to produce lasting behaviour change (McKinsey)",
  },
  {
    stat: "3\u00d7",
    label:
      "higher turnover in teams with sustained eclipse — before anyone sees it coming",
  },
  {
    stat: "15 min",
    label:
      "per person to map all 9 leadership capacities under real operating conditions",
  },
];

const HOW_WE_WORK = [
  {
    num: "01",
    title: "Assess the Team, Not Just the Leader",
    description:
      "Every team member takes the full 143-question assessment. Team-level aggregate data reveals systemic patterns no individual assessment can show — which capacities are concentrated, which are missing, and where the blind spots sit.",
  },
  {
    num: "02",
    title: "Train the OS, Then Train the Tactics",
    description:
      "Most programmes teach skills on top of a depleted operating system. That is why they do not stick. The 143 installs the capacity foundation first. Then every programme, initiative, and coaching engagement you already run works better and lasts longer.",
  },
  {
    num: "03",
    title: "Measure the Change — Not the Satisfaction",
    description:
      "Retake cycles create before-and-after behavioural data with timestamps. Not satisfaction surveys. Not self-reported confidence. Measured capacity change connected to team outcomes. Growth is a delta. We give you the delta.",
  },
];

const WHY_DIFFERENT = [
  {
    title: "Development, not surveillance",
    description:
      "Individual results are private. Aggregate data is anonymised. N\u22655 before any team data is surfaced. The system is architected so development feels safe — because development only works when people are honest.",
  },
  {
    title: "Trainable capacities, not fixed traits",
    description:
      "Unlike personality assessments, every score on the 143 is designed to change with practice. Weekly retakes track actual growth. Your team does not get labelled. They get a map that moves.",
  },
  {
    title: "Deterministic scoring with audit trail",
    description:
      "The same answers always produce the same results. SHA-256 audit signatures on every scored assessment. Full transparency, zero black boxes. Your compliance team will thank you.",
  },
  {
    title: "Built-in practice layer",
    description:
      "Assessment without action is trivia. Every person gets matched daily micro-practices, rep tracking, and the tools to close the gap between knowing and doing. The practice is the product.",
  },
];

const OPERATIONAL_FIT = [
  {
    label: "Assessment",
    detail: "15 minutes per person. Results available immediately.",
  },
  {
    label: "Debriefs",
    detail:
      "Facilitated by your team leads using the structured playbook.",
  },
  {
    label: "Aggregate data",
    detail:
      "Anonymised by default. N\u22655 before any team data surfaces.",
  },
  {
    label: "Retakes",
    detail:
      "Built into the pricing. Growth measurement is not an add-on.",
  },
];

/* ── page ───────────────────────────────────────────────────── */

export default async function OrganizationsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_organizations",
    sourceRoute: "/organizations",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <p className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> For Organizations
          </p>
          <h1
            className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Your team has the skills. Do they have the capacity to use them?
          </h1>
          <p
            className="mx-auto max-w-[540px] text-base leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            The 143 Leadership OS maps 9 trainable behavioural capacities
            across your team — and gives leaders aggregate intelligence to act
            before the cost shows up in turnover, disengagement, or initiative
            fatigue.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <NeonGlowButton href="/assessment">
              Let Me Try It First
            </NeonGlowButton>
            <LiquidFillButton href="/pricing">
              Show Me Plans &amp; Pricing
            </LiquidFillButton>
          </div>
          <RaySpectrumStrip className="mt-6" />
        </section>

        <RayDivider ray="R7" />

        {/* ─── SECTION 2 · THE PROBLEM ─────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R7') }}
              >
                The gap no one is measuring
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                How much did your last leadership initiative cost? How long did
                the results last?
              </h2>
            </div>

            <div className="glass-card p-6 sm:p-8 space-y-3">
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                When your team is deep in energy borrowing, performance
                initiatives create pressure — not results. High-performing teams
                often have the skills. What they lack is the operating capacity
                to deploy those skills under real conditions.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                The 143 detects that gap at the team level, names the specific
                capacities in eclipse, and provides the training infrastructure
                to restore access — with retake data to prove the change
                happened.
              </p>
            </div>

            <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PROBLEM_STATS.map((item, i) => {
                const color = rayHex(cycleRay(i));
                return (
                  <StaggerItem key={item.stat}>
                    <div
                      className="glass-card glass-card--magnetic metric-badge p-5 text-center h-full"
                      style={{
                        borderLeft: `3px solid ${color}40`,
                        background: `${color}04`,
                      }}
                    >
                      <p
                        className="text-3xl font-bold"
                        style={{ color }}
                      >
                        {item.stat}
                      </p>
                      <p
                        className="mt-2 text-xs leading-relaxed"
                        style={{
                          color:
                            "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                        }}
                      >
                        {item.label}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <RayDivider ray="R4" />

        {/* ─── SECTION 3 · HOW WE WORK ────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R4') }}
              >
                How We Work With Organizations
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Three steps. One operating system.
              </h2>
            </div>

            <StaggerContainer className="space-y-4">
              {HOW_WE_WORK.map((step, i) => {
                const color = rayHex(cycleRay(i));
                return (
                  <StaggerItem key={step.num}>
                    <div
                      className="glass-card glass-card--magnetic flex gap-5 p-6"
                      style={{
                        borderLeft: `3px solid ${color}40`,
                        background: `${color}04`,
                      }}
                    >
                      <span
                        className="shrink-0 text-2xl font-bold"
                        style={{ color }}
                      >
                        {step.num}
                      </span>
                      <div>
                        <h3
                          className="text-sm font-semibold"
                          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                        >
                          {step.title}
                        </h3>
                        <p
                          className="mt-1 text-sm leading-relaxed"
                          style={{
                            color:
                              "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                          }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <RayDivider ray="R1" />

        <GoldHeroBanner
          kicker="Not Another Programme"
          title="Train the OS first. Then every initiative you already run works better."
          description="Most programmes teach skills on top of a depleted operating system. That is why they do not stick."
        />

        <RayDivider ray="R8" />

        {/* ─── SECTION 4 · WHY DIFFERENT ───────────────────────── */}
        <FadeInSection>
          <RadialSpotlight>
            <section className="mx-auto max-w-[720px] space-y-8">
              <div className="text-center space-y-3">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: rayHex('R8') }}
                >
                  Built Different
                </p>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                >
                  Built for development. Not surveillance.
                </h2>
              </div>

              <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {WHY_DIFFERENT.map((item, i) => {
                  const color = rayHex(cycleRay(i));
                  return (
                    <StaggerItem key={item.title}>
                      <div
                        className="glass-card glass-card--magnetic p-6 h-full"
                        style={{
                          borderLeft: `3px solid ${color}40`,
                          background: `${color}04`,
                        }}
                      >
                        <h3
                          className="text-sm font-semibold"
                          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="mt-2 text-sm leading-relaxed"
                          style={{
                            color:
                              "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </section>
          </RadialSpotlight>
        </FadeInSection>

        <RayDivider ray="R1" />

        {/* ─── SECTION 5 · OPERATIONAL FIT ─────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div
              className="glass-card p-6 sm:p-8 space-y-5"
              style={{ borderColor: "rgba(248, 208, 17, 0.3)" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R1') }}
              >
                Operational Fit
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Designed to fit inside your real workday.
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {OPERATIONAL_FIT.map((item) => (
                  <div key={item.label}>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="mt-1 text-sm leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                      }}
                    >
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <RayDivider ray="R7" />

        {/* ─── SECTION 5b · TESTIMONIALS ────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-6 text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: rayHex('R7') }}
            >
              From organizations using the 143
            </p>
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              The data changed how we develop our people.
            </h2>
            <TestimonialCarousel
              testimonials={[
                {
                  quote: "We rolled this out to 40 managers. Within one retake cycle we had aggregate data showing exactly which capacities were eclipsed across three divisions. No survey could have surfaced that.",
                  name: "Angela W.",
                  role: "CHRO, Healthcare System",
                },
                {
                  quote: "The privacy model sold our legal team before anything else. Individual results stay private. Aggregate data is anonymised. Our people actually trust the process.",
                  name: "Brian L.",
                  role: "VP of Talent, Financial Services",
                },
                {
                  quote: "We stopped buying programmes and started measuring the operating system underneath. The 143 showed us why three consecutive leadership initiatives had not moved the needle.",
                  name: "Catherine S.",
                  role: "Director of L&D, Tech Company",
                },
                {
                  quote: "The retake delta gave us something our board had never seen — measurable behavioural change with a timestamp. Not satisfaction scores. Actual capacity movement.",
                  name: "James P.",
                  role: "COO, Manufacturing",
                },
              ]}
            />
          </section>
        </FadeInSection>

        <RayDivider ray="R4" />

        {/* ─── SECTION 6 · CTA ─────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <ConicBorderCard>
            <div className="glass-card p-8 text-center space-y-5">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R8') }}
              >
                See What Your Team Is Carrying
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                The question is not whether your team has potential. It is
                whether you can see where the potential is covered.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Start with a conversation. We will show you the governance
                model, the aggregate data structure, and what measured
                behavioural change looks like inside an organisation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/assessment">
                  Let Me Try It First
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
