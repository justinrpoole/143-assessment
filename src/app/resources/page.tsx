import Link from "next/link";

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
    cta: "Open Sample Report",
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
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <header className="glass-card p-6 mb-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Resources</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>Understand the system before you take the test.</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            The framework. The science. A sample report. And a free 3-day challenge that proves the filter can shift before you spend a dollar.
          </p>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          {resources.map((resource) => (
            <article key={resource.title} className="glass-card p-6 flex flex-col">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>{resource.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{resource.description}</p>
              <Link href={resource.href} className="btn-watch mt-4 inline-block self-start text-sm">
                {resource.cta}
              </Link>
            </article>
          ))}
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>The best place to start is free.</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            The 143 Challenge takes 3 minutes a day for 3 days. No account. No credit card. Just a notebook and the willingness to run a different filter. After 3 days, take the free Gravitational Stability Check and see your first two Rays.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/143" className="btn-primary">
              Start the 143 Challenge — Free
            </Link>
            <Link href="/preview" className="btn-watch">
              Take the 3-Minute Stability Check
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
