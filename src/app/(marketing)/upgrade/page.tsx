import Link from "next/link";

import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { UpgradeCheckoutClient } from "@/components/billing/UpgradeCheckoutClient";
import DimmingCarryForwardCard from "@/components/billing/DimmingCarryForwardCard";
import HeroEclipseVisual from "@/components/marketing/HeroEclipseVisual";
import EclipseComparisonGraphic from "@/components/marketing/EclipseComparisonGraphic";
import SunRayDiagram from "@/components/marketing/SunRayDiagram";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import RayDivider from "@/components/ui/RayDivider";
import { rayHex, cycleRay } from "@/lib/ui/ray-colors";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upgrade — 143 Leadership",
  description:
    "143 questions. 15 minutes. Your Light Signature, Eclipse Snapshot, 9-Ray Map, and Rise Path. $43 one-time or $14.33/mo with weekly retakes and progress logs. See what is strong, what is covered, and what to do first.",
};

/* ── static data ───────────────────────────────────────────── */

const DELIVERABLES = [
  {
    title: "Your Light Signature",
    body: "Which two of your nine capacities lead when you are at your best. One of 36 possible combinations. Not a personality type — the pattern your system defaults to under real conditions.",
  },
  {
    title: "Your Eclipse Snapshot",
    body: "Which capacities stress is currently covering — across emotional, cognitive, and relational load. The coverage is temporary. The map makes it visible.",
  },
  {
    title: "Complete 9-Ray Map",
    body: "All nine capacities scored across 36 subfacets. Not good or bad. Strong or eclipsed. Every score is a trainable capacity, not a fixed trait.",
  },
  {
    title: "Energy-to-Eclipse Ratio",
    body: "One number showing how much capacity is online versus covered. Most leaders are surprised. That surprise is the beginning of precision.",
  },
  {
    title: "Your Rise Path",
    body: "Specific reps matched to your results. Not a generic reading list. Not 'try journalling.' Concrete actions designed for where your coverage is highest.",
  },
  {
    title: "30-Day Training Plan",
    body: "A personalised sequence built from your Rise Path. Daily micro-practices that restore access to eclipsed capacities. 3 minutes a day.",
  },
];

const DIFFERENTIATORS = [
  {
    heading: "They measure who you are.",
    body: "Fixed types. Same result in a crisis as on vacation. Useful for knowing. Not for changing. The 143 measures state, not trait. Your results change as your load changes.",
  },
  {
    heading: "This proves you moved.",
    body: "Retake in 90 days. Watch the numbers shift. That is not a feeling. That is evidence the reps are landing. No other assessment is designed to be outgrown.",
  },
  {
    heading: "$43 once. Not $2,000 per seat.",
    body: "143 questions. 15 minutes. A behavioural map that belongs to you permanently. Your data stays even if you never come back. Because the work should earn your attention, not trap it.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I have taken MBTI, Enneagram, DISC, and StrengthsFinder. None of them explained why I was performing well but feeling empty. The eclipse concept did in one sentence what four assessments could not.",
    attribution: "VP of Operations, SaaS",
  },
  {
    quote:
      "I retook the assessment 90 days after starting the Portal. Three of my Ray scores moved. Not because I tried harder. Because I trained differently. First time a tool actually showed me I was growing.",
    attribution: "Senior Director, Healthcare",
  },
  {
    quote:
      "My team noticed before I did. My presence score went from eclipsed to emerging. My direct reports said I was calmer in meetings. That was not an accident — it was reps.",
    attribution: "Engineering Lead, Fortune 500",
  },
];

const REPORT_FEATURES = [
  "Your Light Signature (one of 36)",
  "Full 9-Ray capacity report with Eclipse Snapshot",
  "Energy-to-Eclipse Ratio and Gravitational Stability Score",
  "Personalised Rise Path with concrete next actions",
  "30-Day training plan matched to your results",
  "Downloadable PDF report",
];

const PORTAL_FEATURES = [
  "Everything in the report",
  "Weekly retakes (43-question tracking set)",
  "Daily micro-practices matched to your Rise Path",
  "Watch Me and Go First interactive flows",
  "Watch your scores change week over week",
  "All results and reports stay even if you cancel",
];

/* ── page ───────────────────────────────────────────────────── */

