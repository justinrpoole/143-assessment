import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import IfThenPlanClient from "@/components/retention/IfThenPlanClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "If/Then Plans — 143 Leadership OS",
};

export default async function PlanPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_portal",
    sourceRoute: "/plan",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>If / Then Plans</h1>
        </header>

        <div className="mt-6">
          <IfThenPlanClient />
        </div>
      </div>
    </main>
  );
}
