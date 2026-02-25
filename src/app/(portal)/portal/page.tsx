import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { emitPageView } from "@/lib/analytics/emitter";
import PortalDashboard from "@/components/portal/PortalDashboard";
import CosmicErrorBoundary from "@/components/ui/CosmicErrorBoundary";
import { PageHeader } from "@/components/ui/PageHeader";

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
      <PageHeader
        label="Portal"
        title="Your Leadership Dashboard"
        description="Welcome back. Pick up where you left off — start a new assessment, review your results, or continue your daily practices. Everything you have built is here."
      />

      <CosmicErrorBoundary sectionLabel="PORTAL">
        <PortalDashboard />
      </CosmicErrorBoundary>
    </>
  );
}
