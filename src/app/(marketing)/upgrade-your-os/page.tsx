import Link from "next/link";
import Image from "next/image";

import CosmicHeroStatic from "@/components/marketing/CosmicHeroStatic";
import HeroProofStrip from "@/components/marketing/HeroProofStrip";
import ScrollProgress from "@/components/marketing/ScrollProgress";
import CountUp from "@/components/marketing/CountUp";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import NeonStarField from "@/components/cosmic/NeonStarField";
import StaggerChildren from "@/components/marketing/StaggerChildren";
import RadarMockup from "@/components/marketing/RadarMockup";
import EmailCaptureBanner from "@/components/marketing/EmailCaptureBanner";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import BackToTopButton from "@/components/ui/BackToTopButton";
import SectionTOC from "@/components/ui/SectionTOC";
import CompetitorComparison from "@/components/marketing/CompetitorComparison";
import NotALabelManifesto from "@/components/marketing/NotALabelManifesto";
import ScoreMovementChart from "@/components/marketing/ScoreMovementChart";
import { FadeInSection } from "@/components/ui/FadeInSection";
import RayDivider from "@/components/ui/RayDivider";
import { rayHex, cycleRay } from "@/lib/ui/ray-colors";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import TrustBadgeStrip from "@/components/marketing/TrustBadgeStrip";
import NeonFlicker from "@/components/ui/NeonFlicker";
import { PAGE_COPY_V1 } from "@/content/page_copy.v1";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The 143 Challenge | See Your Filter Reprogram in 3 Days",
  description:
    "Your light was never gone. It was only eclipsed. In 3 days, you'll see 143 everywhere—proof that your Reticular Activating System (attention filter) works exactly as we're about to reprogram it. Free challenge. Self-directed. Evidence-based.",
};

/* ── static data ───────────────────────────────────────────────── */

const WHAT_I_DONT_DO = [
  "This is not motivation theatre. No hype. No pep talks. Structure.",
  "This is not a personality quiz. No types. No labels. No sorting you into a box you cannot leave.",
  "This is coaching and education. I do not provide medical care. I train leadership capacity backed by behavioural science.",
  "This is not a one-time event. Your scores are designed to change. That is the whole point.",
];

const TESTIMONIALS = [
  { quote: "I have taken MBTI, Enneagram, DISC, and StrengthsFinder. None of them explained why I was performing well but feeling empty. The eclipse concept did in one sentence what four assessments could not.", attribution: "VP of Operations, SaaS" },
  { quote: "I retook the assessment 90 days after starting the coaching OS. Three of my Ray scores moved. Not because I tried harder. Because I trained differently. First time a tool actually showed me I was growing.", attribution: "Senior Director, Healthcare" },
  { quote: "My team noticed before I did. My presence score went from eclipsed to emerging. My direct reports said I was calmer in meetings. That was not an accident — it was reps.", attribution: "Engineering Lead, Fortune 500" },
];

const copy = PAGE_COPY_V1.upgradeYourOs;
const qaSpineMarkers = [
  "SPINE:HOOK",
  "SPINE:WHY",
  "SPINE:HOW",
  "SPINE:PROOF",
  "SPINE:OUTCOME",
  "SPINE:LOOP",
];
void qaSpineMarkers;
void copy.questionBand;

