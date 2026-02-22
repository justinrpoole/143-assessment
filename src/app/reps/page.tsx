import RepLogClient from '@/components/retention/RepLogClient';
import PortalTabBar from '@/components/portal/PortalTabBar';

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
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            The Engine That Rewires Your Brain
          </p>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Your REPS</h1>
          <p className="text-xs font-medium tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Recognition &bull; Encouragement &bull; Performance &bull; Sustainability
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            REPS are not hype. They are behavioral repetition with awareness. You do not become confident
            by thinking differently — you become confident by performing differently, consistently, long enough
            for your brain to update its predictions. That update is neurological. Not motivational.
          </p>
        </header>

        <div className="mt-6">
          <RepLogClient initialTool={initialTool} />
        </div>
      </div>
      <PortalTabBar />
    </main>
  );
}
