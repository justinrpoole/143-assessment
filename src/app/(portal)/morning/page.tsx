import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import DailyLoopClient from "@/components/retention/DailyLoopClient";
import { MorningEntryClient } from "@/components/retention/MorningEntryClient";
import PhaseCheckInClient from "@/components/retention/PhaseCheckInClient";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { currentLocalDateIso } from "@/lib/retention/morning";
import { PageHeader } from "@/components/ui/PageHeader";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Morning Routine",
  description: "Start your day with intention. Your morning check-in sets direction, activates your daily loop, and logs your first rep.",
};

export default async function MorningPage() {
  const auth = await getRequestAuthContext();
  const localDate = currentLocalDateIso();

  emitPageView({
    eventName: "page_view_morning",
    sourceRoute: "/morning",
    userState: auth.userState,
    userId: auth.userId,
  });
  emitEvent({
    eventName: "morning_view",
    sourceRoute: "/morning",
    userState: auth.userState,
    userId: auth.userId,
    extra: {
      template_key: "v1-default",
      local_date: localDate,
    },
  });

  return (
    <>
      <PortalBreadcrumb current="Morning" />
      <PageHeader title="Morning" description="Three minutes. One intention. The rep that primes your operating system for the day ahead." />
      <GoldDividerAnimated />

      <div className="mt-6 space-y-6">
        <PhaseCheckInClient />
        <DailyLoopClient />
        <MorningEntryClient />
      </div>

      <FeedbackWidget
        feedback_type="morning_value"
        source_route="/morning"
        title="Morning value check"
      />

      <GoldHeroBanner
        kicker="Daily Practice"
        title="The morning sets the tone. You just set yours."
        description="Three minutes. One intention. The rep that primes your operating system for the day ahead."
      />
    </>
  );
}
