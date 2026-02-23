import Link from "next/link";

import { GlossaryClient } from "@/components/glossary/GlossaryClient";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const metadata = {
  title: "Glossary — 143 Leadership",
  description:
    "Every term used in the 143 Leadership assessment and Gravitational Stability Report, defined and searchable.",
};

export default async function GlossaryPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_glossary",
    sourceRoute: "/glossary",
    userState,
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Reference
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
            Glossary
          </h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Every term used in the 143 Leadership assessment and report,
            defined and searchable.
          </p>
        </header>

        <GlossaryClient />

        {/* ── CTA ── */}
        <section className="glass-card p-6 mt-10 sm:p-8 text-center">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Ready to see these concepts mapped to your own leadership pattern?
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link href="/assessment" className="btn-primary">
              Take the Assessment
            </Link>
            <Link href="/framework" className="btn-watch">
              Explore the Framework
            </Link>
          </div>
        </section>
    </div>
  );
}