export default async function UpgradePage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_upgrade",
    sourceRoute: "/upgrade",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="grid gap-8 md:grid-cols-[1fr,240px] items-center">
          <FloatingOrbs variant="mixed" />
          <div className="space-y-5">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: rayHex('R9') }}
            >
              You Already Felt the Shift
            </p>
            <h1
              className="text-shimmer text-3xl font-semibold leading-tight sm:text-4xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              The Stability Check showed you something real. The full assessment
              shows you everything.
            </h1>
            <p
              className="text-base leading-relaxed max-w-[560px]"
              style={{
                color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              143 questions. 15 minutes. Your Light Signature — which two of
              nine capacities lead when you are at your best. Your Eclipse
              Snapshot — which ones stress is currently covering. Your Rise
              Path — the specific reps that restore access. Not a label. A map
              that changes as you do.
            </p>
            <div className="flex flex-wrap gap-3">
              <NeonGlowButton href="#plans">
                Show Me Both Plans
              </NeonGlowButton>
              <LiquidFillButton href="/preview">
                Check My Stability Free
              </LiquidFillButton>
            </div>
            <RaySpectrumStrip className="mt-6" />
          </div>
          <div className="hidden md:block" aria-hidden="true">
            <HeroEclipseVisual className="scale-75 origin-center" />
          </div>
        </section>

        {/* ─── SECTION 2 · STABILITY CHECK CARRY-FORWARD ─────── */}
        <FadeInSection>
          <DimmingCarryForwardCard />
        </FadeInSection>

        <RayDivider ray="R1" />

        {/* ─── SECTION 3 · WHAT YOU GET ────────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R8') }}
              >
                What the Assessment Reveals
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Six deliverables. One sitting. Yours permanently.
              </h2>
            </div>

            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {DELIVERABLES.map((item, i) => (
                <StaggerItem key={item.title}>
                  <div className="glass-card glass-card--magnetic p-5 space-y-2 h-full" style={{ borderTop: `2px solid ${rayHex(cycleRay(i))}` }}>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: rayHex(cycleRay(i)) }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.70))",
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeInSection delay={0.3}>
              <div className="mx-auto max-w-[600px] space-y-4">
                <SunRayDiagram />
                <p
                  className="text-center text-sm leading-relaxed"
                  style={{
                    color:
                      "var(--text-on-dark-secondary, rgba(255,255,255,0.70))",
                  }}
                >
                  9 capacities. 36 subfacets. 3 phases: Reconnect, Radiate,
                  Become. Your Light Signature shows which rays lead — and which
                  are covered.
                </p>
              </div>
            </FadeInSection>
          </section>
        </FadeInSection>

        <RayDivider ray="R5" />

        {/* ─── SECTION 4 · HOW THIS IS DIFFERENT ───────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R6') }}
              >
                How This Is Different
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Other tools describe you. This one trains you.
              </h2>
            </div>

            <StaggerContainer className="grid gap-5 sm:grid-cols-3">
              {DIFFERENTIATORS.map((item, i) => (
                <StaggerItem key={item.heading}>
                  <div className="glass-card glass-card--magnetic p-5 space-y-2 h-full" style={{ borderTop: `2px solid ${rayHex(cycleRay(i))}` }}>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: rayHex(cycleRay(i)) }}
                    >
                      {item.heading}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.70))",
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeInSection delay={0.2}>
              <div className="mx-auto max-w-[520px]">
                <EclipseComparisonGraphic />
              </div>
            </FadeInSection>
          </section>
        </FadeInSection>

        <RayDivider ray="R7" />

        {/* ─── SECTION 5 · TESTIMONIALS ────────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="text-center">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R7') }}
              >
                What Leaders Discovered
              </p>
            </div>

            <StaggerContainer className="space-y-4 mx-auto max-w-[640px]">
              {TESTIMONIALS.map((t, i) => (
                <StaggerItem key={t.attribution}>
                  <blockquote
                    className="glass-card glass-card--magnetic p-5"
                    style={{
                      borderLeft: `3px solid ${rayHex(cycleRay(i))}`,
                    }}
                  >
                    <p
                      className="text-sm italic leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.70))",
                      }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer
                      className="mt-2 text-xs font-medium"
                      style={{
                        color:
                          "var(--text-on-dark-muted, rgba(255,255,255,0.45))",
                      }}
                    >
                      — {t.attribution}
                    </footer>
                  </blockquote>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <RayDivider ray="R2" />

        {/* ─── SECTION 6 · PLANS + CHECKOUT ────────────────────── */}
        <FadeInSection>
          <section id="plans" className="space-y-8 scroll-mt-20">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R2') }}
              >
                Pick Your Path
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                One report or ongoing proof. Both keep your history.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Cancel the membership anytime. Your data stays. Your map is
                waiting when you come back.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Card A — Gravitational Stability Report */}
              <div
                className="glass-card flex flex-col p-6"
                style={{
                  border: "1.5px solid var(--brand-gold, #F8D011)",
                  boxShadow: "0 0 24px rgba(248,208,17,0.12)",
                }}
              >
                <span
                  className="mb-3 inline-block self-start rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    background: "var(--brand-gold, #F8D011)",
                    color: "#020202",
                  }}
                >
                  Most Popular
                </span>
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: rayHex('R9') }}
                >
                  Gravitational Stability Report
                </p>
                <p
                  className="mt-2 text-3xl font-bold"
                  style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                >
                  $43{" "}
                  <span
                    className="text-sm font-normal"
                    style={{ color: "var(--text-on-dark-muted)" }}
                  >
                    one-time
                  </span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {REPORT_FEATURES.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                    >
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card B — Portal Membership */}
              <div className="glass-card flex flex-col p-6">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: rayHex('R8') }}
                >
                  Portal Membership
                </p>
                <p
                  className="mt-2 text-3xl font-bold"
                  style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                >
                  $14.33{" "}
                  <span
                    className="text-sm font-normal"
                    style={{ color: "var(--text-on-dark-muted)" }}
                  >
                    /month
                  </span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {PORTAL_FEATURES.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                    >
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Checkout */}
            <UpgradeCheckoutClient />
          </section>
        </FadeInSection>

        <RayDivider ray="R9" />

        {/* ─── SECTION 7 · FEEDBACK + EXIT ─────────────────────── */}
        <section className="space-y-4">
          <div className="glass-card p-5">
            <FeedbackWidget
              feedback_type="upgrade_clarity"
              source_route="/upgrade"
              title="Offer clarity check"
            />
          </div>
          <div className="glass-card p-5">
            <FeedbackWidget
              feedback_type="checkout_friction"
              source_route="/upgrade"
              title="Checkout friction check"
            />
          </div>
        </section>

        {/* ─── PRICING WHISPER ─────────────────────────────────── */}
        <section className="text-center py-4">
          <Link
            href="/pricing"
            className="text-sm font-medium transition-opacity hover:opacity-100"
            style={{ color: "var(--brand-gold, #F8D011)", opacity: 0.7 }}
          >
            See all plans and pricing &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}

/* ── utility ───────────────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <circle cx="8" cy="8" r="7" stroke="#F8D011" strokeWidth="1.5" />
      <path
        d="M5 8l2 2 4-4"
        stroke="#F8D011"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
