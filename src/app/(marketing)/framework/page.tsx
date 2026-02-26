import Link from "next/link";

import CosmicImage from "@/components/marketing/CosmicImage";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import RaySpectrumBar from "@/components/marketing/RaySpectrumBar";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Be The Light Framework — 9 Rays, 3 Phases, 1 OS Upgrade",
  description:
    "Nine trainable leadership capacities. Three developmental phases. Grounded in 12 peer-reviewed research pillars from Barrett, Maslach, Dweck, Edmondson, Deci, Ryan, and more. Not a personality label. A behavioural map that changes as you do.",
};

/* ── static data ───────────────────────────────────────────── */

const THREE_PHASES = [
  {
    phase: "Phase 1",
    title: "Reconnect",
    subtitle: "Emotional intelligence with yourself",
    rays: "Intention · Joy · Presence",
    body: "Before you lead others, you need access to yourself. These three rays train the internal operating system — where your attention goes, what fuels you when conditions don't, and the gap between stimulus and response that belongs to you.",
    hook: "Most people skip this phase. The data shows why that costs them.",
  },
  {
    phase: "Phase 2",
    title: "Expand",
    subtitle: "Where self-regulation meets self-expression",
    rays: "Power · Purpose · Authenticity",
    body: "You stop waiting for permission and start moving. These rays measure whether you act before the feeling arrives, whether your calendar matches your values, and whether you are the same person in every room.",
    hook: "The pattern you can't see is the one running you.",
  },
  {
    phase: "Phase 3",
    title: "Become",
    subtitle: "Emotional intelligence with others",
    rays: "Connection · Possibility · Be The Light",
    body: "Your capacity extends beyond yourself. These rays measure whether people feel safe enough to be honest around you, whether you see doors where others see walls, and whether your presence lowers the noise or adds to it.",
    hook: "When these are online, you don't just lead. You multiply.",
  },
];

const SCIENCE_PILLARS = [
  {
    label: "Allostatic Load",
    researcher: "McEwen",
    source: "McEwen, B. S. (2008). PNAS, 105(33), 11867–11872.",
    insight: "Your body borrows energy from future capacity when stress stays elevated. The Eclipse Snapshot makes the cost visible — before you go bankrupt.",
  },
  {
    label: "Attention Training",
    researcher: "Jha",
    source: "Jha, A. P. et al. (2015, 2017). Journal of Cognitive Enhancement.",
    insight: "Attention is a muscle, not a trait. Brief daily practice measurably improves focus in high-stress populations.",
  },
  {
    label: "Affect Labelling",
    researcher: "Lieberman",
    source: "Lieberman, M. D. et al. (2007). Psychological Science, 18(5), 421–428.",
    insight: "Naming an emotion reduces amygdala reactivity. The assessment gives you the language. Naming is the first intervention.",
  },
  {
    label: "Self-Distancing",
    researcher: "Kross",
    source: "Kross, E. et al. (2014). JPSP, 106(2), 304–324.",
    insight: "Perspective is a skill. Speaking about yourself in the third person reduces emotional reactivity measurably.",
  },
  {
    label: "Implementation Intentions",
    researcher: "Gollwitzer",
    source: "Gollwitzer, P. M. (1999). American Psychologist, 54(7), 493–503.",
    insight: "If-then plans increase goal achievement 2–3× across meta-analyses. The negotiation with yourself is already over.",
  },
  {
    label: "Growth Mindset",
    researcher: "Dweck",
    source: "Dweck, C. S. (2006). Mindset. Random House.",
    insight: "When you believe the score can move, you train differently. The assessment is designed to be outgrown.",
  },
  {
    label: "Constructed Emotion",
    researcher: "Barrett",
    source: "Barrett, L. F. (2017). How Emotions Are Made. Houghton Mifflin Harcourt.",
    insight: "Emotions are constructed predictions, not fixed reactions. That distinction is what makes every score trainable.",
  },
  {
    label: "Burnout & Eclipse",
    researcher: "Maslach",
    source: "Maslach, C. & Leiter, M. P. (2016). Burnout. Academic Press.",
    insight: "Emotional exhaustion, depersonalisation, reduced efficacy — measured as temporary capacity reducers, not character deficits.",
  },
  {
    label: "Behavior Design",
    researcher: "Fogg",
    source: "Fogg, B. J. (2020). Tiny Habits. Houghton Mifflin Harcourt.",
    insight: "Behavior = Motivation × Ability × Prompt. The smallest viable rep means you never need willpower to start.",
  },
  {
    label: "Self-Determination",
    researcher: "Deci & Ryan",
    source: "Deci, E. L. & Ryan, R. M. (2000). American Psychologist, 55(1), 68–78.",
    insight: "Autonomy, competence, relatedness — three basic needs mapped directly to Purpose, Authenticity, and Connection.",
  },
  {
    label: "Psychological Safety",
    researcher: "Edmondson",
    source: "Edmondson, A. C. (1999). Admin. Science Quarterly, 44(2), 350–383.",
    insight: "People develop faster when they feel safe to be honest. Connection and Be The Light measure your capacity to create that.",
  },
  {
    label: "Grit & Perseverance",
    researcher: "Duckworth",
    source: "Duckworth, A. L. et al. (2007). JPSP, 92(6), 1087–1101.",
    insight: "Sustained effort through difficulty — not just starting strong. Power and Purpose measure whether you can hold the line.",
  },
];

