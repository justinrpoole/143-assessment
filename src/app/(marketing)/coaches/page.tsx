import Link from 'next/link';
import { FadeInSection } from '@/components/ui/FadeInSection';
import GoldDividerAnimated from '@/components/ui/GoldDividerAnimated';
import GoldHeroBanner from '@/components/ui/GoldHeroBanner';
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import SectionTOC from "@/components/ui/SectionTOC";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import BackToTopButton from "@/components/ui/BackToTopButton";
import ConicBorderCard from "@/components/ui/ConicBorderCard";
import StaggerChildren from '@/components/marketing/StaggerChildren';
import TestimonialCarousel from "@/components/marketing/TestimonialCarousel";
import { emitPageView } from '@/lib/analytics/emitter';
import { getUserStateFromRequest } from '@/lib/auth/user-state';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Light Activation Program — 143 Leadership',
  description: '10 weeks of structured coaching built on your Gravitational Stability Report. Your scores are designed to change. This program proves it.',
};

const PHASES = [
  {
    num: '01',
    title: 'Read Your Map',
    weeks: 'Weeks 1–3',
    description: 'Understand what your Light Signature means in your real life. Name where eclipse is covering capacity. Identify your Rise Path.',
  },
  {
    num: '02',
    title: 'Work Your Strengths',
    weeks: 'Weeks 4–6',
    description: 'Use your top Rays deliberately instead of on autopilot. Notice when one is carrying the load for another. Start logging reps.',
  },
  {
    num: '03',
    title: 'Address Your Eclipse',
    weeks: 'Weeks 7–9',
    description: 'Separate depletion from deficit. Practice one eclipsed capacity with small, specific daily reps. Build sustainable range.',
  },
  {
    num: '04',
    title: 'Integration',
    weeks: 'Week 10',
    description: 'Retake the assessment. Compare your results. See what moved, what held, and what you learned about how you lead.',
  },
];

