import Link from "next/link";

import EclipseHero from "@/components/marketing/EclipseHero";
import HeroProofStrip from "@/components/marketing/HeroProofStrip";
import HeroVideoThumb from "@/components/marketing/HeroVideoThumb";
import StickyCtaBar from "@/components/marketing/StickyCtaBar";
import MiniAssessmentPreview from "@/components/marketing/MiniAssessmentPreview";
import StarfieldBackground from "@/components/marketing/StarfieldBackground";
import ScrollProgress from "@/components/marketing/ScrollProgress";
import CountUp from "@/components/marketing/CountUp";
import MagneticButton from "@/components/marketing/MagneticButton";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import StaggerChildren from "@/components/marketing/StaggerChildren";
import HowItWorks from "@/components/marketing/HowItWorks";
import RadarMockup from "@/components/marketing/RadarMockup";
import EmailCaptureBanner from "@/components/marketing/EmailCaptureBanner";
import { FadeInSection } from "@/components/ui/FadeInSection";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { rayRamp } from "@/lib/ui/ray-colors";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leadership Assessment — Map 9 Trainable Capacities",
  description: "Find out why you're performing well but feeling empty. A 15-minute assessment that maps 9 trainable leadership capacities and shows you what to do this week.",
};

/* ── static data ───────────────────────────────────────────────── */
const NINE_RAYS = [
  { id: "R1", name: "Ray of Intention",    essence: "You wake up and already know your one thing. Your calendar is a decision, not a reaction." },
  { id: "R2", name: "Ray of Joy",          essence: "Your energy does not come from pressure. It comes from something deeper. You create it on purpose." },
  { id: "R3", name: "Ray of Presence",     essence: "Your body is settled. Not numb — regulated. The space between what happens and what you do is yours." },
  { id: "R4", name: "Ray of Power",        essence: "You move before you feel ready — and you trust yourself after. Confidence is not loud. It is consistent." },
  { id: "R5", name: "Ray of Purpose",      essence: "Your calendar matches your values. The gap between what you say matters and where you spend time is closing." },
  { id: "R6", name: "Ray of Authenticity", essence: "You are the same person in every room. No performance. No code-switching your soul." },
  { id: "R7", name: "Ray of Connection",   essence: "People feel safe enough to be honest around you. Your stability is a leadership multiplier." },
  { id: "R8", name: "Ray of Possibility",  essence: "You see options where other people see walls. Your brain scans for openings because you trained it to." },
  { id: "R9", name: "Be The Light",        essence: "Your presence lowers the noise in a room. You hold steady. And somehow that is enough." },
];

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

