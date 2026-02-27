import { GrowthSummaryClient } from "@/components/retention/GrowthSummaryClient";
import { emitEvent, emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { PageHeader } from "@/components/ui/PageHeader";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import RadialSpotlight from "@/components/ui/RadialSpotlight";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import RayDivider from "@/components/ui/RayDivider";
import { FadeInSection } from "@/components/ui/FadeInSection";

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
    <>
      <PortalBreadcrumb current="Growth" />
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
      <ScrollTextReveal text="Your trendline turns effort into proof: run history, deltas, and Day 7/21/66 checkpoints in one place." />
      <RaySpectrumStrip className="mt-4" />
      <RayDivider ray="R4" />

      <FadeInSection>
        <RadialSpotlight>
          <GrowthSummaryClient />
        </RadialSpotlight>
      </FadeInSection>
      <RayDivider ray="R8" />
      <FadeInSection>
        <FeedbackWidget
          feedback_type="growth_value"
          source_route="/growth"
          title="Is this tracking useful?"
        />
      </FadeInSection>
      <GoldHeroBanner
        kicker="Your Trendline"
        title="Growth is not linear. But it is visible."
        description="Every retake adds a data point. Every data point tells a story. This is yours."
      />
    </>
  );
}
