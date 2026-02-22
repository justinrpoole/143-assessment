'use client';

import Link from 'next/link';

interface ReportUpsellProps {
  /** Hide if user already has Coaching OS subscription */
  subscriptionActive?: boolean;
}

const FEATURES = [
  { label: 'Unlimited retakes', detail: 'Retake every 90 days and watch scores move' },
  { label: 'Daily coaching tools', detail: 'Presence Pause, RAS Reset, Go First, and more' },
  { label: 'Growth tracking', detail: 'Sparklines and before/after comparisons' },
  { label: 'If/Then plans', detail: 'Trigger-response pairs for real-world situations' },
];

export default function ReportUpsell({ subscriptionActive }: ReportUpsellProps) {
  if (subscriptionActive) return null;

  return (
    <section
      className="glass-card p-6 sm:p-8 space-y-5"
      style={{ borderColor: 'rgba(248, 208, 17, 0.2)' }}
    >
      <div className="text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F8D011' }}>
          Keep Going
        </p>
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          Your scores are designed to change.
        </h3>
        <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-on-dark-secondary)' }}>
          The assessment showed you where you are. The Coaching OS gives you the daily tools to move your numbers — and the retakes to prove it.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.label}
            className="flex items-start gap-3 rounded-xl p-3"
            style={{ background: 'rgba(96, 5, 141, 0.2)' }}
          >
            <span className="mt-0.5 text-sm" style={{ color: '#F8D011' }}>&#x2713;</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {f.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                {f.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <Link
          href="/upgrade"
          className="btn-primary px-8 py-3 text-sm font-semibold text-center"
        >
          Upgrade to Coaching OS — $14.33/mo
        </Link>
        <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
          Cancel anytime. Your report stays forever.
        </p>
      </div>
    </section>
  );
}
