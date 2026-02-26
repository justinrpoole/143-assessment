import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import EveningReflectionClient from "@/components/retention/EveningReflectionClient";
import { PageHeader } from "@/components/ui/PageHeader";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";

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
      <PageHeader title="Evening Reflection" />
      <GoldDividerAnimated />

      <div className="mt-6">
        <EveningReflectionClient />
        <FeedbackWidget
          feedback_type="reflect_value"
          source_route="/reflect"
          title="Did reflection land tonight?"
        />
        <GoldHeroBanner
          kicker="Daily Practice"
          title="Notice what you gave, what you received, and what is still in motion."
          description="The rep that trains awareness. Not perfection — presence."
        />
      </div>
    </>
  );
}
