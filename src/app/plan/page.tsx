import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import IfThenPlanClient from "@/components/retention/IfThenPlanClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "If/Then Plans — 143 Leadership OS",
  description: "Build implementation intentions that fire automatically. If/Then plans turn insight into behavior change — the bridge between knowing and doing.",
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
    <PageShell>
      <PageHeader title="If / Then Plans" />

      <div className="mt-6">
        <IfThenPlanClient />
      </div>
    </PageShell>
  );
}
