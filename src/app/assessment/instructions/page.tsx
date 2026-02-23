import Link from "next/link";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import { RegulationBaselineCard } from "@/components/assessment/RegulationBaselineCard";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Before You Begin — 143 Leadership Assessment",
};

export default async function AssessmentInstructionsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_assessment_instructions",
    sourceRoute: "/assessment/instructions",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <MarketingNav />

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Before You Begin
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
            What to expect in the next 15 minutes
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            143 questions. One honest pass. The assessment measures 9 trainable
            leadership capacities — not personality, not type, not potential.
            Actual, buildable range.
          </p>
        </header>

        <div className="space-y-5">
          <RegulationBaselineCard />

          <section className="glass-card p-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              How to answer
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li>
                Answer based on the last 30 days, not your best day or your
                worst. Your recent default is what matters.
              </li>
              <li>
                There are no right answers. Higher scores are not better. The
                assessment maps where your light is strong and where it is
                temporarily covered.
              </li>
              <li>
                Go with your first instinct. If you overthink it, you are
                performing for the test instead of letting the test see you.
              </li>
              <li>
                You will see frequency scales (Never → Almost always), scenario
                cards, and brief reflections. Just respond honestly.
              </li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              What happens with your answers
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li>
                Your responses are saved automatically as you go. If you close
                the browser and come back, you will pick up exactly where you
                left off.
              </li>
              <li>
                When you finish, the system scores your 9 Rays instantly and
                generates your Gravitational Stability Report — your Light
                Signature, Eclipse Snapshot, and Rise Path.
              </li>
              <li>
                Where it helps, your report includes brief research grounding
                for the recommended tools and practices.
              </li>
              <li>
                Your report is saved to your account. You can return to it
                anytime by signing in.
              </li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              What you will discover
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li>
                Your Light Signature — one of 36 archetype combinations showing
                how your top two capacities work together. You might be a
                Strategic Optimist, a Decisive Director, or a Relational Light.
              </li>
              <li>
                Your Eclipse Snapshot — where sustained stress is temporarily
                covering real capacity. Not a verdict. A pattern with a path
                out.
              </li>
              <li>
                Your Rise Path — the specific capacity to train first, the tool
                to use, and the micro-practice to start this week.
              </li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              Before you start
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li>
                Find 15 uninterrupted minutes. The assessment reads better in
                one sitting, though your progress saves automatically.
              </li>
              <li>
                Close distractions. Phone on silent. The questions work best
                when you are present to them.
              </li>
              <li>
                Be honest, not aspirational. The report is more useful when it
                reflects where you actually are, not where you wish you were.
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/assessment/setup" className="btn-primary">
            Begin Assessment
          </Link>
          <Link href="/assessment" className="btn-watch">
            Back to Overview
          </Link>
        </div>
      </div>
    </main>
  );
}
