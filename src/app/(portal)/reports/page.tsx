import { redirect } from "next/navigation";

import { ReportClient } from "@/components/assessment/ReportClient";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import CosmicErrorBoundary from "@/components/ui/CosmicErrorBoundary";
import { PageHeader } from "@/components/ui/PageHeader";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Report",
  description: "Your complete 143 Leadership report — Light Signature, Eclipse Snapshot, 9-Ray scores, and personalised Rise Path.",
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

export default async function ReportsPage({ searchParams }: PageProps) {
  const userState = await getUserStateFromRequest();
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const runId = firstValue(resolvedSearchParams.run_id);

  emitPageView({
    eventName: "page_view_reports",
    sourceRoute: "/reports",
    userState,
  });

  if (!runId) {
    redirect("/assessment/setup");
  }

  const PAID_STATES = new Set(["paid_43", "sub_active", "sub_canceled", "past_due"]);
  if (!PAID_STATES.has(userState)) {
    redirect("/upgrade");
  }

  return (
    <>
      <PortalBreadcrumb current="Full Report" />
      <PageHeader
        label="Full Report"
        title="Your complete Gravitational Stability Report."
        description="Every cosmic visualization — Solar Core, Eclipse Meter, Black Hole Flags, Planetary Alignment, Solar Flare Journal, Constellation Progress, and more. Hover or tap any chart for detailed breakdowns. Generate PDF on demand for sharing."
        size="large"
      />
      <GoldDividerAnimated />

      <RadialSpotlight>
        <CosmicErrorBoundary sectionLabel="REPORT">
          <ReportClient runId={runId} />
        </CosmicErrorBoundary>
      </RadialSpotlight>
      <FeedbackWidget
        feedback_type="report_resonance"
        source_route="/reports"
        run_id={runId}
        title="Report resonance check"
      />
      <GoldHeroBanner
        kicker="Your Full Report"
        title="Every visualization is built from your data. This is yours."
        description="Nine rays. One signature. A full map of where your light is shining and where it is covered."
      />
    </>
  );
}
