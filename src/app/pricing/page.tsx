import Link from "next/link";

import SocialProofTicker from "@/components/marketing/SocialProofTicker";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Plans & Pricing — 143 Leadership",
  description: "Start free. Go deeper when you are ready. From a 3-minute Light Check to the full 143 Assessment, Portal Membership, and 10-week Coaching. Every tier is built to prove change, not just describe you.",
};

const PLANS = [
  {
    id: "light-check",
    title: "The Light Check",
    price: "Free",
    frequency: "",
    description:
      "A three-minute eclipse screening that tells you whether stress is covering your strongest capacities right now. No account. No email. Just clarity.",
    features: [
      "Quick eclipse screening in plain language",
      "No account or email required",
      "Instant results — know in three minutes",
      "Understand whether eclipse is running your week",
      "Private — nothing stored, nothing tracked",
    ],
    cta: { label: "Start the Light Check", href: "/preview" },
    highlight: false,
  },
  {
    id: "assessment",
    title: "Gravitational Stability Report",
    price: "$43",
    frequency: "one-time",
    description:
      "Your complete behavioural map. 143 questions — the number is not arbitrary, it is the foundation principle built into the design. Measures 9 trainable capacities, identifies your Light Signature, and reveals where eclipse is strongest.",
    features: [
      "Your Light Signature — one of 36 unique patterns",
      "Your Eclipse Snapshot — where stress covers capacity",
      "Energy-to-Eclipse Ratio and Rise Path",
      "Complete behavioural map across all 9 Rays",
      "Gravitational Stability Score",
      "Performance-Presence Delta analysis",
      "Permanent access to your results",
      "Downloadable PDF report",
    ],
    cta: { label: "Get Your Report", href: "/upgrade" },
    highlight: true,
  },
  {
    id: "portal-membership",
    title: "Portal Membership",
    price: "$14.33",
    frequency: "/month",
    description:
      "Everything in the report plus a daily operating system that closes the knowing-doing gap. Retake monthly to watch your capacities change in real time.",
    features: [
      "Full Gravitational Stability Report included",
      "Unlimited monthly retakes (43-question tracking set)",
      "Watch Me and Go First interactive flows",
      "Daily micro-practices matched to your Rise Path",
      "Watch your scores change month over month",
      "Energy Audit and Evening Reflection tools",
      "Growth tracking dashboard",
      "Weekly Scan",
    ],
    cta: { label: "Start Portal Membership", href: "/upgrade" },
    highlight: false,
  },
  {
    id: "coaching-10wk",
    title: "10-Week Coaching",
    price: "$143",
    frequency: "/week",
    description:
      "Structured coaching built on your Gravitational Stability Report. 10 weeks. Your Portal Membership is included for the duration. $1,430 total.",
    features: [
      "Full Gravitational Stability Report included",
      "Portal Membership included for 10 weeks",
      "Structured Light Activation Program",
      "Weekly coaching matched to your results",
      "Mid-point and final retake with comparison",
      "Direct support between sessions",
    ],
    cta: { label: "Learn About Coaching", href: "/coaches" },
    highlight: false,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "Custom",
    frequency: "",
    description:
      "Team-wide assessment with aggregate pattern analysis, individual Rise Paths, executive coaching, and behavioural ROI — proof of change, not satisfaction surveys.",
    features: [
      "Team-wide 143 Assessment deployment",
      "Aggregate team pattern and eclipse analysis",
      "Individual Rise Paths for every team member",
      "Executive coaching sessions",
      "Behavioural ROI framework",
      "Custom integration with existing L&D programmes",
      "Quarterly re-assessment and progress reporting",
      "Dedicated account manager",
    ],
    cta: { label: "Contact Us", href: "/corporate" },
    highlight: false,
  },
] as const;

