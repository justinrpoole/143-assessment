import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import WeeklyReviewClient from "@/components/retention/WeeklyReviewClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Weekly Review — 143 Leadership OS",
};

export default async function WeeklyPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_portal",
    sourceRoute: "/weekly",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Weekly Review</h1>
        </header>

        <div className="mt-6">
          <WeeklyReviewClient />
        </div>
      </div>
    </main>
  );
}
