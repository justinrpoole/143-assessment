import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import WeeklyReviewClient from "@/components/retention/WeeklyReviewClient";
import { PageHeader } from "@/components/ui/PageHeader";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Weekly Scan — 143 Leadership OS",
  description: "Your weekly leadership snapshot. Track capacity shifts, notice patterns, and see where your operating system is updating.",
};

export default async function WeeklyPage() {
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_weekly",
    sourceRoute: "/weekly",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <>
      <PortalBreadcrumb current="Weekly Scan" />
      <PageHeader
        label="Weekly Practice"
        title="Weekly Scan"
        description="Your system changes week by week. This snapshot tracks capacity shifts, notices patterns, and shows where your operating system is updating."
      />
      <GoldDividerAnimated />

      <div className="mt-6">
        <WeeklyReviewClient />
      </div>

      <FeedbackWidget
        feedback_type="weekly_value"
        source_route="/weekly"
        title="Was your weekly scan useful?"
      />

      <GoldHeroBanner
        kicker="Weekly Practice"
        title="Your system changes. This scan proves it."
        description="One scan per week. Five minutes. The data that turns effort into evidence."
      />
    </>
  );
}
