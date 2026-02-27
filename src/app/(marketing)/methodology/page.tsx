import Link from "next/link";

import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import SectionTOC from "@/components/ui/SectionTOC";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import BackToTopButton from "@/components/ui/BackToTopButton";
import GoldTooltip from "@/components/ui/GoldTooltip";
import ConicBorderCard from "@/components/ui/ConicBorderCard";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/ui/FadeInSection";
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
    citation:
      "How Emotions Are Made (2017). Theory of Constructed Emotion — emotions are not hardwired but constructed by the brain in context.",
  },
  {
    researcher: "Katy Milkman",
    field: "Behavioral Change",
    mapping:
      "Temptation bundling, fresh starts, commitment devices. The rep system uses these mechanisms.",
    citation:
      "How to Change (2021). Fresh start effect increases goal-directed behavior by 20-30% at temporal landmarks.",
  },
  {
    researcher: "Caroline Leaf",
    field: "Neuroplasticity",
    mapping:
      "Thought patterns are trainable. Scores are designed to move through deliberate practice.",
    citation:
      "Cleaning Up Your Mental Mess (2021). The Neurocycle — a 5-step process for directed neuroplasticity validated in clinical trials.",
  },
  {
    researcher: "Amishi Jha",
    field: "Attention Science",
    mapping:
      "Attention is depletable and trainable. The Presence Ray measures attentional capacity.",
    citation:
      "Peak Mind (2021). 12 minutes/day of mindfulness practice significantly improved attentional performance in military cohorts under high stress.",
  },
  {
    researcher: "BJ Fogg",
    field: "Tiny Habits",
    mapping:
      "Minimum effective dose. The Rise Path prescribes the smallest viable rep.",
    citation:
      "Tiny Habits (2019). Behavior = Motivation × Ability × Prompt. Scaling down to the smallest viable behavior removes the willpower bottleneck.",
  },
  {
    researcher: "Daniel Goleman",
    field: "Emotional Intelligence",
    mapping:
      "Self-awareness, self-regulation, social awareness, relationship management. Four pillars mapped across Rays.",
    citation:
      "Emotional Intelligence (1995); Primal Leadership (2002). EI accounts for up to 90% of the difference between star performers and average leaders at senior levels.",
  },
  {
    researcher: "Christina Maslach",
    field: "Burnout Research",
    mapping:
      "Three-dimensional burnout model adapted for Eclipse system: emotional, cognitive, relational load.",
    citation:
      "Maslach Burnout Inventory (1981, updated 2016). Three-factor model: emotional exhaustion, depersonalization, reduced personal accomplishment — mapped to Eclipse dimensions.",
  },
  {
    researcher: "Carol Dweck",
    field: "Growth Mindset",
    mapping:
      "Fixed vs growth orientation. The assessment treats capacity as trainable.",
    citation:
      "Mindset (2006). Growth-oriented individuals show higher resilience and sustained effort; meta-analysis (Sisk et al., 2018) confirms d=0.10 on achievement outcomes.",
  },
  {
    researcher: "Angela Duckworth",
    field: "Grit & Perseverance",
    mapping:
      "Sustained effort toward long-term goals. Power and Purpose Rays measure consistency under pressure.",
    citation:
      "Grit (2016). Grit Scale predicts retention in West Point cadets, National Spelling Bee finalists, and novice teachers beyond IQ and conscientiousness.",
  },
  {
    researcher: "Amy Edmondson",
    field: "Psychological Safety",
    mapping:
      "Team-level trust and candor. Connection and Be The Light measure capacity to hold safe space.",
    citation:
      "The Fearless Organization (2018). Google's Project Aristotle confirmed psychological safety as the #1 predictor of high-performing teams.",
  },
  {
    researcher: "Edward Deci & Richard Ryan",
    field: "Self-Determination Theory",
    mapping:
      "Autonomy, competence, relatedness. Intrinsic motivation mapped through Purpose and Authenticity.",
    citation:
      "Self-Determination Theory (1985, updated 2017). Intrinsic motivation — driven by autonomy, competence, and relatedness — produces more sustained behavior change than external rewards.",
  },
  {
    researcher: "Kristin Neff",
    field: "Self-Compassion",
    mapping:
      "Fierce self-compassion drives sustained motivation without the cost of self-criticism. The foundation of the 143 Eclipse framework.",
    citation:
      "Self-Compassion (2011); Fierce Self-Compassion (2021). Self-compassion lowers cortisol, reduces rumination, and sustains motivation — the design philosophy behind 143.",
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
      <SectionTOC items={[
        { id: "hero", label: "Hero" },
        { id: "research-pillars", label: "Research Pillars" },
        { id: "scoring", label: "How Scoring Works" },
        { id: "constructs", label: "9 Constructs" },
        { id: "limitations", label: "Known Limitations" },
        { id: "cta", label: "Get Started" },
      ]} />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">
      {/* ── Hero ── */}
      <section id="hero" className="mx-auto max-w-[720px] space-y-5 text-center">
        <p
          className="gold-tag mx-auto"
        >
          <span style={{ color: '#F8D011' }}>◆</span> Scientific Methodology · 10 min read
        </p>
        <h1
          className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
        >
          How We Built It. Why It Works. Where It&apos;s Going.
        </h1>
        <div className="mx-auto max-w-[540px]">
          <ScrollTextReveal text="The 143 Leadership Assessment is grounded in 12 peer-reviewed research pillars. This page explains every construct, how we measure it, known limitations, and what we plan to improve." />
        </div>
      </section>

      <GoldDividerAnimated />

      {/* ── 12 Research Pillars ── */}
      <FadeInSection>
        <section id="research-pillars" className="relative mx-auto max-w-[960px] px-5 py-16 sm:px-8 section-blend-top">
          <div className="mb-8">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              12 Research Pillars
            </p>
            <h2
              className="mt-3 text-2xl font-bold gold-underline"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              The science supporting the system.
            </h2>
          </div>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESEARCH_PILLARS.map((p) => (
              <StaggerItem key={p.researcher}>
              <div className="glass-card glass-card--magnetic glass-card--lift p-4">
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
                <p
                  className="mt-2 text-[10px] leading-relaxed italic"
                  style={{
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {p.citation}
                </p>
              </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </FadeInSection>

      <hr className="gold-rule" />

      <GoldDividerAnimated />

      {/* ── Scoring Model ── */}
      <FadeInSection>
        <section id="scoring" className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
          <div className="glass-card glass-card--executive p-6 sm:p-8">
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
                  <GoldTooltip tip="Your active leadership capacity — what shows up when you're at your best.">Shine</GoldTooltip> (0–100)
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
                  <GoldTooltip tip="When stress covers your strongest capacities and your leadership light dims.">Eclipse</GoldTooltip> (0–100)
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
              fixed mathematical model. Same responses always produce the same
              output. SHA-256 verified. Fully auditable.
            </p>

            <div
              className="mt-6 p-4 rounded-lg"
              style={{ background: "rgba(248,208,17,0.04)", border: "1px solid rgba(248,208,17,0.15)" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Scoring Transparency
              </p>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))" }}
              >
                In an era of AI hype and algorithmic opacity, radical
                transparency is not optional — it is required. We publish
                our confidence bands. We state our known limitations. We
                tell you exactly what the score means and what it does not.
                If you cannot audit the assessment, why would you trust it
                with your development?
              </p>
            </div>
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
        <section id="constructs" className="relative mx-auto max-w-[960px] px-5 py-16 sm:px-8">
          <FloatingOrbs />
          <div className="mb-8">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              9 Constructs
            </p>
            <h2
              className="mt-3 text-2xl font-bold text-gold-gradient"
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
              <span className="gold-highlight">designed to move</span> with deliberate <GoldTooltip tip="Repetition-based practice drill that builds leadership capacity through daily micro-actions.">reps</GoldTooltip>.
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

      {/* ── Reps, Not Resolutions (#10) ── */}
      <FadeInSection>
        <section className="relative mx-auto max-w-[720px] px-5 py-16 sm:px-8">
          <div className="glass-card p-6 sm:p-8 space-y-4">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              Reps, Not Resolutions
            </p>
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              The behavioral engine behind the system.
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
            >
              Implementation intentions have a <span className="gold-highlight">d=0.781 effect size</span> across
              10,466 participants (Gollwitzer, 2025 meta-analysis). Habit formation
              takes a median of 59 to 66 days — not 21 (Lally et al., European
              Journal of Social Psychology). The 143 rep system is built on these
              mechanisms: if/then plans attached to specific moments in your day.
              Not advice. Behavioral triggers.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))" }}
            >
              A rep is not willpower. It is neurological rewiring. When you recognize
              a leadership moment, name the capacity you used, and log it — you are
              building a neural pathway. Do it daily and the pathway becomes automatic.
            </p>
          </div>
        </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── Built for Real Brains (#3) ── */}
      <FadeInSection>
        <section className="relative mx-auto max-w-[720px] px-5 py-16 sm:px-8">
          <div className="glass-card p-6 sm:p-8 space-y-4">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              Built for Real Brains
            </p>
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              Designed for the hardest attention case first.
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
            >
              This system was built by someone with ADHD who needed it to work.
              Traditional assessments are 60 to 240 items, no breaks, abstract language,
              one sitting. The 143 system needs: <span className="gold-highlight">short practices, clear structure,
              immediate feedback, visible progress, no willpower required to start</span>.
              That is not accommodation — that is better design for every brain.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))" }}
            >
              This aligns with Universal Design for Learning (UDL) principles
              and the ALIGN framework for neurodivergent-inclusive assessment.
              When you build for the brain that needs the most structure,
              the result works better for all brains.
            </p>
          </div>
        </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── Designed to Be Outgrown (#8) ── */}
      <FadeInSection>
        <section className="relative mx-auto max-w-[720px] px-5 py-16 sm:px-8">
          <div className="glass-card glass-card--executive p-6 sm:p-8 space-y-4">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              Designed to Be Outgrown
            </p>
            <h2
              className="text-xl font-bold sm:text-2xl text-gold-gradient"
            >
              Your scores should change. That is the point.
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
            >
              Most assessments want you to accept a label forever. We built one
              that expects you to outgrow it. When your Intention score moves
              from 45 to 72, you did not discover something about yourself.
              You <span className="gold-highlight">built something in yourself</span>.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))" }}
            >
              We could have built a test that gives you a permanent type. It would
              be simpler to market. But it would be a lie. Capacities are trainable.
              We built for that truth. The retake is not a repeat — it is a measurement
              of what changed. That is why the assessment exists.
            </p>
          </div>
        </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── Open Methodology Commitment (#29) ── */}
      <FadeInSection>
        <section className="relative mx-auto max-w-[720px] px-5 py-16 sm:px-8">
          <div className="glass-card p-6 sm:p-8 space-y-4">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              Our Commitment
            </p>
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              We hold ourselves to the standard we wish existed in this
              industry.
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
            >
              Most leadership assessments hide behind proprietary black
              boxes. We are building toward full methodological
              transparency — not because it is easy, but because it is the
              only way to earn trust from leaders who have been burned by
              tools that overpromise and underdeliver.
            </p>
            <div className="space-y-2 mt-2">
              {[
                "Population-specific reliability data as pilot cohorts complete",
                "Predictive validity studies published openly",
                "Known limitations clearly stated — not buried in footnotes",
                "Confidence band methodology explained in plain language",
                "Scoring logic auditable — no black boxes, no AI interpretation",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                  style={{ color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))" }}
                >
                  <span
                    className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--brand-gold)" }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── Known Limitations ── */}
      <FadeInSection>
        <section id="limitations" className="relative mx-auto max-w-[720px] px-5 py-16 sm:px-8 watermark-143 section-blend-bottom">
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
        <section id="cta" className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
          <ConicBorderCard>
          <div className="glass-card p-8">
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              The science is real. The practice is simple.
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <NeonGlowButton href="/upgrade">
                Show Me My Map — $43
              </NeonGlowButton>
              <LiquidFillButton href="/glossary">
                Explore the Glossary
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
