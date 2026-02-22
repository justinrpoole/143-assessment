import { redirect } from "next/navigation";

import { ResultsClient } from "@/components/assessment/ResultsClient";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import PatternInterruptHub from "@/components/PatternInterruptHub";
import PortalTabBar from "@/components/portal/PortalTabBar";
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

export default async function ResultsPage({ searchParams }: PageProps) {
  const userState = await getUserStateFromRequest();
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const runId = firstValue(resolvedSearchParams.run_id);

  emitPageView({
    eventName: "page_view_results",
    sourceRoute: "/results",
    userState,
  });

  if (!runId) {
    redirect("/assessment/setup");
  }

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-8 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F8D011]">Results</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
            Your behavioural map is ready.
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Below is your complete 9-Ray report — your Light Signature archetype, Eclipse
            Snapshot, Energy-to-Eclipse Ratio, and Rise Path. Start with your Light Signature
            to understand your natural leadership force, then explore each section for the full
            picture. Every metric is explained — hover or tap the information icons for details.
          </p>
        </header>

        <ResultsClient runId={runId} />
        <PatternInterruptHub />
        <FeedbackWidget
          feedback_type="report_resonance"
          source_route="/results"
          run_id={runId}
          title="Did this report land for you?"
        />
        <FeedbackWidget
          feedback_type="next_step_confidence"
          source_route="/results"
          run_id={runId}
          title="Do you have your next REP?"
        />
      </div>
      <PortalTabBar />
    </main>
  );
}
