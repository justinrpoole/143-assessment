import Image from "next/image";
import Link from "next/link";

import CosmicImage from "@/components/marketing/CosmicImage";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
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
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import BackToTopButton from "@/components/ui/BackToTopButton";
import TestimonialCarousel from "@/components/marketing/TestimonialCarousel";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Justin Ray — The Builder of 143 Leadership",
  description:
    "I built the 143 Assessment because I needed it first. Executive development background. Real pressure. A framework built on behavioural science and tested where leadership actually happens.",
};

/* ── static data ───────────────────────────────────────────── */

const DO_LIST = [
  "Name the real problem in plain language. No jargon. No cushion.",
  "Back every claim with published research you can read yourself.",
  "Build tools that <span className=\"gold-highlight\">measure change</span> \u2014 and show you the receipt at retake.",
  "Use non-shame language. Your gaps are not failures. They are covered capacities. People develop faster when they feel safe to be honest.",
];

const DONT_LIST = [
  "Wrap hard truths in motivational cotton that fades by Friday.",
  "Make promises backed by enthusiasm alone. If there is no mechanism, there is no tool.",
  "Sort you into a personality box and call it self-awareness. Your scores are designed to change.",
  "Use urgency manufactured from shame. That spikes cortisol. I build systems that lower it.",
];

const CREDENTIALS = [
  "Executive development consulting across tech, healthcare, finance, and education \u2014 inside the rooms where leadership pressure is real, not theoretical",
  "Trained in behavioural science, positive psychology, and applied neuroscience \u2014 every tool in the system maps to published, peer-reviewed research",
  "Built and validated the 143 Assessment from the ground up \u2014 143 questions measuring <span className=\"gold-highlight\">9 trainable leadership capacities</span>",
  "Designed a deterministic scoring engine \u2014 auditable, reproducible, SHA-256 verified. No black boxes. No vibes.",
  "Created the Eclipse concept \u2014 a <span className=\"gold-highlight\">non-shame framework</span> for explaining why high-performers lose access to their strongest capacities under sustained stress",
  "Developed 36 Light Signature archetypes from C(9,2) ray pair combinations \u2014 a combinatorial identity system, not a personality label",
];

/* ── page ───────────────────────────────────────────────────── */

