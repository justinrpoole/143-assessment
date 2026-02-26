import Link from "next/link";

import { CoachingApplicationForm } from "@/components/coach/CoachingApplicationForm";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "OS Coaching — 143 Leadership",
  description:
    "Select 1-on-1 coaching with Justin Ray. Data-led sessions built on your 143 Assessment. The framework, the systems, and the accountability to change your leadership patterns.",
};

const COACHING_PILLARS = [
  {
    title: "The Framework",
    description:
      "You learn the full 143 Leadership OS — 9 Rays, eclipse mechanics, the RAS system, and how they map to your actual leadership behaviour. This is not theory. This is the operating system your brain is already running, made visible.",
  },
  {
    title: "The Systems",
    description:
      "Beyond the framework: the tools, protocols, and daily practices that turn insight into behaviour change. If/Then planning, rep logging, energy audits, the 143 Challenge — structured systems that compound.",
  },
  {
    title: "Professional Development",
    description:
      "For executives: strategic capacity mapping, team composition analysis, leadership under sustained pressure, and the metrics that matter. The data your organisation needs, built into your personal development.",
  },
  {
    title: "The App — Ongoing Regulation",
    description:
      "After coaching, you self-regulate with the 143 app. Daily practices, weekly retakes, rep tracking, and phase check-ins keep your growth measurable. Coaching builds the skill. The app keeps it alive.",
  },
];

const SESSION_FORMAT = [
  {
    time: "0–10 min",
    activity: "Data Review + Pattern Surface",
    detail:
      "Review your current 9-Ray scores, Eclipse Snapshot, rep log, and app data from the past week. Surface the patterns your brain is running — the ones you see and the ones you do not.",
  },
  {
    time: "10–25 min",
    activity: "Framework + Systems Exploration",
    detail:
      "Learn the OS mechanics behind your patterns. Why your RAS defaults to certain behaviours. How eclipse compounds. Which capacity to train first and why the sequence matters. For executives: team-level patterns and strategic capacity intelligence.",
  },
  {
    time: "25–40 min",
    activity: "Protocol Design + Accountability",
    detail:
      "Design your practice for the coming week — specific tools, If/Then plans, energy audit adjustments. Measurable, time-bound, matched to your Rise Path. For executive clients: leadership application frameworks.",
  },
  {
    time: "40–45 min",
    activity: "Integration + App Handoff",
    detail:
      "Name what shifted. Set the commitment. Your daily practice lives in the 143 app — rep tracking, phase check-ins, and weekly retakes continue between sessions. Coaching builds the skill. The app sustains it.",
  },
];

const WHO_THIS_IS_FOR = [
  "Executives and senior leaders who want a data-led development path, not generic competency coaching",
  "Founders navigating sustained pressure who need someone who understands eclipse mechanics and capacity recovery",
  "Leaders ready to learn the full 143 framework, implement the systems, and self-regulate with the app long-term",
  "Anyone committed enough to do the reps — not just talk about change, but measure it",
];

const WHO_THIS_IS_NOT_FOR = [
  "People looking for motivational pep talks or someone to just listen — this is structured, data-led work",
  "Leaders who want a quick fix — the 143 OS is a practice, not a prescription",
  "Anyone not willing to use the app between sessions — the systems only work if you work them",
];

export default async function OsCoachingPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_os_coaching",
    sourceRoute: "/os-coaching",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            OS Coaching
          </p>
          <h1
            className="text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Select 1-on-1 coaching. The framework, the systems, and the accountability.
          </h1>
          <p
            className="mx-auto max-w-[540px] text-base leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            OS Coaching is not open enrolment — Justin selects who he works with based
            on fit, readiness, and commitment. You learn the full 143 Leadership framework,
            the systems to apply it, and then regulate long-term with the app.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/assessment" className="btn-primary">
              Take the Assessment First
            </Link>
            <Link href="#format" className="btn-watch">
              See the Session Format
            </Link>
          </div>
        </section>

        <GoldDivider />

        {/* ─── SECTION 2 · FOUR PILLARS ──────────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                How It Works
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                What you get. What stays with you.
              </h2>
            </div>

            <StaggerContainer className="grid gap-5 sm:grid-cols-2">
              {COACHING_PILLARS.map((pillar) => (
                <StaggerItem key={pillar.title}>
                  <div className="glass-card p-6 h-full space-y-2">
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-on-dark-secondary)" }}
                    >
                      {pillar.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 3 · SESSION FORMAT ────────────────────────── */}
        <FadeInSection>
          <section id="format" className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Session Format
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                45 minutes. Four movements. One outcome.
              </h2>
            </div>

            <StaggerContainer className="space-y-4">
              {SESSION_FORMAT.map((step) => (
                <StaggerItem key={step.time}>
                  <div className="glass-card flex gap-5 p-6">
                    <div className="shrink-0">
                      <span
                        className="text-xs font-bold"
                        style={{ color: "var(--brand-gold, #F8D011)" }}
                      >
                        {step.time}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                      >
                        {step.activity}
                      </h3>
                      <p
                        className="mt-1 text-sm leading-relaxed"
                        style={{ color: "var(--text-on-dark-secondary)" }}
                      >
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 4 · WHO THIS IS FOR ───────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="glass-card p-6 space-y-4">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  This Is For You If
                </p>
                <ul className="space-y-3">
                  {WHO_THIS_IS_FOR.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--text-on-dark-secondary)" }}
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0"
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
              </div>
              <div className="glass-card p-6 space-y-4">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-on-dark-secondary)" }}
                >
                  This Is Not For You If
                </p>
                <ul className="space-y-3">
                  {WHO_THIS_IS_NOT_FOR.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--text-on-dark-secondary)" }}
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        <path
                          d="M4 4l8 8M12 4l-8 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 5 · APPLICATION ───────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-6">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Apply
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Coaching is by application.
              </h2>
              <p
                className="mx-auto max-w-[520px] text-sm leading-relaxed"
                style={{ color: "var(--text-on-dark-secondary)" }}
              >
                If the OS Coaching model is the right fit, apply below. Short form. Clear signal.
              </p>
            </div>
            <CoachingApplicationForm />
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 6 · CTA ────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Start with the assessment. Coaching is by application.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Take the assessment first. See your results. If 1-on-1 coaching feels like
                the right next step, apply above. Justin reviews every application and selects
                clients based on fit, readiness, and commitment to the reps.
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
