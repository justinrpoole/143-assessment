import Link from "next/link";

import CosmicImage from "@/components/marketing/CosmicImage";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import SunRayDiagram from "@/components/marketing/SunRayDiagram";
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
    rays: "Ray of Intention, Ray of Joy, Ray of Presence",
    body: "Emotional intelligence with yourself. Before you lead others, you need access to yourself \u2014 and that access starts with self-directed compassion. Intention sets direction so your calendar becomes a decision, not a reaction. Joy creates fuel independent of conditions so you stop running on borrowed energy. Presence settles your nervous system so the gap between stimulus and response is yours.",
  },
  {
    phase: "Phase 2",
    title: "Expand",
    rays: "Ray of Power, Ray of Purpose, Ray of Authenticity",
    body: "Where self-regulation meets self-expression. You stop waiting for permission and start moving. Power is consistent action despite fear \u2014 moving before you feel ready and trusting yourself after. Purpose is alignment between your calendar and your values. Authenticity is being the same person in every room without code-switching your soul.",
  },
  {
    phase: "Phase 3",
    title: "Become",
    rays: "Ray of Connection, Ray of Possibility, Be The Light",
    body: "Emotional intelligence with others. Your capacity extends beyond yourself. Connection builds trust so people feel safe enough to be honest. Possibility opens doors where others see walls. Be The Light holds the room steady \u2014 your presence lowers the noise. When these rays are online, you do not just lead. You multiply.",
  },
];

