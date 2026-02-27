import { ToolkitDeliveryClient } from "@/components/retention/ToolkitDeliveryClient";
import ToolkitClient from "@/components/retention/ToolkitClient";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { PageHeader } from "@/components/ui/PageHeader";
import RayDivider from "@/components/ui/RayDivider";
import { rayHex } from "@/lib/ui/ray-colors";
import { FadeInSection } from "@/components/ui/FadeInSection";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tool Library",
  description: "13 protocols. Each one trains a specific Ray. Each one backed by peer-reviewed research. Each one is a rep.",
};

export default async function ToolkitPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_toolkit",
    sourceRoute: "/toolkit",
    userState: auth.userState,
    userId: auth.userId,
  });
  emitEvent({
    eventName: "toolkit_view",
    sourceRoute: "/toolkit",
    userState: auth.userState,
    userId: auth.userId,
    extra: {
      toolkit_version: "v2",
    },
  });

  return (
    <>
      <PortalBreadcrumb current="Toolkit" />
      <PageHeader
        label="Tool Library"
        title="Tool Library"
        description="13 protocols. Each one trains a specific Ray. Each one backed by peer-reviewed research. Each one is a rep."
      />
      <RayDivider ray="R5" />

      <FadeInSection>
        <div className="mt-6 space-y-8">
          <ToolkitClient />
          <ToolkitDeliveryClient isAuthenticated={auth.isAuthenticated} />
          <FeedbackWidget
            feedback_type="toolkit_value"
            source_route="/toolkit"
            title="Finding what you need?"
          />
          <RayDivider ray="R5" />
          <section className="mx-auto max-w-lg">
            <p className="text-center text-xs font-bold uppercase tracking-widest mb-4" style={{ color: rayHex('R5') }}>
              Continue Your Practice
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <LiquidFillButton href="/reps">
                Log a REP
              </LiquidFillButton>
              <LiquidFillButton href="/plan">
                If/Then Plans
              </LiquidFillButton>
            </div>
          </section>

          <GoldHeroBanner
            kicker="Your Arsenal"
            title="The right tool at the right time changes everything."
            description="Every tool in this library maps to a specific capacity. Use the one your system needs most right now."
          />
        </div>
      </FadeInSection>
    </>
  );
}