const COMPARISON_FEATURES = [
  { name: "Eclipse Screening", lightCheck: true, report: true, portal: true, coaching10wk: true, enterprise: true },
  { name: "Light Signature", lightCheck: false, report: true, portal: true, coaching10wk: true, enterprise: true },
  { name: "Full 9-Ray Behavioural Map", lightCheck: false, report: true, portal: true, coaching10wk: true, enterprise: true },
  { name: "Eclipse Snapshot", lightCheck: false, report: true, portal: true, coaching10wk: true, enterprise: true },
  { name: "Gravitational Stability Score", lightCheck: false, report: true, portal: true, coaching10wk: true, enterprise: true },
  { name: "PDF Report Download", lightCheck: false, report: true, portal: true, coaching10wk: true, enterprise: true },
  { name: "Monthly Retakes", lightCheck: false, report: false, portal: true, coaching10wk: true, enterprise: true },
  { name: "Watch Me & Go First Flows", lightCheck: false, report: false, portal: true, coaching10wk: true, enterprise: true },
  { name: "Daily Micro-Practices", lightCheck: false, report: false, portal: true, coaching10wk: true, enterprise: true },
  { name: "Growth Tracking Dashboard", lightCheck: false, report: false, portal: true, coaching10wk: true, enterprise: true },
  { name: "Weekly Scan", lightCheck: false, report: false, portal: true, coaching10wk: true, enterprise: true },
  { name: "Weekly Coaching Sessions", lightCheck: false, report: false, portal: false, coaching10wk: true, enterprise: true },
  { name: "Team Aggregate Analysis", lightCheck: false, report: false, portal: false, coaching10wk: false, enterprise: true },
  { name: "Behavioural ROI Framework", lightCheck: false, report: false, portal: false, coaching10wk: false, enterprise: true },
] as const;

