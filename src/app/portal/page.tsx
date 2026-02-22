import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { emitPageView } from "@/lib/analytics/emitter";
import PortalDashboard from "@/components/portal/PortalDashboard";
import PortalTabBar from "@/components/portal/PortalTabBar";
import CosmicErrorBoundary from "@/components/ui/CosmicErrorBoundary";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Portal — 143 Leadership OS",
};

export default async function PortalPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_portal",
    sourceRoute: "/portal",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Portal</p>
          <h1 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            Your Leadership Dashboard
          </h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Welcome back. Pick up where you left off — start a new assessment, review your
            results, or continue your daily practices. Everything you have built is here.
          </p>
        </header>

        <CosmicErrorBoundary sectionLabel="PORTAL">
          <PortalDashboard />
        </CosmicErrorBoundary>
      </div>
      <PortalTabBar />
    </main>
  );
}
