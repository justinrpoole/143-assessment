import { emitPageView } from '@/lib/analytics/emitter';
import { getUserStateFromRequest } from '@/lib/auth/user-state';
import LightDashboardClient from '@/components/portal/LightDashboardClient';
import CosmicErrorBoundary from '@/components/ui/CosmicErrorBoundary';

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
        <CosmicErrorBoundary sectionLabel="LIGHT DASHBOARD">
          <LightDashboardClient />
        </CosmicErrorBoundary>
      </div>
    </main>
  );
}
