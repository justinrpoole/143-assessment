import Link from "next/link";

import { PAGE_COPY_V1 } from "@/content/page_copy.v1";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Outcomes",
  description: "What changes when you upgrade your operating system. Real outcomes from the 143 Leadership framework.",
};

export default async function OutcomesPage() {
  const userState = await getUserStateFromRequest();
  const copy = PAGE_COPY_V1.outcomes;

  emitPageView({
    eventName: "page_view_outcomes",
    sourceRoute: "/outcomes",
    userState,
  });

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        <header className="glass-card p-6 mb-8 sm:p-8">
          {/* <!--SPINE:HOOK--> */}
          <p className="chip mb-3">{copy.label}</p>
          <h1 className="mb-3 text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
            {copy.headline}
          </h1>
          {/* <!--SPINE:WHY--> */}
          <p className="max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {copy.subhead}
          </p>
        </header>

        {/* <!--SPINE:OUTCOME--> */}
        <section className="glass-card p-6 sm:p-8">
          <h2 className="mb-4 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.winsTitle}</h2>
          <ul className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {copy.wins.map((win) => (
              <li key={win}>{win}</li>
            ))}
          </ul>
        </section>

        {/* <!--SPINE:HOW--> */}
        <section className="glass-card p-6 mt-8 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.howTitle}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.howBody}</p>
          {/* <!--SPINE:PROOF--> */}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.proof}</p>
          {/* <!--SPINE:LOOP--> */}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.loop}</p>
        </section>

        {/* ── CTA ── */}
        <section className="glass-card p-6 mt-8 sm:p-8 text-center">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            These outcomes start with one map. 143 questions. 15 minutes. Your Light Signature shows exactly where to begin.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link href="/assessment" className="btn-primary">
              Take the Assessment
            </Link>
            <Link href="/sample-report" className="btn-watch">
              See a Sample Report
            </Link>
          </div>
        </section>
    </div>
  );
}
