import Image from "next/image";
import Link from "next/link";

import CosmicImage from "@/components/marketing/CosmicImage";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BackToTopButton from "@/components/ui/BackToTopButton";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Be The Light — 143 Leadership",
  description:
    "You want your life to mean something. Not look good. Mean something. Be The Light is what happens when you practice that message inward long enough that it shows up outward. The assessment shows what is covering your light — and what to restore first.",
};

/* ── static data ───────────────────────────────────────────── */

const RECOGNITION_SIGNALS = [
  "You feel the weight of the room. You always have.",
  "You notice what people need before they say it. And you give it before you check whether you have it to give.",
  "You want your life to mean something. Not look good. Mean something.",
  "You crushed the presentation. You came home empty. Nobody asked how you were doing.",
  "You chose the team over yourself, again, because you did not want to be the one who could not carry it.",
];

const SIGNATURE_PATTERNS = [
  {
    signature: "A Relational Light",
    pattern:
      "leads by making every person in the room feel seen. The cost is invisible — they absorb so much that their own signal fades.",
  },
  {
    signature: "A Calm Center",
    pattern:
      "leads by staying steady when everyone else is spinning. The cost is that no one checks on them — because they never look like they need it.",
  },
  {
    signature: "A Servant Leader",
    pattern:
      "leads by building something that outlasts them. The cost is that the structure gets fed while the person building it does not.",
  },
];

const ECLIPSE_SIGNS = [
  {
    label: "Energy Borrowing",
    description:
      "You are giving from reserves you have not replenished. The output looks the same. The internal cost is climbing.",
  },
  {
    label: "The \"I Miss Me\" Signal",
    description:
      "You catch yourself thinking: I used to be different. That is not nostalgia. That is your system telling you a capacity has gone offline.",
  },
  {
    label: "Performing Steadiness",
    description:
      "You are calm for the room, not for yourself. The role is running. The person inside is tired.",
  },
];

/* ── page ───────────────────────────────────────────────────── */

export default async function BeTheLightPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_be_the_light",
    sourceRoute: "/be-the-light",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="relative mx-auto max-w-[720px] space-y-5">
          <div
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl"
            aria-hidden="true"
          >
            <Image
              src="/images/cosmic/sunrise-landscape.png"
              alt=""
              fill
              className="object-cover opacity-[0.15]"
              sizes="720px"
              style={{
                maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
              }}
            />
          </div>
          <CosmicImage
            src="/images/logo-justin-ray-transparent.png"
            alt="Justin Ray"
            width={48}
            height={48}
            maxWidth="48px"
            variant="decorative"
          />
          <p className="gold-tag">
            <span style={{ color: '#F8D011' }}>◆</span> The Third Commitment
          </p>
          <h1
            className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Be The Light.
          </h1>
          <p
            className="text-lg leading-relaxed max-w-[560px]"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            I see you holding the room together while nobody holds you. You walk
            in and people feel steadier. You walk out and wonder who notices.
          </p>
          <p
            className="text-sm leading-relaxed max-w-[560px]"
            style={{
              color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
            }}
          >
            They notice. And the question is not whether your light is there. It
            is whether you are accessing it or borrowing against it.
          </p>
        </section>

        <GoldDividerAnimated />

        {/* ─── SECTION 2 · SELF-RECOGNITION ───────────────────── */}
        <FadeInSection blur>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-5">
              <p
                className="text-sm font-semibold leading-relaxed"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Have you ever crushed the presentation and come home empty?
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Performed confidence in a room where no one checks on you afterward.
                Chose the team over yourself, again. Felt the weight shift onto you
                and said nothing because you did not want to be the one who
                could not carry it.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                That is not selflessness. That is one ray carrying the load while
                another is eclipsed. And it will not hold forever. The assessment
                names the exact pattern — which ray is carrying, which is covered,
                and what to restore first.
              </p>
            </div>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 3 · SOUND FAMILIAR ─────────────────────── */}
        <FadeInSection>
          <RadialSpotlight>
            <section className="mx-auto max-w-[720px]">
              <div className="glass-card p-6 sm:p-8">
                <p
                  className="mb-5 text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  Sound Familiar?
                </p>
                <StaggerContainer className="space-y-3">
                  {RECOGNITION_SIGNALS.map((signal) => (
                    <StaggerItem key={signal}>
                      <div
                        className="flex items-start gap-3 text-sm leading-relaxed"
                        style={{
                          color:
                            "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                        }}
                      >
                        <span
                          className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: "var(--brand-gold)" }}
                        />
                        {signal}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </section>
          </RadialSpotlight>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 4 · THE ECLIPSE COST ───────────────────── */}
        <FadeInSection>
          <section className="relative mx-auto max-w-[720px] space-y-8 gold-dot-grid">
            <div className="space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                The Cost of Borrowed Energy
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Your light is not gone. It is running on reserves you have not
                replenished.
              </h2>
            </div>

            <StaggerContainer className="space-y-4">
              {ECLIPSE_SIGNS.map((item) => (
                <StaggerItem key={item.label}>
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
                      {item.label}
                    </p>
                    <p
                      className="mt-1 text-sm leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                      }}
                    >
                      {item.description}
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
              None of this means you are failing. It means your system is
              compensating. The assessment makes the compensation visible — so
              you can stop borrowing and start restoring.
            </p>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        <GoldHeroBanner
          kicker="Not Broken. Covered."
          title="Your light is not gone. It is running on reserves you have not replenished."
          description="The assessment names the exact pattern — which ray is carrying, which is covered, and what to restore first."
        />

        <GoldDividerAnimated />

        {/* ─── SECTION 5 · SIGNATURE PATTERNS ─────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-8">
            <div className="space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Your Light Shows Up in a Specific Pattern
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Each Light Signature has a cost when it runs on borrowed energy.
              </h2>
            </div>

            <StaggerContainer className="space-y-4">
              {SIGNATURE_PATTERNS.map((item) => (
                <StaggerItem key={item.signature}>
                  <div className="glass-card p-5 space-y-1">
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color:
                          "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                      }}
                    >
                      <strong
                        style={{ color: "var(--brand-gold, #F8D011)" }}
                      >
                        {item.signature}
                      </strong>{" "}
                      {item.pattern}
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
              There are 36 Light Signatures. The assessment shows you which one
              you are running, what it is costing you, and what to restore first.
            </p>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 6 · THE MEANING ────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Why 143
              </p>
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                143 means I love you. One letter. Four letters. Three letters.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Be The Light is not a slogan. It is what happens when you
                practice that message inward long enough that it shows up outward.
                Your light is nine trainable capacities. Your eclipse is temporary
                coverage, not permanent damage. The assessment maps both — and gives
                you the first rep to restore access.
              </p>
            </div>
          </section>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ─── SECTION 7 · CTA ────────────────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                The Practice
              </p>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Your light is still there. The assessment shows you what is
                covering it.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Not a personality label. A map of 9 trainable capacities. Where you
                are strong, where you are eclipsed, and the first rep to restore
                access.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/assessment">
                  Take the Assessment
                </NeonGlowButton>
                <LiquidFillButton href="/preview">
                  Try the Free Stability Check
                </LiquidFillButton>
              </div>
              <p
                className="text-xs"
                style={{
                  color:
                    "var(--text-on-dark-muted, rgba(255,255,255,0.45))",
                }}
              >
                143 questions. 15 minutes. Your map shows what is carrying and
                what is covered.
              </p>
            </div>
          </section>
        </FadeInSection>
      </div>
      <BackToTopButton />
    </main>
  );
}
