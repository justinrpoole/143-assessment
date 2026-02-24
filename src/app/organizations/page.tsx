import Link from "next/link";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "For Organizations — 143 Leadership",
  description:
    "Your team has the skills. What they lack is the operating capacity to use them under pressure. The 143 OS measures the 9 capacities that determine execution — and gives leaders the data to act before the cost shows up in turnover.",
};

const PROBLEM_STATS = [
  { stat: "77%", label: "of leadership programmes fail to produce lasting behaviour change (McKinsey)" },
  { stat: "3×", label: "higher turnover in teams with sustained eclipse — before anyone sees it coming" },
  { stat: "15 min", label: "per person to map all 9 leadership capacities under real operating conditions" },
];

const HOW_WE_WORK = [
  {
    num: "01",
    title: "Assess the Team, Not Just the Leader",
    description:
      "Every participant takes the full 143-question assessment. Team-level aggregate data reveals systemic patterns no individual assessment can show — which capacities are concentrated, which are missing, and where the blind spots sit.",
  },
  {
    num: "02",
    title: "Train the OS, Then Train the Tactics",
    description:
      "Most programmes teach skills on top of a depleted operating system. That is why they do not stick. The 143 installs the capacity foundation first. Then every programme, initiative, and coaching engagement you already run works better and lasts longer.",
  },
  {
    num: "03",
    title: "Measure the Change — Not the Satisfaction",
    description:
      "Retake cycles create before-and-after behavioural data with timestamps. Not satisfaction surveys. Not self-reported confidence. Measured capacity change connected to team outcomes. Growth is a delta. We give you the delta.",
  },
];

const WHY_DIFFERENT = [
  {
    title: "Development, not surveillance",
    description: "Individual results are private. Aggregate data is anonymised. N≥5 before any team data is surfaced. The system is architected so development feels safe — because development only works when people are honest.",
  },
  {
    title: "Trainable capacities, not fixed traits",
    description: "Unlike personality assessments, every score on the 143 is designed to change with practice. Monthly retakes track actual growth. Your team does not get labelled. They get a map that moves.",
  },
  {
    title: "Deterministic scoring with audit trail",
    description: "The same answers always produce the same results. SHA-256 audit signatures on every scored assessment. Full transparency, zero black boxes. Your compliance team will thank you.",
  },
  {
    title: "Built-in practice layer",
    description: "Assessment without action is trivia. Every participant gets matched daily micro-practices, rep tracking, and the tools to close the gap between knowing and doing. The practice is the product.",
  },
];

export default async function OrganizationsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_organizations",
    sourceRoute: "/organizations",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      {/* Hero */}
      <section className="mx-auto max-w-[720px] px-5 pt-16 pb-12 text-center sm:px-8 sm:pt-24 sm:pb-16">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--brand-gold, #F8D011)" }}
        >
          For Organizations
        </p>
        <h1
          className="mt-4 text-3xl font-bold leading-tight sm:text-4xl"
          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
        >
          Your team has the skills. Do they have the capacity to use them?
        </h1>
        <p
          className="mx-auto mt-4 max-w-[540px] text-sm leading-relaxed"
          style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
        >
          The 143 Leadership OS maps 9 trainable behavioural capacities across your team — and
          gives leaders aggregate intelligence to act before the cost shows up in turnover,
          disengagement, or initiative fatigue.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/enterprise" className="btn-primary">
            Request a Briefing
          </Link>
          <Link href="/corporate" className="btn-watch">
            See Corporate Programs
          </Link>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #F8D011, transparent)" }} />
      </div>

      {/* The Problem */}
      <section className="mx-auto max-w-[720px] space-y-6 px-5 py-12 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>
            The gap no one is measuring
          </p>
          <h2 className="mt-2 text-2xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            How much did your last leadership initiative cost? How long did the results last?
          </h2>
        </div>
        <div className="glass-card p-6 space-y-3 sm:p-8">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
            When your team is deep in energy borrowing, performance initiatives create pressure — not results.
            High-performing teams often have the skills. What they lack is the operating capacity to deploy
            those skills under real conditions.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
            The 143 detects that gap at the team level, names the specific capacities in eclipse, and provides
            the training infrastructure to restore access — with retake data to prove the change happened.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PROBLEM_STATS.map((item) => (
            <div key={item.label} className="glass-card p-5 text-center">
              <p className="text-3xl font-bold" style={{ color: "var(--brand-gold, #F8D011)" }}>{item.stat}</p>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #F8D011, transparent)" }} />
      </div>

      {/* How We Work */}
      <section className="mx-auto max-w-[720px] space-y-8 px-5 py-12 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>
            How We Work With Organizations
          </p>
          <h2 className="mt-2 text-2xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            Three steps. One operating system.
          </h2>
        </div>
        <div className="space-y-4">
          {HOW_WE_WORK.map((step) => (
            <div key={step.num} className="glass-card flex gap-5 p-6">
              <span className="shrink-0 text-2xl font-bold" style={{ color: "var(--brand-gold, #F8D011)" }}>
                {step.num}
              </span>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #F8D011, transparent)" }} />
      </div>

      {/* Why Different */}
      <section className="mx-auto max-w-[720px] space-y-8 px-5 py-12 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>
            Built Different
          </p>
          <h2 className="mt-2 text-2xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            Built for development. Not surveillance.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {WHY_DIFFERENT.map((item) => (
            <div key={item.title} className="glass-card p-6">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #F8D011, transparent)" }} />
      </div>

      {/* Operational Fit */}
      <section className="mx-auto max-w-[720px] px-5 py-12 sm:px-8">
        <div className="glass-card p-6 sm:p-8 space-y-4" style={{ borderColor: "rgba(248, 208, 17, 0.3)" }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>
            Operational Fit
          </p>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            Designed to fit inside your real workday.
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Assessment", detail: "15 minutes per person. Results available immediately." },
              { label: "Debriefs", detail: "Facilitated by your team leads using the structured playbook." },
              { label: "Aggregate data", detail: "Anonymised by default. N≥5 before any team data surfaces." },
              { label: "Retakes", detail: "Built into the pricing. Growth measurement is not an add-on." },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-sm font-semibold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>{item.label}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #F8D011, transparent)" }} />
      </div>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
            The question is not whether your team has potential. It is whether you can see where the potential is covered.
          </h2>
          <p className="mx-auto mt-2 max-w-[440px] text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
            Start with a 30-minute conversation. We will show you the governance model, the aggregate data structure,
            and what measured behavioural change looks like inside an organisation.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/enterprise" className="btn-primary">
              Request a Briefing
            </Link>
            <Link href="/143" className="btn-watch">
              Try the 143 Challenge — Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
