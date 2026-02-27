import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import EnergyAuditClient from "@/components/retention/EnergyAuditClient";
import { PageHeader } from "@/components/ui/PageHeader";
import RayDivider from "@/components/ui/RayDivider";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import { rayHex } from "@/lib/ui/ray-colors";
import { FadeInSection } from "@/components/ui/FadeInSection";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import StreakBadge from "@/components/portal/StreakBadge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Energy Audit — 143 Leadership OS",
  description: "Track where your energy goes each day. Map emotional, cognitive, and relational load so you can train recovery before it compounds.",
};

export default async function EnergyPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_energy",
    sourceRoute: "/energy",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <>
      <PortalBreadcrumb current="Energy Audit" />
      <StreakBadge />
      <PageHeader
        label="Daily Practice"
        title="Energy Audit"
        description="Track where your energy goes each day. The audit helps you see patterns — which activities fuel you, which drain you, and where eclipse is creeping in before you notice it. Over time, this log becomes your most honest mirror."
      />
      <RayDivider ray="R2" />

      <FadeInSection>
        <div className="mt-6">
          <EnergyAuditClient />
          <FeedbackWidget
            feedback_type="energy_value"
            source_route="/energy"
            title="Was this audit useful?"
          />
          <RayDivider ray="R2" />
          <section className="mx-auto max-w-lg">
            <p className="text-center text-xs font-bold uppercase tracking-widest mb-4" style={{ color: rayHex('R2') }}>
              Continue Your Practice
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <LiquidFillButton href="/morning">
                Morning Routine
              </LiquidFillButton>
              <LiquidFillButton href="/reflect">
                Evening Reflection
              </LiquidFillButton>
            </div>
          </section>

          <GoldHeroBanner
            kicker="Daily Practice"
            title="Where your energy goes, your life follows."
            description="This audit makes the invisible visible — so you can stop spending and start investing."
          />
        </div>
      </FadeInSection>
    </>
  );
}
