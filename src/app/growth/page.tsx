import { GrowthSummaryClient } from "@/components/retention/GrowthSummaryClient";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Growth Tracking",
  description: "Track what changed across your assessment runs — capacity shifts, Eclipse recovery, and training progress over time.",
};

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
    <PageShell>
      <PageHeader
        label="Growth"
        title="Track what changed across your runs."
        description="Your trendline turns effort into proof: run history, deltas, and Day 7/21/66 checkpoints in one place."
        size="large"
      >
        <p className="mt-3 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Access mode: <code>{auth.userState}</code>
        </p>
      </PageHeader>

      <GrowthSummaryClient />
    </PageShell>
  );
}
