import { CoachWorkspaceClient } from '@/components/coach/CoachWorkspaceClient';
import { emitPageView } from '@/lib/analytics/emitter';
import { getUserStateFromRequest } from '@/lib/auth/user-state';

export const dynamic = 'force-dynamic';

export default async function CoachPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: 'page_view_coach',
    sourceRoute: '/coach',
    userState,
  });

  return <CoachWorkspaceClient />;
}
