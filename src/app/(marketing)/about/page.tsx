import Image from "next/image";
import Link from "next/link";

import CosmicImage from "@/components/marketing/CosmicImage";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ConicBorderCard from "@/components/ui/ConicBorderCard";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import SectionTOC from "@/components/ui/SectionTOC";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import BackToTopButton from "@/components/ui/BackToTopButton";
import TestimonialCarousel from "@/components/marketing/TestimonialCarousel";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import RayDivider from "@/components/ui/RayDivider";
import { rayHex, cycleRay } from "@/lib/ui/ray-colors";

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
      <SectionTOC items={[
        { id: "hero", label: "Hero" },
        { id: "story", label: "The Story" },
        { id: "credentials", label: "Background" },
        { id: "do-dont", label: "What You Get" },
        { id: "method", label: "The Method" },
        { id: "testimonials", label: "Testimonials" },
        { id: "cta", label: "Get Started" },
      ]} />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section id="hero" className="mx-auto max-w-[720px] space-y-5 text-center">
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
          <RaySpectrumStrip className="mt-6" />
        </section>

        <RayDivider ray="R1" />

        {/* ─── SECTION 2 · THE STORY ──────────────────────────── */}
        <FadeInSection blur>
          <section id="story" className="relative mx-auto max-w-[720px] section-blend-top">
            <div className="glass-card glass-card--executive p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R1') }}
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

        <RayDivider ray="R6" />

        {/* ─── SECTION 3 · CREDENTIALS ────────────────────────── */}
        <FadeInSection>
          <section id="credentials" className="relative mx-auto max-w-[720px] space-y-8">
            <FloatingOrbs />
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R6') }}
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
              {CREDENTIALS.map((item, idx) => (
                <StaggerItem key={item}>
                  <div className="glass-card glass-card--magnetic flex items-start gap-3 p-4 check-animated" style={{ animationDelay: `${idx * 0.1}s`, borderLeft: `2px solid ${rayHex(cycleRay(idx))}40` }}>
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

        <RayDivider ray="R4" />

        {/* ─── SECTION 4 · DO / DON'T ─────────────────────────── */}
        <FadeInSection>
          <section id="do-dont" className="mx-auto max-w-[720px] space-y-8">
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
                  style={{ color: rayHex('R6') }}
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
                  style={{ color: `${rayHex('R4')}88` }}
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

        <RayDivider ray="R8" />

        {/* ─── BUILT FOR REAL BRAINS (#3) ──────────────────────── */}
        <FadeInSection>
          <section className="relative mx-auto max-w-[720px] space-y-5">
            <div className="glass-card glass-card--executive p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R8') }}
              >
                Built for Real Brains
              </p>
              <h2
                className="text-xl font-bold sm:text-2xl text-gold-gradient"
              >
                This system was built because its creator needed it.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
              >
                ADHD does not wait for long assessments or abstract frameworks.
                It needs: short practices. Clear structure. Immediate feedback.
                Visible progress. No willpower required to start.
                That is not accommodation — that is <span className="gold-highlight">better design for every brain</span>.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
              >
                Traditional assessments are 60 to 240 items, no breaks, abstract
                language, one sitting. The 143 system was built for a brain that
                needs structure to function — and that structure makes it work better
                for everyone. This is Universal Design for Learning applied to
                leadership development. We built for the hardest attention case first.
                That is why it works for everyone.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 mt-2">
                {[
                  { label: "3-5 min", desc: "Daily practices — not 60-min sessions", rayKey: "R1" },
                  { label: "Weekly scan", desc: "5-minute retake — not annual reassessment", rayKey: "R9" },
                  { label: "Visible proof", desc: "Scores you can see move — not abstract insight", rayKey: "R8" },
                  { label: "No willpower gate", desc: "Smallest viable rep — not behavior overhaul", rayKey: "R4" },
                ].map((item) => (
                  <div key={item.label} className="glass-card glass-card--magnetic p-3" style={{ borderTop: `2px solid ${rayHex(item.rayKey)}30` }}>
                    <p className="text-sm font-bold" style={{ color: rayHex(item.rayKey) }}>{item.label}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <RayDivider ray="R9" />

        <GoldHeroBanner
          kicker="Why 143"
          title="One letter. Four letters. Three letters. I love you."
          description="Not a platitude. An operating condition. Self-directed compassion lowers cortisol. Self-criticism spikes it. The number is the design philosophy."
        />

        <RayDivider ray="R3" />

        {/* ─── THE 143 DESIGN PHILOSOPHY (#24) ────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R3') }}
              >
                The 143 Design Philosophy
              </p>
              <h2
                className="text-xl font-bold sm:text-2xl"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                We named it 143 because self-directed compassion is the
                operating principle, not a nice-to-have.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
              >
                Kristin Neff&rsquo;s research on fierce self-compassion
                demonstrates that <span className="gold-highlight">compassion
                drives sustained motivation without the cost of
                self-criticism</span>. A regulated nervous system sustains
                high standards. A shamed one collapses. That distinction
                shaped every design decision in this system — from how we
                name your gaps (eclipse, not derailment) to how we frame
                your scores (coverage, not weakness) to how we speak to
                you in your results (what to restore, not what to fix).
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))" }}
              >
                In a market of clinical language and deficit framing, 143
                is a deliberate act. The number is not branding. It is the
                principle. Every interaction with this system reinforces:
                you are not broken. You are covered. And coverage lifts.
              </p>
            </div>
          </section>
        </FadeInSection>

        <RayDivider ray="R5" />

        {/* ─── SECTION 5 · THE METHOD ─────────────────────────── */}
        <FadeInSection>
          <section id="method" className="mx-auto max-w-[720px] space-y-5 text-center">
            <CosmicImage
              src="/images/logo-leadership-full.svg"
              alt="143 Leadership"
              width={160}
              height={160}
              maxWidth="160px"
              variant="decorative"
            />
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: rayHex('R5') }}
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

        <RayDivider ray="R7" />

        {/* ─── SECTION 5b · TESTIMONIALS ─────────────────────────── */}
        <FadeInSection>
          <section id="testimonials" className="relative mx-auto max-w-[720px] space-y-6 text-center section-blend-bottom">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: rayHex('R7') }}
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

        <RayDivider />

        {/* ─── SECTION 6 · CTA ────────────────────────────────── */}
        <FadeInSection>
          <section id="cta" className="mx-auto max-w-[720px]">
            <ConicBorderCard glow>
            <div className="glass-card p-8 text-center space-y-5" style={{ border: 'none' }}>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: rayHex('R9') }}
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

/* ── utility ───────────────────────────────────────────────── */

function CheckIcon({ color = "#F8D011" }: { color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" />
      <path
        d="M5 8l2 2 4-4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
