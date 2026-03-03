import EnterpriseSalesPage from '@/components/enterprise/EnterpriseSalesPage';
import NeonGlowButton from '@/components/marketing/NeonGlowButton';
import { emitPageView } from '@/lib/analytics/emitter';
import { getUserStateFromRequest } from '@/lib/auth/user-state';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Enterprise — 143 Leadership OS',
  description: 'Run the 143 Leadership OS across your team. Aggregate capacity intelligence, built for development — not surveillance.',
};

export default async function EnterprisePage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: 'page_view_enterprise',
    sourceRoute: '/enterprise',
    userState,
  });

  return (
    <main className="cosmic-page-bg min-h-screen">
      <section className="content-wrap--wide px-6 py-14 sm:py-18 space-y-6 relative">
        <p
          className="text-xs font-bold uppercase tracking-[0.18em]"
          style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-cosmic-display)' }}
        >
          Enterprise
        </p>
        <h1
          className="text-3xl sm:text-5xl font-bold"
          style={{ color: 'var(--text-body)', fontFamily: 'var(--font-cosmic-display)' }}
        >
          143 Leadership OS for teams
        </h1>

        <div
          className="rounded-2xl p-4 sm:p-6"
          style={{ background: 'color-mix(in srgb, var(--ink-950) 65%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-cyan) 18%, transparent)' }}
        >
          <EnterpriseSalesPage />
        </div>

        <div className="flex justify-center sm:justify-start">
          <NeonGlowButton href="/preview">Discover your Rays — free Stability Check</NeonGlowButton>
        </div>
      </section>
    </main>
  );
}
