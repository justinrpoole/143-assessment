import Link from "next/link";
import { FadeInSection } from "@/components/ui/FadeInSection";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import RayDivider from "@/components/ui/RayDivider";
import { rayHex, cycleRay } from "@/lib/ui/ray-colors";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import StaggerChildren from "@/components/marketing/StaggerChildren";
import NeonGlowButton from "@/components/marketing/NeonGlowButton";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import BackToTopButton from "@/components/ui/BackToTopButton";
import ConicBorderCard from "@/components/ui/ConicBorderCard";

const resources = [
  {
    title: "The 143 Leadership OS: How It Works",
    description:
      "A plain-language walkthrough of the 9 Rays, the Eclipse Snapshot, the 36 Light Signatures, and the tools-first approach that makes this different from every personality assessment you have taken.",
    href: "/framework",
    cta: "Read the Framework",
  },
  {
    title: "See What a Full Report Looks Like",
    description:
      "An actual sample of the 9-Ray report, including the Eclipse Snapshot, capacity scores, Light Signature, identity opener, and personalised tool recommendations.",
    href: "/sample-report",
    cta: "Open Sample Light Signature Map",
  },
  {
    title: "The 143 Challenge: 3 Days to Proof",
    description:
      "Your brain is running a threat filter you never installed. The 143 Challenge uses your Reticular Activating System to reprogram it in 3 days. 3 minutes a day. Free. No account needed.",
    href: "/143",
    cta: "Start the Challenge — Free",
  },
  {
    title: "Meet Justin Ray",
    description:
      "Former executive who burned out at the top and built the system that brought him back. The 143 OS was born from lived experience and peer-reviewed behavioural science.",
    href: "/about",
    cta: "Read His Story",
  },
];

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resources — 143 Leadership",
  description: "Understand the 143 OS before you take the assessment. The framework, the science, a sample report, and the free 3-day challenge that proves the filter can shift.",
};

export default function ResourcesPage() {
  return (
    <main className="cosmic-page-bg">
      <ScrollProgressBar />
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">
        {/* ── Hero ── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <FloatingOrbs variant="mixed" />
          <p className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Resources
          </p>
          <h1 className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
            Understand the system before you take the test.
          </h1>
          <div className="mx-auto max-w-[540px]">
            <ScrollTextReveal text="The framework. The science. A sample report. And a free 3-day challenge that proves the filter can shift before you spend a dollar." />
          </div>
          <RaySpectrumStrip className="mt-6" />
        </section>

        <RayDivider ray="R1" />

        {/* ── Resource Cards ── */}
        <FadeInSection>
          <StaggerChildren className="grid gap-4 sm:grid-cols-2">
            {resources.map((resource, i) => (
              <article key={resource.title} className="glass-card glass-card--magnetic glass-card--lift p-6 flex flex-col" style={{ borderTop: `2px solid ${rayHex(cycleRay(i))}` }}>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>{resource.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{resource.description}</p>
                <LiquidFillButton href={resource.href} className="mt-4 inline-block self-start text-sm">
                  {resource.cta}
                </LiquidFillButton>
              </article>
            ))}
          </StaggerChildren>
        </FadeInSection>

        <RayDivider ray="R8" />

        {/* ── Gold Banner ── */}
        <GoldHeroBanner
          kicker="Free to Start"
          title="The best place to start costs nothing."
          description="The 143 Challenge takes 3 minutes a day for 3 days. No account. No credit card. Just a notebook and the willingness to run a different filter."
          cta={{ label: "Start the 143 Challenge — Free", href: "/143" }}
        />

        <RayDivider ray="R9" />

        {/* ── CTA ── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <ConicBorderCard>
            <div className="glass-card p-8 text-center space-y-5">
              <h2 className="text-2xl font-bold gold-underline" style={{ color: 'var(--text-on-dark)' }}>
                See your first two Rays — free.
              </h2>
              <p className="mx-auto max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                The Gravitational Stability Check takes 3 minutes and shows you which capacities are <span className="gold-highlight">carrying your system</span> right now.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <NeonGlowButton href="/preview">
                  Check My Stability
                </NeonGlowButton>
                <LiquidFillButton href="/framework">
                  Read the Framework
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
