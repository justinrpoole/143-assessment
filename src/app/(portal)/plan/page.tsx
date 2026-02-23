import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import IfThenPlanClient from "@/components/retention/IfThenPlanClient";
import { PageHeader } from "@/components/ui/PageHeader";

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
    <>
      <PageHeader title="If / Then Plans" />

      <div className="mt-6">
        <IfThenPlanClient />
      </div>
    </>
  );
}
