import Link from 'next/link';

// IS / IS NOT governance table
const IS_TABLE = [
  { is: 'A development tool that builds leadership capacity across teams', isNot: 'A performance management or ranking system' },
  { is: 'Aggregate data (N >= 5, consent-gated) that reveals team patterns', isNot: 'Individual scoring visible to managers or HR' },
  { is: 'A starting point for coaching conversations grounded in data', isNot: 'A hiring, firing, or promotion decision input' },
  { is: 'A capacity signal under real operating conditions', isNot: 'A medical or personality classification tool' },
  { is: 'Confidential by design — individuals own their results', isNot: 'Surveillance, monitoring, or behavioral tracking' },
];

const WHAT_ENTERPRISE_GETS = [
  {
    icon: '📊',
    title: 'Aggregate Capacity Intelligence',
    description: 'See which Rays are strong across your team and which are in eclipse — without exposing any individual. Patterns emerge at the team level that no individual assessment can reveal.',
  },
  {
    icon: '🔥',
    title: 'Early Depletion Detection',
    description: 'The Energy Ratio and Load Signal Count flag energy borrowing across teams before it shows up in turnover numbers. You see the cost before you pay it.',
  },
  {
    icon: '⚡',
    title: 'Behavioral ROI Framework',
    description: 'Before-and-after retake data connects capacity growth to team outcomes. Not satisfaction surveys. Measured behavioral change with timestamps.',
  },
  {
    icon: '🎯',
    title: 'Structured Coaching Tools',
    description: 'Session prep data, structured debrief protocols, and group coaching frameworks — all built on the same constructs as the assessment. Your team leads can facilitate using the built-in playbook.',
  },
];

const PRICING = [
  {
    name: 'Team Cohort',
    price: '$14,300',
    seats: '50 seats',
    includes: ['Full 143 Assessment per participant', 'Aggregate capacity dashboard', 'One structured debrief session', 'Governance-compliant reporting', 'Implementation support'],
    cta: 'Start with your team',
  },
  {
    name: 'Enterprise Pilot',
    price: '$28,600',
    seats: '200 seats',
    highlight: true,
    includes: ['Everything in Team Cohort', 'Load Signal Count and depletion detection', 'Multi-cohort aggregate dashboard', 'Two live debrief sessions with retake cycle', 'Dedicated implementation and coaching support'],
    cta: 'Launch a pilot',
  },
  {
    name: 'Annual License',
    price: '$143,000',
    seats: '1,000 seats',
    includes: ['Everything in Enterprise Pilot', 'Unlimited cohort rollouts with retake cycles', 'Custom onboarding and change management', 'Structured coaching playbook for team leads', 'Quarterly strategy reviews with behavioral ROI', 'Priority access + API integration'],
    cta: 'Contact us for licensing',
  },
];

export default function EnterpriseSalesPage() {
  return (
    <main className="cosmic-page-bg">

      {/* Hero */}
      <section className="px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">
            Built for development. Not surveillance.
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ color: 'var(--text-on-dark)' }}>
            You measure performance. Do you measure the capacity to perform?
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            The 143 OS maps the 9 behavioral capacities that determine whether your team can execute — and gives leaders the data to act before the cost shows up in turnover numbers.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <a
              href="mailto:enterprise@143leadership.com"
              className="btn-primary text-base px-8 py-3"
            >
              Contact us
            </a>
            <Link href="#pricing" className="btn-watch px-8 py-3">
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 py-16 max-w-4xl mx-auto space-y-6">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">The gap no one is measuring</p>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
            How much did your last leadership initiative cost? How long did the results last?
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            When your team is deep in energy borrowing, performance initiatives create pressure — not results.
            High-performing teams often have the skills. What they lack is the operating capacity to use them
            under real conditions. The 143 OS detects that gap at the team level, names the specific
            capacities in eclipse, and provides the training infrastructure to restore access — with
            retake data to prove the change is real.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {[
            { stat: '9', label: 'Trainable leadership capacities mapped per person' },
            { stat: '143', label: 'Science-backed items in the full assessment' },
            { stat: 'N>=5', label: 'Minimum group size before any team data is surfaced' },
          ].map((item) => (
            <div key={item.label} className="glass-card p-6 text-center">
              <p className="text-4xl font-bold text-brand-gold">{item.stat}</p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-on-dark-secondary)' }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What Enterprise Gets */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">What you get</p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-on-dark)' }}>Built for development. Not surveillance.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {WHAT_ENTERPRISE_GETS.map((item) => (
              <div key={item.title} className="glass-card p-6 space-y-3">
                <div className="text-3xl">{item.icon}</div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-on-dark)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy commitment */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="glass-card p-8 space-y-4" style={{ borderColor: 'rgba(248, 208, 17, 0.3)' }}>
          <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">Privacy commitment</p>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
            Individual scores never surface to managers. That is not a policy. It is architecture.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Every aggregate view requires a minimum of 5 participants (N&gt;=5) before any team data is surfaced.
            Individual results are consent-gated. Managers see capacity patterns — not people. The system is
            designed so that development feels safe, because development only works when people are honest.
          </p>
        </div>
      </section>

      {/* IS / IS NOT Governance Table */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">Governance</p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-on-dark)' }}>This is / This is not</h2>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-2 text-on-dark text-sm font-semibold" style={{ background: 'linear-gradient(to right, var(--cosmic-purple-gradient), var(--cosmic-purple-vivid))' }}>
              <div className="px-6 py-3">This IS</div>
              <div className="px-6 py-3 border-l border-white/20">This is NOT</div>
            </div>
            {IS_TABLE.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 text-sm ${i % 2 === 0 ? '' : 'bg-white/5'}`}
              >
                <div className="px-6 py-4 flex items-start gap-2" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                  {row.is}
                </div>
                <div className="px-6 py-4 flex items-start gap-2 border-l" style={{ color: 'var(--text-on-dark-muted)', borderColor: 'var(--surface-border)' }}>
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                  {row.isNot}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 max-w-5xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">Investment</p>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-on-dark)' }}>Priced for serious deployment</h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-on-dark-muted)' }}>
            All tiers include aggregate dashboards, governance-compliant reporting, and consent-gated privacy controls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PRICING.map((tier) => (
            <div
              key={tier.name}
              className={`glass-card p-6 space-y-4 ${
                tier.highlight
                  ? 'scale-[1.02]'
                  : ''
              }`}
              style={tier.highlight ? { borderColor: 'rgba(248, 208, 17, 0.4)' } : undefined}
            >
              {tier.highlight && (
                <span className="text-xs bg-brand-gold text-brand-black font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most popular
                </span>
              )}
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {tier.name}
                </p>
                <p className="text-3xl font-bold mt-1 text-brand-gold">
                  {tier.price}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {tier.seats}
                </p>
              </div>

              <ul className="space-y-2">
                {tier.includes.map((item) => (
                  <li key={item} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-on-dark-secondary)' }}>
                    <span className="text-brand-gold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:enterprise@143leadership.com"
                className={tier.highlight ? 'btn-primary block text-center' : 'btn-watch block text-center'}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <section className="px-6 py-16 text-center space-y-6">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text-on-dark)' }}>The question is not whether your team has potential. It is whether you can see where the potential is covered.</h2>
        <p className="max-w-xl mx-auto text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
          Start with a 30-minute conversation. We will show you the governance structure,
          the aggregate data model, and what measured behavioral change looks like inside an organization.
        </p>
        <a
          href="mailto:enterprise@143leadership.com"
          className="btn-primary inline-block"
        >
          Contact us
        </a>
      </section>
    </main>
  );
}
