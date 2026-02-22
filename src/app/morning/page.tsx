import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import DailyLoopClient from "@/components/retention/DailyLoopClient";
import { MorningEntryClient } from "@/components/retention/MorningEntryClient";
import PhaseCheckInClient from "@/components/retention/PhaseCheckInClient";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { currentLocalDateIso } from "@/lib/retention/morning";

export const dynamic = "force-dynamic";

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
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Morning</h1>
        </header>

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
      </div>
    </main>
  );
}