/* ── page ───────────────────────────────────────────────────────── */
export default async function UpgradeYourOsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_home_143_challenge",
    sourceRoute: "/",
    userState,
  });

  return (
    <main className="cosmic-page-bg page-shell relative">
      {/* ── Global visual layers ── */}
      <ScrollProgress />
      <SectionTOC items={[
        { id: "hero", label: "Hero" },
        { id: "justin", label: "My Story" },
        { id: "eclipse-concept", label: "Your Light" },
        { id: "score-movement", label: "Scores Move" },
        { id: "filter", label: "The Filter" },
        { id: "proof", label: "The 143 Proof" },
        { id: "eclipsed-if", label: "Eclipse Signs" },
        { id: "eclipse-nova", label: "Eclipse & Nova" },
        { id: "why-different", label: "Why Different" },
        { id: "tools", label: "Tools" },
        { id: "sample-report-teaser", label: "Your Map" },
        { id: "competitor-comparison", label: "Why 143" },
        { id: "testimonials", label: "Testimonials" },
        { id: "pricing", label: "Pricing" },
        { id: "science", label: "The Science" },
        { id: "final-cta", label: "Get Started" },
      ]} />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: COSMIC HERO
         ══════════════════════════════════════════════════════════════ */}
      <div id="hero" className="relative z-10">
        <CosmicHeroStatic />
      </div>

      <div className="relative z-10">
        <HeroProofStrip />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: JUSTIN RAY — "I am the brand. This is my story."
          Moved all the way up. First thing after hero.
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="justin" className="relative content-wrap--narrow py-10 sm:py-14">
        <FloatingOrbs variant="gold" />
        <div className="relative z-10">
          <div className="glass-card glass-card--hero p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="shrink-0">
                <div className="h-28 w-28 overflow-hidden rounded-full" style={{ border: '2px solid var(--gold-primary)', boxShadow: '0 0 30px color-mix(in srgb, var(--gold-primary) 30%, transparent)' }}>
                  <Image
                    src="/images/justin-ray-headshot.png"
                    alt="Justin Ray"
                    width={224}
                    height={224}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: 'var(--gold-primary)' }}>
                  Built By
                </p>
                <h2 className="text-gold-gradient text-2xl font-bold mt-1">
                  Justin Ray
                </h2>
                <p className="text-xs font-medium uppercase tracking-widest mt-1" style={{ color: 'var(--gold-primary)', opacity: 0.7 }}>
                  Educator · Coach · System Builder
                </p>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                  &ldquo;I spent years watching leadership programs teach information that never
                  landed — smart people learning powerful ideas that disappeared by Monday.
                  So I built a different system.&rdquo;
                </p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  One that <span className="gold-highlight">measures capacity</span> instead of labeling
                  personality. One that trains through <span className="gold-highlight">daily reps</span> instead of one-time workshops.
                  One that <span className="gold-highlight">proves growth</span> is happening instead of hoping it is.
                </p>
                <p className="mt-3 text-sm leading-relaxed italic" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  We upgrade your internal operating system so you can live just in a ray of light.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-xs tabular-nums" style={{ color: 'color-mix(in srgb, var(--gold-primary) 60%, transparent)' }}>
                    <CountUp end={2400} suffix="+" className="tabular-nums" style={{ color: 'color-mix(in srgb, var(--gold-primary) 60%, transparent)' }} /> leaders assessed
                  </span>
                  <span className="text-xs" style={{ color: 'var(--surface-border)' }}>·</span>
                  <span className="text-xs" style={{ color: 'color-mix(in srgb, var(--gold-primary) 60%, transparent)' }}>
                    Grounded in behavioural science
                  </span>
                </div>
                <Link href="/about" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold transition-all hover:brightness-110 hover:gap-2" style={{ color: 'var(--gold-primary)' }}>
                  Read the full story <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R5" />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: YOUR LIGHT IS NOT GONE — moved way up
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <RadialSpotlight>
      <section id="eclipse-concept" className="relative content-wrap py-10 sm:py-14">
        <NeonStarField showConstellations />
        <div className="relative z-10 grid items-center gap-6 md:grid-cols-2">
          <div className="gold-accent-left">
            <span className="gold-tag">
              <span style={{ color: 'var(--gold-primary)' }}>◆</span> Live Measurement
            </span>
            <h2 className="text-gold-gradient gold-underline heading-section mt-3">
              Your light is not gone. It is covered.
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              When stress stays elevated too long, your strongest capacity starts carrying
              your weakest. You deliver at work and <span className="gold-highlight">come home empty</span>. That is not failure.
              That is biology. The assessment names that exact pattern.
            </p>
          </div>
          <StaggerChildren className="grid gap-3" staggerMs={200}>
            <div className="glass-card glass-card--lift card-border-left-gold-soft p-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold-primary)', opacity: 0.5 }}>
                ◇ Eclipsed Monday
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                7am: alarm goes off, already dreading the 9am. You run the meeting well. Nobody
                knows the cost. By 3pm your creativity is gone. By 6pm you are running on fumes
                and calling it discipline.
              </p>
            </div>
            <div className="glass-card glass-card--lift card-border-left-body p-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold-primary)' }}>
                ◆ Light-Online Monday
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                7am: you wake up knowing your one thing. The 9am is clear. By 3pm you have energy
                left for thinking. By 6pm you chose what to give, not what was taken.
              </p>
            </div>
          </StaggerChildren>
          <div className="col-span-full">
            <p className="mt-1 text-center text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
              The assessment tells you which version you are running right now — and what is underneath.
            </p>
            <div className="mt-3 text-center">
              <NeonGlowButton href="/preview">
                Find Out Which One I&rsquo;m Running
              </NeonGlowButton>
            </div>
          </div>
        </div>
      </section>
      </RadialSpotlight>
      </FadeInSection>

      <RayDivider ray="R4" />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: SCORE MOVEMENT CHART — moved way up
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="score-movement" className="relative z-10 content-wrap--narrow py-10 sm:py-14">
        <div className="text-center space-y-2 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: rayHex('R4') }}>
            Scores That Move
          </p>
          <h2 className="heading-section" style={{ color: 'var(--text-body)' }}>
            Watch the growth happen — week by week.
          </h2>
          <p className="content-wrap--narrow max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            No other leadership assessment is designed to be retaken weekly.
            Every data point is evidence that the practice is landing.
          </p>
        </div>
        <ScoreMovementChart />
      </section>
      </FadeInSection>

      <RayDivider ray="R2" />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5: THE FILTER + VIDEO
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="filter" className="relative z-10 content-wrap--wide py-10 sm:py-14">
        <div className="glass-card grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(400px,50%)] lg:items-center" style={{ '--card-accent': 'var(--gold-primary)' } as { ['--card-accent']: string }}>
          <div>
            <span className="gold-tag">
              <span style={{ color: 'var(--gold-primary)' }}>◆</span> The Filter
            </span>
            <h2 className="heading-section mt-3 leading-tight" style={{ color: 'var(--text-on-dark)' }}>
              <span style={{ display: "block" }}>YOUR BRAIN PROCESSES</span>
              <span style={{ display: "block" }}>11 MILLION</span>
              <span style={{ display: "block" }}>BITS PER SECOND</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Your Reticular Activating System filters that down to 40-50 bits of consciousness. Right now,
              it&apos;s tuned to find threat and self-criticism. The 143 Challenge rewires it to find what you
              actually want to notice.
            </p>
          </div>
          <div className="glass-card glass-card--noGlow mx-auto w-full overflow-hidden rounded-2xl lg:mx-0 lg:justify-self-end" style={{ '--card-accent': 'var(--neon-violet)' } as { ['--card-accent']: string }}>
            <video
              className="block aspect-video h-auto w-full object-cover"
              src="/videos/brain-solar-system.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 6: SEE 143 EVERYWHERE — curiosity-driven, email gate
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="proof" className="relative z-10 content-wrap py-10 sm:py-14">
        <div className="mb-6 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: 'var(--gold-primary)' }}>◆</span> The Proof
          </span>
          <h2 className="heading-section mt-3" style={{ color: 'var(--text-on-dark)' }}>
            SEE 143 EVERYWHERE IN 72 HOURS
          </h2>
          <p className="mx-auto mt-2 max-w-[520px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            What if you could prove — to yourself — that your brain can be reprogrammed in 3 days?
            Not with theory. With your own experience.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="glass-card p-4" style={{ '--card-accent': rayHex('R5') } as { ['--card-accent']: string }}>
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: rayHex('R5') }}>DAY 1: NOTICE</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Your brain will start filtering for 143 everywhere — clocks, receipts, addresses. You will not be able to unsee it. That is proof your RAS works.
            </p>
          </div>
          <div className="glass-card p-4" style={{ '--card-accent': rayHex('R2') } as { ['--card-accent']: string }}>
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: rayHex('R2') }}>DAY 2: ACTIVATE</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Each time you see 143, you redirect your attention on purpose. Variable reps that teach your nervous system a new default.
            </p>
          </div>
          <div className="glass-card p-4" style={{ '--card-accent': rayHex('R9') } as { ['--card-accent']: string }}>
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: rayHex('R9') }}>DAY 3: RECOGNIZE</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Name the pattern you are running. The challenge proves your filter can change. The assessment shows you exactly where it is set right now.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            Enter your email to get the free 3-day challenge PDF.
          </p>
          <EmailCaptureBanner />
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R3" />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 7: YOU MIGHT BE ECLIPSED IF...
          Replaces old "Have you ever" questions — more relatable
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection blur>
      <section id="eclipsed-if" className="relative content-wrap py-10 sm:py-14">
        <FloatingOrbs variant="purple" />
        <div className="relative z-10 mb-6 text-center">
          <h2 className="heading-section" style={{ color: 'var(--text-on-dark)' }}>
            You might be <span style={{ color: 'var(--neon-amber)', textShadow: '0 0 20px var(--neon-amber)' }}>eclipsed</span> if&hellip;
          </h2>
        </div>
        <StaggerChildren className="relative z-10 grid gap-3 md:grid-cols-2">
          {[
            { text: "You perform well at work but come home with nothing left to give.", color: rayHex('R4') },
            { text: "You know what to do but cannot make yourself do it consistently.", color: rayHex('R1') },
            { text: "People think you are fine. You have not told anyone the truth in months.", color: rayHex('R6') },
            { text: "You used to feel creative and energized. Now you feel efficient and empty.", color: rayHex('R2') },
            { text: "You lead others well but have no one leading you.", color: rayHex('R7') },
            { text: "You keep achieving goals that do not make you feel the way you expected.", color: rayHex('R5') },
          ].map((item) => (
            <div
              key={item.text}
              className="glass-card glass-card--lift card-border-left-accent-soft card-surface-accent-subtle p-4"
              style={{ '--card-accent': item.color } as { ['--card-accent']: string }}
            >
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                {item.text}
              </p>
            </div>
          ))}
        </StaggerChildren>
        <div className="relative z-10 mt-6 text-center">
          <p className="text-sm italic mb-3" style={{ color: 'var(--neon-amber)', textShadow: '0 0 12px color-mix(in srgb, var(--neon-amber) 40%, transparent)' }}>
            Eclipse is not failure. It is your system running on survival fuel and calling it discipline.
          </p>
          <LiquidFillButton href="/preview">
            Find Where My Eclipse Is
          </LiquidFillButton>
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R9" />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 8: ECLIPSE & NOVA — neon colors, sun/moon icons
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="eclipse-nova" className="relative content-wrap py-10 sm:py-14 overflow-hidden">
        <FloatingOrbs variant="purple" />
        <NeonStarField />

        <div className="relative z-10 mb-8 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: 'var(--gold-primary)' }}>◆</span> WHY 143 WORKS
          </span>
        </div>

        <div className="relative z-10 grid gap-6 md:grid-cols-2 items-start">

          {/* Left — THE ECLIPSE — moon icon, neon violet */}
          <div
            className="glass-card card-border-left-stroke surface-border-fill p-6"
            style={{ borderLeftColor: 'var(--neon-violet)', boxShadow: 'inset 4px 0 24px -12px var(--neon-violet)' }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'color-mix(in srgb, var(--neon-violet) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-violet) 40%, transparent)' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <circle cx="14" cy="14" r="11" fill="none" stroke="var(--neon-violet)" strokeWidth="1.5" />
                  <circle cx="18" cy="14" r="8" fill="var(--bg-deep)" />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--neon-violet)', textShadow: '0 0 12px var(--neon-violet)' }}>
                The Eclipse
              </p>
            </div>
            <h3 className="text-xl font-bold mb-3 leading-snug" style={{ color: 'var(--neon-violet)', textShadow: '0 0 16px color-mix(in srgb, var(--neon-violet) 50%, transparent)' }}>
              YOUR LIGHT GOT COVERED.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              When you walk on eggshells. When you lower your excitement. When you shrink so someone else stays comfortable. That&rsquo;s an Eclipse. Your light didn&rsquo;t disappear &mdash; it was blocked. And it is temporary.
            </p>
          </div>

          {/* Right — THE NOVA — sun icon, neon gold */}
          <div
            className="glass-card card-border-left-gold surface-border-fill p-6"
            style={{ borderLeftColor: 'var(--gold-primary)', boxShadow: 'inset 4px 0 24px -12px var(--gold-primary)' }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'color-mix(in srgb, var(--gold-primary) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--gold-primary) 40%, transparent)' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  {Array.from({ length: 8 }, (_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    return (
                      <line
                        key={i}
                        x1={14 + Math.cos(angle) * 6}
                        y1={14 + Math.sin(angle) * 6}
                        x2={14 + Math.cos(angle) * 11}
                        y2={14 + Math.sin(angle) * 11}
                        stroke="var(--gold-primary)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    );
                  })}
                  <circle cx="14" cy="14" r="4.5" fill="var(--gold-primary)" />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold-primary)', textShadow: '0 0 12px var(--gold-primary)' }}>
                The Nova
              </p>
            </div>
            <h3 className="text-xl font-bold mb-3 leading-snug" style={{ color: 'var(--gold-primary)', textShadow: '0 0 16px color-mix(in srgb, var(--gold-primary) 50%, transparent)' }}>
              YOUR LIGHT REMEMBERS.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              A Nova is a star remembering its power. Not becoming someone new. Becoming visible again. The 143 Challenge proves your filter can shift. The assessment shows you exactly where it is set.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 text-center">
          <LiquidFillButton href="/preview">
            Find where your Eclipse is
          </LiquidFillButton>
        </div>
      </section>
      </FadeInSection>

      <div className="relative z-10 content-wrap">
        <TrustBadgeStrip badges={["9 Rays Measured", "143+ Data Points", "Evidence-Based"]} />
      </div>

      <RayDivider ray="R1" />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 9: WHY THIS IS DIFFERENT — color pops on labels
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="why-different" className="relative z-10 content-wrap py-10 sm:py-14">
        <div className="mb-8 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: 'var(--gold-primary)' }}>◆</span> The Difference
          </span>
          <h2 className="heading-section mt-3" style={{ color: 'var(--text-on-dark)' }}>
            Every other assessment tells you who you are.
            <br />
            <span className="gold-highlight">We tell you what you can build right now.</span>
          </h2>
        </div>
        <StaggerChildren className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: 'State, Not Type',
              body: 'MBTI tells you your personality. We tell you your current operating state. It changes. So does our map.',
              ray: 'R1',
            },
            {
              label: 'Grounded in Science',
              body: 'The RAS — your brain\'s filter for possibility — is reprogrammable. We show you exactly where to start.',
              ray: 'R4',
            },
            {
              label: 'A Language, Not a Label',
              body: 'Sun. Eclipse. Nova. Ray. When 143 people say "I\'m in my Eclipse," that\'s culture. That\'s community. No other platform has this.',
              ray: 'R9',
            },
          ].map((card) => {
            const color = rayHex(card.ray as Parameters<typeof rayHex>[0]);
            return (
              <div
                key={card.label}
                className="glass-card glass-card--lift card-border-top-accent card-surface-accent-soft p-5"
                style={{ '--card-accent': color } as { ['--card-accent']: string }}
              >
                <h3 className="text-base font-bold mb-2" style={{ color, textShadow: `0 0 12px ${color}40` }}>
                  {card.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  {card.body}
                </p>
              </div>
            );
          })}
        </StaggerChildren>
      </section>
      </FadeInSection>

      <RayDivider ray="R6" />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 10: TOOLS — "Go First" not "Play First"
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="tools" className="relative content-wrap py-10 sm:py-14">
        <div className="mb-8 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: "var(--gold-primary)" }}>◆</span> The Tools
          </span>
          <h2 className="heading-section mt-3" style={{ color: "var(--text-on-dark)" }}>
            WATCH ME · GO FIRST · BE THE LIGHT
          </h2>
          <p className="mx-auto mt-2 max-w-[620px] text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
            Three fast pathways to reprogram your brain in live moments.
          </p>
        </div>
        <StaggerChildren className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "WATCH ME",
              body: "Redirect attention fast when you feel noise, urgency, or emotional spin.",
              href: "/watch-me",
              accent: "var(--gold-primary)",
            },
            {
              title: "GO FIRST",
              body: "Break hesitation loops with one clean move that restores agency.",
              href: "/go-first",
              accent: "var(--neon-violet)",
            },
            {
              title: "BE THE LIGHT",
              body: "Hold your signal under pressure so your presence does not collapse.",
              href: "/be-the-light",
              accent: "var(--neon-blue)",
            },
          ].map((tool) => (
            <div
              key={tool.title}
              className="glass-card glass-card--lift card-border-left-accent-soft card-surface-accent-subtle p-5"
              style={{ "--card-accent": tool.accent } as { ["--card-accent"]: string }}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: tool.accent, textShadow: `0 0 10px ${tool.accent}` }}>
                {tool.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
                {tool.body}
              </p>
              <div className="mt-4">
                <Link href={tool.href} className="text-sm font-semibold" style={{ color: tool.accent }}>
                  Explore {tool.title} →
                </Link>
              </div>
            </div>
          ))}
        </StaggerChildren>
      </section>
      </FadeInSection>

      <RayDivider ray="R5" />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 11: SAMPLE REPORT — much more transparent preview
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="sample-report-teaser" className="relative content-wrap py-10 sm:py-14 overflow-hidden">
        <NeonStarField showConstellations />

        <div className="relative z-10 mb-8 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: 'var(--gold-primary)' }}>◆</span> Your Map Preview
          </span>
          <h2 className="heading-section mt-3" style={{ color: 'var(--text-on-dark)' }}>
            This is what your map looks like.
          </h2>
          <p className="mx-auto mt-2 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            9 Ray scores. Your Eclipse snapshot. Your Rise Path. Your Light Signature.
            Not a screenshot — a real, interactive report built from your answers.
          </p>
        </div>

        {/* Transparent report preview — visible content, not opaque blur */}
        <div className="relative z-10 content-wrap--narrow max-w-[680px]">
          <div className="glass-card relative rounded-2xl overflow-hidden">

            {/* Visible report content — light blur, mostly readable */}
            <div className="p-5 sm:p-6 space-y-4" style={{ filter: 'blur(1.5px)', opacity: 0.85, userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
              <RadarMockup className="flex flex-col items-center" />
              <div className="grid grid-cols-3 gap-2 mt-3">
                {['R1 Intention', 'R2 Joy', 'R3 Presence', 'R4 Power', 'R5 Purpose', 'R6 Authenticity'].map((ray, i) => {
                  const color = rayHex(cycleRay(i));
                  return (
                  <div key={ray} className="glass-card p-2.5 text-center">
                    <div className="h-2 rounded-full mb-1.5" style={{ background: color, width: `${55 + i * 7}%`, boxShadow: `0 0 8px ${color}` }} />
                    <p className="text-xs font-medium" style={{ color }}>{ray}</p>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Subtle overlay with CTA — not blocking the view */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-8 gap-4"
              style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)' }}
            >
              <NeonGlowButton href="/preview">
                See My Full Map
              </NeonGlowButton>
              <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--text-body) 45%, transparent)' }}>
                Free stability check — no credit card
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
            Not ready to take it?{' '}
            <Link href="/sample-report" className="font-semibold transition-colors hover:brightness-110" style={{ color: 'var(--gold-primary)' }}>
              View a sample report &rarr;
            </Link>
          </p>
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R8" />

      {/* ── NOT A LABEL MANIFESTO ── */}
      <FadeInSection>
      <section id="not-a-label" className="relative z-10 content-wrap py-10 sm:py-14">
        <NotALabelManifesto />
      </section>
      </FadeInSection>

      <RayDivider ray="R3" />

      {/* ── ECLIPSE IS NOT FAILURE ── */}
      <FadeInSection>
      <section className="relative z-10 content-wrap--narrow py-10 sm:py-14">
        <div className="glass-card glass-card--executive p-5 sm:p-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: rayHex('R3') }}>
            Eclipse Is Not Failure
          </p>
          <h2 className="heading-section text-gold-gradient">
            Other assessments call it a &ldquo;derailment risk.&rdquo; We call it what it is.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Hogan finds your weaknesses and calls them &ldquo;derailment risks.&rdquo; The Leadership Circle
            calls them &ldquo;reactive tendencies.&rdquo; We find what is covering your light and call it
            <span className="gold-highlight"> eclipse</span>. Not damage. Coverage. Not permanent. Temporary.
            Not who you are. What is happening to you right now.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
            A regulated nervous system sustains high standards. A shamed one collapses.
            We built for regulation, not shame. That is why the number is 143.
          </p>
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R7" />

      {/* ── COMPETITOR COMPARISON ── */}
      <FadeInSection>
      <section id="competitor-comparison" className="relative content-wrap py-10 sm:py-14">
        <FloatingOrbs variant="purple" />
        <div className="relative z-10">
          <CompetitorComparison />
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R8" />

      {/* ── WHAT THIS IS NOT ── */}
      <FadeInSection>
      <section id="what-this-is-not" className="content-wrap--narrow py-10 sm:py-14">
        <div className="mb-6 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: 'var(--gold-primary)' }}>◆</span> No Hype. No Shortcuts.
          </span>
          <h2 className="heading-section mt-3" style={{ color: 'var(--text-on-dark)' }}>
            What This Is Not
          </h2>
        </div>
        <StaggerChildren className="space-y-2">
          {WHAT_I_DONT_DO.map((item, i) => {
            const color = rayHex(cycleRay(i));
            return (
            <div
              key={item}
              className="glass-card glass-card--lift glass-card--magnetic card-border-left-accent-soft card-surface-accent-subtle flex items-start gap-3 p-3"
              style={{ '--card-accent': color } as { ['--card-accent']: string }}
            >
              <span className="shrink-0 text-sm font-bold" style={{ color }}>✕</span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>{item}</p>
            </div>
            );
          })}
        </StaggerChildren>
        <p className="mt-4 text-center text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          I map your pattern. I give you the next rep. I help you track progress so growth
          stays visible — <span className="gold-highlight">not hoped for, measured</span>.
        </p>
      </section>
      </FadeInSection>

      <RayDivider ray="R5" />

      {/* ── TESTIMONIALS ── */}
      <FadeInSection>
      <section id="testimonials" className="relative content-wrap--narrow py-10 sm:py-14">
        <div className="mb-6 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: 'var(--gold-primary)' }}>◆</span> What Leaders Say
          </span>
        </div>
        <StaggerChildren className="space-y-3">
          {TESTIMONIALS.map((t, i) => {
            const color = rayHex(cycleRay(i));
            return (
            <div
              key={t.attribution}
              className="glass-card glass-card--magnetic testimonial-card card-border-left-accent-soft card-surface-accent-subtle p-4 pl-5"
              style={{ '--card-accent': color } as { ['--card-accent']: string }}
            >
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-2 text-xs font-bold" style={{ color }}>
                — {t.attribution}
              </p>
            </div>
            );
          })}
        </StaggerChildren>

        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="metric-badge">
            <CountUp
              end={2400}
              suffix="+"
              className="tabular-nums text-2xl font-bold sm:text-3xl"
              style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-cosmic-display)' }}
            />
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--gold-primary) 60%, transparent)' }}>leaders assessed</p>
          </div>
          <div className="metric-badge">
            <span className="tabular-nums text-2xl font-bold sm:text-3xl" style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-cosmic-display)' }}>
              90<span className="text-lg">-day</span>
            </span>
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--gold-primary) 60%, transparent)' }}>measurable growth</p>
          </div>
          <div className="metric-badge">
            <CountUp
              end={9}
              className="tabular-nums text-2xl font-bold sm:text-3xl"
              style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-cosmic-display)' }}
            />
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--gold-primary) 60%, transparent)' }}>trainable capacities</p>
          </div>
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R9" />

      {/* ══════════════════════════════════════════════════════════════
          PRICING — $43 color fixed to gold with glow
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="pricing" className="relative content-wrap--narrow py-10 sm:py-14">
        <NeonStarField showConstellations />
        <div className="relative z-10 mb-8 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: 'var(--gold-primary)' }}>◆</span> Choose Your Path
          </span>
          <h2 className="heading-section mt-3" style={{ color: 'var(--text-on-dark)' }}>
            Start free. Go deeper when you&rsquo;re ready.
          </h2>
          <p className="mx-auto mt-2 max-w-[560px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            After the 143 Challenge, your toolkit includes: 9 Ray scores, Eclipse detection, Rise Path with daily tools, weekly retake access to track growth.
          </p>
        </div>
        <div className="relative z-10 grid gap-3 sm:grid-cols-2">
          {/* Free option */}
          <div className="glass-card glass-card--lift flex flex-col p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold-primary)', opacity: 0.7 }}>Free Preview</p>
            <p className="mt-2 text-3xl font-bold tabular-nums" style={{ color: 'var(--text-on-dark)', fontFamily: 'var(--font-cosmic-display)' }}>$0</p>
            <ul className="mt-3 flex-1 space-y-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: 'var(--gold-primary)', animationDelay: '0.1s' }}>◆</span> 3-minute stability check</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: 'var(--gold-primary)', animationDelay: '0.2s' }}>◆</span> Top 2 Ray preview</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: 'var(--gold-primary)', animationDelay: '0.3s' }}>◆</span> Eclipse indicator</li>
              <li className="flex items-start gap-2"><span style={{ color: 'color-mix(in srgb, var(--text-body) 20%, transparent)' }}>◇</span> <span style={{ opacity: 0.4 }}>Full 9-Ray report</span></li>
              <li className="flex items-start gap-2"><span style={{ color: 'color-mix(in srgb, var(--text-body) 20%, transparent)' }}>◇</span> <span style={{ opacity: 0.4 }}>Rise Path + daily tools</span></li>
            </ul>
            <LiquidFillButton href="/preview" className="mt-5 block text-center">
              Start Free
            </LiquidFillButton>
          </div>
          {/* Paid option — $43 in gold with glow */}
          <div className="glass-card glass-card--featured pricing-featured flex flex-col p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold-primary)' }}>
              ◆ Full Assessment
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums" style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-cosmic-display)', textShadow: '0 0 16px color-mix(in srgb, var(--gold-primary) 40%, transparent)' }}>$43</p>
            <ul className="mt-3 flex-1 space-y-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: 'var(--gold-primary)', animationDelay: '0.1s' }}>◆</span> 143 questions, 15 minutes</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: 'var(--gold-primary)', animationDelay: '0.2s' }}>◆</span> All 9 Ray scores</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: 'var(--gold-primary)', animationDelay: '0.3s' }}>◆</span> Your Light Signature</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: 'var(--gold-primary)', animationDelay: '0.4s' }}>◆</span> Eclipse Snapshot</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: 'var(--gold-primary)', animationDelay: '0.5s' }}>◆</span> Rise Path + daily tools</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: 'var(--gold-primary)', animationDelay: '0.6s' }}>◆</span> 90-day retake to track growth</li>
            </ul>
            <NeonFlicker>
              <NeonGlowButton href="/upgrade">
                Get the Full Map
              </NeonGlowButton>
            </NeonFlicker>
          </div>
        </div>
        <p className="relative z-10 mt-3 text-center text-xs" style={{ color: 'color-mix(in srgb, var(--gold-primary) 40%, transparent)' }}>
          Free during beta · Assessment price increases after launch
        </p>
      </section>
      </FadeInSection>

      <RayDivider ray="R2" />

      {/* ══════════════════════════════════════════════════════════════
          SCIENCE — improved, moved to bottom
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="science" className="relative z-10 content-wrap py-10 sm:py-14">
        <div className="mb-6 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: 'var(--gold-primary)' }}>◆</span> The Science
          </span>
          <h2 className="heading-section mt-3" style={{ color: 'var(--text-on-dark)' }}>
            BUILT ON NEUROSCIENCE. NOT INSPIRATION.
          </h2>
          <p className="mx-auto mt-2 max-w-[560px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Every tool, every rep, every score in the 143 system is grounded in published behavioural science research.
          </p>
        </div>
        <StaggerChildren className="grid gap-3 md:grid-cols-2">
          {[
            { name: "Dr. Jill Bolte Taylor", finding: "The 90-second chemical window — after that, you are re-triggering through thought, not chemistry.", color: rayHex('R3') },
            { name: "Dr. Albert Bandura", finding: "Micro-mastery reps that prove to your nervous system you can do the thing. Self-efficacy is built, not born.", color: rayHex('R4') },
            { name: "Dr. Rick Hanson", finding: "Repeated practice creates new neural pathways. Neuroplasticity is not a concept — it is a training method.", color: rayHex('R1') },
            { name: "Variable Repetition", finding: "Your brain stays engaged when reps vary. Habituation does not lock in. That is why 143 reps change format.", color: rayHex('R5') },
          ].map((item) => (
            <div
              key={item.name}
              className="glass-card glass-card--lift card-border-left-accent-soft card-surface-accent-subtle p-4"
              style={{ '--card-accent': item.color } as { ['--card-accent']: string }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: item.color }}>
                {item.name}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {item.finding}
              </p>
            </div>
          ))}
        </StaggerChildren>
      </section>
      </FadeInSection>

      {/* Gold rule separator */}
      <div className="content-wrap py-3">
        <hr className="gold-rule" />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          FINAL CTA
         ══════════════════════════════════════════════════════════════ */}
      <FadeInSection>
      <section id="final-cta" className="relative content-wrap--narrow py-10 sm:py-14">
        <div className="glass-card glass-card--hero relative z-10 p-6 sm:p-8 text-center">
          <h2 className="text-shimmer heading-section">
            Your light is still there.
          </h2>
          <p className="mx-auto mt-2 max-w-[520px] text-sm leading-relaxed italic" style={{ color: 'var(--text-on-dark-secondary)' }}>
            We upgrade your internal operating system so you can live just in a ray of light.
          </p>
          <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            <span className="gold-highlight">143 questions</span>. 15 minutes. A map that shows you where it went and how to get it back.
          </p>
          <div className="mt-5">
            <NeonGlowButton href="/preview">
              Check My Stability Free
            </NeonGlowButton>
          </div>
          <p className="mt-3 text-xs" style={{ color: 'color-mix(in srgb, var(--text-body) 35%, transparent)' }}>
            Free during beta · No credit card required
          </p>
          <p className="mt-2 text-sm text-gold-glow" style={{ fontFamily: 'var(--font-cosmic-display)', opacity: 0.7 }}>
            143 means I love you. That is where this starts.
          </p>
        </div>
      </section>
      </FadeInSection>
      <BackToTopButton />
    </main>
  );
}
