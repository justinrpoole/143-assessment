import Link from "next/link";

import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Methodology",
  description:
    "How the 143 Leadership Assessment is built, scored, and validated. 12 research pillars, transparent scoring model, and known limitations.",
};

const RESEARCH_PILLARS = [
  {
    researcher: "Lisa Feldman Barrett",
    field: "Constructed Emotion",
    mapping:
      "Emotions are predictions, not reactions. The assessment measures regulation capacity, not emotional types.",
  },
  {
    researcher: "Katy Milkman",
    field: "Behavioral Change",
    mapping:
      "Temptation bundling, fresh starts, commitment devices. The rep system uses these mechanisms.",
  },
  {
    researcher: "Caroline Leaf",
    field: "Neuroplasticity",
    mapping:
      "Thought patterns are trainable. Scores are designed to move through deliberate practice.",
  },
  {
    researcher: "Amishi Jha",
    field: "Attention Science",
    mapping:
      "Attention is depletable and trainable. The Presence Ray measures attentional capacity.",
  },
  {
    researcher: "BJ Fogg",
    field: "Tiny Habits",
    mapping:
      "Minimum effective dose. The Rise Path prescribes the smallest viable rep.",
  },
  {
    researcher: "Daniel Goleman",
    field: "Emotional Intelligence",
    mapping:
      "Self-awareness, self-regulation, social awareness, relationship management. Four pillars mapped across Rays.",
  },
  {
    researcher: "Christina Maslach",
    field: "Burnout Research",
    mapping:
      "Three-dimensional burnout model adapted for Eclipse system: emotional, cognitive, relational load.",
  },
  {
    researcher: "Carol Dweck",
    field: "Growth Mindset",
    mapping:
      "Fixed vs growth orientation. The assessment treats capacity as trainable.",
  },
  {
    researcher: "Angela Duckworth",
    field: "Grit & Perseverance",
    mapping:
      "Sustained effort toward long-term goals. Power and Purpose Rays measure consistency under pressure.",
  },
  {
    researcher: "Amy Edmondson",
    field: "Psychological Safety",
    mapping:
      "Team-level trust and candor. Connection and Be The Light measure capacity to hold safe space.",
  },
  {
    researcher: "Edward Deci",
    field: "Self-Determination",
    mapping:
      "Autonomy, competence, relatedness. Intrinsic motivation mapped through Purpose and Authenticity.",
  },
  {
    researcher: "Richard Ryan",
    field: "Self-Determination",
    mapping:
      "Basic psychological needs satisfaction drives sustained growth.",
  },
];

const NINE_RAYS = [
  { name: "Intention", description: "Deliberate direction-setting" },
  { name: "Joy", description: "Capacity for positive emotion independent of conditions" },
  { name: "Presence", description: "Attentional stability and nervous system regulation" },
  { name: "Power", description: "Consistent action despite fear" },
  { name: "Purpose", description: "Alignment between values and behavior" },
  { name: "Authenticity", description: "Congruence across contexts" },
  { name: "Connection", description: "Relational trust and empathy" },
  { name: "Possibility", description: "Openness to change and creative problem-solving" },
  { name: "Be The Light", description: "Capacity to hold space for others" },
];

const LIMITATIONS = [
  "This is not a clinical instrument. It does not assess or treat mental health conditions.",
  "Scores reflect self-reported behavior, not observed behavior.",
  "The assessment has not yet been normed on a large population sample.",
  "Eclipse scores measure temporary load, not permanent traits.",
  "Validation studies are in progress. Current evidence confidence is MODERATE for most constructs.",
  "We adapt peer-reviewed frameworks rather than directly replicating validated instruments.",
];

