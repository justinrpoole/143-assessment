import Link from "next/link";

import { MarketingNav } from "@/components/marketing/MarketingNav";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "For Organizations",
  description: "Bring the 143 Leadership OS to your team. Capacity intelligence for development — not surveillance. Team-wide assessment with aggregate pattern analysis.",
};

export default function OrganizationsPage() {
  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <MarketingNav />

        <header className="glass-card p-6 mb-6 sm:p-8">
          <h1 className="text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>For Organizations</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            The same OS. Applied at scale. Measure what actually predicts performance. Train what actually changes.
          </p>
        </header>

        <section className="glass-card p-6 mb-6 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>How We Work With Organizations</h2>
          <ul className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            <li>Assess the team, not just the leader — team-level data reveals systemic patterns no individual assessment can show.</li>
            <li>Train the OS, then train the tactics — install the foundation first, then every program sticks better and lasts longer.</li>
            <li>Measure the change — retake cycles create before-and-after data connecting capacity growth to team outcomes.</li>
          </ul>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Operational Fit</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Assessment takes 15 minutes per person. Results are available immediately. Debriefs can be facilitated by your team leads using the structured playbook. Aggregate data is anonymized by default. Retakes are built into the pricing — growth measurement is not an add-on, it is the point.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/corporate" className="btn-primary">
              Schedule a Conversation
            </Link>
            <Link href="/sample-report" className="btn-watch">
              View Corporate Overview
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
