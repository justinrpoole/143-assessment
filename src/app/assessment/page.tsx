import Link from "next/link";

import { AssessmentRunnerClient } from "@/components/assessment/AssessmentRunnerClient";
import CosmicErrorBoundary from "@/components/ui/CosmicErrorBoundary";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Be The Light Assessment — Map Your 9 Leadership Capacities",
  description: "143 questions. 15 minutes. See your Light Signature, Eclipse Snapshot, and the specific capacity to train first. Not who you are. What you can build. Start with the free Gravitational Stability Check or go straight to the full assessment.",
};

type SearchParams = Record<string, string | string[] | undefined>;

interface PageProps {
  searchParams?: Promise<SearchParams> | SearchParams;
}

function firstValue(input: string | string[] | undefined): string | null {
  if (typeof input === "string") {
    return input;
  }
  if (Array.isArray(input)) {
    return input[0] ?? null;
  }
  return null;
}

async function resolveSearchParams(value: PageProps["searchParams"]): Promise<SearchParams> {
  if (!value) {
    return {};
  }

  if (typeof (value as Promise<SearchParams>).then === "function") {
    return (await value) ?? {};
  }

  return value;
}

export default async function AssessmentPage({ searchParams }: PageProps) {
  const userState = await getUserStateFromRequest();
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const runId = firstValue(resolvedSearchParams.run_id);

  emitPageView({
    eventName: "page_view_assessment",
    sourceRoute: "/assessment",
    userState,
  });

  if (!runId) {
    return (
      <main className="cosmic-page-bg">
        <div className="mx-auto max-w-[720px] px-5 py-12 sm:px-8 sm:py-16">
          {/* Hero — I See You */}
          <header className="glass-card mb-6 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">The Assessment</p>
            <h1 className="text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>The 143 Be The Light Assessment</h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              I see you performing leadership every day without a mirror that shows what is actually happening underneath.
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              You run the meeting. You hit the number. And by 6pm something is missing that you cannot name.
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              143 questions. 15 minutes. You will see your Light Signature, your Eclipse Snapshot, and the specific capacity to train first. Not who you are. What you can build.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/preview" className="btn-primary">
                Check My Stability — Free
              </Link>
              <Link href="/assessment/instructions" className="btn-watch">
                Go Straight to the Full Assessment
              </Link>
            </div>
          </header>

          {/* Leading the Witness */}
          <section className="glass-card mb-6 p-6 sm:p-8">
            <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--brand-gold)' }}>
              Notice how every other assessment told you who you are but never what to do next?
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              That is the gap. The 143 is not a personality test. It measures 9 trainable leadership capacities backed by peer-reviewed behavioural science. Your scores are designed to change. And the first thing you will notice when you open your results is that it sounds like someone who knows you.
            </p>
          </section>

          {/* Archetype Teaser */}
          <section className="glass-card mb-6 p-6 sm:p-8">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-gold">When you open your results</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              You will not see a type. You will see your top two Rays, what they mean together, and where one might be compensating for another. You might be a Strategic Optimist — someone who finds the win even when life is loud. Or a Bold Authentic — someone who says the true thing before the room is ready. Or a Calm Center — someone whose steadiness holds everything in orbit.
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
              There are 36 Light Signatures. The assessment reveals yours.
            </p>
          </section>

          {/* See the report */}
          <section className="glass-card mb-6 p-6 sm:p-8">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-gold">See what the report looks like</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              The first thing people say when they open their results: &quot;Oh. That is what is happening.&quot; The report names the pattern you have been living but could not articulate.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/sample-report" className="btn-watch">
                Open Sample Report
              </Link>
              <Link href="/preview" className="btn-watch">
                Check My Stability — Free
              </Link>
            </div>
          </section>

          {/* Final CTA */}
          <section className="glass-card p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>The most honest mirror your leadership has seen.</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Not a personality label. A behavioural map that changes as you do. Start free. Go deeper when you are ready.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
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

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <CosmicErrorBoundary sectionLabel="ASSESSMENT">
          <AssessmentRunnerClient runId={runId} />
        </CosmicErrorBoundary>
      </div>
    </main>
  );
}
