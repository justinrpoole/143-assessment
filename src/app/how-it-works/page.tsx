import Link from "next/link";

import { PAGE_COPY_V1 } from "@/content/page_copy.v1";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export default async function HowItWorksPage() {
  const userState = await getUserStateFromRequest();
  const copy = PAGE_COPY_V1.howItWorks;

  emitPageView({
    eventName: "page_view_how_it_works",
    sourceRoute: "/how-it-works",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
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
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={copy.ctas.primary.href} className="btn-primary">
              {copy.ctas.primary.label}
            </Link>
            <Link href={copy.ctas.secondary.href} className="btn-watch">
              {copy.ctas.secondary.label}
            </Link>
          </div>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Prefer to start free?{" "}
            <Link
              href={copy.ctas.tertiary.href}
              className="font-semibold underline hover:text-[var(--text-on-dark)]"
            >
              {copy.ctas.tertiary.label}
            </Link>
          </p>
        </header>

        {/* <!--SPINE:HOW--> */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Funnel Map</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {copy.funnelSteps.map((step) => (
              <article key={step.step} className="step-card">
                <p className="step-tag">{step.step}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          {/* <!--SPINE:PROOF--> */}
          <h2 className="mb-4 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.whatYouGet.title}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {copy.whatYouGet.cards.map((card) => (
              <article key={card.title} className="offer-card">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{card.body}</p>
              </article>
            ))}
          </div>

          {/* <!--SPINE:LOOP--> */}
          <h3 className="mt-6 text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.repeatWhy.title}</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.repeatWhy.body}</p>

          {/* <!--SPINE:OUTCOME--> */}
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.outcome}</p>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.cancellationNote}</p>
        </section>
      </div>
    </main>
  );
}
