import Link from "next/link";

import CosmicImage from "@/components/marketing/CosmicImage";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "How It Works — 143 Leadership",
  description:
    "From free RAS reset to full assessment to daily practice. Four stages. One operating system upgrade. Every step builds on the last. Nothing is skipped. Nothing is guessed. You will have receipts.",
};

/* ── static data ───────────────────────────────────────────── */

const FUNNEL_STEPS = [
  {
    step: "Stage 1",
    title: "Reset Your Filter",
    detail:
      "The 143 Challenge reprograms your Reticular Activating System in 3 days. Your brain starts scanning for possibility instead of threat. Free. No card required. This is the foundation.",
    badge: "Free",
  },
  {
    step: "Stage 2",
    title: "Map Your Capacities",
    detail:
      "143 questions. 15 minutes. The assessment scores all 9 Rays across 36 subfacets and generates your Light Signature, Eclipse Snapshot, Energy-to-Eclipse Ratio, and Rise Path. Not who you are. What you can build.",
    badge: "$43",
  },
  {
    step: "Stage 3",
    title: "Train the Gaps",
    detail:
      "Your Rise Path gives you specific reps matched to your results. 13 science-backed protocols. Daily micro-practices. 3 minutes a day. The reps target the capacity that is most eclipsed — not the one that is easiest.",
    badge: "Included",
  },
  {
    step: "Stage 4",
    title: "Measure the Proof",
    detail:
      "Retake in 90 days. Watch the numbers shift. That is not a feeling. That is evidence the reps are landing. No other assessment is designed to be outgrown. Your data stays even if you cancel.",
    badge: "Portal",
  },
];

const OFFER_TIERS = [
  {
    title: "143 Challenge",
    price: "Free",
    description:
      "3-day RAS reset. Your brain stops scanning for threat and starts scanning for capacity. The entry point to the whole system.",
    href: "/143",
    cta: "Start the Challenge",
  },
  {
    title: "Gravitational Stability Report",
    price: "$43 one-time",
    description:
      "Light Signature, Eclipse Snapshot, full 9-Ray map, Energy-to-Eclipse Ratio, personalised Rise Path, 30-day training plan, PDF download.",
    href: "/assessment",
    cta: "Take the Assessment",
  },
  {
    title: "Portal Membership",
    price: "$14.33/month",
    description:
      "Everything in the report plus weekly retakes, daily micro-practices, Watch Me and Go First flows, week-over-week progress logs. Cancel anytime. Data stays.",
    href: "/upgrade",
    cta: "See My Options",
  },
];

/* ── page ───────────────────────────────────────────────────── */

export default async function HowItWorksPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_how_it_works",
    sourceRoute: "/how-it-works",
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
            Four stages. One operating system upgrade.
          </p>
          <h1
            className="text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Reset the filter. Map the pattern. Train the gaps. Measure the proof.
          </h1>
          <p
            className="mx-auto text-base leading-relaxed max-w-[540px]"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Every stage builds on the last. Nothing is skipped. Nothing is
            guessed. You will have receipts.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/143" className="btn-primary">
              Start the Challenge — Free
            </Link>
            <Link href="/assessment" className="btn-watch">
              Take the Assessment
            </Link>
          </div>

          <CosmicImage
            src="/images/cosmic/framework-phases.png"
            alt="Four phases of the 143 Leadership system — reset, map, train, measure"
            width={600}
            height={600}
            maxWidth="600px"
            variant="section"
            className="mt-6"
          />
        </section>

        <GoldDividerAnimated />

        {/* ─── SECTION 2 · THE FUNNEL ─────────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                The Pipeline
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Each step builds capacity for the next.
              </h2>
            </div>

            <CosmicImage
              src="/images/cosmic/gravitational-stability.png"
              alt="Gravitational stability — measuring your leadership capacity under pressure"
              width={320}
              height={320}
              maxWidth="320px"
              variant="section"
            />

            <StaggerContainer className="grid gap-5 sm:grid-cols-2">
              {FUNNEL_STEPS.map((step) => (
                <StaggerItem key={step.step}>
                  <div className="glass-card p-5 h-full space-y-3">
                    <div className="flex items-center justify-between">
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: "var(--brand-gold, #F8D011)" }}
                      >
                        {step.step}
                      </p>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                        style={{
                          background: "rgba(248,208,17,0.12)",
                          color: "var(--brand-gold, #F8D011)",
                        }}
                      >
                        {step.badge}
                      </span>
                    </div>
                    <p
                      className="text-base font-semibold"
                      style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                    >
                      {step.title}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.70))",
                      }}
                    >
                      {step.detail}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 3 · WHAT YOU GET ───────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Choose Your Entry Point
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Free to start. Priced to prove.
              </h2>
            </div>

            <StaggerContainer className="grid gap-5 sm:grid-cols-3">
              {OFFER_TIERS.map((tier) => (
                <StaggerItem key={tier.title}>
                  <div className="glass-card flex flex-col p-5 h-full space-y-3">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--brand-gold, #F8D011)" }}
                    >
                      {tier.title}
                    </p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                    >
                      {tier.price}
                    </p>
                    <p
                      className="flex-1 text-sm leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.70))",
                      }}
                    >
                      {tier.description}
                    </p>
                    <Link
                      href={tier.href}
                      className="mt-auto inline-block text-center rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-105"
                      style={{
                        background: "rgba(248,208,17,0.12)",
                        color: "var(--brand-gold, #F8D011)",
                        border: "1px solid rgba(248,208,17,0.25)",
                      }}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 4 · WHY RETAKE ─────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Designed to Be Outgrown
              </p>
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                The score is supposed to change. That is the point.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Most assessments give you a label and a shelf life. The 143 is
                designed to be retaken. Your scores move as your capacity changes.
                That shift is not noise. It is proof the reps are landing. The
                Portal membership tracks that movement week over week — so you
                are not guessing whether the work is working.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                }}
              >
                Cancel anytime. No penalties. No exit interviews. Your data stays.
                Your map is waiting when you come back.
              </p>
              <CosmicImage
                src="/images/cosmic/moon-sun-slider.png"
                alt="Moon to sun — your scores shift from eclipse toward full radiance over time"
                width={400}
                height={400}
                maxWidth="400px"
                variant="section"
                className="mt-2"
              />
            </div>
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
                The system works. The question is where you start.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Start free with the 143 Challenge. Or go straight to the
                assessment and get your full map today.
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
