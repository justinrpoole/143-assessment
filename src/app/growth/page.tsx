import { GrowthSummaryClient } from "@/components/retention/GrowthSummaryClient";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";

export const dynamic = "force-dynamic";

function growthViewMode(
  userState: string,
): "upsell_only" | "full" | "history_only" {
  if (userState === "sub_active") {
    return "full";
  }
  if (userState === "sub_canceled" || userState === "past_due") {
    return "history_only";
  }
  return "upsell_only";
}

export default async function GrowthPage() {
  const auth = await getRequestAuthContext();
  const viewMode = growthViewMode(auth.userState);

  emitPageView({
    eventName: "page_view_growth",
    sourceRoute: "/growth",
    userState: auth.userState,
    userId: auth.userId,
  });
  emitEvent({
    eventName: "growth_view",
    sourceRoute: "/growth",
    userState: auth.userState,
    userId: auth.userId,
    extra: {
      view_mode: viewMode,
    },
  });

  for (const milestone of ["7", "21", "66"]) {
    emitEvent({
      eventName: "milestone_checkpoint_view",
      sourceRoute: "/growth",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        milestone_day: milestone,
        checkpoint_status: "visible",
      },
    });
  }

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F8D011] mb-3">Growth</p>
          <h1 className="text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
            Track what changed across your runs.
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Your trendline turns effort into proof: run history, deltas, and Day
            7/21/66 checkpoints in one place.
          </p>
          <p className="mt-3 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Access mode: <code>{auth.userState}</code>
          </p>
        </header>

        <GrowthSummaryClient />
      </div>
    </main>
  );
}
