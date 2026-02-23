import EnterpriseSalesPage from '@/components/enterprise/EnterpriseSalesPage';
import { emitPageView } from '@/lib/analytics/emitter';
import { getUserStateFromRequest } from '@/lib/auth/user-state';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Enterprise — 143 Leadership OS',
  description: 'Run the 143 Leadership OS across your team. Aggregate capacity intelligence, built for development — not surveillance.',
};

export default async function EnterprisePage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: 'page_view_enterprise',
    sourceRoute: '/enterprise',
    userState,
  });

  return (
    <EnterpriseSalesPage />
  );
}
