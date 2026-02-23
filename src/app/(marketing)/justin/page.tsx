import Link from "next/link";

import { PAGE_COPY_V1 } from "@/content/page_copy.v1";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Justin Ray",
  description: "Meet Justin Ray — the builder of the 143 Leadership framework. Executive development background, behavioural science foundation, real-world proof.",
};

export default async function JustinPage() {
  const userState = await getUserStateFromRequest();
  const copy = PAGE_COPY_V1.justin;

  emitPageView({
    eventName: "page_view_justin",
    sourceRoute: "/justin",
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

        {/* <!--SPINE:PROOF--> */}
        <section className="glass-card p-6 mb-8 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.credibilityTitle}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.credibilityBody}</p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.storyBody}</p>
        </section>

        <section className="glass-card p-6 mb-8 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.trustTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="offer-card">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>I do not do</p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {copy.dontDo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="offer-card">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>What I do</p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {copy.do.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* <!--SPINE:HOW--> */}
        <section className="glass-card p-6 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.methodTitle}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.methodBody}</p>
          {/* <!--SPINE:OUTCOME--> */}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.outcome}</p>
          {/* <!--SPINE:LOOP--> */}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.loop}</p>
        </section>

        {/* ── CTA ── */}
        <section className="glass-card p-6 mt-8 sm:p-8 text-center">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            I built the assessment to show you the truth your calendar cannot. 143 questions. 15 minutes. One map of where your light is strong and where it is covered.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link href="/assessment" className="btn-primary">
              Take the Assessment
            </Link>
            <Link href="/framework" className="btn-watch">
              See the Framework
            </Link>
          </div>
        </section>
    </div>
  );
}
