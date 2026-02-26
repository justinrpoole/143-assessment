import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { emitPageView } from "@/lib/analytics/emitter";
import PortalDashboard from "@/components/portal/PortalDashboard";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import CosmicErrorBoundary from "@/components/ui/CosmicErrorBoundary";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import { PageHeader } from "@/components/ui/PageHeader";
import RadialSpotlight from "@/components/ui/RadialSpotlight";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Portal — 143 Leadership OS",
  description: "Your leadership operating system dashboard. Assessment results, daily practices, growth tracking, and tools — all in one place.",
};

export default async function PortalPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_portal",
    sourceRoute: "/portal",
    userState,
  });

  return (
    <>
      <PortalBreadcrumb current="Dashboard" />

      <PageHeader
        label="Light Portal"
        title="Your Light Portal"
        description="Welcome back to your Light Portal. Pick up where you left off — start a new assessment, review your results, or continue your daily practices. Everything you have built is here."
      />

      <GoldDividerAnimated />

      <RadialSpotlight>
        <CosmicErrorBoundary sectionLabel="PORTAL">
          <PortalDashboard />
        </CosmicErrorBoundary>
      </RadialSpotlight>

      <GoldDividerAnimated />

      <FeedbackWidget
        feedback_type="portal_value"
        source_route="/portal"
        title="Is your portal useful?"
      />

      <GoldHeroBanner
        kicker="Your Operating System"
        title="Every rep you log is proof the system is working. Keep going."
      />
    </>
  );
}
