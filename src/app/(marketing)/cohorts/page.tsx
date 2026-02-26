import Link from "next/link";

import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Light Cohorts — 143 Leadership",
  description:
    "10 weeks. 6–8 leaders. The full 143 framework, the systems to apply it, and the app to sustain it. Group coaching that produces measurable leadership change.",
};

const COHORT_BENEFITS = [
  {
    title: "The Full Framework",
    description:
      "Every participant learns the complete 143 Leadership OS — the 9 Rays, eclipse mechanics, the RAS system, and the science behind every tool. This is not a workshop. It is a 10-week operating system installation.",
  },
  {
    title: "The Systems",
    description:
      "Beyond understanding: the daily protocols, If/Then planning, energy audits, rep tracking, and phase check-ins that turn knowledge into behaviour change. You leave with systems, not just insights.",
  },
  {
    title: "Professional Development (Executive Track)",
    description:
      "For executives: strategic capacity mapping, team composition analysis, leadership under sustained pressure, and the aggregate intelligence your organisation needs. The metadata that drives real decisions.",
  },
  {
    title: "The App — Ongoing Regulation",
    description:
      "After the 10 weeks, you self-regulate with the 143 app. Daily practices, weekly retakes, rep logging, and phase check-ins keep your development measurable. The cohort builds the skill. The app keeps it alive.",
  },
];

const COHORT_TIERS = [
  {
    label: "Group Cohort",
    size: "6–8 leaders",
    duration: "10 weeks",
    description:
      "The core offering. 6–8 leaders learn the full 143 framework together over 10 weeks. Individual assessments, group sessions, shared language, and the app for ongoing regulation after the programme.",
    includes: [
      "Full 143 Assessment for each participant",
      "10 weekly group coaching sessions",
      "Individual reports + Rise Path",
      "The full OS toolkit (13 protocols)",
      "App access for ongoing self-regulation",
      "30-day post-programme retake",
    ],
    ideal: "Leaders ready to change patterns, not just discuss them",
  },
  {
    label: "Executive Cohort",
    size: "6–8 executives",
    duration: "10 weeks",
    description:
      "Everything in the Group Cohort plus executive-level professional development. Strategic capacity mapping, team composition intelligence, leadership metadata, and the aggregate data your organisation needs to make real decisions.",
    includes: [
      "Everything in Group Cohort",
      "Executive professional development modules",
      "Strategic capacity + team composition analysis",
      "Leadership metadata + aggregate intelligence",
      "Cohort pattern analysis for sponsor reporting",
      "Priority app features + ongoing support",
    ],
    ideal: "Senior leaders and executives who need both personal development and organisational intelligence",
  },
  {
    label: "Private Cohort",
    size: "Custom",
    duration: "10 weeks",
    description:
      "Bring your own team. Same 10-week structure, customised to your organisation's context, language, and strategic priorities. Debrief sessions tailored to your team dynamics.",
    includes: [
      "Everything in Executive Cohort",
      "Custom deployment to your team",
      "Facilitated team debrief sessions",
      "Aggregate reporting for leadership sponsors",
      "Ongoing app access for the full team",
      "Quarterly retake cycles",
    ],
    ideal: "Organisations deploying the 143 OS across a leadership team",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    num: "01",
    title: "Take the Assessment",
    description:
      "Every participant takes the full 143-question assessment before the cohort begins. Individual results, Light Signature, Eclipse Snapshot, and Rise Path — your private data, your starting point.",
  },
  {
    num: "02",
    title: "10 Weeks of Light Cohort Coaching",
    description:
      "Weekly sessions with 6–8 leaders. Learn the full framework, the science behind the tools, and the systems to apply them. Executives get additional professional development modules and strategic capacity intelligence.",
  },
  {
    num: "03",
    title: "Practice Between Sessions",
    description:
      "Use the 143 app daily — rep logging, phase check-ins, If/Then protocols, energy audits. The app tracks your practice between sessions so every week starts with real data, not self-reporting.",
  },
  {
    num: "04",
    title: "Retake and Measure",
    description:
      "Weekly retakes track what moved, what held, and what needs a different approach. Growth is a delta. Your before-and-after data is the proof that the reps are working.",
  },
  {
    num: "05",
    title: "Self-Regulate with the App",
    description:
      "After 10 weeks, the coaching ends but the practice does not. The 143 app is your ongoing regulation tool — daily practices, weekly retakes, and the system you learned applied to every new challenge.",
  },
];

