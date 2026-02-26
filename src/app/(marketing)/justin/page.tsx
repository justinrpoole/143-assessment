import Image from "next/image";
import Link from "next/link";

import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ConicBorderCard from "@/components/ui/ConicBorderCard";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Justin Ray — The Builder of 143 Leadership",
  description:
    "I do not motivate. I build maps for people who are tired of wandering. Executive development background. Real-world pressure. A framework built on behavioural science and tested where leadership actually happens.",
};

/* ── static data ───────────────────────────────────────────── */

const DONT_DO = [
  "Give motivational speeches that fade by Friday.",
  "Promise transformation without showing the mechanism.",
  "Use shame language to create urgency. Your gaps are not failures. They are covered capacities.",
];

const DO_LIST = [
  "Translate neuroscience into tools you can use Monday morning.",
  "Build systems that produce measurable change — and show you the receipt at retake.",
  "Name the real thing plainly. Even when it is hard. Especially when it is hard.",
];

/* ── page ───────────────────────────────────────────────────── */

export default async function JustinPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_justin",
    sourceRoute: "/justin",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5">
          <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden border-2" style={{ borderColor: "var(--brand-gold)" }}>
            <Image
              src="/images/justin-ray-headshot.png"
              alt="Justin Ray"
              width={120}
              height={120}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <p className="gold-tag">
            <span style={{ color: '#F8D011' }}>&#x25C6;</span> The person who built the system — because he needed it first.
          </p>
          <h1
            className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            I do not motivate. I build maps for people who are tired of
            wandering.
          </h1>
          <p
            className="max-w-[560px] text-base leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Executive development background. Real organisations. Real pressure.
            A framework built on <span className="gold-highlight">behavioural science</span> and tested in the rooms
            where leadership actually happens — not conference stages.
          </p>
        </section>

        <GoldDividerAnimated />

        {/* ─── SECTION 2 · THE STORY ───────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                The short version
              </p>
              <h2
                className="text-xl font-bold sm:text-2xl"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                The short version.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                I spent years inside executive development watching the same
                pattern: a leader finishes a programme, feels genuinely changed,
                and watches the results fade by the following week. Not because
                the programme was bad. Because it never addressed what was
                underneath. That gap is why I built the 143 Assessment.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                I built it because I needed it first. The leadership tools
                everyone was selling did not work — not because they were wrong,
                but because they assumed an operating system that was not
                running. I was stretched. Performing well and coming home empty.
                Running on borrowed energy and calling it discipline. So I
                started from scratch. <span className="gold-highlight">Nine trainable capacities</span> backed by
                peer-reviewed science. An Eclipse Snapshot that names the gap
                without shame. Non-diagnostic language because people develop
                faster when they feel safe. A retake system that proves <span className="gold-highlight">growth
                is real</span>. I did not study this from a distance. I trained myself
                with these tools and watched my own Light Signature change.
              </p>
            </div>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 3 · TRUST ───────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-8">
            <h2
              className="text-center text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              No hype. Structure and receipts.
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p
                  className="mb-4 text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  What I do
                </p>
                <StaggerContainer className="space-y-3">
                  {DO_LIST.map((item) => (
                    <StaggerItem key={item}>
                      <div className="glass-card flex items-start gap-3 p-4">
                        <span
                          className="shrink-0 font-bold"
                          style={{ color: "var(--brand-gold)" }}
                        >
                          &#x2713;
                        </span>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                        >
                          {item}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
              <div>
                <p
                  className="mb-4 text-xs font-bold uppercase tracking-widest"
                  style={{ color: "rgba(248,208,17,0.55)" }}
                >
                  What I don&apos;t do
                </p>
                <StaggerContainer className="space-y-3" baseDelay={0.2}>
                  {DONT_DO.map((item) => (
                    <StaggerItem key={item}>
                      <div className="glass-card flex items-start gap-3 p-4">
                        <span
                          className="shrink-0 font-bold"
                          style={{ color: "rgba(248,208,17,0.5)" }}
                        >
                          &#x2715;
                        </span>
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            color:
                              "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                          }}
                        >
                          {item}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        <GoldHeroBanner
          kicker="The Method Is The Message"
          title="Fix the operating system first. Then every tactic works."
          description="Nine trainable capacities backed by peer-reviewed science. Not who you are. What you can build."
        />

        <GoldDividerAnimated />

        {/* ─── SECTION 4 · THE METHOD ──────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-5 text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              The method is the message
            </p>
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              Reset the filter. Map the capacities. Train the gaps. Measure the
              proof.
            </h2>
            <p
              className="mx-auto max-w-[540px] text-sm leading-relaxed"
              style={{
                color:
                  "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              The first three Rays train emotional intelligence with yourself.
              The middle three are where self-regulation meets self-expression.
              The last three train emotional intelligence with others. Nine
              dimensions. One operating system upgrade. Not who you are. What you
              can build.
            </p>
            <p
              className="mx-auto max-w-[540px] text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
              }}
            >
              Take it. Train. Retake. Watch your Light Signature evolve. That is
              the work. That is the path. That is the difference between this and
              everything else you have tried.
            </p>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 5 · CTA ─────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                143 questions. 15 minutes. One map of where your light is
                strong and where it is covered.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                You move from scattered effort to aligned execution — with proof
                that the shift is real. Not a feeling. A number.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/upgrade-your-os">
                  Map My Full Light Signature
                </NeonGlowButton>
                <LiquidFillButton href="/preview">
                  Check My Stability (Free)
                </LiquidFillButton>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>
    </main>
  );
}
