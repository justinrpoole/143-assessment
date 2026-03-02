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
    "Three simple steps: free Stability Check, get your Ray map, then train what matters most.",
};

const STEPS = [
  {
    step: "Step 1",
    title: "Start with the free Stability Check",
    detail: "In a few minutes, you get a quick signal for where you are stable and where you are eclipsed.",
  },
  {
    step: "Step 2",
    title: "Unlock your full Ray map",
    detail: "Get the complete 143 Assessment with your Gravitational Stability Report and clear next moves.",
  },
  {
    step: "Step 3",
    title: "Practice and track your shift",
    detail: "Use short weekly reps and retakes to measure whether your leadership signal is rising.",
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
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <FloatingOrbs variant="mixed" />
          <p className="gold-tag mx-auto">◆ How It Works</p>
          <h1 className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            Three steps. Clear signal. Real movement.
          </h1>
          <p className="mx-auto text-base leading-relaxed max-w-[540px]" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>
            We keep it simple up front. If you want the full methodology and deeper coaching flow,
            start with your free Stability Check first.
          </p>
        </section>

        <FadeInSection>
          <section className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="glass-card p-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#F8D011" }}>{item.step}</p>
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>{item.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </section>
        </FadeInSection>

        <RayDivider />

        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#F8D011" }}>
                Want the deeper framework?
              </p>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
                Start your free Stability Check first.
              </h2>
              <p className="text-sm" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>
                We share the full training system after you have your baseline signal.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/preview">Start your free Stability Check</NeonGlowButton>
                <LiquidFillButton href="/pricing">See options</LiquidFillButton>
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Not ready? <Link href="/upgrade-your-os" style={{ color: "#F8D011" }}>Read the Eclipse/Nova story</Link>
              </p>
            </div>
          </section>
        </FadeInSection>
      </div>
      <BackToTopButton />
    </main>
  );
}
