import Link from "next/link";

import { MarketingNav } from "@/components/marketing/MarketingNav";

const resources = [
  {
    title: "The 143 Leadership OS: How It Works",
    description:
      "A plain-language walkthrough of the 9 Rays, the Eclipse Snapshot, the 36 Light Signatures, and the tools-first approach that makes this different from every personality assessment you have taken.",
  },
  {
    title: "13 Protocols. Here Is What They Do.",
    description:
      "A summary of every tool in the 143 library — what capacity it trains, what science backs it, and how it fits into a real day. Each one is a rep. Each one builds a specific Ray.",
  },
  {
    title: "See What a Full Report Looks Like",
    description:
      "An actual sample of the 9-Ray report, including the Eclipse Snapshot, capacity scores, Light Signature, identity opener, and personalized tool recommendations.",
  },
];

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resources",
  description: "Guides, walkthroughs, and reference materials for the 143 Leadership framework.",
};

export default function ResourcesPage() {
  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <MarketingNav />

        <header className="glass-card p-6 mb-6 sm:p-8">
          <h1 className="text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>Resources</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Everything you need to understand the 143 OS before you take the assessment. Start here. Go deeper.
          </p>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          {resources.map((resource) => (
            <article key={resource.title} className="offer-card">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>{resource.title}</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{resource.description}</p>
            </article>
          ))}
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Stay in the loop</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            I see you bookmarking pages to come back to later. Most of them disappear. This one stays in your inbox. One email a week. A tool, a science translation, or a reframe you can use the same day. No hype. No sales sequences.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/login" className="btn-primary">
              Subscribe to Updates
            </Link>
            <Link href="/assessment" className="btn-watch">
              Take the Assessment
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
