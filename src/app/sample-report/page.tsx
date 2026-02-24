import DimmingDetector from "@/components/assessment/DimmingDetector";
import SampleReportClient from "@/components/assessment/SampleReportClient";
import SampleReportCTA from "@/components/billing/SampleReportCTA";
import EmailGate from "@/components/marketing/EmailGate";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sample Report — 143 Leadership",
  description:
    "Preview what your 143 Leadership report looks like — 9-Ray scores, Light Signature, Eclipse Snapshot, and personalised training plan. Not a screenshot. The real thing.",
};

/* ── static data ───────────────────────────────────────────── */

const PAID_TIER_ITEMS = [
  "Gravitational Stability Report ($43) — Your full 9-Ray report, Eclipse Snapshot, Light Signature with identity opener, Energy Ratio, Rise Path, and lifetime access. Downloadable PDF.",
  "Portal Membership ($14.33/month) — Everything in the report, plus weekly retakes, daily micro-practices, progress logs, growth dashboard, and the tools to actually close the gap your report identifies. Cancel anytime.",
];

/* ── page ───────────────────────────────────────────────────── */

export default async function SampleReportPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_sample_report",
    sourceRoute: "/sample-report",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-[960px] px-5 py-12 sm:px-8 sm:py-16 space-y-16">

        {/* ─── SECTION 1 · HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-[720px] space-y-5">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            Sample Report
          </p>
          <h1
            className="text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            This is what a full report reads like. Not a screenshot. The real
            thing.
          </h1>
          <p
            className="max-w-[560px] text-base leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Browse a sample Gravitational Stability Report — same format, same
            depth, same identity-first language. The only difference is the data
            is not yours. Yet.
          </p>
        </section>

        <GoldDivider />

        {/* ─── SECTION 2 · WHAT PEOPLE SAY ─────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-4">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                What people say when they open their report
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                The first thing you will notice is that it sounds like someone
                who knows you. Not someone who categorized you. Someone who has
                watched you navigate a hard week and can name what is actually
                happening underneath the performance. That is by design. Every
                line of your report is generated from your specific answers, not
                a template.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                The report opens with your Light Signature and an identity
                opener: &ldquo;I know you are the type of person who...&rdquo;
                Then the Eclipse Snapshot shows where stress may be suppressing
                real capacity. Then your Energy-to-Eclipse Ratio. Then your Rise
                Path with specific tool recommendations. Every section is mapped
                to your profile. Nothing is generic.
              </p>
            </div>
          </section>
        </FadeInSection>

        <GoldDivider />

        {/* ─── SECTION 3 · DIMMING DETECTOR ────────────────────── */}
        <FadeInSection>
          <DimmingDetector />
        </FadeInSection>

        {/* ─── SECTION 4 · INTERACTIVE SAMPLE REPORT ───────────── */}
        <EmailGate>
          <SampleReportClient />
        </EmailGate>

        <GoldDivider />

        {/* ─── SECTION 5 · TWO WAYS TO USE ─────────────────────── */}
        <FadeInSection>
          <section className="mx-auto max-w-[720px]">
            <div className="glass-card p-6 sm:p-8 space-y-5">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Two ways to use your report
              </p>
              <ul className="space-y-3">
                {PAID_TIER_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-relaxed"
                    style={{
                      color:
                        "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                    }}
                  >
                    <span
                      className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--brand-gold)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
                }}
              >
                A report that reads like someone who understands you handed you
                a map and said: start here. Not who you are. What you can build.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
                }}
              >
                Retake after 90 days of training. Watch your Light Signature
                evolve. When it shifts, that is not inconsistency. That is
                growth you can see.
              </p>
              <div className="mt-2">
                <SampleReportCTA
                  primaryLabel="Check My Stability — Free"
                  secondaryLabel="Get Your Full Report — $43"
                />
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>
    </main>
  );
}

/* ── utility ───────────────────────────────────────────────── */

function GoldDivider() {
  return (
    <div className="mx-auto max-w-[200px]">
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--brand-gold), transparent)",
        }}
      />
    </div>
  );
}
