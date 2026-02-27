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
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import BackToTopButton from "@/components/ui/BackToTopButton";
import ConicBorderCard from "@/components/ui/ConicBorderCard";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FAQ — 143 Leadership",
  description:
    "Your questions answered. How the 143 Assessment works, what your results mean, how pricing works, and the peer-reviewed science behind every capacity.",
};

const FAQS = [
  {
    category: "The Assessment",
    items: [
      {
        q: "What is the 143 Assessment?",
        a: "The 143 Assessment is a research-backed behavioural assessment that measures 9 trainable leadership capacities called Rays. It produces your Light Signature archetype (one of 36), your Eclipse Snapshot showing where stress is covering capacity, your Energy-to-Eclipse Ratio, and a personalised Rise Path with your next concrete step. It takes about 15 minutes to complete.",
      },
      {
        q: "How long does the assessment take?",
        a: "Most people complete the full 143-question assessment in 12 to 18 minutes. Your answers are automatically saved as you go, so you can close the browser and return later to pick up where you left off.",
      },
      {
        q: "What kind of questions are asked?",
        a: "The assessment uses three question types: frequency scales (how often you do something), scenario cards (what you would do in a specific situation), and reflections (open-ended self-observations). There are no right or wrong answers — the goal is an honest snapshot of how you are operating right now.",
      },
      {
        q: "Can I save and come back later?",
        a: "Yes. Answers are automatically saved every time you select a response. If you close the browser mid-assessment, you can return and pick up exactly where you left off. There is also a Save & Exit button if you prefer to be explicit about it.",
      },
      {
        q: "Is the assessment timed?",
        a: "No. Take as long as you need. The 15-minute estimate is an average, not a deadline.",
      },
      {
        q: "What happens after I submit?",
        a: "Your results are scored immediately using a deterministic scoring engine. You will see your full report — Light Signature, Eclipse Snapshot, 9-Ray scores, Energy-to-Eclipse Ratio, Gravitational Stability, and Rise Path — within seconds of submitting.",
      },
    ],
  },
  {
    category: "Results & Reports",
    items: [
      {
        q: "What is a Light Signature?",
        a: "Your Light Signature is a unique archetype based on your two Primary Rays — your top two Rays. There are 36 possible combinations (the mathematical C(9,2) pairs). Examples include the Visionary Servant, the Bold Authentic, and the Driven Leader. Your Light Signature describes the combination of capacities that define your current leadership force.",
      },
      {
        q: "What is the Eclipse Snapshot?",
        a: "The Eclipse Snapshot measures how much stress, depletion, or sustained pressure is covering your natural capacities. Think of it like a solar eclipse — your light is not gone, it is temporarily covered. The snapshot shows your eclipse level (Low, Moderate, Elevated, or High) and which specific dimensions are most affected.",
      },
      {
        q: "What is a Rise Path?",
        a: "Your Rise Path identifies the one Ray with the most potential for immediate growth and gives you a concrete next step. This is not your weakest point — it is the capacity where a small amount of training will create the biggest shift in how you lead.",
      },
      {
        q: "Can I download my results?",
        a: "Yes. A downloadable PDF report is available on paid tiers. Your online report is always accessible by signing in.",
      },
      {
        q: "Will my results change over time?",
        a: "Yes — that is by design. Unlike personality assessments that give you a fixed type, the 143 measures trainable capacities. With the Portal Membership subscription, you can retake a 43-question tracking version each week and watch your scores change over time.",
      },
    ],
  },
  {
    category: "Pricing & Plans",
    items: [
      {
        q: "What does the free Gravitational Stability Check include?",
        a: "The Gravitational Stability Check is a quick three-minute eclipse screening. It gives you a plain-language read on whether eclipse is currently affecting your capacities. No account or email required.",
      },
      {
        q: "What does the $43 Gravitational Stability Report include?",
        a: "The full 143-question assessment, your Light Signature archetype, Eclipse Snapshot, complete 9-Ray behavioural map, Energy-to-Eclipse Ratio, Gravitational Stability Score, Performance-Presence Delta analysis, Rise Path, and a downloadable PDF report. Permanent access to your results.",
      },
      {
        q: "What does the $14.33/month Portal Membership include?",
        a: "Everything in the assessment plus weekly retakes (43-question tracking set), the 10-week Light Activation Programme, daily micro-practices matched to your Rise Path, Energy Audit and Evening Reflection tools, and a growth tracking dashboard. Cancel anytime.",
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes. Cancel anytime. No penalties. No exit interviews. If your payment lapses, your assessment history stays. Your data does not disappear. When you come back, your map is waiting.",
      },
      {
        q: "Is there a free trial?",
        a: "The Gravitational Stability Check is free. The full assessment starts at $43 one-time. There is no trial period for the Portal Membership, but you can cancel at any time.",
      },
    ],
  },
  {
    category: "Science & Methodology",
    items: [
      {
        q: "Is the 143 Assessment scientifically validated?",
        a: "The framework draws on decades of published behavioural science, positive psychology, and neuroscience research. Key references include McEwen (2008) on allostatic load, Lieberman et al. (2007) on affect labelling, Gollwitzer (1999) on implementation intentions, and Kross et al. (2014) on self-distancing. Every capacity is mapped to peer-reviewed evidence.",
      },
      {
        q: "How is the assessment scored?",
        a: "The scoring engine is deterministic — the same answers always produce the same results. Scores are computed using weighted means with polarity correction, and every scored assessment produces a SHA-256 signature pair for audit verification. The engine is versioned and the scoring methodology is fully transparent.",
      },
      {
        q: "Is this a personality test?",
        a: "No. Personality tests give you a fixed type. The 143 measures trainable capacities — scores that are designed to change over time. Your results describe how you are operating right now, not who you are permanently.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    items: [
      {
        q: "Is my data private?",
        a: "Yes. Your responses are encrypted in transit and at rest. We never sell your data. Your behavioural map belongs to you. See our full privacy policy for details.",
      },
      {
        q: "Who can see my results?",
        a: "Only you. Your results are tied to your authenticated account and are not visible to anyone else unless you choose to share them. Enterprise administrators can see aggregate team patterns but not individual responses.",
      },
      {
        q: "Can I delete my data?",
        a: "Yes. You can request complete data deletion at any time. Contact us and we will remove all your assessment data, responses, and results from our systems.",
      },
    ],
  },
];

export default async function FaqPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_faq",
    sourceRoute: "/faq",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <FloatingOrbs variant="mixed" />
          <p className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Before you decide
          </p>
          <h1
            className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Every question you are thinking. Answered.
          </h1>
          <div className="mx-auto max-w-[480px]">
            <ScrollTextReveal text="How the assessment works, what your results actually show, what the science is, and why your scores are designed to change." />
          </div>
          <RaySpectrumStrip className="mt-6" />
        </section>

        {/* ─── SECTION 2 · QUICK JUMP ────────────────────────────── */}
        <section className="mx-auto max-w-[720px]">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {FAQS.map((section, i) => (
              <a
                key={section.category}
                href={`#faq-${section.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="rounded-full px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[rgba(248,208,17,0.15)] min-h-[44px] inline-flex items-center"
                style={{
                  color: rayHex(cycleRay(i)),
                  border: `1px solid ${rayHex(cycleRay(i))}33`,
                }}
              >
                {section.category}
              </a>
            ))}
          </div>
        </section>

        <RayDivider ray="R6" />

        {/* ─── SECTION 3 · FAQ CATEGORIES ────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-12">
          {FAQS.map((section, idx) => (
            <FadeInSection
              key={section.category}
            >
              {idx > 0 && <hr className="gold-rule mb-12" />}
              <div
                id={`faq-${section.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              >
                <h2
                  className="mb-4 text-lg font-bold"
                  style={{ color: rayHex(cycleRay(idx)) }}
                >
                  {section.category}
                </h2>
                <StaggerContainer className="space-y-3">
                  {section.items.map((faq) => (
                    <StaggerItem key={faq.q}>
                      <details className="glass-card glass-card--magnetic glass-card--lift group p-5">
                        <summary
                          className="flex cursor-pointer items-center justify-between text-sm font-semibold"
                          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                        >
                          {faq.q}
                          <svg
                            className="ml-3 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                            viewBox="0 0 16 16"
                            fill="none"
                            style={{ color: "var(--brand-gold, #F8D011)" }}
                            aria-hidden="true"
                          >
                            <path
                              d="M4 6l4 4 4-4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </summary>
                        <p
                          className="mt-3 text-sm leading-relaxed"
                          style={{
                            color:
                              "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                          }}
                        >
                          {faq.a}
                        </p>
                      </details>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </FadeInSection>
          ))}
        </section>

        <RayDivider ray="R8" />

        <GoldHeroBanner
          kicker="Still Curious?"
          title="The best way to understand it is to feel it."
          description="Start with the free Stability Check. Three minutes. No account required."
          cta={{ label: "Check My Stability — Free", href: "/preview" }}
        />

        <RayDivider ray="R9" />

        {/* ─── SECTION 4 · CTA ────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <ConicBorderCard>
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                The best way to understand it is to <span className="gold-highlight">feel it</span>.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Start with the free Stability Check and <span className="gold-highlight">see your pattern right now</span>.
                Or take the full assessment and get your complete map today.
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