export default async function CoachingPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: 'page_view_coach',
    sourceRoute: '/coaches',
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <SectionTOC items={[
        { id: "hero", label: "Hero" },
        { id: "leading-the-witness", label: "The Gap" },
        { id: "archetype-teaser", label: "Light Signature" },
        { id: "four-phases", label: "Four Phases" },
        { id: "different", label: "What Is Different" },
        { id: "what-you-need", label: "What You Need" },
        { id: "testimonials", label: "Testimonials" },
        { id: "cta", label: "Get Started" },
      ]} />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">
      {/* Hero */}
      <section id="hero" className="mx-auto max-w-[720px] space-y-5 text-center">
        <p className="gold-tag mx-auto">
          <span style={{ color: '#F8D011' }}>◆</span> 10-Week Light Activation Program · 7 min read
        </p>
        <h1 className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
          Your assessment gave you a map. This program teaches you to walk it.
        </h1>
        <div className="mx-auto max-w-[540px]">
          <ScrollTextReveal text="I see you reading the report, nodding, and then putting it in a drawer. Not because it was wrong. Because knowing is not the same as doing. This program closes that gap." />
        </div>
      </section>

      <GoldDividerAnimated />

      {/* Leading the Witness */}
      <FadeInSection>
        <section id="leading-the-witness" className="relative mx-auto max-w-[720px] px-5 pb-12 sm:px-8 section-blend-top">
          <div className="glass-card p-6 sm:p-8 space-y-5">
            <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--brand-gold)' }}>
              Have you ever learned something powerful at a workshop and lost it by Monday?
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              That is not your fault. Those programmes taught tactics without upgrading the system that runs them. This program upgrades the system first. Then every tactic lands.
            </p>
          </div>
        </section>
      </FadeInSection>

      {/* Archetype Teaser */}
      <FadeInSection>
        <section id="archetype-teaser" className="mx-auto max-w-[720px]">
          <div className="glass-card glass-card--lift p-6 sm:p-8">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
              The program adapts to how you lead
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              A Driven Leader needs a different protocol than a Deep Listener. A True North Leader trains different edges than a Community Builder. The coaching is matched to your <span className="gold-highlight">Light Signature</span> — not a generic curriculum.
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
              There are 36 Light Signatures. The assessment reveals yours. The program trains from it.
            </p>
          </div>
        </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* Four Phases */}
      <FadeInSection>
        <section id="four-phases" className="relative mx-auto max-w-[720px] space-y-8">
          <FloatingOrbs />
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--brand-gold)' }}>The Structure</p>
            <h2 className="text-3xl font-bold gold-underline" style={{ color: 'var(--text-on-dark)' }}>Four phases. One protocol.</h2>
            <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
              Each phase builds on the one before it. Each week has a specific focus, a matched tool, and a daily practice — all personalised to your <span className="gold-highlight">assessment results</span>.
            </p>
          </div>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHASES.map((phase) => (
              <div key={phase.num} className="glass-card glass-card--magnetic glass-card--lift p-6 space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold" style={{ color: 'var(--brand-gold)' }}>{phase.num}</span>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>{phase.title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>{phase.weeks}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  {phase.description}
                </p>
              </div>
            ))}
          </StaggerChildren>
        </section>
      </FadeInSection>

      <GoldHeroBanner
        kicker="Not Another Course"
        title="The protocol is the product. The proof is in the retake."
        description="You retake the assessment at the end and compare. No guessing whether it worked."
      />

      <GoldDividerAnimated />

      {/* What makes this different */}
      <FadeInSection>
        <section id="different" className="relative mx-auto max-w-[720px] watermark-143">
          <div className="glass-card p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--brand-gold)' }}>Not another course</p>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>What makes this different</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 check-animated" style={{ animationDelay: '0s' }}>
                <span className="shrink-0 font-bold" style={{ color: 'var(--brand-gold)' }}>&#x2715;</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>No generic curriculum. Every week is matched to your actual assessment data.</p>
              </div>
              <div className="flex items-start gap-3 check-animated" style={{ animationDelay: '0.1s' }}>
                <span className="shrink-0 font-bold" style={{ color: 'var(--brand-gold)' }}>&#x2715;</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>No guessing whether it worked. You retake the assessment at the end and compare.</p>
              </div>
              <div className="flex items-start gap-3 check-animated" style={{ animationDelay: '0.2s' }}>
                <span className="shrink-0 font-bold" style={{ color: 'var(--brand-gold)' }}>&#x2715;</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>No motivation speeches. Daily reps, specific tools, <span className="gold-highlight">measurable change</span>.</p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* What you need */}
      <FadeInSection>
        <section id="what-you-need" className="mx-auto max-w-[720px]">
          <div className="glass-card p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--brand-gold)' }}>Before you start</p>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>What you need</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-on-dark)' }}>Your completed assessment</p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  The program is built on your actual results. If you have not taken the assessment yet, start there.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-on-dark)' }}>15 minutes per day</p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  One practice, one rep log, one reflection. A protocol that fits inside your real day.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-on-dark)' }}>Honesty, not aspiration</p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  Show up where you actually are. Not where you wish you were. The data will follow.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* Testimonials */}
      <FadeInSection>
        <section id="testimonials" className="relative mx-auto max-w-[720px] space-y-6 text-center section-blend-bottom">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            From leaders who walked the program
          </p>
          <h2
            className="text-xl font-bold sm:text-2xl text-gold-gradient"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            The reps changed how I lead. The retake proved it.
          </h2>
          <TestimonialCarousel
            testimonials={[
              {
                quote: "By week three I stopped reading the report and started living it. The daily reps made the difference — small enough to do, specific enough to stick.",
                name: "Natalie F.",
                role: "Senior Director, Product",
              },
              {
                quote: "I have been through executive coaching before. This is the first time I had data showing my capacity actually moved. My Presence Ray went from eclipsed to top two in 10 weeks.",
                name: "Andre J.",
                role: "VP of Engineering",
              },
              {
                quote: "The program matched my Light Signature, not a generic curriculum. Every week felt like it was built for how I actually lead — because it was.",
                name: "Rachel H.",
                role: "Chief of Staff",
              },
              {
                quote: "Week 7 was the turning point. Addressing my eclipse without shame changed everything. I finally understood the difference between depletion and deficit.",
                name: "Michael C.",
                role: "Regional Operations Lead",
              },
            ]}
          />
        </section>
      </FadeInSection>

      <GoldDividerAnimated />

      {/* Pricing + CTA */}
      <FadeInSection>
        <section id="cta" className="mx-auto max-w-[720px]">
          <ConicBorderCard>
          <div className="glass-card glass-card--executive p-8 text-center space-y-5">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
              The protocol is the product. The proof is in the retake.
            </h2>
            <p className="max-w-lg mx-auto text-lg font-semibold" style={{ color: 'var(--brand-gold)', fontFamily: 'var(--font-cosmic-display)' }}>
              $143 per week for 10 weeks.
            </p>
            <p className="max-w-lg mx-auto text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
              $1,430 total. Your Gravitational Stability Report and Portal Membership are included for the full duration.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <NeonGlowButton href="/143">
                Start My 143 Challenge — Free
              </NeonGlowButton>
              <LiquidFillButton href="/preview">
                Check My Stability (3 Min)
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
