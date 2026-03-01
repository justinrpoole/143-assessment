import { emitPageView } from '@/lib/analytics/emitter';
import { getUserStateFromRequest } from '@/lib/auth/user-state';
import CosmicErrorBoundary from '@/components/ui/CosmicErrorBoundary';
import RaySpectrumStrip from '@/components/ui/RaySpectrumStrip';
import PortalDashboardShell from '@/components/portal/PortalDashboardShell';
import { FeedbackWidget } from '@/components/feedback/FeedbackWidget';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Light Dashboard — 143 Leadership',
  description: 'Nine rays. East to west. See where your light lands this week.',
};

export default async function LightDashboardPage() {
  const userState = await getUserStateFromRequest();
  emitPageView({ eventName: 'page_view_light_dashboard', sourceRoute: '/light-dashboard', userState });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[1040px] px-4 py-8 sm:px-6 sm:py-10">
        {/* Spectrum strip — thin neon rainbow above dashboard */}
        <RaySpectrumStrip className="mb-6" />

        {/* The dashboard IS the portal */}
        <CosmicErrorBoundary sectionLabel="LIGHT DASHBOARD">
          <PortalDashboardShell />
        </CosmicErrorBoundary>

        {/* Feedback */}
        <div className="mt-8">
          <FeedbackWidget
            feedback_type="dashboard_value"
            source_route="/light-dashboard"
            title="Is your dashboard clear?"
          />
        </div>
      </div>
    </main>
  );
}
