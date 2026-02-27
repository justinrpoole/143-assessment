import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import IfThenPlanClient from "@/components/retention/IfThenPlanClient";
import { PageHeader } from "@/components/ui/PageHeader";
import RayDivider from "@/components/ui/RayDivider";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import { rayHex } from "@/lib/ui/ray-colors";
import { FadeInSection } from "@/components/ui/FadeInSection";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";

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
      <RayDivider ray="R1" />

      <FadeInSection>
        <div className="mt-6">
          <IfThenPlanClient />
        </div>
      </FadeInSection>

      <FeedbackWidget
        feedback_type="plan_value"
        source_route="/plan"
        title="Are your plans landing?"
      />

      <RayDivider ray="R1" />
      <FadeInSection>
        <section className="mx-auto max-w-lg">
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-4" style={{ color: rayHex('R1') }}>
            Continue Your Practice
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LiquidFillButton href="/reps">
              Log a REP
            </LiquidFillButton>
            <LiquidFillButton href="/toolkit">
              Tool Library
            </LiquidFillButton>
          </div>
        </section>
      </FadeInSection>

      <GoldHeroBanner
        kicker="Implementation"
        title="If the cue happens, then the behavior follows."
        description="Implementation intentions increase goal achievement 2-3x. The negotiation with yourself is already over."
      />
    </>
  );
}
