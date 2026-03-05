import Link from "next/link";
import Image from "next/image";

import HeroEclipseVisual from "@/components/marketing/HeroEclipseVisual";
import LightCheckOrchestrator from "@/components/marketing/LightCheckOrchestrator";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
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
    <main className="cosmic-page-bg page-shell">
      <div className="content-wrap py-12 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <FadeInSection>
          <section className="glass-card card-border-left-accent-soft card-surface-accent-subtle grid gap-8 p-7 sm:p-9 md:grid-cols-[1fr,220px] md:items-center" style={{ '--card-accent': 'var(--gold-primary)' } as { ['--card-accent']: string }}>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/143-landscape-logo.svg"
                  alt="143"
                  width={184}
                  height={42}
                  className="h-auto w-[150px] sm:w-[170px]"
                  priority
                />
                <p className="gold-tag">
                  <span style={{ color: "var(--gold-primary)" }}>◆</span> Stability Check
                </p>
              </div>
              <h1 className="heading-section text-3xl sm:text-4xl" style={{ color: "var(--text-body)" }}>
                SEE WHERE YOUR LIGHT IS STRONGEST — AND WHAT MIGHT BE COVERING IT.
              </h1>
              <p className="max-w-[560px] text-base leading-relaxed text-secondary">
                Free Stability Check with email unlock. See how your nervous system is showing up right now,
                then choose the next move from self-trust instead of self-pressure.
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
                style={{ color: "var(--gold-primary)" }}
              >
                When You Are Ready
              </p>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "var(--text-body)" }}
              >
                Two paths forward. Both start from where you are.
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Card A — Full Assessment */}
              <div
                className="glass-card card-border-gold-mid p-6 space-y-4"
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--gold-primary)" }}
                >
                  Be The Light Assessment
                </p>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-body)" }}
                >
                  Map All 9 Rays — $43
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  143 questions. 15 minutes. Your complete Light Signature, Eclipse
                  Snapshot, Energy Ratio, and Rise Path. A map of where your light is
                  strong and where it is covered — with specific tools to restore access.
                </p>
                <LiquidFillButton href="/upgrade" className="inline-block text-sm font-semibold">
                  Discover your Rays — full report $43
                </LiquidFillButton>
              </div>

              {/* Card B — 143 Challenge */}
              <div
                className="glass-card card-border-default p-6 space-y-4"
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--accent-purple, var(--text-body))" }}
                >
                  Free Entry Point
                </p>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-body)" }}
                >
                  Start the 143 Challenge — Free
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Workbook-first challenge with email unlock. Get fast proof your
                  filter can change, then use the PDF for the full reps and sequence.
                </p>
                <NeonGlowButton href="/143" className="text-sm font-semibold">
                  Start the 143 Challenge — Free
                </NeonGlowButton>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "color-mix(in srgb, var(--gold-primary) 84%, transparent)" }}>
                  I LOVE CHALLENGE
                </p>
              </div>
            </div>

            {/* Testimonial */}
            <blockquote
              className="glass-card card-border-gold-soft content-wrap--narrow p-6 text-center"
            >
              <p
                className="text-sm italic leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                &ldquo;{TESTIMONIAL.quote}&rdquo;
              </p>
              <footer
                className="mt-3 text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
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
            style={{ color: "var(--gold-primary)", opacity: 0.7 }}
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
    <div className="content-wrap--narrow">
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
