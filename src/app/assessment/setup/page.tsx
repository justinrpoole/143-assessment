import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import { AssessmentSetupClient } from "@/components/assessment/AssessmentSetupClient";
import FloatingOrbs from "@/components/marketing/FloatingOrbs";
import RaySpectrumStrip from "@/components/ui/RaySpectrumStrip";
import RayDivider from "@/components/ui/RayDivider";
import GoldHeroBanner from "@/components/ui/GoldHeroBanner";

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
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-8">
        <section className="relative">
          <FloatingOrbs variant="purple" />
          <header className="glass-card mb-6 p-6 sm:p-8">
            <p className="gold-tag inline-block">Calibration</p>
            <h1 className="text-shimmer mt-2 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Calibration</h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>Your results are shaped by where you are right now. Let&apos;s calibrate.</p>
            <RaySpectrumStrip className="mt-4" />
          </header>
        </section>

        <RayDivider ray="R1" />

        <AssessmentSetupClient />

        <GoldHeroBanner
          kicker="Your Assessment"
          title="143 questions. 9 capacities. One honest mirror."
          description="This is not a personality test. It is a measurement of where your leadership energy is right now — and where it can go next."
        />
      </div>
    </main>
  );
}
