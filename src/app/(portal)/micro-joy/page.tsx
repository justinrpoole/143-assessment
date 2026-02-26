import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { MicroJoyClient } from "@/components/retention/MicroJoyClient";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { countMicroJoyEntriesForDate } from "@/lib/db/retention";
import { PageHeader } from "@/components/ui/PageHeader";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import StreakBadge from "@/components/portal/StreakBadge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Micro-Joy",
  description: "Your daily micro-joy practice. A small, intentional moment of joy that trains your Ray of Joy and rewires your attention filter.",
};

const MAX_GENERATES_PER_DAY = 1;
const MAX_SWAPS_PER_DAY = 3;
const MAX_TOTAL_SUGGESTIONS = MAX_GENERATES_PER_DAY + MAX_SWAPS_PER_DAY;

function localDateIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function MicroJoyPage() {
  const auth = await getRequestAuthContext();
  const localDate = localDateIso();
  let dailyCount = 0;
  if (auth.userId) {
    dailyCount = await countMicroJoyEntriesForDate({
      userId: auth.userId,
      localDate,
    }).catch(() => 0);
  }

  const remainingTotal = Math.max(0, MAX_TOTAL_SUGGESTIONS - dailyCount);
  const remainingSwaps = Math.max(0, remainingTotal - (dailyCount === 0 ? 1 : 0));

  emitPageView({
    eventName: "page_view_microjoy",
    sourceRoute: "/micro-joy",
    userState: auth.userState,
    userId: auth.userId,
  });
  emitEvent({
    eventName: "microjoy_view",
    sourceRoute: "/micro-joy",
    userState: auth.userState,
    userId: auth.userId,
    extra: {
      local_date: localDate,
      remaining_generates: dailyCount === 0 ? 1 : 0,
      remaining_swaps: remainingSwaps,
    },
  });

  return (
    <>
      <PortalBreadcrumb current="Micro-Joy" />
      <StreakBadge />
      <PageHeader
        label="Daily Practice"
        title="Micro Joy"
        description="One small thing that tells your RAS the world has good in it. That signal changes what your brain looks for next."
      />
      <GoldDividerAnimated />

      <MicroJoyClient />
      <FeedbackWidget
        feedback_type="microjoy_value"
        source_route="/micro-joy"
        title="Micro Joy value check"
      />
      <GoldDividerAnimated />
      <section className="mx-auto max-w-lg">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--brand-gold)' }}>
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
        title="Joy is not a luxury. It is a leadership tool."
        description="Micro-joy trains your system to notice what is working. That changes everything downstream."
      />
    </>
  );
}
