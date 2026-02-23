import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { AssessmentSetupClient } from "@/components/assessment/AssessmentSetupClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Assessment Setup",
  description: "Set your intention and prepare for the 143 Leadership Assessment.",
};

export default async function AssessmentSetupPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_assessment_setup",
    sourceRoute: "/assessment/setup",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Setup</p>
          <h1 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Assessment Setup</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>Choose your context and focus area before we begin.</p>
        </header>

        <AssessmentSetupClient />
      </div>
    </main>
  );
}
