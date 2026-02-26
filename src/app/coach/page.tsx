import { CoachWorkspaceClient } from '@/components/coach/CoachWorkspaceClient';
import { emitPageView } from '@/lib/analytics/emitter';
import { getUserStateFromRequest } from '@/lib/auth/user-state';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Coach Workspace",
  description: "Your coaching workspace in the 143 Leadership OS.",
};

export default async function CoachPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: 'page_view_coach',
    sourceRoute: '/coach',
    userState,
  });

  return <CoachWorkspaceClient />;
}