export default async function AboutPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_about",
    sourceRoute: "/about",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <div className="mx-auto w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full overflow-hidden border-2" style={{ borderColor: "var(--brand-gold)" }}>
            <Image
              src="/images/justin-ray-headshot.png"
              alt="Justin Ray"
              width={140}
              height={140}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <p className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Not a motivator. A builder. · 6 min read
          </p>
          <h1
            className="text-shimmer mx-auto max-w-[600px] text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            I built the map so you do not have to wander for 20 years.
          </h1>
          <div className="mx-auto max-w-[540px]">
            <ScrollTextReveal text="Executive development background. Real-world pressure. A framework built on behavioural science and tested in the rooms where leadership actually happens — not conference stages." />
          </div>
        </section>

        <GoldDividerAnimated />

        {/* ─── SECTION 2 · THE STORY ──────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card glass-card--executive p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                The short version
              </p>
              <h2
                className="text-xl font-bold sm:text-2xl text-gold-gradient"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                I watched the same gap for years. Then I built the bridge.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                I spent years inside executive development. Real organisations.
                Real pressure. And I watched the same pattern on repeat: a leader
                finishes a programme, feels genuinely changed, and by the
                following week the old patterns are back. Not because the
                programme was bad. Because it taught tactics without upgrading the
                operating system that runs them. Have you ever had that
                experience? That is not a willpower failure. That is a $240
                billion design gap.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                So I built the operating system. The 143 Assessment measures 9
                leadership capacities backed by peer-reviewed science. It detects
                when depletion is masking real capacity. And your scores are
                designed to change — because you are not a fixed type. I built it
                because I needed it first. I was the stretched leader. Performing
                well. Coming home empty. Running on borrowed energy and calling it
                discipline. These tools changed my own pattern before I offered
                them to anyone else.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                }}
              >
                Why 143? One letter. Four letters. Three letters. I love you.
                That is the foundation. Not as a platitude — as an operating
                condition. Self-directed compassion lowers cortisol.
                Self-criticism spikes it. A regulated nervous system sustains high
                standards. A shamed one collapses. The number is not decoration.
                It is the principle the entire system is built on.
              </p>
            </div>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 3 · CREDENTIALS ────────────────────────── */}
        <FadeInSection>
          <section className="relative mx-auto max-w-[720px] space-y-8">
            <FloatingOrbs />
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Background
              </p>
              <h2
                className="text-xl font-bold sm:text-2xl"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Built from the inside out.
              </h2>
            </div>

            <StaggerContainer className="space-y-3">
              {CREDENTIALS.map((item) => (
                <StaggerItem key={item}>
                  <div className="glass-card glass-card--magnetic flex items-start gap-3 p-4">
                    <CheckIcon />
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                    >
                      {item}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 4 · DO / DON'T ─────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-8">
            <h2
              className="text-center text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              What you will get. What you will not.
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
                      <div className="glass-card glass-card--magnetic flex items-start gap-3 p-4">
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
                  {DONT_LIST.map((item) => (
                    <StaggerItem key={item}>
                      <div className="glass-card glass-card--magnetic flex items-start gap-3 p-4">
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
          kicker="Why 143"
          title="One letter. Four letters. Three letters. I love you."
          description="Not a platitude. An operating condition. Self-directed compassion lowers cortisol. Self-criticism spikes it."
        />

        <GoldDividerAnimated />

        {/* ─── SECTION 5 · THE METHOD ─────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-5 text-center">
            <CosmicImage
              src="/images/logo-143-transparent.png"
              alt="143 Leadership"
              width={160}
              height={160}
              maxWidth="160px"
              variant="decorative"
            />
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
              Fix the operating system first. Then every tactic works.
            </h2>
            <p
              className="mx-auto max-w-[540px] text-sm leading-relaxed"
              style={{
                color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
              }}
            >
              The 9 Rays are emotional intelligence made trainable and
              measurable. Intention, Joy, and Presence train EQ with yourself.
              Connection, Possibility, and Be The Light train EQ with others.
              Power, Purpose, and Authenticity are where they meet. That is the map. 143 questions. 15 minutes. The most honest
              mirror your leadership has seen. Not who you are. What you can
              build.
            </p>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 5b · TESTIMONIALS ─────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-6 text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              What leaders are saying
            </p>
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              Built for real leaders. Tested by real leaders.
            </h2>
            <TestimonialCarousel
              testimonials={[
                {
                  quote: "I have done every personality assessment out there. This is the first one that told me something I could actually change — and showed me how.",
                  name: "Sarah M.",
                  role: "VP of Operations",
                },
                {
                  quote: "Justin does not hand you a label. He hands you a map. That distinction changed how I lead my team.",
                  name: "David K.",
                  role: "Director of Engineering",
                },
                {
                  quote: "The eclipse concept alone was worth the entire assessment. I finally understood why my best capacities disappeared under pressure.",
                  name: "Priya R.",
                  role: "Chief People Officer",
                },
                {
                  quote: "I came in sceptical. The retake data shut that down. My scores moved in 90 days. Not a feeling — a number.",
                  name: "Marcus T.",
                  role: "Senior Program Manager",
                },
              ]}
            />
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 6 · CTA ────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <ConicBorderCard glow>
            <div className="glass-card p-8 text-center space-y-5" style={{ border: 'none' }}>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Ready to see your map?
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                143 questions. 15 minutes. The most honest mirror your leadership
                has seen.
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/assessment">
                  Take the Assessment
                </NeonGlowButton>
                <LiquidFillButton href="/preview">
                  Try the Free Stability Check
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
