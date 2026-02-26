import { emitPageView } from '@/lib/analytics/emitter';
import { getUserStateFromRequest } from '@/lib/auth/user-state';
import LightDashboardClient from '@/components/portal/LightDashboardClient';
import CosmicErrorBoundary from '@/components/ui/CosmicErrorBoundary';
import { PageHeader } from '@/components/ui/PageHeader';
import GoldDividerAnimated from '@/components/ui/GoldDividerAnimated';
import PortalBreadcrumb from '@/components/portal/PortalBreadcrumb';
import { FeedbackWidget } from '@/components/feedback/FeedbackWidget';
import GoldHeroBanner from '@/components/ui/GoldHeroBanner';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Light Dashboard — 143 Leadership',
  description: 'Nine rays. East to west. See where your light lands this week.',
};

export default async function LightDashboardPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: 'page_view_light_dashboard',
    sourceRoute: '/light-dashboard',
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <PortalBreadcrumb current="Light Dashboard" />
        <PageHeader
          label="Light Dashboard"
          title="Your Light Dashboard"
          description="Nine rays. East to west. See where your light lands this week."
        />
        <GoldDividerAnimated />
        <CosmicErrorBoundary sectionLabel="LIGHT DASHBOARD">
          <LightDashboardClient />
        </CosmicErrorBoundary>
        <FeedbackWidget
          feedback_type="dashboard_value"
          source_route="/light-dashboard"
          title="Is your dashboard clear?"
        />
        <GoldHeroBanner
          kicker="Your Signature"
          title="Nine rays. One signature. This is your light."
          description="Your Light Signature is not a label. It is a living pattern that changes as you train."
        />
      </div>
    </main>
  );
}