export default async function CohortsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_cohorts",
    sourceRoute: "/cohorts",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <p className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Cohorts
          </p>
          <h1
            className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            10 weeks. 6–8 leaders. The framework, the systems, and the app.
          </h1>
          <p
            className="mx-auto max-w-[540px] text-base leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Group coaching cohorts where you learn the full 143 Leadership OS together.
            Every participant gets their own assessment, individual development path, and
            the app to self-regulate after the programme ends. This is where lasting
            leadership change happens.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <NeonGlowButton href="/organizations">
              Request a Cohort
            </NeonGlowButton>
            <LiquidFillButton href="#how-it-works">
              See How It Works
            </LiquidFillButton>
          </div>
        </section>

        <GoldDividerAnimated />

        {/* ─── SECTION 2 · BENEFITS ──────────────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Why Cohorts Work
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Learn the framework. Implement the systems. Regulate with the app.
              </h2>
            </div>

            <StaggerContainer className="grid gap-5 sm:grid-cols-2">
              {COHORT_BENEFITS.map((benefit) => (
                <StaggerItem key={benefit.title}>
                  <div className="glass-card p-6 h-full space-y-2">
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-on-dark-secondary)" }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 3 · COHORT TIERS ──────────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Cohort Options
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Choose your track. All cohorts run 10 weeks.
              </h2>
            </div>

            <StaggerContainer className="grid gap-5 sm:grid-cols-3">
              {COHORT_TIERS.map((tier) => (
                <StaggerItem key={tier.label}>
                  <div className="glass-card p-6 h-full space-y-3">
                    <p
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: "var(--brand-gold, #F8D011)" }}
                    >
                      {tier.label}
                    </p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                    >
                      {tier.size}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-on-dark-muted)" }}
                    >
                      {tier.duration}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-on-dark-secondary)" }}
                    >
                      {tier.description}
                    </p>
                    <ul className="space-y-2">
                      {tier.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs leading-relaxed"
                          style={{ color: "var(--text-on-dark-secondary)" }}
                        >
                          <svg
                            className="mt-0.5 h-3 w-3 shrink-0"
                            viewBox="0 0 16 16"
                            fill="none"
                            style={{ color: "var(--brand-gold, #F8D011)" }}
                          >
                            <path
                              d="M3 8l3.5 3.5L13 5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p
                      className="text-xs italic"
                      style={{ color: "var(--text-on-dark-muted)" }}
                    >
                      Ideal for: {tier.ideal}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        <GoldHeroBanner
          kicker="Shared Language. Individual Paths."
          title="The cohort builds the skill. The app keeps it alive."
          description="Every participant gets their own assessment, their own Rise Path, and the shared language to support each other after the programme ends."
        />

        <GoldDividerAnimated />

        {/* ─── SECTION 4 · HOW IT WORKS ──────────────────────────── */}
        <FadeInSection>
          <section id="how-it-works" className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Process
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Assessment → 10 weeks → self-regulation.
              </h2>
            </div>

            <StaggerContainer className="space-y-4">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <StaggerItem key={step.num}>
                  <div className="glass-card flex gap-5 p-6">
                    <span
                      className="shrink-0 text-2xl font-bold"
                      style={{ color: "var(--brand-gold, #F8D011)" }}
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
                        style={{ color: "var(--text-on-dark-secondary)" }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 5 · CTA ────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Start with the assessment. Then join a cohort.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Take the assessment to see where you stand. When the next cohort opens,
                you will have your data ready. 6–8 leaders, 10 weeks, and the app to keep
                it going after.
              </p>
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