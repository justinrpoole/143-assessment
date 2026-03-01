import { redirect } from "next/navigation";

import { ReportClient } from "@/components/assessment/ReportClient";
import BlurredReportTeaser from "@/components/results/BlurredReportTeaser";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import CosmicErrorBoundary from "@/components/ui/CosmicErrorBoundary";
import { PageHeader } from "@/components/ui/PageHeader";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import RayDivider from "@/components/ui/RayDivider";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Light Map Vault",
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

const PAID_STATES = new Set(["paid_43", "sub_active", "sub_canceled", "past_due"]);

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

  // Non-paid users see a blurred teaser instead of being redirected to /upgrade.
  // This gives them a taste of the report and surfaces the upgrade CTA in context.
  if (!PAID_STATES.has(userState)) {
    return (
      <>
        <PortalBreadcrumb current="Light Map Vault" />
        <PageHeader
          label="Light Map Vault"
          title="Your full map is ready."
          description="You completed the assessment. Unlock your complete report — Light Signature, Eclipse Snapshot, 9-Ray scores, and your personalised Rise Path."
          size="large"
        />
        <RaySpectrumStrip className="mt-4" />
        <RayDivider ray="R9" />
        <div className="mt-8">
          <BlurredReportTeaser />
        </div>
      </>
    );
  }

  return (
    <>
      <PortalBreadcrumb current="Light Map Vault" />
      <PageHeader
        label="Light Map Vault"
        title="Your complete Gravitational Stability Report."
        description="Every cosmic visualization — Solar Core, Eclipse Meter, Black Hole Flags, Planetary Alignment, Solar Flare Journal, Constellation Progress, and more. Hover or tap any chart for detailed breakdowns. Generate PDF on demand for sharing."
        size="large"
      />
      <RaySpectrumStrip className="mt-4" />
      <RayDivider ray="R9" />
      <ScrollTextReveal text="Every cosmic visualization — Solar Core, Eclipse Meter, Black Hole Flags, Planetary Alignment, Solar Flare Journal, Constellation Progress, and more." />

      <RadialSpotlight>
        <CosmicErrorBoundary sectionLabel="REPORT">
          <ReportClient runId={runId} />
        </CosmicErrorBoundary>
      </RadialSpotlight>
      <RayDivider ray="R5" />
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
