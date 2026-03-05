import Link from "next/link";

import { FadeInSection } from "@/components/ui/FadeInSection";
import RayDivider from "@/components/ui/RayDivider";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BackToTopButton from "@/components/ui/BackToTopButton";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "How It Works — 143 Leadership",
  description:
    "143 means I love you. Start with a signal check, then use the workbook and tools to train self-love under pressure.",
};

const STEPS = [
  {
    step: "Signal",
    title: "Start with the free Stability Check",
    detail: "Get a quick read on where your light is online and where eclipse pressure is active.",
  },
  {
    step: "Map",
    title: "See your live pattern",
    detail: "Use the map to spot the exact pattern you are running right now without guessing.",
  },
  {
    step: "Reps",
    title: "Train with the workbook + tools",
    detail: "Use the I Love Challenge workbook and core tools to practice self-love and track your shift.",
  },
];

export default async function HowItWorksPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_how_it_works",
    sourceRoute: "/how-it-works",
    userState,
  });

  return (
    <main className="cosmic-page-bg page-shell">
      <ScrollProgressBar />
      <div className="content-wrap px-5 py-12 sm:px-8 sm:py-16 space-y-16">
        <section className="content-wrap--narrow space-y-5 text-center">
          <FloatingOrbs variant="mixed" />
          <p className="gold-tag mx-auto">◆ How It Works</p>
          <h1 className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl" style={{ color: "var(--text-body)" }}>
            Clear signal. Real movement.
          </h1>
          <p className="mx-auto text-base leading-relaxed max-w-[540px]" style={{ color: "var(--text-secondary)" }}>
            143 means I love you. We keep the page simple: get your signal, then use the workbook for full reps and sequence.
          </p>
        </section>

        <FadeInSection>
          <section className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="glass-card p-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold-primary)" }}>{item.step}</p>
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-body)" }}>{item.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </section>
        </FadeInSection>

        <RayDivider />

        <FadeInSection>
          <section className="content-wrap--narrow">
            <div className="glass-card p-8 text-center space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold-primary)" }}>
                The I Love Challenge
              </p>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-body)" }}>
                Start The 143 Challenge.
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                We keep instructions in the workbook so this page stays clean and outcome-focused.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/challenge">Start The 143 Challenge</NeonGlowButton>
                <LiquidFillButton href="/preview">Check My Stability</LiquidFillButton>
              </div>
              <p className="text-xs" style={{ color: "color-mix(in srgb, var(--text-body) 40%, transparent)" }}>
                Not ready? <Link href="/upgrade-your-os" style={{ color: "var(--gold-primary)" }}>Read the I Love challenge story</Link>
              </p>
            </div>
          </section>
        </FadeInSection>
      </div>
      <BackToTopButton />
    </main>
  );
}
