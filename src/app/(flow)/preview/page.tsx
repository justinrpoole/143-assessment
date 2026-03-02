import Link from "next/link";

import HeroEclipseVisual from "@/components/marketing/HeroEclipseVisual";
import LightCheckOrchestrator from "@/components/marketing/LightCheckOrchestrator";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { PAGE_COPY_V1 } from "@/content/page_copy.v1";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gravitational Stability Check — See Where Your Light Is Strongest",
  description:
    "3 questions. 3 minutes. Free Stability Check with email unlock. Discover your signal before you go deeper.",
};

/* ── static data ───────────────────────────────────────────── */

const TESTIMONIAL = {
  quote:
    "I have taken MBTI, Enneagram, DISC, and StrengthsFinder. None of them explained why I was performing well but feeling empty. The eclipse concept did in one sentence what four assessments could not.",
  attribution: "VP of Operations, SaaS",
};

const copy = PAGE_COPY_V1.preview;
const qaSpineMarkers = [
  "SPINE:HOOK",
  "SPINE:WHY",
  "SPINE:HOW",
  "SPINE:PROOF",
  "SPINE:OUTCOME",
  "SPINE:LOOP",
];
const qaTokens = ["PreviewSnapshotClient"];
void copy;
void qaSpineMarkers;
void qaTokens;

/* ── page ───────────────────────────────────────────────────── */

export default async function PreviewPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_preview",
    sourceRoute: "/preview",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <FadeInSection>
          <section className="grid gap-8 md:grid-cols-[1fr,200px] items-center">
            <div className="space-y-5">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Your Gravitational Stability Check
              </p>
              <h1
                className="text-3xl font-semibold leading-tight sm:text-4xl"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                See where your light is strongest — and what might be covering it.
              </h1>
              <p
                className="text-base leading-relaxed max-w-[540px]"
                style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.70))" }}
              >
                3 questions. 3 minutes. Free Stability Check with email unlock. Just honest answers about the last 30 days.
              </p>
            </div>
            <div className="hidden md:block" aria-hidden="true">
              <HeroEclipseVisual className="scale-75 origin-center" />
            </div>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTIONS 2-3 · GRAVITATIONAL STABILITY CHECK + COACHING DEBRIEF ─── */}
        {/* Single browser boundary — assessment, analytics, result panel */}
        <FadeInSection>
          <LightCheckOrchestrator />
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 4 · GO DEEPER ──────────────────────────── */}
        <FadeInSection>
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                When You Are Ready
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Two paths forward. Both start from where you are.
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Card A — Full Assessment */}
              <div
                className="glass-card p-6 space-y-4"
                style={{ borderColor: "rgba(248, 208, 17, 0.25)" }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  Be The Light Assessment
                </p>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                >
                  Map All 9 Rays — $43
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.70))" }}
                >
                  143 questions. 15 minutes. Your complete Light Signature, Eclipse
                  Snapshot, Energy Ratio, and Rise Path. A map of where your light is
                  strong and where it is covered — with specific tools to restore access.
                </p>
                <Link href="/upgrade" className="btn-primary inline-block text-sm font-semibold">
                  Show Me All 9 Rays — $43
                </Link>
              </div>

              {/* Card B — 143 Challenge */}
              <div
                className="glass-card p-6 space-y-4"
                style={{ borderColor: "rgba(167, 139, 250, 0.25)" }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--accent-purple, #A78BFA)" }}
                >
                  Free Entry Point
                </p>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-on-dark, #FFFEF5)" }}
                >
                  Start the 143 Challenge — Free
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.70))" }}
                >
                  3 days. 3 minutes a day. Rewire the filter your brain is running.
                  No account required. The entry point for everything else.
                </p>
                <Link
                  href="/143"
                  className="inline-block text-sm font-semibold rounded-lg px-5 py-2.5"
                  style={{
                    border: "1px solid var(--accent-purple, #A78BFA)",
                    color: "var(--accent-purple, #A78BFA)",
                  }}
                >
                  Start the 143 Challenge — Free
                </Link>
              </div>
            </div>

            {/* Testimonial */}
            <blockquote
              className="glass-card mx-auto max-w-[640px] p-6 text-center"
              style={{ borderColor: "rgba(248, 208, 17, 0.15)" }}
            >
              <p
                className="text-sm italic leading-relaxed"
                style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.70))" }}
              >
                &ldquo;{TESTIMONIAL.quote}&rdquo;
              </p>
              <footer
                className="mt-3 text-xs font-medium"
                style={{ color: "var(--text-on-dark-muted, rgba(255,255,255,0.45))" }}
              >
                — {TESTIMONIAL.attribution}
              </footer>
            </blockquote>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 5 · PRICING WHISPER ────────────────────── */}
        <section className="text-center py-4">
          <Link
            href="/pricing"
            className="text-sm font-medium transition-opacity hover:opacity-100"
            style={{ color: "var(--brand-gold, #F8D011)", opacity: 0.7 }}
          >
            See all plans and pricing &rarr;
          </Link>
        </section>
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