/* ── page ───────────────────────────────────────────────────── */

export default async function FrameworkPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_how_it_works",
    sourceRoute: "/framework",
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
            Not a theory. A training system.
          </p>
          <h1
            className="text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Nine capacities. Each one trainable. Each one measurable. Each one
            yours.
          </h1>
          <p
            className="mx-auto max-w-[540px] text-base leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            The Be The Light Framework maps where your light is shining and
            where it is covered — across 9 dimensions that change as you do.
            Not a personality label. A behavioural map with a training plan
            built in.
          </p>
        </section>

        <GoldDividerAnimated />

        {/* ─── SECTION 2 · THE SPECTRUM ──────────────────────── */}
        <FadeInSection>
          <section className="space-y-6">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Your Light Signature
              </p>
              <h2
                className="text-2xl font-bold sm:text-3xl"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Every ray lives on a spectrum. Where does yours land?
              </h2>
              <p
                className="mx-auto max-w-[560px] text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Each capacity moves between eclipsed and shining — not as a
                grade, but as a position you can train. The assessment places
                your marker. The system shows you how to move it.
              </p>
            </div>

            <div className="glass-card p-5 sm:p-6">
              <RaySpectrumBar />
            </div>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 3 · THE PROBLEM ────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                The $240 billion question
              </p>
              <h2
                className="text-xl font-bold sm:text-2xl"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                You felt changed. By the next quarter, the results had faded.
                That was not your fault.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Most leadership programmes teach tactics without upgrading the
                internal operating system that runs them. The Be The Light
                Framework starts with the operating system — it names the 9
                capacities that underlie every leadership behaviour, detects
                when those capacities are eclipsed, and gives you reps to
                restore access. With measurement to prove it is working.
              </p>
            </div>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 4 · THREE PHASES ───────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Three Phases. One Path.
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Reconnect. Expand. Become.
              </h2>
            </div>

            <StaggerContainer className="space-y-4">
              {THREE_PHASES.map((phase, i) => (
                <StaggerItem key={phase.phase}>
                  <div className="glass-card flex gap-5 p-5 sm:gap-6 sm:p-6">
                    <div className="shrink-0 text-center">
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{
                          color: "var(--brand-gold, #F8D011)",
                          opacity: 0.7,
                        }}
                      >
                        {phase.phase}
                      </p>
                      <p
                        className="mt-1 text-3xl font-bold"
                        style={{ color: "var(--brand-gold, #F8D011)" }}
                      >
                        {i + 1}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3
                        className="text-lg font-bold"
                        style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                      >
                        {phase.title}
                      </h3>
                      <p
                        className="text-[11px] font-medium"
                        style={{
                          color: "var(--text-on-dark-secondary, rgba(255,255,255,0.7))",
                        }}
                      >
                        {phase.subtitle}
                      </p>
                      <p
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{
                          color: "var(--brand-gold, #F8D011)",
                          opacity: 0.8,
                        }}
                      >
                        {phase.rays}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color:
                            "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                        }}
                      >
                        {phase.body}
                      </p>
                      <p
                        className="text-xs font-medium italic"
                        style={{
                          color: "var(--brand-gold, #F8D011)",
                          opacity: 0.7,
                        }}
                      >
                        {phase.hook}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <CosmicImage
              src="/images/cosmic/framework-mandala.png"
              alt="The Be The Light Framework — 9 Rays arranged across 3 developmental phases"
              width={520}
              height={520}
              maxWidth="520px"
              variant="section"
            />
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 5 · ECLIPSE ────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-5 text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              Not failure. Covered.
            </p>
            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              Your light is not gone. It is covered.
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              Sustained stress narrows attention, shrinks emotional range, and
              compromises decision quality. Dr. Bruce McEwen&apos;s allostatic
              load research shows exactly what happens to the body — and Dr.
              Matthew Lieberman&apos;s affect labelling research shows that
              simply naming what you feel reduces threat reactivity. The
              Eclipse Snapshot names the pattern. Not as failure. As a
              temporary state with a clear path out.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
              }}
            >
              Your strongest ray may be compensating for your most eclipsed
              one — and that compensation pattern is invisible until someone
              names it. The assessment names it.
            </p>
            <CosmicImage
              src="/images/cosmic/eclipse-meter.png"
              alt="Eclipse meter — measuring how much of your light is currently covered"
              width={360}
              height={360}
              maxWidth="360px"
              variant="section"
              className="mt-4"
            />
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 6 · SCIENCE ────────────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                12 Research Pillars
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Every capacity maps to published research.
              </h2>
              <p
                className="max-w-[540px] text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                143 = I love you. The science is real. The language is human.
                Each mechanism is translated into a daily practice you can use
                Monday.
              </p>
            </div>

            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SCIENCE_PILLARS.map((s) => (
                <StaggerItem key={s.label}>
                  <div className="glass-card p-4 h-full">
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--brand-gold, #F8D011)" }}
                    >
                      {s.label}
                    </p>
                    <p
                      className="mt-1 text-xs italic"
                      style={{ color: "rgba(248,208,17,0.5)" }}
                    >
                      {s.source}
                    </p>
                    <p
                      className="mt-2 text-xs leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                      }}
                    >
                      {s.insight}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Validation status note */}
            <div
              className="mt-6 rounded-lg p-4 border"
              style={{
                background: "rgba(96, 5, 141, 0.08)",
                borderColor: "rgba(148, 80, 200, 0.15)",
              }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--brand-gold, #F8D011)", opacity: 0.7 }}
              >
                Validation Status
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                }}
              >
                The 143 Assessment is grounded in established, peer-reviewed
                research and designed with measurement integrity: deterministic
                scoring, confidence bands, and 9 built-in validity checks.
                Population-specific reliability and predictive validity data
                will be published as pilot cohorts complete. We show you the
                science we stand on and the evidence we are still building.
              </p>
            </div>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 7 · CTA ────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                You saw the spectrum. The question is where your marker lands.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Nine dimensions. Three phases. A Light Signature that is
                uniquely yours — along with the map of what to build first.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/assessment" className="btn-primary">
                  Map My Light Signature
                </Link>
                <Link href="/preview" className="btn-watch">
                  Check My Stability
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>
    </main>
  );
}
