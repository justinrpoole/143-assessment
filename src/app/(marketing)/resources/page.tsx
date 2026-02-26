import Link from "next/link";
import { FadeInSection } from "@/components/ui/FadeInSection";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import StaggerChildren from "@/components/marketing/StaggerChildren";

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
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">
        {/* ── Hero ── */}
        <section className="mx-auto max-w-[720px] space-y-5 text-center">
          <p className="gold-tag mx-auto">
            <span style={{ color: '#F8D011' }}>◆</span> Resources
          </p>
          <h1 className="text-shimmer text-3xl font-bold leading-tight sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
            Understand the system before you take the test.
          </h1>
          <p className="mx-auto max-w-[540px] text-base leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            The framework. The science. A sample report. And a free 3-day challenge that proves the filter can shift before you spend a dollar.
          </p>
        </section>

        <GoldDividerAnimated />

        {/* ── Resource Cards ── */}
        <FadeInSection>
          <StaggerChildren className="grid gap-4 sm:grid-cols-2">
            {resources.map((resource) => (
              <article key={resource.title} className="glass-card glass-card--lift p-6 flex flex-col">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>{resource.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{resource.description}</p>
                <Link href={resource.href} className="btn-watch mt-4 inline-block self-start text-sm">
                  {resource.cta}
                </Link>
              </article>
            ))}
          </StaggerChildren>
        </FadeInSection>

        <GoldDividerAnimated />

        {/* ── Gold Banner ── */}
        <GoldHeroBanner
          kicker="Free to Start"
          title="The best place to start costs nothing."
          description="The 143 Challenge takes 3 minutes a day for 3 days. No account. No credit card. Just a notebook and the willingness to run a different filter."
          cta={{ label: "Start the 143 Challenge — Free", href: "/143" }}
        />

        <GoldDividerAnimated />

        {/* ── CTA ── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-8 text-center space-y-5">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
                See your first two Rays — free.
              </h2>
              <p className="mx-auto max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                The Gravitational Stability Check takes 3 minutes and shows you which capacities are carrying your system right now.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/preview" className="btn-primary">
                  Check My Stability
                </Link>
                <Link href="/framework" className="btn-watch">
                  Read the Framework
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>
    </main>
  );
}
