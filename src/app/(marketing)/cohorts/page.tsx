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
  title: "Light Circles — Teaser",
  description:
    "Small-group leadership transformation with Justin Ray. Apply to unlock full cohort details.",
};

export default async function CohortsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_cohorts",
    sourceRoute: "/cohorts",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[880px] px-5 py-12 sm:px-8 sm:py-16 space-y-14">
        <section className="text-center space-y-4 max-w-[720px] mx-auto">
          <p className="gold-tag mx-auto">◆ Light Circles</p>
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            Small group. Deep work. Real signal change.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>
            This is not a workshop. It is a guided training environment where your behavior changes because your operating
            system changes.
          </p>
        </section>

        <FadeInSection>
          <section className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Cohort Size", body: "6–8 people max so coaching stays personal and direct." },
              { title: "Duration", body: "10 weeks of structured reps, reflection, and accountability." },
              { title: "Outcome", body: "A measurable shift in how you lead under load." },
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
              Apply first
            </p>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
              Start with your free Stability Check, then apply for the cohort.
            </h2>
            <p className="text-sm" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}>
              I only open full cohort details after baseline signal and fit screening.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <NeonGlowButton href="/preview">Discover your Rays — free Stability Check</NeonGlowButton>
              <LiquidFillButton href="/group-coaching">Apply for Group Coaching</LiquidFillButton>
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Need the origin first? <Link href="/justin" style={{ color: "#F8D011" }}>Meet Justin</Link>
            </p>
          </section>
        </FadeInSection>
      </div>
      <BackToTopButton />
    </main>
  );
}
