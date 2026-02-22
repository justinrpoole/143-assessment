import { PAGE_COPY_V1 } from "@/content/page_copy.v1";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import SampleReportClient from "@/components/assessment/SampleReportClient";
import DimmingDetector from "@/components/assessment/DimmingDetector";
import EmailGate from "@/components/marketing/EmailGate";
import SampleReportCTA from "@/components/billing/SampleReportCTA";

export const dynamic = "force-dynamic";

export default async function SampleReportPage() {
  const userState = await getUserStateFromRequest();
  const copy = PAGE_COPY_V1.sampleReport;

  emitPageView({
    eventName: "page_view_sample_report",
    sourceRoute: "/sample-report",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        <header className="glass-card p-6 mb-8 sm:p-8">
          {/* <!--SPINE:HOOK--> */}
          <p className="chip mb-3">{copy.label}</p>
          <h1 className="mb-3 text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
            {copy.headline}
          </h1>
          {/* <!--SPINE:WHY--> */}
          <p className="max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.subhead}</p>
        </header>

        {/* <!--SPINE:PROOF--> */}
        <section className="glass-card p-6 mb-8 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.proofTitle}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.proofBody}</p>
          {/* <!--SPINE:HOW--> */}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.howBody}</p>
        </section>

        {/* ── Dimming Detector — Mini Self-Audit ── */}
        <DimmingDetector />

        {/* ── Email gate → Interactive Sample Report ── */}
        <EmailGate>
          <SampleReportClient />
        </EmailGate>

        <section className="glass-card p-6 mt-8 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.paidTierTitle}</h2>
          <ul className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {copy.paidTierItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {/* <!--SPINE:OUTCOME--> */}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.outcome}</p>
          {/* <!--SPINE:LOOP--> */}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.loop}</p>
          <div className="mt-5">
            <SampleReportCTA
              primaryLabel={copy.ctas.primary.label}
              secondaryLabel={copy.ctas.secondary.label}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
