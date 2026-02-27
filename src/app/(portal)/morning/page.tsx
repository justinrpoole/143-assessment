import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import DailyLoopClient from "@/components/retention/DailyLoopClient";
import { MorningEntryClient } from "@/components/retention/MorningEntryClient";
import PhaseCheckInClient from "@/components/retention/PhaseCheckInClient";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { currentLocalDateIso } from "@/lib/retention/morning";
import { PageHeader } from "@/components/ui/PageHeader";
import RayDivider from "@/components/ui/RayDivider";
import { rayHex } from "@/lib/ui/ray-colors";
import { FadeInSection } from "@/components/ui/FadeInSection";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import StreakBadge from "@/components/portal/StreakBadge";
import CosmicErrorBoundary from "@/components/ui/CosmicErrorBoundary";

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
      <StreakBadge />
      <PageHeader title="Morning" description="Three minutes. One intention. The rep that primes your operating system for the day ahead." />
      <RayDivider ray="R1" />

      <FadeInSection>
        <div className="mt-6 space-y-6">
          <CosmicErrorBoundary sectionLabel="PHASE CHECK-IN">
            <PhaseCheckInClient />
          </CosmicErrorBoundary>
          <CosmicErrorBoundary sectionLabel="DAILY LOOP">
            <DailyLoopClient />
          </CosmicErrorBoundary>
          <CosmicErrorBoundary sectionLabel="MORNING ENTRY">
            <MorningEntryClient />
          </CosmicErrorBoundary>
        </div>
      </FadeInSection>

      <FeedbackWidget
        feedback_type="morning_value"
        source_route="/morning"
        title="Morning value check"
      />

      <RayDivider ray="R1" />
      <FadeInSection>
        <section className="mx-auto max-w-lg">
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-4" style={{ color: rayHex('R1') }}>
            Continue Your Practice
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LiquidFillButton href="/energy">
              Energy Audit
            </LiquidFillButton>
            <LiquidFillButton href="/reps">
              Log a REP
            </LiquidFillButton>
          </div>
        </section>
      </FadeInSection>

      <GoldHeroBanner
        kicker="Daily Practice"
        title="The morning sets the tone. You just set yours."
        description="Three minutes. One intention. The rep that primes your operating system for the day ahead."
      />
    </>
  );
}
