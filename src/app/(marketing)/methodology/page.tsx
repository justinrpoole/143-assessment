import Link from "next/link";

import { FadeInSection } from "@/components/ui/FadeInSection";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import BackToTopButton from "@/components/ui/BackToTopButton";
import RayDivider from "@/components/ui/RayDivider";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Methodology — Teaser",
  description:
    "A short look at the assessment science. Start your free Stability Check to unlock full framework depth.",
};

export default async function MethodologyPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_methodology",
    sourceRoute: "/methodology",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[880px] px-5 py-12 sm:px-8 sm:py-16 space-y-14">
        <section className="text-center space-y-4 max-w-[720px] mx-auto">
          <p className="gold-tag mx-auto">◆ Methodology (Teaser)</p>
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            The system is evidence-based. The full mechanics are gated.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>
            I do not teach the full operating model cold on a webpage. You start with your own baseline first,
            then I show you the exact framework that fits your signal.
          </p>
        </section>

        <FadeInSection>
          <section className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Measure", body: "Run the Stability Check and establish signal before strategy." },
              { title: "Map", body: "Identify where your light is online and where it is eclipsed." },
              { title: "Train", body: "Use reps to retrain your operating system in the real world." },
            ].map((card) => (
              <div key={card.title} className="glass-card p-5">
                <h2 className="text-lg font-semibold" style={{ color: "#F8D011" }}>{card.title}</h2>
                <p className="text-sm mt-2" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>{card.body}</p>
              </div>
            ))}
          </section>
        </FadeInSection>

        <RayDivider ray="R9" />

        <FadeInSection>
          <section className="glass-card p-8 text-center max-w-[720px] mx-auto space-y-4">
            <p className="text-xs uppercase tracking-widest font-bold" style={{ color: "#F8D011" }}>
              Discover your Rays
            </p>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
              Start your free Stability Check.
            </h2>
            <p className="text-sm" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>
              Get your signal first. Then unlock full methodology, scoring logic, and your custom training path.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <NeonGlowButton href="/preview">Discover your Rays — free Stability Check</NeonGlowButton>
              <LiquidFillButton href="/pricing">See full options</LiquidFillButton>
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Want context first? <Link href="/upgrade-your-os" style={{ color: "#F8D011" }}>Read Eclipse/Nova</Link>
            </p>
          </section>
        </FadeInSection>
      </div>
      <BackToTopButton />
    </main>
  );
}