/* ── page ───────────────────────────────────────────────────────── */
export default async function UpgradeYourOsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_upgrade_os",
    sourceRoute: "/upgrade-your-os",
    userState,
  });

  return (
    <main className="cosmic-page-bg relative">
      {/* ── Global visual layers ── */}
      <StarfieldBackground />
      <ScrollProgress />

      {/* ── ECLIPSE HERO — Single brand moment (sun/moon + 143 with Justin Ray) ── */}
      <div className="relative z-10">
        <EclipseHero className="mx-auto max-w-[960px] px-5 pt-6 sm:px-8 sm:pt-12" />
      </div>

      {/* ── HERO TEXT ── */}
      <section className="relative z-10 mx-auto max-w-[960px] px-5 pb-12 sm:px-8 sm:pb-16">
        <div>
          {/* Social proof pill with gold border */}
          <div className="proof-pill mb-6 inline-flex cursor-default items-center gap-2 rounded-full px-4 py-1.5"
            style={{ background: 'rgba(248, 208, 17, 0.04)', border: '1px solid rgba(248, 208, 17, 0.2)' }}
          >
            <CountUp
              end={2400}
              suffix="+"
              className="tabular-nums text-xs font-bold"
              style={{ color: '#F8D011' }}
            />
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              leaders assessed
            </span>
            <span className="text-xs" style={{ color: '#F8D011' }}>
              ★★★★★
            </span>
          </div>

          <span className="gold-tag mb-4 block w-fit">
            <span style={{ color: '#F8D011' }}>◆</span> Leadership Assessment
          </span>

          {/* Hero H1 */}
          <h1 className="text-shimmer mt-4 max-w-[720px] text-3xl font-bold leading-tight sm:text-4xl lg:text-[44px]">
            Find out why you&rsquo;re performing well but feeling empty.
          </h1>
          <p className="mt-4 max-w-[560px] text-base leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            A 15-minute assessment that maps <span className="gold-highlight">9 trainable leadership capacities</span> — and shows you what to do this week.
          </p>
          {/* CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <MagneticButton href="/preview" className="btn-primary">
              Take the Free Assessment
            </MagneticButton>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Free during beta · No credit card
            </span>
          </div>
          <HeroVideoThumb />
        </div>
      </section>

      {/* Proof strip */}
      <div className="relative z-10">
        <HeroProofStrip />
      </div>

      <StickyCtaBar />

      {/* Gold rule separator */}
      <div className="mx-auto max-w-[960px] px-5 py-4 sm:px-8">
        <hr className="gold-rule" />
      </div>

      {/* ── CONVERSION QUESTIONS ── */}
      <FadeInSection>
      <section className="section-alt-dark gold-dot-grid relative mx-auto max-w-[960px] px-5 py-16 sm:px-8 watermark-143">
        <FloatingOrbs variant="purple" />
        <StaggerChildren className="relative z-10 grid gap-5 md:grid-cols-3">
          {[
            {
              q: "Have you ever learned something powerful and lost it by Monday?",
              a: "That is not your fault. Those programmes taught tactics without upgrading the system that runs them.",
            },
            {
              q: "Have you ever delivered in every meeting and still come home empty?",
              a: "That is not a discipline problem. That is one capacity carrying another. The assessment names that pattern.",
            },
            {
              q: "When was the last time someone asked how you were and you told the truth?",
              a: "If you had to think about it, that is the eclipse talking. It does not always look like falling apart.",
            },
          ].map((item) => (
            <div key={item.q} className="glass-card glass-card--lift glass-card--executive p-5">
              <p className="text-sm font-semibold leading-relaxed" style={{ color: '#F8D011' }}>
                {item.q}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {item.a}
              </p>
            </div>
          ))}
        </StaggerChildren>
        <div className="relative z-10 mt-8 text-center">
          <MagneticButton href="/preview" className="btn-secondary">
            See where this shows up in your results
          </MagneticButton>
          <p className="mt-4 text-sm italic" style={{ color: 'rgba(248, 208, 17, 0.4)' }}>
            Running on survival fuel and calling it discipline.
          </p>
        </div>
      </section>
      </FadeInSection>

      {/* ── TRY 3 QUESTIONS ── */}
      <FadeInSection>
      <section className="relative z-10 mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <MiniAssessmentPreview />
        <EmailCaptureBanner />
      </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── HOW IT WORKS — 3-step walkthrough ── */}
      <FadeInSection>
      <section className="relative mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <HowItWorks />
      </section>
      </FadeInSection>

      {/* ── PRODUCT PREVIEW — radar chart mockup ── */}
      <FadeInSection>
      <section className="section-alt-dark gold-dot-grid relative mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
          <div className="gold-accent-left">
            <span className="gold-tag">
              <span style={{ color: '#F8D011' }}>◆</span> Your Results
            </span>
            <h2 className="gold-underline mt-3 text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
              A map, not a label
            </h2>
            <p className="mt-6 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Your <span className="gold-highlight">Light Signature</span> is a radar chart of 9 capacities — showing where you shine, where stress is covering you, and exactly what to train this week.
            </p>
            <ul className="mt-4 space-y-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li className="flex items-start gap-2">
                <span className="text-gold-glow">◆</span> 9 Ray scores with Shine/Eclipse breakdown
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-glow">◆</span> Eclipse detection — which strength is compensating
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-glow">◆</span> Rise Path with daily tools for your specific pattern
              </li>
            </ul>
            <div className="mt-6">
              <MagneticButton href="/preview" className="btn-primary">
                See My Light Signature
              </MagneticButton>
            </div>
          </div>
          <RadarMockup className="flex flex-col items-center" />
        </div>
      </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── ECLIPSE CONCEPT ── */}
      <FadeInSection>
      <section className="relative mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <FloatingOrbs variant="gold" />
        <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
          <div className="gold-accent-left">
            <span className="gold-tag">
              <span style={{ color: '#F8D011' }}>◆</span> The Eclipse Concept
            </span>
            <h2 className="text-gold-gradient gold-underline mt-3 text-2xl font-bold leading-tight">
              Your light is not gone. It is covered.
            </h2>
            <p className="mt-6 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              When stress stays elevated too long, your strongest capacity starts carrying
              your weakest. You deliver at work and <span className="gold-highlight">come home empty</span>. That is not failure.
              That is biology. The assessment names that exact pattern.
            </p>
          </div>
          <StaggerChildren className="grid gap-4" staggerMs={200}>
            {/* Eclipsed day */}
            <div className="glass-card glass-card--lift p-5" style={{ borderLeft: '3px solid rgba(248,208,17,0.25)' }}>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#F8D011', opacity: 0.5 }}>
                ◇ Eclipsed Monday
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                7am: alarm goes off, already dreading the 9am. You run the meeting well. Nobody
                knows the cost. By 3pm your creativity is gone. By 6pm you are running on fumes
                and calling it discipline.
              </p>
            </div>
            {/* Light-online day */}
            <div className="glass-card glass-card--lift p-5" style={{ borderLeft: '3px solid #F8D011' }}>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#F8D011' }}>
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
            <div className="mt-4 text-center">
              <MagneticButton href="/preview" className="btn-primary">
                Find Out Which One I&rsquo;m Running
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── 9 RAYS — staggered cards with color ramps ── */}
      <FadeInSection>
      <section className="section-alt-dark gold-dot-grid relative mx-auto max-w-[960px] px-5 py-16 sm:px-8 watermark-143">
        <div className="relative z-10 mb-10 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> The 9 Rays
          </span>
          <h2 className="text-shimmer mt-4 text-2xl font-bold sm:text-3xl">
            9 dimensions. Each one trainable.
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            The first three train EQ with yourself. The last three train EQ with others. The
            middle three are where they meet. Not personality types — <span className="gold-highlight">capacities built through reps</span>.
          </p>
        </div>
        <StaggerChildren className="relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" staggerMs={80}>
          {NINE_RAYS.map((ray) => {
            const ramp = rayRamp(ray.id);
            return (
              <div
                key={ray.id}
                className="glass-card glass-card--lift p-4"
                style={{
                  borderLeft: `3px solid ${ramp.hoverBorder}`,
                  background: ramp.bgTint,
                }}
              >
                <p className="text-sm font-bold" style={{ color: ramp.full }}>
                  <span style={{ color: '#F8D011', marginRight: '6px', fontSize: '8px', verticalAlign: 'middle' }}>◆</span>
                  {ray.name}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>{ray.essence}</p>
              </div>
            );
          })}
        </StaggerChildren>
        <div className="relative z-10 mt-8 text-center">
          <MagneticButton href="/preview" className="btn-secondary">
            Which ray leads for you? Find out in 15 minutes.
          </MagneticButton>
        </div>
      </section>
      </FadeInSection>

      {/* Gold rule separator */}
      <div className="mx-auto max-w-[960px] px-5 py-4 sm:px-8">
        <hr className="gold-rule" />
      </div>

      {/* ── WHAT THIS IS NOT ── */}
      <FadeInSection>
      <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <div className="mb-8 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> No Hype. No Shortcuts.
          </span>
          <h2 className="mt-4 text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
            What This Is Not
          </h2>
        </div>
        <StaggerChildren className="space-y-3">
          {WHAT_I_DONT_DO.map((item) => (
            <div key={item} className="glass-card glass-card--lift flex items-start gap-3 p-4">
              <span className="shrink-0 text-sm font-bold" style={{ color: '#F8D011' }}>✕</span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>{item}</p>
            </div>
          ))}
        </StaggerChildren>
        <p className="mt-6 text-center text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          I map your pattern. I give you the next rep. I help you track progress so growth
          stays visible — <span className="gold-highlight">not hoped for, measured</span>.
        </p>
      </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── TESTIMONIALS — gold stripe accent ── */}
      <FadeInSection>
      <section className="relative mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <div className="mb-8 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> What Leaders Say
          </span>
        </div>
        <StaggerChildren className="space-y-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.attribution} className="glass-card testimonial-card testimonial-gold-stripe p-5 pl-6">
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-3 text-xs font-bold" style={{ color: '#F8D011' }}>
                — {t.attribution}
              </p>
            </div>
          ))}
        </StaggerChildren>

        {/* Metric badges with executive styling */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="metric-badge">
            <CountUp
              end={2400}
              suffix="+"
              className="tabular-nums text-2xl font-bold sm:text-3xl"
              style={{ color: '#F8D011', fontFamily: 'var(--font-cosmic-display)' }}
            />
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'rgba(248, 208, 17, 0.6)' }}>leaders assessed</p>
          </div>
          <div className="metric-badge">
            <span className="tabular-nums text-2xl font-bold sm:text-3xl" style={{ color: '#F8D011', fontFamily: 'var(--font-cosmic-display)' }}>
              90<span className="text-lg">-day</span>
            </span>
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'rgba(248, 208, 17, 0.6)' }}>measurable growth</p>
          </div>
          <div className="metric-badge">
            <CountUp
              end={9}
              className="tabular-nums text-2xl font-bold sm:text-3xl"
              style={{ color: '#F8D011', fontFamily: 'var(--font-cosmic-display)' }}
            />
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'rgba(248, 208, 17, 0.6)' }}>trainable capacities</p>
          </div>
        </div>
      </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* ── PRICING — gold-bordered featured card ── */}
      <FadeInSection>
      <section className="section-alt-dark relative mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <FloatingOrbs variant="mixed" />
        <div className="relative z-10 mb-10 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Choose Your Path
          </span>
          <h2 className="mt-4 text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
            Start free. Go deeper when you&rsquo;re ready.
          </h2>
        </div>
        <div className="relative z-10 grid gap-4 sm:grid-cols-2">
          {/* Free option */}
          <div className="glass-card glass-card--lift flex flex-col p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#F8D011', opacity: 0.7 }}>Free Preview</p>
            <p className="mt-2 text-3xl font-bold tabular-nums" style={{ color: 'var(--text-on-dark)', fontFamily: 'var(--font-cosmic-display)' }}>$0</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: '#F8D011', animationDelay: '0.1s' }}>◆</span> 3-minute stability check</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: '#F8D011', animationDelay: '0.2s' }}>◆</span> Top 2 Ray preview</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: '#F8D011', animationDelay: '0.3s' }}>◆</span> Eclipse indicator</li>
              <li className="flex items-start gap-2"><span style={{ color: 'rgba(255,255,255,0.2)' }}>◇</span> <span style={{ opacity: 0.4 }}>Full 9-Ray report</span></li>
              <li className="flex items-start gap-2"><span style={{ color: 'rgba(255,255,255,0.2)' }}>◇</span> <span style={{ opacity: 0.4 }}>Rise Path + daily tools</span></li>
            </ul>
            <MagneticButton href="/preview" className="btn-watch mt-6 block text-center">
              Start Free
            </MagneticButton>
          </div>
          {/* Paid option — gold border featured */}
          <div className="glass-card glass-card--lift pricing-featured flex flex-col p-6"
            style={{ border: '1.5px solid #F8D011' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#F8D011' }}>
              ◆ Full Assessment
            </p>
            <p className="text-gold-gradient mt-2 text-3xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-cosmic-display)' }}>$43</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: '#F8D011', animationDelay: '0.1s' }}>◆</span> 143 questions, 15 minutes</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: '#F8D011', animationDelay: '0.2s' }}>◆</span> All 9 Ray scores</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: '#F8D011', animationDelay: '0.3s' }}>◆</span> Your Light Signature</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: '#F8D011', animationDelay: '0.4s' }}>◆</span> Eclipse Snapshot</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: '#F8D011', animationDelay: '0.5s' }}>◆</span> Rise Path + daily tools</li>
              <li className="flex items-start gap-2"><span className="check-animated" style={{ color: '#F8D011', animationDelay: '0.6s' }}>◆</span> 90-day retake to track growth</li>
            </ul>
            <MagneticButton href="/upgrade" className="btn-primary mt-6 block text-center">
              Get the Full Map
            </MagneticButton>
          </div>
        </div>
        <p className="relative z-10 mt-4 text-center text-xs" style={{ color: 'rgba(248, 208, 17, 0.4)' }}>
          Free during beta · Assessment price increases after launch
        </p>
      </section>
      </FadeInSection>

      {/* Gold rule separator */}
      <div className="mx-auto max-w-[960px] px-5 py-4 sm:px-8">
        <hr className="gold-rule" />
      </div>

      {/* ── ABOUT JUSTIN + FINAL CTA ── */}
      <FadeInSection>
      <section className="relative mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <FloatingOrbs variant="gold" />
        <div className="relative z-10 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Built By
          </span>
          <h2 className="text-gold-gradient mt-4 text-xl font-bold">
            Justin Ray
          </h2>
          <p className="mx-auto mt-1 text-xs font-medium uppercase tracking-widest" style={{ color: '#F8D011', opacity: 0.6 }}>
            Educator · Coach · System Builder
          </p>

          {/* Gold decorative line */}
          <div className="mx-auto my-4 h-px w-24" style={{ background: 'linear-gradient(to right, transparent, #F8D011, transparent)' }} />

          <p className="mx-auto max-w-[520px] text-sm italic leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            &ldquo;I spent years watching leadership programs teach information that never
            landed — smart people learning powerful ideas that disappeared by Monday.
            So I built a different system. One that <span className="gold-highlight">measures capacity</span> instead of labeling
            personality. One that trains through <span className="gold-highlight">daily reps</span> instead of one-time workshops.
            One that <span className="gold-highlight">proves growth</span> is happening instead of hoping it is.&rdquo;
          </p>
          <p className="mx-auto mt-3 max-w-[520px] text-xs" style={{ color: 'rgba(248, 208, 17, 0.5)' }}>
            <CountUp end={2400} suffix="+" className="tabular-nums" style={{ color: 'rgba(248, 208, 17, 0.5)' }} /> leaders assessed · Grounded in behavioural science
          </p>
          <Link href="/about" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold transition-all hover:brightness-110 hover:gap-2" style={{ color: '#F8D011' }}>
            Read the full story <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Final CTA — gold accent card */}
        <div className="glass-card glass-card--executive relative z-10 mt-12 p-8 text-center"
          style={{ borderTopColor: '#F8D011' }}
        >
          <h2 className="text-shimmer text-2xl font-bold sm:text-3xl">
            Your light is still there.
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            <span className="gold-highlight">143 questions</span>. 15 minutes. A map that shows you where it went and how to get it back.
          </p>
          <div className="mt-6">
            <MagneticButton href="/preview" className="btn-primary">
              Take the Free Assessment
            </MagneticButton>
          </div>
          <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Free during beta · No credit card required
          </p>
          <p className="mt-3 text-sm text-gold-glow" style={{ fontFamily: 'var(--font-cosmic-display)', opacity: 0.7 }}>
            143 means I love you. That is where this starts.
          </p>
        </div>
      </section>
      </FadeInSection>
    </main>
  );
}
