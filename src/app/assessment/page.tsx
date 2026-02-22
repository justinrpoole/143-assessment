import Link from "next/link";

import { AssessmentRunnerClient } from "@/components/assessment/AssessmentRunnerClient";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import CosmicErrorBoundary from "@/components/ui/CosmicErrorBoundary";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

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
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          <MarketingNav />

          <header className="glass-card mb-6 p-6 sm:p-8">
            <h1 className="text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>The 143 Be The Light Assessment</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              I see you performing leadership every day without a mirror that shows what is actually happening underneath. 143 questions. 15 minutes. You will see your Light Signature, your Eclipse Snapshot, and the specific capacity to train first. Not who you are. What you can build.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/assessment/instructions" className="btn-primary">
                Start the Assessment
              </Link>
              <Link href="/sample-report" className="btn-watch">
                See Sample Results
              </Link>
            </div>
          </header>

          <section className="glass-card mb-6 p-6 sm:p-8">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#F8D011]">What Makes This Different</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Notice how every other assessment told you who you are but never what to do next? That is the gap. The 143 is not a personality test. It measures 9 trainable leadership capacities backed by peer-reviewed behavioral science. Your scores are designed to change. And the first thing you will notice when you open your results is that it sounds like someone who knows you.
            </p>
          </section>

          <section className="glass-card mb-6 p-6 sm:p-8">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#F8D011]">What You Will Discover</h2>
            <ul className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li>Your Light Signature — one of 36 combinations that shows how your top two Rays work together. You might be a Strategic Optimist, a Decisive Director, or a Relational Light.</li>
              <li>Your Eclipse Snapshot — where sustained stress is covering real capacity. Not a verdict. A temporary state with a clear path out.</li>
              <li>Your Energy Ratio — how much of your available capacity you are currently accessing versus burning through.</li>
              <li>Your Rise Path — the specific Ray to train first, the tool to use, and the micro-practice to start this week.</li>
            </ul>
          </section>

          <section className="glass-card mb-6 p-6 sm:p-8">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#F8D011]">Two Ways In</h2>
            <ul className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li>Free — The Light Check gives you a quick eclipse screening and your top Ray in 3 minutes. No account required.</li>
              <li>$43 one-time — Full 143 Assessment with your Light Signature, Eclipse Snapshot, and personalized Rise Path.</li>
              <li>$14.33/month — Everything in the assessment plus unlimited retakes, growth tracking, and daily micro-practices.</li>
              <li>Enterprise — Team-wide assessment with aggregate patterns, coaching integration, and behavioral ROI framework.</li>
            </ul>
          </section>

          <section className="glass-card mb-6 p-6 sm:p-8">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#F8D011]">See What the Report Looks Like</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              The first thing people say when they open their results: &quot;Oh. That is what is happening.&quot; The report names the pattern you have been living but could not articulate. Preview the structure and the personal language before you begin.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/sample-report" className="btn-watch">
                Open Sample Report
              </Link>
              <Link href="/preview" className="btn-watch">
                Start Snapshot Preview
              </Link>
            </div>
          </section>

          <section className="glass-card mb-6 p-6 sm:p-8">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#F8D011]">FAQs</h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <p>How long does it take? 143 questions. About 15 minutes. Most people say it goes faster than expected because the questions feel personal, not generic.</p>
              <p>What if I do not like my results? There are no bad results. Every score is a capacity to build. Eclipse does not mean failure — it means your range is covered. The report shows you exactly what is underneath.</p>
              <p>Can I retake it? Yes. The $14.33/month plan includes unlimited retakes. Retake in 90 days and watch your scores move — that is proof the reps are landing.</p>
            </div>
          </section>

          <section className="glass-card p-6 sm:p-8">
            <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>The most honest mirror your leadership has seen.</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              143 questions. 15 minutes. You will see your Light Signature, your Eclipse Snapshot, and the first capacity to train. Not who you are. What you can build.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/assessment/instructions" className="btn-primary">
                Start the Assessment
              </Link>
              <Link href="/preview" className="btn-watch">
                Start with Preview
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