const SCIENCE_BACKING = [
  {
    label: "Allostatic Load",
    source: "McEwen, B. S. (2008). PNAS, 105(33), 11867\u201311872.",
    use: "When stress stays elevated, your body borrows energy from future capacity. The Eclipse Snapshot makes the cost visible before you go bankrupt. That is biology, not weakness.",
  },
  {
    label: "Attention Training",
    source: "Jha, A. P. et al. (2015, 2017). Journal of Cognitive Enhancement.",
    use: "Attention is not a personality trait. It is a muscle. Jha\u2019s research shows brief daily practice measurably improves focus in high-stress populations. The Presence and Possibility Rays train it.",
  },
  {
    label: "Affect Labelling",
    source: "Lieberman, M. D. et al. (2007). Psychological Science, 18(5), 421\u2013428.",
    use: "Naming an emotion reduces amygdala reactivity significantly. The assessment gives you the language. Naming is not therapy. It is the first intervention.",
  },
  {
    label: "Self-Distancing",
    source: "Kross, E. et al. (2014). JPSP, 106(2), 304\u2013324.",
    use: "Perspective is a skill, not a gift. Speaking about yourself in the third person reduces emotional reactivity. The coaching OS trains this through specific language practices.",
  },
  {
    label: "Implementation Intentions",
    source: "Gollwitzer, P. M. (1999). American Psychologist, 54(7), 493\u2013503.",
    use: "If-then plans increase goal achievement by 2\u20133\u00d7 across meta-analyses. The Rise Path gives you pre-decided moves. The negotiation with yourself is already over.",
  },
  {
    label: "Growth Mindset",
    source: "Dweck, C. S. (2006). Mindset. Random House.",
    use: "When you believe the score can move, you train differently. The 143 Assessment is designed to be outgrown. The belief that change is possible changes the behaviour itself.",
  },
  {
    label: "Constructed Emotion",
    source: "Barrett, L. F. (2017). How Emotions Are Made. Houghton Mifflin Harcourt.",
    use: "Emotions are constructed predictions, not fixed reactions. The assessment measures your regulation capacity \u2014 not your emotional type. That distinction is what makes scores trainable.",
  },
  {
    label: "Burnout \u0026 Eclipse",
    source: "Maslach, C. \u0026 Leiter, M. P. (2016). Burnout. Academic Press.",
    use: "Three dimensions: emotional exhaustion, depersonalisation, reduced efficacy. The Eclipse system measures all three as temporary capacity reducers \u2014 not character deficits.",
  },
  {
    label: "Behavior Design",
    source: "Fogg, B. J. (2020). Tiny Habits. Houghton Mifflin Harcourt.",
    use: "Behavior = Motivation \u00d7 Ability \u00d7 Prompt. The Rise Path prescribes the smallest viable rep so you never need willpower to start. Make it tiny, make it daily.",
  },
  {
    label: "Self-Determination",
    source: "Deci, E. L. \u0026 Ryan, R. M. (2000). American Psychologist, 55(1), 68\u201378.",
    use: "Autonomy, competence, and relatedness are basic psychological needs. Purpose, Authenticity, and Connection Rays map to these three drivers of sustained motivation.",
  },
  {
    label: "Psychological Safety",
    source: "Edmondson, A. C. (1999). Admin. Science Quarterly, 44(2), 350\u2013383.",
    use: "People develop faster when they feel safe to be honest. Connection and Be The Light measure your capacity to create that safety for yourself and others.",
  },
  {
    label: "Grit \u0026 Perseverance",
    source: "Duckworth, A. L. et al. (2007). JPSP, 92(6), 1087\u20131101.",
    use: "Passion and perseverance for long-term goals. Power and Purpose rays measure whether you can sustain effort through difficulty \u2014 not just start strong.",
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
            Nine dimensions. Three phases. One operating system upgrade.
          </h1>
          <p
            className="mx-auto max-w-[540px] text-base leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            The Be The Light Framework maps 9 trainable leadership capacities
            across 3 developmental phases. Each one backed by peer-reviewed
            science. Each one designed to move — because you are not a fixed
            type, and your assessment should prove it.
          </p>
        </section>

        <GoldDivider />

        {/* ─── SECTION 2 · THE PROBLEM ────────────────────────── */}
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
                Have you ever attended a leadership programme, felt genuinely
                changed, and watched the results fade by the following quarter?
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                That is not a reflection of your commitment. That is a $240
                billion design gap. Most programmes teach tactics without upgrading
                the internal operating system that runs them. The Be The Light
                Framework starts with the operating system. It names the 9
                capacities that underlie every leadership behaviour, detects when
                those capacities are eclipsed, and gives you the reps to restore
                access — with measurement to prove it is working.
              </p>
            </div>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 3 · THREE PHASES ───────────────────────── */}
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
                Emotional intelligence made trainable.
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
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                      >
                        {phase.title}
                      </h3>
                      <p
                        className="mt-1 text-xs font-semibold uppercase tracking-widest"
                        style={{
                          color: "var(--brand-gold, #F8D011)",
                          opacity: 0.8,
                        }}
                      >
                        {phase.rays}
                      </p>
                      <p
                        className="mt-2 text-sm leading-relaxed"
                        style={{
                          color:
                            "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                        }}
                      >
                        {phase.body}
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

        <GoldDivider />

        {/* ─── SECTION 4 · ECLIPSE ────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-5 text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              Eclipse does not mean failure. It means covered.
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
              compromises decision quality. Dr. Bruce McEwen&apos;s research
              shows exactly what happens — and Dr. Matthew Lieberman&apos;s work
              shows that simply naming what you feel reduces threat reactivity.
              The Eclipse Snapshot names the pattern. Not as failure. As a
              temporary state with a clear path out.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
              }}
            >
              Your strongest ray may be compensating for your most eclipsed one —
              and that compensation pattern is invisible until someone names it.
              The assessment names it. The first step out is not trying harder. It
              is creating stability to train.
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

        <GoldDivider />

        {/* ─── SECTION 5 · SCIENCE ────────────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                The Science
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
                Each mechanism is translated into plain daily practice you can use
                Monday.
              </p>
            </div>

            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SCIENCE_BACKING.map((s) => (
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
                      {s.use}
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

        <GoldDivider />

        {/* ─── SECTION 6 · CTA ────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                The framework works. The question is where you start.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Nine dimensions. Three phases. 36 Light Signatures. The
                assessment reveals yours — along with the map of what to build
                first.
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
