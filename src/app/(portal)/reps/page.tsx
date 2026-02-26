import RepLogClient from '@/components/retention/RepLogClient';
import { PageHeader } from "@/components/ui/PageHeader";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import PortalBreadcrumb from "@/components/portal/PortalBreadcrumb";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";
import LiquidFillButton from "@/components/marketing/LiquidFillButton";
import StreakBadge from "@/components/portal/StreakBadge";
import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Your REPS — 143 Leadership OS',
  description: 'REPS: Recognition, Encouragement, Performance, Sustainability. Behavioral repetition with awareness — the engine that rewires your brain.',
};

type SearchParams = Record<string, string | string[] | undefined>;

interface PageProps {
  searchParams?: Promise<SearchParams> | SearchParams;
}

async function resolveSearchParams(
  value: PageProps['searchParams'],
): Promise<SearchParams> {
  if (!value) return {};
  if (typeof (value as Promise<SearchParams>).then === 'function') {
    return (await value) ?? {};
  }
  return value;
}

export default async function RepsPage({ searchParams }: PageProps) {
  const params = await resolveSearchParams(searchParams);
  const initialTool = typeof params.tool === 'string' ? params.tool : null;
  const auth = await getRequestAuthContext();

  emitPageView({
    eventName: "page_view_reps",
    sourceRoute: "/reps",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <>
      <PortalBreadcrumb current="REPS" />
      <StreakBadge />
      <PageHeader
        label="The Engine That Rewires Your Brain"
        title="Your REPS"
        description="REPS are not hype. They are behavioral repetition with awareness. You do not become confident by thinking differently — you become confident by performing differently, consistently, long enough for your brain to update its predictions. That update is neurological. Not motivational."
      >
        <p className="mt-2 text-xs font-medium tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Recognition &bull; Encouragement &bull; Performance &bull; Sustainability
        </p>
      </PageHeader>
      <GoldDividerAnimated />

      <div className="mt-6">
        <RepLogClient initialTool={initialTool} />
      </div>

      <FeedbackWidget
        feedback_type="rep_value"
        source_route="/reps"
        title="Did this rep land?"
      />

      <GoldDividerAnimated />
      <section className="mx-auto max-w-lg">
        <p className="text-center text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--brand-gold)' }}>
          Continue Your Practice
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <LiquidFillButton href="/toolkit">
            Tool Library
          </LiquidFillButton>
          <LiquidFillButton href="/morning">
            Morning Routine
          </LiquidFillButton>
        </div>
      </section>

      <GoldHeroBanner
        kicker="The Engine"
        title="Every rep rewires something. This one counts."
        description="Repetition is not punishment. It is the mechanism that turns insight into instinct."
      />
    </>
  );
}
