import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { ResultsClient } from "@/components/assessment/ResultsClient";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import PatternInterruptHub from "@/components/PatternInterruptHub";
import IntentionRecall from "@/components/results/IntentionRecall";
import { PageHeader } from "@/components/ui/PageHeader";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

interface PageProps {
  searchParams?: Promise<SearchParams> | SearchParams;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolved = await resolveSearchParams(searchParams);
  const runId = firstValue(resolved.run_id);

  const base: Metadata = {
    title: "Your Results | 143 Leadership",
    description:
      "Your behavioural map is ready. Review your 9-Ray capacity scores, Eclipse Snapshot, and personalised 30-day training plan.",
  };

  if (runId) {
    const ogUrl = `/api/og/results/${encodeURIComponent(runId)}`;
    base.openGraph = {
      title: "My Light Signature | 143 Leadership Assessment",
      description:
        "I just discovered my Light Signature. Take the assessment to find yours.",
      images: [{ url: ogUrl, width: 1200, height: 630, alt: "Light Signature" }],
    };
    base.twitter = {
      card: "summary_large_image",
      title: "My Light Signature | 143 Leadership",
      description:
        "I just discovered my Light Signature. Take the assessment to find yours.",
      images: [ogUrl],
    };
  }

  return base;
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
    // Auto-fetch the latest completed run for authenticated users
    // so the PortalTabBar "Report" link works without a run_id param
    const { cookies } = await import("next/headers");
    const store = await cookies();
    const userId = store.get("user_id")?.value;

    if (userId) {
      try {
        const { supabaseRestFetch } = await import("@/lib/db/supabase-rest");
        const res = await supabaseRestFetch<Array<{ id: string }>>({
          restPath: "assessment_runs",
          query: {
            select: "id",
            user_id: `eq.${userId}`,
            status: "eq.completed",
            order: "created_at.desc",
            limit: 1,
          },
        });
        const latestRunId = res.data?.[0]?.id;
        if (latestRunId) {
          redirect(`/results?run_id=${latestRunId}`);
        }
      } catch {
        // Fall through to setup redirect
      }
    }

    redirect("/assessment/setup");
  }

  return (
    <>
      <PortalBreadcrumb current="Results" />
      <PageHeader
        label="Results"
        title="Your behavioural map is ready."
        size="large"
        className="mb-8"
      >
        <IntentionRecall />
      </PageHeader>
      <ScrollTextReveal text="Below is your complete 9-Ray report — your Light Signature archetype, Eclipse Snapshot, Energy-to-Eclipse Ratio, and Rise Path. Start with your Light Signature to understand your natural leadership force, then explore each section for the full picture. Every metric is explained — hover or tap the information icons for details." />
      <GoldDividerAnimated />

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
      <GoldHeroBanner
        kicker="Your Map"
        title="Every score is a starting point, not a sentence."
        description="What you see here is where you are. What you do next determines where you go."
      />
    </>
  );
}
