import Link from "next/link";

import { FadeInSection } from "@/components/ui/FadeInSection";
import RayDivider from "@/components/ui/RayDivider";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BackToTopButton from "@/components/ui/BackToTopButton";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Be The Light Framework — Teaser",
  description:
    "A short teaser of the 143 framework. Discover your Rays with the free Stability Check to unlock the full system.",
};

export default async function FrameworkPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_how_it_works",
    sourceRoute: "/framework",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[920px] px-5 py-12 sm:px-8 sm:py-16 space-y-14">
        <section className="mx-auto max-w-[720px] text-center space-y-4">
          <p className="gold-tag mx-auto">◆ Framework (Teaser)</p>
          <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            Nine Rays. One leadership signal.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>
            The framework maps where your signal is strong and where it is eclipsed. We keep the full methodology gated
            so your learning starts from your real baseline, not theory.
          </p>
        </section>

        <RayDivider />

        <FadeInSection>
          <section className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Reconnect", body: "Stabilize your internal signal first." },
              { title: "Expand", body: "Turn insight into visible leadership action." },
              { title: "Become", body: "Build trust, clarity, and influence with others." },
            ].map((item) => (
              <div key={item.title} className="glass-card p-5">
                <h2 className="text-lg font-semibold" style={{ color: "#F8D011" }}>{item.title}</h2>
                <p className="text-sm mt-2" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>{item.body}</p>
              </div>
            ))}
          </section>
        </FadeInSection>

        <RayDivider ray="R9" />

        <FadeInSection>
          <section className="glass-card p-8 text-center space-y-4 max-w-[720px] mx-auto">
            <p className="text-xs uppercase tracking-widest font-bold" style={{ color: "#F8D011" }}>
              Discover your Rays
            </p>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
              Start your free Stability Check.
            </h2>
            <p className="text-sm" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>
              Get your baseline first. Then unlock the deeper methodology and training path.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <NeonGlowButton href="/preview">Discover your Rays — free Stability Check</NeonGlowButton>
              <LiquidFillButton href="/pricing">See full options</LiquidFillButton>
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Prefer context first? <Link href="/upgrade-your-os" style={{ color: "#F8D011" }}>Read the Eclipse/Nova story</Link>
            </p>
          </section>
        </FadeInSection>
      </div>
      <BackToTopButton />
    </main>
  );
}
