import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import IfThenPlanClient from "@/components/retention/IfThenPlanClient";
import { PageHeader } from "@/components/ui/PageHeader";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";

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
    <>
      <PortalBreadcrumb current="If/Then Plans" />
      <PageHeader
        label="Daily Practice"
        title="If / Then Plans"
        description="Build implementation intentions that fire automatically. If the cue happens, then the behavior follows — no willpower required."
      />
      <GoldDividerAnimated />

      <div className="mt-6">
        <IfThenPlanClient />
      </div>

      <FeedbackWidget
        feedback_type="plan_value"
        source_route="/plan"
        title="Are your plans landing?"
      />

      <GoldHeroBanner
        kicker="Implementation"
        title="If the cue happens, then the behavior follows."
        description="Implementation intentions increase goal achievement 2-3x. The negotiation with yourself is already over."
      />
    </>
  );
}
