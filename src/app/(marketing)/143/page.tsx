import Link from "next/link";

import CosmicImage from "@/components/marketing/CosmicImage";
import DigitalClock143 from "@/components/marketing/DigitalClock143";
import { ToolkitDeliveryClient } from "@/components/retention/ToolkitDeliveryClient";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The 143 Challenge — Free 3-Day Brain Rewire",
  description:
    "You talk to yourself worse than you would talk to anyone you love. The 143 Challenge rewires your brain's threat filter in 3 days, 3 minutes a day. Free. No card required.",
};

/* ── static data ───────────────────────────────────────────── */

const SCIENCE_CARDS = [
  {
    label: "The Filter",
    body: "Your Reticular Activating System filters 11 million bits of sensory data every second down to about 40. It decides what you notice. Right now, it is tuned to find threat.",
  },
  {
    label: "The Rewire",
    body: "143 means I love you. One letter. Four letters. Three letters. Every clock at :43 becomes a cue your brain cannot ignore. Hand over heart. The protocol starts.",
  },
  {
    label: "The Proof",
    body: "Self-compassion lowers cortisol. Self-criticism spikes it. Dr. Jill Bolte Taylor's research shows the chemical flood lasts 90 seconds. After that, you are re-triggering yourself through thought. The 143 Challenge interrupts the loop.",
  },
];

const CHALLENGE_STEPS = [
  {
    week: "Days 1\u20133",
    title: "Notice",
    instruction:
      "Just notice 143 on clocks, receipts, signs, license plates. Do not force it. Your brain will start scanning within 72 hours.",
  },
  {
    week: "Days 4\u20137",
    title: "Activate",
    instruction:
      'Every time you see :43 on a clock, look at the hour number. Say "I love you" that many times, using your name. 1:43 = once. 7:43 = seven times. 12:43 = twelve.',
  },
  {
    week: "Week 2+",
    title: "Make It Yours",
    instruction:
      "Add your own layer. A breath. A hand on your chest. A phrase that lands. The cue system is installed. Now you own it.",
  },
];

const KIT_INCLUDES = [
  "3-day challenge walkthrough with daily instructions",
  "RAS Reset audio guide (2 minutes)",
  "Printable 143 tracker card",
  "Science brief: why this works (with citations)",
  "Bridge to the Gravitational Stability Check",
];

/* ── page ───────────────────────────────────────────────────── */

export default async function Challenge143Page() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_143",
    sourceRoute: "/143",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            Your brain is running a threat filter you never installed.
          </p>
          <h1
            className="text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            3 days to reprogram it. 3 minutes a day. Free.
          </h1>
          <p
            className="text-base leading-relaxed max-w-[560px]"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            You talk to yourself worse than you would talk to anyone you love.
            That is not a character flaw. It is a miscalibrated filter. The 143
            Challenge gives your brain new search instructions — through
            self-directed compassion plus structured repetition that rewires the
            filter. Not affirmation. Not positive thinking. A reprogramming act.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="#challenge-start" className="btn-primary">
              Start the Challenge
            </Link>
            <Link href="/assessment" className="btn-watch">
              Take the Full Assessment
            </Link>
          </div>

          <div className="mt-6">
            <DigitalClock143 />
          </div>
        </section>

        <GoldDivider />

        {/* ─── SECTION 2 · THE SCIENCE ────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-8">
            <div className="space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Why This Works
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Your inner critic is not a character flaw. It is a miscalibrated
                filter.
              </h2>
            </div>

            <StaggerContainer className="space-y-4">
              {SCIENCE_CARDS.map((card) => (
                <StaggerItem key={card.label}>
                  <div
                    className="glass-card p-5"
                    style={{
                      borderLeft: "3px solid var(--brand-gold, #F8D011)",
                    }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--brand-gold, #F8D011)" }}
                    >
                      {card.label}
                    </p>
                    <p
                      className="mt-1 text-sm leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                      }}
                    >
                      {card.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 3 · THE PROTOCOL ───────────────────────── */}
        <FadeInSection>
          <section
            id="challenge-start"
            className="mx-auto max-w-[720px] space-y-8 scroll-mt-20"
          >
            <div className="space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                The Protocol
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                143 means I love you. That is the rep.
              </h2>
            </div>

            <StaggerContainer className="space-y-4">
              {CHALLENGE_STEPS.map((step) => (
                <StaggerItem key={step.title}>
                  <div className="glass-card p-5 space-y-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                        style={{
                          background: "var(--brand-gold, #F8D011)",
                          color: "#020202",
                        }}
                      >
                        {step.week}
                      </span>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                      >
                        {step.title}
                      </p>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                      }}
                    >
                      {step.instruction}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <p
              className="text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
              }}
            >
              Variable repetition keeps the brain engaged. Same repetition leads
              to habituation. The hour number changes every time — so the rep
              stays fresh and the neural pathway keeps forming.
            </p>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 4 · THE CHALLENGE KIT ──────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-6">
            <div className="glass-card p-6 sm:p-8 space-y-5">
              <CosmicImage
                src="/images/logo-143-challenge-transparent.png"
                alt="143 Challenge"
                width={120}
                height={120}
                maxWidth="120px"
                variant="decorative"
                className="mb-2"
              />
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Your Challenge Kit
              </p>
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Everything you need to start. Free. No card required.
              </h2>

              <ul className="space-y-2">
                {KIT_INCLUDES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-relaxed"
                    style={{
                      color:
                        "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                    }}
                  >
                    <span
                      className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--brand-gold)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <ToolkitDeliveryClient isAuthenticated={auth.isAuthenticated} />
            </div>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 5 · THE BRIDGE ─────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                What Comes Next
              </p>
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                The Challenge resets your filter. The assessment maps your whole
                system.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                The 143 Challenge works on one mechanism: your RAS filter. The
                full assessment maps all 9 capacities — your Light Signature,
                your Eclipse Snapshot, and the specific reps to restore access.
                Start here for free. Go deeper when you are ready.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/preview" className="btn-watch">
                  Take the Free Stability Check
                </Link>
                <Link
                  href="/assessment"
                  className="text-sm font-medium transition-opacity hover:opacity-100"
                  style={{ color: "var(--brand-gold)", opacity: 0.7 }}
                >
                  Full Assessment &rarr;
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ─── SECTION 6 · CTA ────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                &ldquo;I choose what my mind magnifies.&rdquo;
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                3 days. 3 minutes. Your brain starts scanning for possibility
                instead of threat. That is restored access. That is the beginning.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="#challenge-start" className="btn-primary">
                  Start the 143 Challenge — Free
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
