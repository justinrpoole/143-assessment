import Link from "next/link";

import HeroProofStrip from "@/components/marketing/HeroProofStrip";
import HeroEclipseVisual from "@/components/marketing/HeroEclipseVisual";
import EclipseComparisonGraphic from "@/components/marketing/EclipseComparisonGraphic";
import SunRayDiagram from "@/components/marketing/SunRayDiagram";
import StickyCtaBar from "@/components/marketing/StickyCtaBar";
import MiniAssessmentPreview from "@/components/marketing/MiniAssessmentPreview";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/ui/FadeInSection";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "143 Leadership — See Where Your Light Is Covered",
  description:
    "You hold rooms steady. You carry decisions other people avoid. The 143 Assessment maps 9 trainable leadership capacities — showing what is strong and what is temporarily eclipsed. 143 questions. 15 minutes. One mirror.",
};

/* ── static data ───────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote:
      "I have taken MBTI, Enneagram, DISC, and StrengthsFinder. None of them explained why I was performing well but feeling empty. The eclipse concept did in one sentence what four assessments could not.",
    attribution: "VP of Operations, SaaS",
  },
  {
    quote:
      "I retook the assessment 90 days after starting the Portal Membership. Three of my Ray scores moved. Not because I tried harder. Because I trained differently. First time a tool actually showed me I was growing.",
    attribution: "Senior Director, Healthcare",
  },
  {
    quote:
      "My team noticed before I did. My presence score went from eclipsed to emerging. My direct reports said I was calmer in meetings. That was not an accident — it was reps.",
    attribution: "Engineering Lead, Fortune 500",
  },
];

/* ── page ───────────────────────────────────────────────────────── */
export default async function UpgradeYourOsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_upgrade_os",
    sourceRoute: "/upgrade-your-os",
    userState,
  });

  return (
    <main className="cosmic-page-bg">

      {/* ══════════════════════════════════════════════════════════
          SECTION 1: HERO — Identity Mirror
          Lead the witness. Tell them who they are before they
          decide for themselves. Pygmalion effect in action.
          ══════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-[960px] px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
        <div className="grid items-center gap-8 md:grid-cols-[1fr,280px]">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              The Stretched Leader
            </p>

            <h1
              className="mt-4 max-w-[640px] text-3xl font-bold leading-tight sm:text-4xl lg:text-[44px]"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              You hold rooms steady. You carry decisions other people avoid.
              And lately, the cost has gone quiet.
            </h1>

            <p
              className="mt-5 max-w-[560px] text-base leading-relaxed"
              style={{
                color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              You are not burnt out. You are{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--brand-gold), #E89D0C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                }}
              >
                eclipsed
              </span>
              . One capacity is carrying another, and your operating system has
              not been recalibrated in years. That is not a personal failure.
              That is biology. And it is measurable.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/preview" className="btn-primary">
                See Your Light Signature — Free
              </Link>
              <Link href="/143" className="btn-watch">
                Start the 143 Challenge
              </Link>
            </div>
          </div>

          {/* Eclipsed sun visual — upper right, decorative */}
          <HeroEclipseVisual className="hidden md:block" />
        </div>
      </section>

      {/* Proof strip */}
      <HeroProofStrip />

      {/* Sticky CTA bar — mobile */}
      <StickyCtaBar />

      {/* ── Gold Divider ── */}
      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════
          SECTION 2: ECLIPSE CONCEPT — Visual, Not Verbal
          Two sentences of explanation. Let the graphic do the work.
          ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <FadeInSection>
          <div className="text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              The Eclipse Concept
            </p>
            <h2
              className="mt-3 text-2xl font-bold leading-tight sm:text-3xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              Your light is not gone. It is covered.
            </h2>
            <p
              className="mx-auto mt-4 max-w-[600px] text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              Sustained load does not destroy capacity. It eclipses it.
              The assessment measures which of your 9 leadership capacities
              are running strong and which are temporarily covered — then
              gives you the specific reps to restore access. Not who you are.
              What you can build.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="mt-12">
            <EclipseComparisonGraphic className="mx-auto max-w-[520px]" />
          </div>
        </FadeInSection>
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════
          SECTION 3: DIFFERENTIATOR — Not Another Label
          Three glass cards. Traits vs state, retakes, $43 anchor.
          ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <FadeInSection>
          <div className="text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              What Makes This Different
            </p>
            <h2
              className="mt-3 text-2xl font-bold leading-tight sm:text-3xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              Other tools tell you what you are.
              <br className="hidden sm:block" />{" "}
              This one shows you what is covered — and what to do about it.
            </h2>
          </div>
        </FadeInSection>

        <StaggerContainer className="mt-10 grid gap-5 md:grid-cols-3" baseDelay={0.15}>
          {/* Card 1: Traits */}
          <StaggerItem>
            <div className="glass-card flex flex-col p-6">
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                They measure traits.
              </p>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Fixed categories. Same result in a crisis as on vacation.
                Useful for cocktail party conversation. Not for Tuesday at 3 PM.
              </p>
            </div>
          </StaggerItem>

          {/* Card 2: State */}
          <StaggerItem>
            <div className="glass-card flex flex-col p-6">
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                This measures state.
              </p>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Your results change with your load. Eclipsed today does not
                mean eclipsed forever. Retake in 90 days and watch the numbers
                move.
              </p>
            </div>
          </StaggerItem>

          {/* Card 3: Price anchor */}
          <StaggerItem>
            <div className="glass-card flex flex-col p-6">
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                $43 once.
              </p>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Not $2,000 per seat. Not a multi-day offsite. 143 questions,
                15 minutes, and a behavioural map that belongs to you
                permanently.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════
          SECTION 4: 9 RAYS — Tease, Don't Teach
          Names only. No descriptions. Sun-ray diagram.
          "36 combinations" creates identity curiosity.
          ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <FadeInSection>
          <div className="text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              9 Trainable Capacities
            </p>
            <h2
              className="mt-3 text-2xl font-bold leading-tight sm:text-3xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              The assessment maps 9 capacities.
              <br className="hidden sm:block" />{" "}
              Each one trainable. Each one measurable.
            </h2>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.15}>
          <SunRayDiagram className="mt-10" />
        </FadeInSection>

        <FadeInSection delay={0.3}>
          <p
            className="mx-auto mt-8 max-w-[480px] text-center text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Your Light Signature reveals which rays are strongest and which
            are temporarily eclipsed. There are 36 possible combinations.
          </p>
          <div className="mt-6 text-center">
            <Link href="/preview" className="btn-primary">
              See Your Top 2 Rays — Free
            </Link>
          </div>
        </FadeInSection>
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════
          SECTION 5: MINI ASSESSMENT PREVIEW — Try 3 Questions
          Existing component. Low friction. Interactive proof.
          ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <MiniAssessmentPreview />
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════
          SECTION 6: TRUST — Social Proof + About Justin
          Bio + testimonials combined. "Built by a leader who
          needed it first" earns trust through origin, not title.
          ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <FadeInSection>
          <div className="mx-auto max-w-[640px] text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              Built by a leader who needed it first
            </p>
            <h2
              className="mt-3 text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              Justin Ray
            </h2>
            <p
              className="mx-auto mt-4 max-w-[520px] text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              Educator. Coach. System builder. I spent years inside executive
              development watching leaders leave programmes inspired and return
              to the same patterns within a week. So I built a system that
              measures capacity, trains it through daily reps, and proves it is
              changing. I built it because I needed it first.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block text-sm font-medium transition-colors"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              Read the full story &rarr;
            </Link>
          </div>
        </FadeInSection>

        <StaggerContainer
          className="mt-12 space-y-4"
          baseDelay={0.2}
          staggerDelay={0.12}
        >
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.attribution}>
              <div
                className="glass-card p-5"
                style={{ borderLeft: "3px solid var(--brand-gold, #F8D011)" }}
              >
                <p
                  className="text-sm italic leading-relaxed"
                  style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p
                  className="mt-2 text-xs font-semibold"
                  style={{
                    color: "var(--brand-gold, #F8D011)",
                    opacity: 0.7,
                  }}
                >
                  — {t.attribution}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════
          SECTION 7: FINAL CTA — The Close
          Calm urgency. Invitation, not pressure.
          "The most honest mirror" positions the assessment as courage.
          ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
        <FadeInSection>
          <div
            className="glass-card p-8 sm:p-10"
            style={{
              border: "1px solid rgba(248,208,17,0.15)",
              boxShadow: "0 0 40px rgba(248,208,17,0.06)",
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              Your light is not gone. It is covered. This is how you restore
              access.
            </p>

            <h2
              className="mt-4 text-2xl font-bold leading-tight sm:text-3xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              3 minutes. 9 capacities. The most honest mirror your leadership
              has seen.
            </h2>

            <p
              className="mx-auto mt-4 max-w-[480px] text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              The Gravitational Stability Check is free. No account. No email required. See your
              top 2 Rays and your Eclipse Snapshot. Or start the 143 Challenge —
              3 days, 3 minutes a day, free.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/preview" className="btn-primary">
                Check My Stability — Free
              </Link>
              <Link href="/143" className="btn-watch">
                Start the 143 Challenge — Free
              </Link>
            </div>

            <Link
              href="/pricing"
              className="mt-5 inline-block text-xs font-medium transition-colors"
              style={{
                color: "var(--text-on-dark-muted, rgba(255,255,255,0.42))",
              }}
            >
              See all plans and pricing &rarr;
            </Link>
          </div>
        </FadeInSection>
      </section>
    </main>
  );
}

/* ── Shared Divider ──────────────────────────────────────────── */
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
