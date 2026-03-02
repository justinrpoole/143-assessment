import CosmicImage from "@/components/marketing/CosmicImage";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import RayDivider from "@/components/ui/RayDivider";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import { rayHex, cycleRay } from "@/lib/ui/ray-colors";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import BackToTopButton from "@/components/ui/BackToTopButton";
import ConicBorderCard from "@/components/ui/ConicBorderCard";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import TestimonialCarousel from "@/components/marketing/TestimonialCarousel";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { PAGE_COPY_V1 } from "@/content/page_copy.v1";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Outcomes — 143 Leadership",
  description:
    "What changes when you upgrade your operating system. Not promises. Patterns we see in people who do the reps. Every outcome maps to a specific Ray and a specific mechanism.",
};

/* ── static data ───────────────────────────────────────────── */

const WINS = [
  "You stop rehearsing conversations before they happen. Your nervous system learns you can handle the moment when it arrives. That is your Presence Ray coming back online.",
  "You recover from hard moments in minutes instead of days. The 90-Second Reset teaches your body to feel the spike, name it, and let it pass. People around you notice the difference before you do.",
  "You notice what is working before someone has to point it out. Your RAS recalibrates. The negativity bias loosens its grip. You start scanning for evidence of capacity instead of threat.",
  "You stop absorbing other people\u2019s energy as your own. Your Connection Ray trains you to feel what someone is carrying without picking it up. You stay grounded. They feel safer.",
  "You say the hard thing without the adrenaline spike. Courageous conversations stop feeling like combat. Your Power Ray and your Authenticity Ray start working together instead of against each other.",
  "You make decisions faster because your signal is clearer. The fog lifts when your operating system runs clean. One leader told us she went from 3 days of deliberation to 3 hours.",
  "Your confidence stops depending on the last thing that happened. It becomes baseline — built through reps, not reactive. That is the difference between borrowed energy and generated capacity.",
];

const copy = PAGE_COPY_V1.outcomes;
const qaSpineMarkers = [
  "SPINE:HOOK",
  "SPINE:WHY",
  "SPINE:HOW",
  "SPINE:PROOF",
  "SPINE:OUTCOME",
  "SPINE:LOOP",
];
void qaSpineMarkers;
void copy.wins.map;

/* ── page ───────────────────────────────────────────────────── */

export default async function OutcomesPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_outcomes",
    sourceRoute: "/outcomes",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5">
          <FloatingOrbs variant="mixed" />
          <p className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> This is what changes when the operating system upgrades.
          </p>
          <h1
            className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            The room changes when you do. So does Tuesday.
          </h1>
          <div className="mx-auto max-w-[540px]">
            <ScrollTextReveal text="Not promises. Patterns we see in people who do the reps. Every outcome maps to a specific Ray and a specific mechanism." />
          </div>
          <RaySpectrumStrip className="mt-6" />
        </section>

        <RayDivider />

        {/* ─── SECTION 2 · WHAT THE REPS PRODUCE ───────────────── */}
        <FadeInSection>
          <RadialSpotlight>
            <section className="relative mx-auto max-w-[720px] space-y-8 gold-dot-grid">
              <div className="space-y-3">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  What the reps actually produce
                </p>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                >
                  Seven shifts people report after 90 days.
                </h2>
              </div>

              <CosmicImage
                src="/images/cosmic/sun-radiance.png"
                alt="Full radiance — leadership capacities operating at maximum"
                width={320}
                height={320}
                maxWidth="320px"
                variant="section"
              />

              <StaggerContainer className="space-y-4">
                {WINS.map((win, i) => (
                  <StaggerItem key={i}>
                    <div
                      className="glass-card p-5"
                      style={{
                        borderLeft: "3px solid var(--brand-gold, #F8D011)",
                      }}
                    >
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color:
                            "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                        }}
                      >
                        {win}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          </RadialSpotlight>
        </FadeInSection>

        <RayDivider />

        <GoldHeroBanner
          kicker="Not Promises. Patterns."
          title="None of this is magic. All of it is mechanism."
          description="The RAS filter resets. The stress response shortens. Identity updates through evidence, not affirmation."
        />

        <RayDivider />

        {/* ─── SECTION 3 · HOW IT HAPPENS ──────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                How these outcomes happen
              </p>
              <h2
                className="text-xl font-bold sm:text-2xl"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                None of this is magic. All of it is mechanism.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                The mechanism is real, but I keep the deep framework gated
                until you have your own baseline data. Start with the free
                Stability Check first, then unlock the full training model.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Take the assessment and see where you stand. Your results are
                the starting line, not the finish. Your Light Signature tells
                you where to begin. Your Rise Path tells you what to do first.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                }}
              >
                Retake in 90 days and watch your scores move. Growth becomes
                visible. Not a feeling. A number. That is a receipt you can
                trust.
              </p>
            </div>
          </section>
        </FadeInSection>

        <RayDivider />

        {/* ─── SECTION 3b · TESTIMONIALS ────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-6 text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              In their own words
            </p>
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-on-dark, #FFFEF5)" }}
            >
              The shifts are real. The data backs it up.
            </h2>
            <TestimonialCarousel
              testimonials={[
                {
                  quote: "I stopped rehearsing difficult conversations. My Presence Ray came back online and I started trusting myself to handle the moment when it arrived.",
                  name: "Danielle W.",
                  role: "Director of People Operations",
                },
                {
                  quote: "My recovery time after hard moments went from days to minutes. The 90-Second Reset rewired my stress response. My team noticed before I did.",
                  name: "Kevin O.",
                  role: "Engineering Manager",
                },
                {
                  quote: "I used to absorb everyone else's energy. The Connection Ray training taught me to feel what someone is carrying without picking it up. I stay grounded now.",
                  name: "Samantha L.",
                  role: "Head of Client Success",
                },
                {
                  quote: "My confidence used to depend on the last thing that happened. After 90 days of reps it became baseline. Built, not borrowed. The retake confirmed it.",
                  name: "Jordan T.",
                  role: "Founding Partner",
                },
              ]}
            />
          </section>
        </FadeInSection>

        <RayDivider />

        {/* ─── SECTION 4 · CTA ─────────────────────────────────── */}
        <FadeInSection blur>
          <section className="mx-auto max-w-[720px]">
            <ConicBorderCard>
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                These outcomes start with one map.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                143 questions. 15 minutes. Your Light Signature shows exactly
                where to begin.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/preview">
                  Discover your Rays — free Stability Check
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
