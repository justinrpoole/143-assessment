import { EmailGateModulePlaceholder } from "@/components/EmailGateModulePlaceholder";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest, hasFreeEmailAccess } from "@/lib/auth/user-state";
import type { V1RouteSpec } from "@/lib/routes/v1-route-specs";

interface RouteShellPageProps {
  spec: V1RouteSpec;
}

export async function RouteShellPage({ spec }: RouteShellPageProps) {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: spec.pageViewEvent,
    sourceRoute: spec.route,
    userState,
  });

  const isLockedByEmailGate = spec.requiresFreeEmail && !hasFreeEmailAccess(userState);
  const isChallengeRoute = spec.route === "/143";

  return (
    <main className="cosmic-page-bg page-shell">
      <div className="content-wrap py-12 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">{spec.route}</p>
          <h1 className="mt-2 text-2xl font-semibold text-header">{spec.heading}</h1>
        </header>

        {isChallengeRoute ? (
          <section className="space-y-4" aria-label="143 challenge flow placeholder">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-header">Start now (email unlock)</h2>
              <p className="mt-2 text-sm text-secondary">Public users can run the core challenge flow without email capture.</p>
            </div>
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-header">Challenge Kit (email-gated)</h2>
              <p className="mt-2 text-sm text-secondary">Only tracker/prompts/reminders/share cards/logging are inside the Email Gate.</p>
            </div>
            {!hasFreeEmailAccess(userState) ? (
              <EmailGateModulePlaceholder
                route={spec.route}
                message="Unlock the Challenge Kit only. The core challenge remains open without email."
              />
            ) : null}
          </section>
        ) : null}

        {isLockedByEmailGate ? <EmailGateModulePlaceholder route={spec.route} /> : null}

        <section className="space-y-4" aria-label="Required module placeholders">
          {spec.modules.length === 0 ? (
            <div className="glass-card p-6" aria-label="No required modules">
              <h2 className="text-lg font-semibold text-header">No required modules</h2>
              <p className="mt-2 text-sm text-secondary">This route is a shell with no module placeholders yet.</p>
            </div>
          ) : (
            spec.modules.map((moduleName) => <ModulePlaceholder key={moduleName} name={moduleName} />)
          )}
        </section>
      </div>
    </main>
  );
}
