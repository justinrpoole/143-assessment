import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import EveningReflectionClient from "@/components/retention/EveningReflectionClient";
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
  title: "Evening Reflection — 143 Leadership OS",
  description: "End-of-day reflection practice. Notice what you gave, what you received, and what is still in motion. The rep that trains awareness.",
};

export default async function ReflectPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_reflect",
    sourceRoute: "/reflect",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <>
      <PortalBreadcrumb current="Reflect" />
      <StreakBadge />
      <PageHeader
        title="Evening Reflection"
        label="Daily Practice"
        description="End-of-day reflection. Notice what you gave, what you received, and what is still in motion. The rep that trains awareness."
      />
      <RayDivider ray="R3" />

      <FadeInSection>
        <div className="mt-6">
          <EveningReflectionClient />
          <FeedbackWidget
            feedback_type="reflect_value"
            source_route="/reflect"
            title="Did reflection land tonight?"
          />
          <RayDivider ray="R3" />
          <section className="mx-auto max-w-lg">
            <p className="text-center text-xs font-bold uppercase tracking-widest mb-4" style={{ color: rayHex('R3') }}>
              Continue Your Practice
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <LiquidFillButton href="/morning">
                Morning Routine
              </LiquidFillButton>
              <LiquidFillButton href="/energy">
                Energy Audit
              </LiquidFillButton>
            </div>
          </section>

          <GoldHeroBanner
            kicker="Daily Practice"
            title="Notice what you gave, what you received, and what is still in motion."
            description="The rep that trains awareness. Not perfection — presence."
          />
        </div>
      </FadeInSection>
    </>
  );
}