export default async function MethodologyPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_methodology",
    sourceRoute: "/methodology",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[720px] space-y-5 text-center">
        <p
          className="gold-tag mx-auto"
        >
          <span style={{ color: '#F8D011' }}>◆</span> Scientific Methodology
        </p>
        <h1
          className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
        >
          How We Built It. Why It Works. Where It&apos;s Going.
        </h1>
        <p
          className="mx-auto max-w-[540px] text-base leading-relaxed"
          style={{
            color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
          }}
        >
          The 143 Leadership Assessment is grounded in 12 <span className="gold-highlight">peer-reviewed research</span>
          pillars. This page explains every construct, how we measure it, known
          limitations, and what we plan to improve.
        </p>
      </section>

      <GoldDividerAnimated />

      {/* ── 12 Research Pillars ── */}
      <FadeInSection>
        <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
          <div className="mb-8">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              12 Research Pillars
            </p>
            <h2
              className="mt-3 text-2xl font-bold"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              The science supporting the system.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESEARCH_PILLARS.map((p) => (
              <div key={p.researcher} className="glass-card p-4">
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  {p.researcher}
                </p>
                <p
                  className="mt-1 text-xs italic"
                  style={{ color: "rgba(248,208,17,0.5)" }}
                >
                  {p.field}
                </p>
                <p
                  className="mt-2 text-xs leading-relaxed"
                  style={{
                    color:
                      "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                  }}
                >
                  {p.mapping}
                </p>
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── Scoring Model ── */}
      <FadeInSection>
        <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
          <div className="glass-card p-6 sm:p-8">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              How Scoring Works
            </p>
            <h2
              className="mt-3 text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              Transparent by design.
            </h2>
            <p
              className="mt-4 text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              Every score is <span className="gold-highlight">deterministic</span> — the same responses always produce the
              same output.
            </p>

            <div className="mt-6 space-y-3">
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  Shine (0–100)
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{
                    color:
                      "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                  }}
                >
                  Baseline capacity under normal conditions.
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  Access (0–100)
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{
                    color:
                      "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                  }}
                >
                  Capacity under pressure.
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  Eclipse (0–100)
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{
                    color:
                      "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                  }}
                >
                  Current system load / distortion.
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  Net Energy
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{
                    color:
                      "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                  }}
                >
                  (Shine &minus; Eclipse + 100) / 2
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  Confidence Band
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{
                    color:
                      "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                  }}
                >
                  LOW, MODERATE, or HIGH based on validity checks.
                </p>
              </div>
            </div>

            <p
              className="mt-6 text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              No AI or machine learning is involved in scoring. The pipeline is a
              fixed mathematical model.
            </p>
          </div>
        </section>
      </FadeInSection>

      <GoldHeroBanner
        kicker="Not Personality Types"
        title="Capacities built through reps."
        description="Every score is designed to move. That is the difference between a label and a training system."
      />

      <GoldDividerAnimated />

      {/* ── 9 Constructs ── */}
      <FadeInSection>
        <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
          <div className="mb-8">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              9 Constructs
            </p>
            <h2
              className="mt-3 text-2xl font-bold"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              Nine capacities. Not personality traits.
            </h2>
            <p
              className="mt-2 max-w-[540px] text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              Each Ray represents a trainable behavioral capacity, not a fixed
              label. Scores reflect current access levels and are
              <span className="gold-highlight">designed to move</span> with practice.
            </p>
          </div>
          <div className="space-y-3">
            {NINE_RAYS.map((ray, i) => (
              <div key={ray.name} className="glass-card flex items-baseline gap-4 p-4">
                <span
                  className="shrink-0 text-sm font-bold"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  {i + 1}.
                </span>
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--brand-gold, #F8D011)" }}
                  >
                    {ray.name}
                  </p>
                  <p
                    className="mt-1 text-xs leading-relaxed"
                    style={{
                      color:
                        "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                    }}
                  >
                    {ray.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── Known Limitations ── */}
      <FadeInSection>
        <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
          <div className="glass-card p-6 sm:p-8">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              Known Limitations
            </p>
            <h2
              className="mt-3 text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              What this assessment is not.
            </h2>
            <ul className="mt-5 space-y-3">
              {LIMITATIONS.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed"
                  style={{
                    color:
                      "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                  }}
                >
                  <span
                    className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--brand-gold, #F8D011)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </FadeInSection>

      {/* ── Bottom CTA ── */}
      <FadeInSection>
        <section className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
          <div className="glass-card p-8">
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              The science is real. The practice is simple.
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <NeonGlowButton href="/upgrade">
                Take the Assessment — $43
              </NeonGlowButton>
              <LiquidFillButton href="/glossary">
                Explore the Glossary
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
