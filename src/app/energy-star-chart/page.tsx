import type { Metadata } from 'next';
import { getUserStateFromRequest } from '@/lib/auth/user-state';
import EnergyStarChartClient from './EnergyStarChartClient';
import EnergyStarChartPortalClient from './EnergyStarChartPortalClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Energy Star Chart — Leadership Capacity Diagnostic',
  description:
    'See how 9 rays of leadership capacity map into a single living instrument. Take the assessment to unlock your full Energy Star Chart.',
};

export default async function EnergyStarChartPage() {
  const userState = await getUserStateFromRequest();
  const isAuthenticated = userState !== 'public';

  if (isAuthenticated) {
    return (
      <main
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #1A0A2E 0%, #0D0520 70%, #020202 100%)',
          minHeight: '100vh',
          padding: '16px',
        }}
      >
        <EnergyStarChartPortalClient />
      </main>
    );
  }

  return (
    <main
      className="page-shell"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #2D1450 0%, #1A0A2E 55%, #0D0520 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="content-wrap py-8">
        <EnergyStarChartClient />
      </div>
    </main>
  );
}
