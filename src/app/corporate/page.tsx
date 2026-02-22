import Link from "next/link";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Corporate Programs — 143 Leadership",
  description:
    "Bring the 143 Leadership OS to your organisation. Capacity intelligence for development teams, not surveillance systems.",
};

const USE_CASES = [
  {
    title: "Leadership Development",
    description:
      "Replace generic competency models with individual behavioural maps. Each leader gets a Light Signature, Eclipse Snapshot, and Rise Path — specific enough to act on, measurable enough to track.",
    outcome: "Leaders who know their patterns and have a protocol for changing them.",
  },
  {
    title: "Team Composition Analysis",
    description:
      "See which Rays are concentrated in the team and which are missing. Understand why the team defaults to certain behaviours under pressure and where the blind spots sit.",
    outcome: "Hiring and assignment decisions informed by actual capacity data.",
  },
  {
    title: "Post-Merger Integration",
    description:
      "When two cultures collide, it is not values that clash — it is default leadership patterns. Map both teams, find the overlaps and gaps, and design an integration plan based on data instead of politics.",
    outcome: "Faster integration with less culture friction.",
  },
  {
    title: "High-Potential Programmes",
    description:
      "Identify high-potential leaders not by their résumé, but by their capacity range. The 143 measures 9 trainable dimensions — leaders with broad range across all nine are your most adaptable.",
    outcome: "Development programmes targeted to actual growth areas.",
  },
  {
    title: "Burnout Prevention",
    description:
      "The Eclipse Snapshot measures sustained load across four dimensions. Catch elevated eclipse before it becomes attrition. Early intervention is cheaper than replacement.",
    outcome: "Leading indicators for burnout risk at the individual and team level.",
  },
  {
    title: "Executive Coaching Augmentation",
    description:
      "Give your executive coaches data. Every coaching session can start with the latest 9-Ray scores, rep log, and monthly retake comparison. Data-led coaching produces measurable results.",
    outcome: "Coaching ROI you can actually quantify.",
  },
];

const DIFFERENTIATORS = [
  {
    title: "Development, not surveillance",
    description:
      "Individual results are private. Aggregate data is anonymised. The system is built for growth, not performance management.",
  },
  {
    title: "Trainable capacities, not fixed traits",
    description:
      "Unlike personality assessments, every score on the 143 is designed to change with practice. Monthly retakes track actual growth.",
  },
  {
    title: "Deterministic scoring",
    description:
      "The same answers always produce the same results. SHA-256 audit signatures on every scored assessment. Full transparency, zero black boxes.",
  },
  {
    title: "Built-in practice layer",
    description:
      "Assessment without action is trivia. Every participant gets access to the 10-week Light Activation Program, daily micro-practices, and monthly retakes.",
  },
];

const DEPLOYMENT_OPTIONS = [
  {
    label: "Pilot",
    size: "10–25 participants",
    includes: [
      "Full 143-question assessment for each participant",
      "Individual reports with Light Signature and Rise Path",
      "Aggregate cohort pattern analysis",
      "One facilitated debrief session",
      "30-day retake comparison",
    ],
  },
  {
    label: "Programme",
    size: "25–100 participants",
    includes: [
      "Everything in Pilot",
      "Multiple cohort breakdowns (by team, level, or function)",
      "Quarterly retake cycles",
      "Executive summary report for sponsors",
      "Dedicated account support",
    ],
  },
  {
    label: "Enterprise",
    size: "100+ participants",
    includes: [
      "Everything in Programme",
      "Custom deployment timeline",
      "API integration for HR systems",
      "Ongoing monthly aggregate reporting",
      "Coach training for internal facilitators",
      "Priority support and SLA",
    ],
  },
];

export default async function CorporatePage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_corporate",
    sourceRoute: "/corporate",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <MarketingNav />

      {/* Hero */}
      <section className="mx-auto max-w-[720px] px-5 pt-16 pb-12 text-center sm:px-8 sm:pt-24 sm:pb-16">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--brand-gold, #F8D011)" }}
        >
          Corporate Programs
        </p>
        <h1
          className="mt-4 text-3xl font-bold sm:text-4xl"
          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
        >
          Capacity intelligence for organisations that develop leaders, not label them.
        </h1>
        <p
          className="mx-auto mt-3 max-w-[540px] text-sm leading-relaxed"
          style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
        >
          The 143 Leadership OS gives every leader an individual behavioural map and
          gives the organisation aggregate intelligence — which capacities are strong,
          which are eclipsed, and where targeted development will have the biggest impact.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/enterprise" className="btn-primary">
            Request a Briefing
          </Link>
          <Link href="#use-cases" className="btn-watch">
            See Use Cases
          </Link>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #F8D011, transparent)",
          }}
        />
      </div>

      {/* Differentiators */}
      <section className="mx-auto max-w-[720px] space-y-8 px-5 py-12 sm:px-8">
        <div className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            What Makes This Different
          </p>
          <h2
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Built for development. Not for surveillance.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {DIFFERENTIATORS.map((item) => (
            <div key={item.title} className="glass-card p-6">
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                {item.title}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--text-on-dark-secondary)" }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #F8D011, transparent)",
          }}
        />
      </div>

      {/* Use Cases */}
      <section
        id="use-cases"
        className="mx-auto max-w-[720px] space-y-8 px-5 py-12 sm:px-8"
      >
        <div className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            Use Cases
          </p>
          <h2
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Six ways organisations deploy the 143.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {USE_CASES.map((uc) => (
            <div key={uc.title} className="glass-card p-6">
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                {uc.title}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--text-on-dark-secondary)" }}
              >
                {uc.description}
              </p>
              <p
                className="mt-3 text-xs font-semibold"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                Outcome: {uc.outcome}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #F8D011, transparent)",
          }}
        />
      </div>

      {/* Deployment Options */}
      <section className="mx-auto max-w-[720px] space-y-8 px-5 py-12 sm:px-8">
        <div className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            Deployment Options
          </p>
          <h2
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Start small. Scale with evidence.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {DEPLOYMENT_OPTIONS.map((option) => (
            <div key={option.label} className="glass-card p-6">
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                {option.label}
              </p>
              <p
                className="mt-1 text-lg font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                {option.size}
              </p>
              <ul className="mt-4 space-y-2">
                {option.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-xs leading-relaxed"
                    style={{ color: "var(--text-on-dark-secondary)" }}
                  >
                    <svg
                      className="mt-0.5 h-3 w-3 shrink-0"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{ color: "var(--brand-gold, #F8D011)" }}
                    >
                      <path
                        d="M3 8l3.5 3.5L13 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #F8D011, transparent)",
          }}
        />
      </div>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
        <div className="glass-card p-8">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Ready to bring the 143 to your organisation?
          </h2>
          <p
            className="mx-auto mt-2 max-w-[440px] text-sm leading-relaxed"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            Tell us about your team size, timeline, and goals. We will design a deployment that fits your context — no generic packages, no unnecessary overhead.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/enterprise" className="btn-primary">
              Request a Briefing
            </Link>
            <Link href="/cohorts" className="btn-watch">
              Explore Group Coaching Cohorts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
