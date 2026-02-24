import RepLogClient from '@/components/retention/RepLogClient';
import PortalTabBar from '@/components/portal/PortalTabBar';
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

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

  return (
    <PageShell after={<PortalTabBar />}>
      <PageHeader
        label="The Engine That Rewires Your Brain"
        title="Your REPS"
        description="REPS are not hype. They are behavioral repetition with awareness. You do not become confident by thinking differently — you become confident by performing differently, consistently, long enough for your brain to update its predictions. That update is neurological. Not motivational."
      >
        <p className="mt-2 text-xs font-medium tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Recognition &bull; Encouragement &bull; Performance &bull; Sustainability
        </p>
      </PageHeader>

      <div className="mt-6">
        <RepLogClient initialTool={initialTool} />
      </div>
    </PageShell>
  );
}
