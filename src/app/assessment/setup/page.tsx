import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { AssessmentSetupClient } from "@/components/assessment/AssessmentSetupClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Calibration",
  description: "Set your context before we measure. Your results are shaped by where you are right now.",
};

export default async function AssessmentSetupPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "calibration_view",
    sourceRoute: "/assessment/setup",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Calibration</p>
          <h1 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Calibration</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>Your results are shaped by where you are right now. Let&apos;s calibrate.</p>
        </header>

        <AssessmentSetupClient />
      </div>
    </main>
  );
}
