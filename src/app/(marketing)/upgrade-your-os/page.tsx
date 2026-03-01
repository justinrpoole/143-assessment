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
import GoldTooltip from "@/components/ui/GoldTooltip";
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
import { NEON, neonText } from "@/lib/ui/neon";

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
        { id: "not-a-label", label: "Not a Label" },
        { id: "conversion-questions", label: "The Questions" },
        { id: "try-it", label: "Try 3 Questions" },
        { id: "os-explainer", label: "Your OS" },
        { id: "how-it-works", label: "How It Works" },
        { id: "product-preview", label: "Your Results" },
        { id: "score-movement", label: "Score Movement" },
        { id: "eclipse-concept", label: "Eclipse" },
        { id: "nine-rays", label: "The 9 Rays" },
        { id: "competitor-comparison", label: "Why 143" },
        { id: "what-this-is-not", label: "What This Is Not" },
        { id: "testimonials", label: "Testimonials" },
        { id: "pricing", label: "Pricing" },
        { id: "final-cta", label: "Get Started" },
      ]} />

      {/* ── COSMIC HERO V2 — Sun/Moon eclipse animation + Supernova celebration ── */}
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

      {/* ── NOT A LABEL MANIFESTO (#2) ── */}
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

      <RayDivider ray="R1" />

      {/* ── YOUR OPERATING SYSTEM (#6) ── */}
      <FadeInSection>
      <section id="os-explainer" className="relative z-10 mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24">
        <OSExplainer />
      </section>
      </FadeInSection>

      <RayDivider ray="R8" />

      {/* ── HOW IT WORKS — 3-step walkthrough ── */}
      <FadeInSection>
      <section id="how-it-works" className="relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24">
        <HowItWorks />
      </section>
      </FadeInSection>

      {/* ── PRODUCT PREVIEW — radar chart mockup ── */}
      <FadeInSection>
      <section id="product-preview" className="section-alt-dark relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24 overflow-hidden">
        {/* ── Astrology / Star Chart background decoration ── */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <svg viewBox="0 0 600 600" width="600" height="600" className="opacity-[0.06]" style={{ maxWidth: '100%' }}>
            <circle cx="300" cy="300" r="280" fill="none" stroke="#F8D011" strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx="300" cy="300" r="220" fill="none" stroke="#F8D011" strokeWidth="0.5" strokeDasharray="3 6" />
            <circle cx="300" cy="300" r="160" fill="none" stroke="rgba(248,208,17,0.8)" strokeWidth="0.5" strokeDasharray="2 5" />
            <circle cx="300" cy="300" r="100" fill="none" stroke="rgba(248,208,17,0.6)" strokeWidth="0.5" strokeDasharray="2 4" />
            <circle cx="300" cy="300" r="50" fill="none" stroke="rgba(248,208,17,0.4)" strokeWidth="0.5" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line key={deg} x1="300" y1="300" x2={300 + 280 * Math.cos((deg - 90) * Math.PI / 180)} y2={300 + 280 * Math.sin((deg - 90) * Math.PI / 180)} stroke="#F8D011" strokeWidth="0.3" opacity="0.5" />
            ))}
            {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
              const rad = (deg - 90) * Math.PI / 180;
              return (<line key={`tick-${deg}`} x1={300 + 270 * Math.cos(rad)} y1={300 + 270 * Math.sin(rad)} x2={300 + 280 * Math.cos(rad)} y2={300 + 280 * Math.sin(rad)} stroke="#F8D011" strokeWidth="0.5" opacity="0.6" />);
            })}
            {[[300,20],[300,80],[300,140],[300,580],[300,520],[300,460],[20,300],[80,300],[140,300],[580,300],[520,300],[460,300],[85,85],[515,85],[85,515],[515,515],[160,160],[440,160],[160,440],[440,440],[200,100],[400,100],[100,200],[500,200],[200,500],[400,500],[100,400],[500,400]].map(([cx2,cy2], i) => (
              <circle key={`star-${i}`} cx={cx2} cy={cy2} r={i % 3 === 0 ? 2.5 : 1.5} fill="#F8D011" opacity={0.5 + (i % 3) * 0.2} />
            ))}
            <polyline points="85,85 160,160 200,100 300,20 400,100 440,160 515,85" fill="none" stroke="#F8D011" strokeWidth="0.4" opacity="0.4" />
            <polyline points="85,515 160,440 200,500 300,580 400,500 440,440 515,515" fill="none" stroke="#F8D011" strokeWidth="0.4" opacity="0.4" />
            <polyline points="85,85 100,200 20,300 100,400 85,515" fill="none" stroke="#F8D011" strokeWidth="0.4" opacity="0.3" />
            <polyline points="515,85 500,200 580,300 500,400 515,515" fill="none" stroke="#F8D011" strokeWidth="0.4" opacity="0.3" />
          </svg>
        </div>

        <div className="relative z-10 text-center space-y-6">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Your Results
          </span>
          <h2 className="gold-underline heading-section mx-auto mt-3" style={{ color: 'var(--text-on-dark)' }}>
            A map, not a label
          </h2>
          <p className="mx-auto max-w-[560px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Your <span className="gold-highlight"><GoldTooltip tip="Your unique combination of top two Rays — the pattern your leadership defaults to.">Light Signature</GoldTooltip></span> is a radar chart of <span style={{ color: '#F8D011' }}>9 rays of light</span> — showing where you shine, where stress is blocking you, and exactly what to train this week.
          </p>

          <RadarMockup className="flex flex-col items-center" />

          <ul className="mx-auto max-w-[480px] space-y-3 text-sm text-left">
            <li className="flex items-start gap-2">
              <span style={{ color: '#F8D011', textShadow: '0 0 8px rgba(248,208,17,0.4)' }}>◆</span>
              <span style={{ color: 'var(--text-on-dark-secondary)' }}>
                <span style={{ color: rayHex('R9') }}>9 Ray scores</span> with <span style={{ color: rayHex('R1') }}>Shine</span>/<span style={{ color: rayHex('R3') }}>Eclipse</span> breakdown
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: rayHex('R3'), textShadow: `0 0 8px ${rayHex('R3')}66` }}>◆</span>
              <span style={{ color: 'var(--text-on-dark-secondary)' }}>
                <GoldTooltip tip="When stress covers your strongest capacities and your leadership light dims."><span style={{ color: rayHex('R3') }}>Eclipse</span></GoldTooltip> detection — which <span style={{ color: rayHex('R4') }}>strength</span> is compensating
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: rayHex('R6'), textShadow: `0 0 8px ${rayHex('R6')}66` }}>◆</span>
              <span style={{ color: 'var(--text-on-dark-secondary)' }}>
                <GoldTooltip tip="Your personalized development sequence based on current capacity gaps."><span style={{ color: rayHex('R6') }}>Rise Path</span></GoldTooltip> with daily tools for your specific pattern
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: rayHex('R7'), textShadow: `0 0 8px ${rayHex('R7')}66` }}>◆</span>
              <span style={{ color: 'var(--text-on-dark-secondary)' }}>
                Your <span style={{ color: rayHex('R7') }}>Light Signature</span> — the pattern your leadership defaults to
              </span>
            </li>
          </ul>

          <div className="mt-6">
            <NeonGlowButton href="/preview">
              See My Light Signature
            </NeonGlowButton>
          </div>
        </div>
      </section>
      </FadeInSection>

      <RayDivider ray="R5" />

      {/* ── SCORE MOVEMENT CHART (#4) ── */}
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

      <RayDivider ray="R4" />

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

      <RayDivider ray="R3" />

      {/* ── 9 RAYS — vertical progression with sun ── */}
      <FadeInSection>
      <section id="nine-rays" className="section-alt-dark gold-dot-grid relative mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24 watermark-143">
        <div className="relative z-10 mb-10 text-center">
          <span className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> The 9 Rays
          </span>
          <h2 className="text-shimmer heading-section mt-4">
            9 dimensions. Each one trainable.
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

      {/* ── ECLIPSE IS NOT FAILURE (#14) ── */}
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

      <RayDivider ray="R6" />

      {/* ── THE 143 LOOP — Daily Practice (#9, #16) ── */}
      <FadeInSection>
      <section id="daily-loop" className="relative z-10 mx-auto max-w-[960px] px-5 py-20 sm:px-8 sm:py-24">
        <DailyLoopVisual />
      </section>
      </FadeInSection>

      <RayDivider ray="R2" />

      {/* ── MICRO-JOY — Smallest Viable Practice (#12) ── */}
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

      {/* ── COMPETITOR COMPARISON (#1) ── */}
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

      {/* ── TESTIMONIALS — gold stripe accent ── */}
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

      <RayDivider ray="R9" />

      {/* ── PRICING — gold-bordered featured card ── */}
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
          {/* Paid option — gold border featured */}
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
