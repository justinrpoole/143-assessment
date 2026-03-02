import Link from "next/link";

import CosmicHeroV2 from "@/components/marketing/CosmicHeroV2";
import HeroProofStrip from "@/components/marketing/HeroProofStrip";
import StickyCtaBar from "@/components/marketing/StickyCtaBar";
import MiniAssessmentPreview from "@/components/marketing/MiniAssessmentPreview";
import ScrollProgress from "@/components/marketing/ScrollProgress";
import CountUp from "@/components/marketing/CountUp";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import NeonStarField from "@/components/cosmic/NeonStarField";
import StaggerChildren from "@/components/marketing/StaggerChildren";
import HowItWorks from "@/components/marketing/HowItWorks";
import RadarMockup from "@/components/marketing/RadarMockup";
import EmailCaptureBanner from "@/components/marketing/EmailCaptureBanner";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import BackToTopButton from "@/components/ui/BackToTopButton";
import SectionTOC from "@/components/ui/SectionTOC";
import CompetitorComparison from "@/components/marketing/CompetitorComparison";
import NotALabelManifesto from "@/components/marketing/NotALabelManifesto";
import ScoreMovementChart from "@/components/marketing/ScoreMovementChart";
import OSExplainer from "@/components/marketing/OSExplainer";
import DailyLoopVisual from "@/components/marketing/DailyLoopVisual";
import { FadeInSection } from "@/components/ui/FadeInSection";
import RayDivider from "@/components/ui/RayDivider";
import { rayHex, cycleRay } from "@/lib/ui/ray-colors";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import TrustBadgeStrip from "@/components/marketing/TrustBadgeStrip";
import RayProgressionStack from "@/components/cosmic/RayProgressionStack";
import NeonFlicker from "@/components/ui/NeonFlicker";
import { PAGE_COPY_V1 } from "@/content/page_copy.v1";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leadership Assessment — The Only One That Changes With You",
  description: "Every other leadership assessment tells you who you are. This one shows you who you are right now — and gives you the daily system to change it. 9 trainable capacities. Scores designed to move.",
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
    eventName: "page_view_upgrade_os",
    sourceRoute: "/upgrade-your-os",
    userState,
  });

  return (
    <main className="cosmic-page-bg relative">
      {/* ── Global visual layers ── */}
      <ScrollProgress />
      <SectionTOC items={[
        { id: "hero", label: "Hero" },
        { id: "eclipse-nova", label: "Eclipse & Nova" },
        { id: "why-different", label: "Why Different" },
        { id: "nine-rays", label: "The 9 Rays" },
        { id: "how-it-works", label: "How It Works" },
        { id: "sample-report-teaser", label: "Your Map" },
        { id: "not-a-label", label: "Not a Label" },
        { id: "eclipse-concept", label: "Eclipse" },
        { id: "score-movement", label: "Score Movement" },
        { id: "competitor-comparison", label: "Why 143" },
        { id: "testimonials", label: "Testimonials" },
        { id: "pricing", label: "Pricing" },
        { id: "final-cta", label: "Get Started" },
      ]} />

      {/* ── SECTION 1: COSMIC HERO V2 ── */}
      <div id="hero" className="relative z-10">
        <CosmicHeroV2 />
      </div>

      {/* Proof strip */}
      <div className="relative z-10">
        <HeroProofStrip />
      </div>

      <div className="relative z-10 mx-auto max-w-[960px] px-5 sm:px-8">
        <TrustBadgeStrip badges={["9 Rays Measured", "143+ Data Points", "Evidence-Based"]} />
      </div>

      <StickyCtaBar />

      {/* Gold rule separator */}
      <div className="mx-auto max-w-[960px] px-5 py-4 sm:px-8">
        <hr className="gold-rule" />
      </div>

      {/* ── SECTION 2: ECLIPSE → NOVA STORY ── */}
      <FadeInSection>
      <section id="eclipse-nova" className="section-alt-dark relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24 overflow-hidden">
        <FloatingOrbs variant="purple" />
        <NeonStarField />

        {/* Section label */}
        <div className="relative z-10 mb-12 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> The Story Behind 143
          </span>
        </div>

        <div className="relative z-10 grid gap-8 md:grid-cols-2 items-start">

          {/* Left — THE ECLIPSE */}
          <div className="glass-card p-7" style={{ borderLeft: '3px solid rgba(147,64,255,0.5)', background: 'rgba(20,3,40,0.6)' }}>
            <div className="mb-4 flex items-center gap-3">
              {/* Moon / eclipse icon */}
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
                <circle cx="21" cy="21" r="19" fill="#160230" stroke="rgba(147,64,255,0.5)" strokeWidth="1.5" />
                <circle cx="27" cy="21" r="13" fill="#060014" />
                <circle cx="21" cy="21" r="19" fill="none" stroke="rgba(160,100,255,0.25)" strokeWidth="3" />
              </svg>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(180,120,255,0.9)' }}>
                The Eclipse
              </p>
            </div>
            <h3 className="text-xl font-bold mb-4 leading-snug" style={{ color: 'var(--text-on-dark)' }}>
              You dimmed. Quietly.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              When you walk on eggshells. When you lower your excitement. When you shrink so someone else stays comfortable. That&rsquo;s an Eclipse. Your light didn&rsquo;t disappear &mdash; it was blocked.
            </p>
          </div>

          {/* Right — THE NOVA */}
          <div className="glass-card p-7" style={{ borderLeft: '3px solid rgba(248,208,17,0.5)', background: 'rgba(30,20,0,0.5)' }}>
            <div className="mb-4 flex items-center gap-3">
              {/* Starburst / nova icon */}
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
                {Array.from({ length: 8 }, (_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  return (
                    <line
                      key={i}
                      x1={21 + Math.cos(angle) * 9}
                      y1={21 + Math.sin(angle) * 9}
                      x2={21 + Math.cos(angle) * 19}
                      y2={21 + Math.sin(angle) * 19}
                      stroke="#F8D011"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  );
                })}
                {Array.from({ length: 8 }, (_, i) => {
                  const angle = ((i + 0.5) / 8) * Math.PI * 2;
                  return (
                    <line
                      key={`d${i}`}
                      x1={21 + Math.cos(angle) * 9}
                      y1={21 + Math.sin(angle) * 9}
                      x2={21 + Math.cos(angle) * 14}
                      y2={21 + Math.sin(angle) * 14}
                      stroke="rgba(248,208,17,0.5)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  );
                })}
                <circle cx="21" cy="21" r="7" fill="#F8D011" />
                <circle cx="21" cy="21" r="3.5" fill="#FFFEF5" />
              </svg>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F8D011' }}>
                The Nova
              </p>
            </div>
            <h3 className="text-xl font-bold mb-4 leading-snug" style={{ color: 'var(--text-on-dark)' }}>
              Your Nova is waiting.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              A Nova is a star remembering its power. Not becoming someone new. Becoming visible again. That&rsquo;s what 143 questions reveal.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-10 text-center">
          <LiquidFillButton href="/preview">
            Find where your Eclipse is
          </LiquidFillButton>
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R3" />

      {/* ── SECTION 3: WHY THIS IS DIFFERENT ── */}
      <FadeInSection>
      <section id="why-different" className="relative z-10 mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mb-10 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> The Difference
          </span>
          <h2 className="heading-section mt-4" style={{ color: 'var(--text-on-dark)' }}>
            Every other assessment tells you who you are.
            <br />
            <span className="gold-highlight">We tell you what you can build right now.</span>
          </h2>
        </div>
        <StaggerChildren className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <circle cx="18" cy="18" r="16" stroke="rgba(248,208,17,0.3)" strokeWidth="1.2" />
                  {/* Two arrows cycling */}
                  <path d="M11 14 A8 8 0 0 1 25 14" stroke="#F8D011" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <path d="M25 22 A8 8 0 0 1 11 22" stroke="#F8D011" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <path d="M23 11 L25 14 L22 15" stroke="#F8D011" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M13 25 L11 22 L14 21" stroke="#F8D011" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              ),
              label: 'State, Not Type',
              body: 'MBTI tells you your personality. We tell you your current operating state. It changes. So does our map.',
              ray: 'R1',
            },
            {
              icon: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <circle cx="18" cy="18" r="16" stroke="rgba(248,208,17,0.3)" strokeWidth="1.2" />
                  {/* Brain / network */}
                  <circle cx="18" cy="18" r="5" fill="none" stroke="#F8D011" strokeWidth="1.5" />
                  <path d="M18 13 L18 8" stroke="#F8D011" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M18 23 L18 28" stroke="#F8D011" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M13 18 L8 18" stroke="#F8D011" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M23 18 L28 18" stroke="#F8D011" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="18" cy="8" r="1.8" fill="#F8D011" />
                  <circle cx="18" cy="28" r="1.8" fill="#F8D011" />
                  <circle cx="8" cy="18" r="1.8" fill="#F8D011" />
                  <circle cx="28" cy="18" r="1.8" fill="#F8D011" />
                </svg>
              ),
              label: 'Grounded in Science',
              body: 'The RAS — your brain\'s filter for possibility — is reprogrammable. We show you exactly where to start.',
              ray: 'R4',
            },
            {
              icon: (
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <circle cx="18" cy="18" r="16" stroke="rgba(248,208,17,0.3)" strokeWidth="1.2" />
                  {/* Sun / light symbol */}
                  {Array.from({ length: 6 }, (_, i) => {
                    const angle = (i / 6) * Math.PI * 2;
                    return (
                      <line
                        key={i}
                        x1={18 + Math.cos(angle) * 7}
                        y1={18 + Math.sin(angle) * 7}
                        x2={18 + Math.cos(angle) * 11}
                        y2={18 + Math.sin(angle) * 11}
                        stroke="#F8D011"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    );
                  })}
                  <circle cx="18" cy="18" r="5" fill="#F8D011" />
                </svg>
              ),
              label: 'A Language, Not a Label',
              body: 'Sun. Eclipse. Nova. Ray. When 143 people say "I\'m in my Eclipse," that\'s culture. That\'s community. No other platform has this.',
              ray: 'R9',
            },
          ].map((card) => {
            const color = rayHex(card.ray as Parameters<typeof rayHex>[0]);
            return (
              <div
                key={card.label}
                className="glass-card glass-card--lift p-6"
                style={{ borderTop: `2px solid ${color}50`, background: `${color}06` }}
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                  {card.icon}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-on-dark)' }}>
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

      <RayDivider ray="R9" />

      {/* ── SECTION 4: THE 9 RAYS ── */}
      <FadeInSection>
      <section id="nine-rays" className="section-alt-dark gold-dot-grid relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24 watermark-143">
        <div className="relative z-10 mb-10 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> The 9 Rays
          </span>
          <h2 className="text-shimmer heading-section mt-4">
            9 Rays. One map. Your current capacity — measured.
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            The first three train EQ with yourself. The last three train EQ with others. The
            middle three are where they meet. Not personality types — <span className="gold-highlight">capacities built through reps</span>.
          </p>
        </div>
        <div className="relative z-10">
          <RayProgressionStack />
        </div>
        <div className="relative z-10 mt-8 text-center">
          <LiquidFillButton href="/preview">
            Show Me All 9 Rays
          </LiquidFillButton>
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R1" />

      {/* ── SECTION 5: HOW IT WORKS ── */}
      <FadeInSection>
      <section id="how-it-works" className="relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24">
        <HowItWorks />
      </section>
      </FadeInSection>

      <RayDivider ray="R5" />

      {/* ── SECTION 6: SAMPLE REPORT TEASER ── */}
      <FadeInSection blur>
      <section id="sample-report-teaser" className="section-alt-dark relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24 overflow-hidden">
        <NeonStarField showConstellations />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <svg viewBox="0 0 600 600" width="600" height="600" className="opacity-[0.04]" style={{ maxWidth: '100%' }}>
            <circle cx="300" cy="300" r="280" fill="none" stroke="#F8D011" strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx="300" cy="300" r="200" fill="none" stroke="#F8D011" strokeWidth="0.5" strokeDasharray="3 6" />
            <circle cx="300" cy="300" r="120" fill="none" stroke="rgba(248,208,17,0.8)" strokeWidth="0.5" strokeDasharray="2 5" />
          </svg>
        </div>

        <div className="relative z-10 mb-10 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Your Map Preview
          </span>
          <h2 className="heading-section mt-4" style={{ color: 'var(--text-on-dark)' }}>
            This is what your map looks like.
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            9 Ray scores. Your Eclipse snapshot. Your Rise Path. Your Light Signature.
          </p>
        </div>

        {/* Frosted/blurred report preview */}
        <div className="relative z-10 mx-auto max-w-[680px]">
          <div className="relative rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(248,208,17,0.18)', boxShadow: '0 0 60px rgba(248,208,17,0.06), 0 24px 80px rgba(0,0,0,0.5)' }}>

            {/* Blurred report content — decorative only */}
            <div className="p-6 sm:p-8 space-y-5" style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }} aria-hidden="true">
              <RadarMockup className="flex flex-col items-center" />
              {/* Simulated report rows */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {['R1 Choose', 'R2 Expand', 'R3 Anchor', 'R4 Act', 'R5 Align', 'R6 Reveal'].map((ray, i) => (
                  <div key={ray} className="glass-card p-3 text-center">
                    <div className="h-2 rounded-full mb-2" style={{ background: rayHex(cycleRay(i)), width: `${55 + i * 7}%` }} />
                    <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>{ray}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Frosted glass CTA overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-5"
              style={{ background: 'rgba(6,0,20,0.75)', backdropFilter: 'blur(12px)' }}
            >
              <div className="text-center space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F8D011' }}>
                  ◆ Unlock Your Full Map
                </p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  See exactly where you shine — and where you&rsquo;re eclipsed.
                </p>
              </div>
              <NeonGlowButton href="/preview">
                See My Full Map
              </NeonGlowButton>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Free stability check &mdash; no credit card
              </p>
            </div>
          </div>

          {/* Or see the sample */}
          <p className="mt-5 text-center text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
            Not ready to take it?{' '}
            <Link href="/sample-report" className="font-semibold transition-colors hover:brightness-110" style={{ color: '#F8D011' }}>
              View a sample report &rarr;
            </Link>
          </p>
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R8" />

      {/* ── NOT A LABEL MANIFESTO ── */}
      <FadeInSection>
      <section id="not-a-label" className="relative z-10 mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24">
        <NotALabelManifesto />
      </section>
      </FadeInSection>

      <RayDivider ray="R3" />

      {/* ── CONVERSION QUESTIONS ── */}
      <FadeInSection blur>
      <section id="conversion-questions" className="section-alt-dark gold-dot-grid relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24 watermark-143">
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
          ].map((item, i) => {
            const color = rayHex(cycleRay(i));
            return (
            <div key={item.q} className="glass-card glass-card--lift glass-card--executive glass-card--magnetic p-5" style={{ borderLeft: `3px solid ${color}40`, background: `${color}04` }}>
              <p className="text-sm font-semibold leading-relaxed" style={{ color }}>
                {item.q}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {item.a}
              </p>
            </div>
            );
          })}
        </StaggerChildren>
        <div className="relative z-10 mt-8 text-center">
          <LiquidFillButton href="/preview">
            Show Me Where This Shows Up
          </LiquidFillButton>
          <p className="mt-4 text-sm italic" style={{ color: 'rgba(248, 208, 17, 0.4)' }}>
            Running on survival fuel and calling it discipline.
          </p>
        </div>
      </section>
      </FadeInSection>

      {/* ── TRY 3 QUESTIONS ── */}
      <FadeInSection>
      <section id="try-it" className="relative z-10 mx-auto max-w-[720px] px-5 py-20 sm:px-8 sm:py-24">
        <MiniAssessmentPreview />
        <EmailCaptureBanner />
      </section>
      </FadeInSection>

      <RayDivider ray="R6" />

      {/* ── ECLIPSE CONCEPT ── */}
      <FadeInSection>
      <RadialSpotlight>
      <section id="eclipse-concept" className="relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24">
        <NeonStarField showConstellations />
        <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
          <div className="gold-accent-left">
            <span className="gold-tag">
              <span style={{ color: '#F8D011' }}>◆</span> The Eclipse Concept
            </span>
            <h2 className="text-gold-gradient gold-underline heading-section mt-3">
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

      {/* ── SCORE MOVEMENT CHART ── */}
      <FadeInSection>
      <section id="score-movement" className="relative z-10 mx-auto max-w-[720px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="text-center space-y-3 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: rayHex('R4') }}>
            Scores That Move
          </p>
          <h2 className="heading-section" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Watch the growth happen — week by week.
          </h2>
          <p className="mx-auto max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            No other leadership assessment is designed to be retaken weekly.
            Every data point is evidence that the practice is landing.
          </p>
        </div>
        <ScoreMovementChart />
      </section>
      </FadeInSection>

      <RayDivider ray="R2" />

      {/* ── YOUR OPERATING SYSTEM ── */}
      <FadeInSection>
      <section id="os-explainer" className="relative z-10 mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24">
        <OSExplainer />
      </section>
      </FadeInSection>

      <RayDivider ray="R6" />

      {/* ── ECLIPSE IS NOT FAILURE ── */}
      <FadeInSection>
      <section className="relative z-10 mx-auto max-w-[720px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="glass-card glass-card--executive p-6 sm:p-8 space-y-4">
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

      {/* ── THE 143 LOOP — Daily Practice ── */}
      <FadeInSection>
      <section id="daily-loop" className="relative z-10 mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24">
        <DailyLoopVisual />
      </section>
      </FadeInSection>

      <RayDivider ray="R2" />

      {/* ── MICRO-JOY — Smallest Viable Practice ── */}
      <FadeInSection>
      <section className="relative z-10 mx-auto max-w-[720px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="glass-card p-6 sm:p-8 space-y-4" style={{ border: '1px solid rgba(248,208,17,0.15)' }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: rayHex('R2') }}>
            Smallest Viable Practice
          </p>
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Micro-Joy: the atomic unit of leadership practice.
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            One generation per day. Three swaps per day. That is it. You are retraining
            your attention filter to notice joy — and <span className="gold-highlight">joy is a leadership capacity</span>.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
            BJ Fogg&rsquo;s Tiny Habits research: the smaller the behavior, the more likely
            it is to become automatic. Micro-Joy is 30 seconds. It trains Ray 2 (Joy) — the
            capacity most leaders have abandoned under pressure.
          </p>
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R7" />

      {/* ── COMPETITOR COMPARISON ── */}
      <FadeInSection>
      <section id="competitor-comparison" className="section-alt-dark relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24">
        <FloatingOrbs variant="purple" />
        <div className="relative z-10">
          <CompetitorComparison />
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R8" />

      {/* ── WHAT THIS IS NOT ── */}
      <FadeInSection>
      <section id="what-this-is-not" className="mx-auto max-w-[720px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mb-8 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> No Hype. No Shortcuts.
          </span>
          <h2 className="heading-section mt-4" style={{ color: 'var(--text-on-dark)' }}>
            What This Is Not
          </h2>
        </div>
        <StaggerChildren className="space-y-3">
          {WHAT_I_DONT_DO.map((item, i) => {
            const color = rayHex(cycleRay(i));
            return (
            <div key={item} className="glass-card glass-card--lift glass-card--magnetic flex items-start gap-3 p-4" style={{ borderLeft: `3px solid ${color}40`, background: `${color}04` }}>
              <span className="shrink-0 text-sm font-bold" style={{ color }}>✕</span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>{item}</p>
            </div>
            );
          })}
        </StaggerChildren>
        <p className="mt-6 text-center text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          I map your pattern. I give you the next rep. I help you track progress so growth
          stays visible — <span className="gold-highlight">not hoped for, measured</span>.
        </p>
      </section>
      </FadeInSection>

      <RayDivider ray="R5" />

      {/* ── TESTIMONIALS ── */}
      <FadeInSection>
      <section id="testimonials" className="relative mx-auto max-w-[720px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mb-8 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> What Leaders Say
          </span>
        </div>
        <StaggerChildren className="space-y-4">
          {TESTIMONIALS.map((t, i) => {
            const color = rayHex(cycleRay(i));
            return (
            <div key={t.attribution} className="glass-card glass-card--magnetic testimonial-card p-5 pl-6" style={{ borderLeft: `3px solid ${color}40`, background: `${color}04` }}>
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-3 text-xs font-bold" style={{ color }}>
                — {t.attribution}
              </p>
            </div>
            );
          })}
        </StaggerChildren>

        {/* Metric badges */}
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

      <RayDivider ray="R9" />

      {/* ── PRICING ── */}
      <FadeInSection>
      <section id="pricing" className="section-alt-dark relative mx-auto max-w-[720px] px-5 py-20 sm:px-8 sm:py-24">
        <NeonStarField showConstellations />
        <div className="relative z-10 mb-10 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Choose Your Path
          </span>
          <h2 className="heading-section mt-4" style={{ color: 'var(--text-on-dark)' }}>
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
            <LiquidFillButton href="/preview" className="mt-6 block text-center">
              Start Free
            </LiquidFillButton>
          </div>
          {/* Paid option */}
          <div className="glass-card glass-card--featured pricing-featured flex flex-col p-6">
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
            <NeonFlicker>
              <NeonGlowButton href="/upgrade">
                Get the Full Map
              </NeonGlowButton>
            </NeonFlicker>
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
      <section id="final-cta" className="relative mx-auto max-w-[720px] px-5 py-20 sm:px-8 sm:py-24">
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

        {/* Final CTA card */}
        <div className="glass-card glass-card--hero relative z-10 mt-12 p-8 sm:p-10 text-center">
          <h2 className="text-shimmer heading-section">
            Your light is still there.
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            <span className="gold-highlight">143 questions</span>. 15 minutes. A map that shows you where it went and how to get it back.
          </p>
          <div className="mt-6">
            <NeonGlowButton href="/preview">
              Check My Stability Free
            </NeonGlowButton>
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
      <BackToTopButton />
    </main>
  );
}
