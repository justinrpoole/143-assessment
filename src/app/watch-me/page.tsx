import Link from "next/link";

import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInSection";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Watch Me — 143 Leadership",
  description:
    "You already know what to do. Your body will not let you start. Watch Me is the practice that moves you from frozen to forward. The assessment shows you why — and which capacity to train first.",
};

/* ── static data ───────────────────────────────────────────── */

const RECOGNITION_SIGNALS = [
  "You encourage everyone else to take the leap. When it is your turn, you stall.",
  "You wait until it feels right. It never feels right. So you wait some more.",
  "You call it overthinking. It is not overthinking. It is your system trying to feel safe before it moves.",
  "You have started the email six times. You have not sent it once.",
  "You know the conversation to have. You have rehearsed it in the shower for days. Your hand does not reach for the phone.",
];

const SIGNATURE_PATTERNS = [
  {
    signature: "A Strategic Optimist",
    pattern:
      "freezes because they see too many paths and cannot pick. Every option looks possible, so none gets started.",
  },
  {
    signature: "A Deep Listener",
    pattern:
      "freezes because they absorbed everyone else\u2019s weight and forgot their own. The body is tired from carrying what was never theirs.",
  },
  {
    signature: "A Driven Leader",
    pattern:
      "freezes because the one thing they cannot power through is uncertainty. And uncertainty is what Watch Me requires.",
  },
];

/* ── page ───────────────────────────────────────────────────── */

export default async function WatchMePage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_watch_me",
    sourceRoute: "/watch-me",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            The First Commitment
          </p>
          <h1
            className="text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Watch Me.
          </h1>
          <p
            className="text-lg leading-relaxed max-w-[560px]"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            I see you rehearsing the conversation in the shower for the third day
            in a row. You know what to say. Your body will not let you start.
          </p>
          <p
            className="text-sm leading-relaxed max-w-[560px]"
            style={{
              color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
            }}
          >
            That is not a flaw. That is your system protecting you from a risk it
            has not measured yet. Watch Me is two words that change the
            measurement.
          </p>
        </section>

        <GoldDivider />

        {/* ─── SECTION 2 · SELF-RECOGNITION ───────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-5">
              <p
                className="text-sm font-semibold leading-relaxed"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Have you ever been completely ready in your head and completely
                frozen in your body?
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Not confused. Not unprepared. Ready. And still stuck. You know the
                email to send. You know the boundary to set. You know the first
                step. But your hand does not move.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                That is not a discipline problem. That is one capacity carrying
                another. When one ray is eclipsed, the rays around it compensate.
                You still function. You just cannot start. The assessment names
                that specific pattern.
              </p>
            </div>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 3 · SOUND FAMILIAR ─────────────────────── */}
        <FadeInSection>
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
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 4 · WHY YOU FREEZE ─────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-8">
            <div className="space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Why This Happens
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                It is not fear. It is a capacity under load.
              </h2>
            </div>

            <div className="glass-card p-6 sm:p-8 space-y-4">
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                Leadership science calls it self-regulation depletion. Your
                system has a finite amount of initiation energy. When one
                capacity is eclipsed — carrying load it was not designed to carry
                alone — the freeze response is not cowardice. It is conservation.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                You do not need more courage. You need to know which capacity is
                carrying, which is covered, and which one to train first so the
                others come back online.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                }}
              >
                That is what the assessment maps. Not what is wrong with you.
                What is carrying — and what is covered.
              </p>
            </div>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 5 · SIGNATURE PATTERNS ─────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px] space-y-8">
            <div className="space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                This Shows Up Differently in Different Leaders
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Your freeze is not random. It follows your Light Signature.
              </h2>
            </div>

            <StaggerContainer className="space-y-4">
              {SIGNATURE_PATTERNS.map((item) => (
                <StaggerItem key={item.signature}>
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
              There are 36 Light Signatures. Each one has a Watch Me pattern.
              The assessment reveals yours — and gives you the specific rep to
              start moving this week.
            </p>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 6 · CTA ────────────────────────────────── */}
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
                Watch Me is not a moment. It is a practice.
              </h2>
              <p
                className="mx-auto max-w-[480px] text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                The assessment shows you why you freeze, which capacity to train
                first, and the specific rep to start this week. Not motivation. A
                map.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/assessment" className="btn-primary">
                  Take the Assessment
                </Link>
                <Link href="/preview" className="btn-watch">
                  Try the Free Stability Check
                </Link>
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
    </main>
  );
}

/* ── utility ───────────────────────────────────────────────── */

function GoldDivider() {
  return (
    <div className="mx-auto max-w-[200px]">
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--brand-gold), transparent)",
        }}
      />
    </div>
  );
}