const FAQS = [
  {
    q: "How long does the assessment take?",
    a: "Most people complete the full 143-question assessment in 12 to 18 minutes. You can save your progress at any time and come back later — your answers are automatically saved as you go.",
  },
  {
    q: "What happens after I complete the assessment?",
    a: "Your results are scored immediately. You will see your Light Signature, Eclipse Snapshot, Energy-to-Eclipse Ratio, and a complete behavioural map across all 9 Rays. Your Gravitational Stability Report is available as a downloadable PDF on the paid tiers.",
  },
  {
    q: "Can I retake the assessment?",
    a: "With the Portal Membership, you can retake a 43-question tracking version every month. This lets you measure real behavioural change over time rather than relying on how you feel.",
  },
  {
    q: "What is the difference between the report and the Portal Membership?",
    a: "The Gravitational Stability Report is a one-time map of where you are right now. The Portal Membership adds a daily operating system — Watch Me, Go First, micro-practices, retakes, growth tracking — that helps you move from knowing to doing.",
  },
  {
    q: "What is the 10-Week Coaching?",
    a: "$143 per week for 10 weeks. Structured coaching built on your Gravitational Stability Report. Your Portal Membership is included for the duration. Weekly sessions matched to your results, with a mid-point retake and a final comparison.",
  },
  {
    q: "Is this backed by research?",
    a: "The 143 framework is built on a foundation of self-directed compassion — 143 means I love you — and draws on decades of behavioural science, positive psychology, and neuroscience research. Every capacity is mapped to published evidence. The scoring engine is deterministic and auditable.",
  },
  {
    q: "What if I want to cancel my Portal Membership?",
    a: "Cancel anytime. No penalties. No exit interviews. Your assessment history stays. Your data does not disappear. When you come back, your map is waiting.",
  },
  {
    q: "How does the enterprise tier work?",
    a: "Enterprise engagements start with a discovery call to understand your team structure and goals. We design a custom deployment that includes team-wide assessment, individual coaching paths, and a behavioural ROI framework that proves change — not just satisfaction.",
  },
  {
    q: "Is my data private?",
    a: "Your responses are encrypted in transit and at rest. We never sell your data. Your behavioural map belongs to you. See our privacy policy for the full details.",
  },
] as const;

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="#F8D011" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="#F8D011" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <path d="M5.5 8h5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default async function PricingPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_pricing",
    sourceRoute: "/pricing",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[960px] px-5 pt-16 pb-12 text-center sm:px-8 sm:pt-24 sm:pb-16">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Start free. Go deeper when you are ready.
        </p>
        <h1 className="mx-auto mt-4 max-w-[640px] text-3xl font-bold leading-tight sm:text-4xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Every tier answers the same question: what happens when your strongest capacities come back online?
        </h1>
        <p className="mx-auto mt-4 max-w-[560px] text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          The free Light Check takes 3 minutes. The full assessment takes 15. The Portal tracks your growth monthly. Coaching proves it in 10 weeks. Pick the depth that matches where you are right now.
        </p>
      </section>

      {/* ── Plan Cards ── */}
      <section className="mx-auto max-w-[1100px] px-5 pb-16 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="glass-card flex flex-col p-6"
              style={plan.highlight ? { border: '1.5px solid var(--brand-gold, #F8D011)', boxShadow: '0 0 24px rgba(248,208,17,0.12)' } : undefined}
            >
              {plan.highlight && (
                <span
                  className="mb-3 inline-block self-start rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: 'var(--brand-gold, #F8D011)', color: '#020202' }}
                >
                  Most Popular
                </span>
              )}
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                {plan.title}
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
                  {plan.price}
                </span>
                {plan.frequency && (
                  <span className="text-sm" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
                    {plan.frequency}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
                {plan.description}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={plan.highlight ? "btn-primary mt-6 block text-center" : "btn-watch mt-6 block text-center"}
              >
                {plan.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social Proof Ticker ── */}
      <div className="py-6">
        <SocialProofTicker />
      </div>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #F8D011, transparent)' }} />
      </div>

      {/* ── Feature Comparison Table ── */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <h2 className="text-center text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Compare Plans
        </h2>
        <p className="mx-auto mt-3 max-w-[480px] text-center text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          See exactly what each tier includes. Every plan builds on the one before it.
        </p>
        <div className="glass-card mt-8 overflow-x-auto p-0">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border, rgba(255,255,255,0.10))' }}>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Feature</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>Light Check</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>Report</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>Portal</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>Coaching</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((row, i) => (
                <tr key={row.name} style={{ borderBottom: i < COMPARISON_FEATURES.length - 1 ? '1px solid var(--surface-border, rgba(255,255,255,0.06))' : 'none' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>{row.name}</td>
                  <td className="px-4 py-3 text-center">{row.lightCheck ? <CheckIcon /> : <DashIcon />}</td>
                  <td className="px-4 py-3 text-center">{row.report ? <CheckIcon /> : <DashIcon />}</td>
                  <td className="px-4 py-3 text-center">{row.portal ? <CheckIcon /> : <DashIcon />}</td>
                  <td className="px-4 py-3 text-center">{row.coaching10wk ? <CheckIcon /> : <DashIcon />}</td>
                  <td className="px-4 py-3 text-center">{row.enterprise ? <CheckIcon /> : <DashIcon />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #F8D011, transparent)' }} />
      </div>

      {/* ── Cancellation Policy ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          No Lock-In. No Penalties.
        </h2>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          Cancel your Portal Membership anytime. No exit interviews. No penalties.
          If your payment lapses, your assessment history stays. Your data does not disappear.
          When you come back, your map is waiting. We believe the work should earn your
          attention every month — not trap it.
        </p>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #F8D011, transparent)' }} />
      </div>

      {/* ── FAQ Section ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <h2 className="text-center text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-3 max-w-[480px] text-center text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          Everything you need to know before you begin.
        </p>
        <div className="mt-8 space-y-4">
          {FAQS.map((faq) => (
            <details key={faq.q} className="glass-card group p-5">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
                {faq.q}
                <svg
                  className="ml-3 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ color: 'var(--brand-gold, #F8D011)' }}
                  aria-hidden="true"
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
        <div className="glass-card p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Not sure where to start?
          </p>
          <h2 className="mt-3 text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Start free. The assessment proves the rest.
          </h2>
          <p className="mx-auto mt-3 max-w-[420px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            The 143 Challenge rewires your brain in 3 days. The Light Check shows you where eclipse is covering capacity in 3 minutes. Both are free. Both prove the framework works before you spend a dollar.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/143" className="btn-primary">
              Start the 143 Challenge — Free
            </Link>
            <Link href="/preview" className="btn-watch">
              Take the 3-Minute Light Check
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
