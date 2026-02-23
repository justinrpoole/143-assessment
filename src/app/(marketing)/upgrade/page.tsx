import Link from "next/link";

import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { UpgradeCheckoutClient } from "@/components/billing/UpgradeCheckoutClient";
import DimmingCarryForwardCard from "@/components/billing/DimmingCarryForwardCard";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upgrade",
  description: "Choose how deep you want to see. Unlock the full 143 Assessment for $43 one-time or start the Coaching OS at $14.33/month.",
};

export default async function UpgradePage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_upgrade",
    sourceRoute: "/upgrade",
    userState,
  });

  return (
    <>
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[960px] px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
        <div className="max-w-[640px]">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Two ways in. Same light.
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Choose how deep you want to see.
          </h1>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            $43 gives you your full 9-Ray report, your Light Signature, Eclipse Snapshot, and a
            personalised Rise Path with concrete next actions. $14.33/mo adds unlimited retakes —
            watch your scores move and prove the reps are landing.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#plans" className="btn-primary">
              Compare Plans
            </Link>
            <Link href="/preview" className="btn-watch">
              Start with a Free Light Check
            </Link>
          </div>
        </div>
      </section>

      {/* ── Dimming Check Carry-Forward ── */}
      <div className="mx-auto max-w-[960px] px-5 sm:px-8">
        <DimmingCarryForwardCard />
      </div>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #F8D011, transparent)' }} />
      </div>

      {/* ── Conversion Questions ── */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              q: "How much did your last leadership programme cost? How long did the results last?",
              a: "Those programmes taught tactics without upgrading the operating system that runs them. This one starts with the OS.",
            },
            {
              q: "What would change if you could see your own pattern — clearly, in one page?",
              a: "Your Light Signature shows which capacities are strong, which are eclipsed, and which specific tool to use first.",
            },
            {
              q: "What if the assessment was designed to prove change, not just describe you?",
              a: "Retake it in 90 days. Watch the scores move. That is proof the reps are landing.",
            },
          ].map((item) => (
            <div key={item.q} className="glass-card p-5">
              <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                {item.q}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #F8D011, transparent)' }} />
      </div>

      {/* ── Plans ── */}
      <section id="plans" className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Pick Your Path
          </p>
          <h2 className="mt-3 text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Both plans keep your full assessment history.
          </h2>
          <p className="mx-auto mt-2 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            Cancel anytime — your data stays. Your map is waiting when you come back.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Assessment Plan */}
          <div className="glass-card flex flex-col p-6" style={{ border: '1.5px solid var(--brand-gold, #F8D011)', boxShadow: '0 0 24px rgba(248,208,17,0.12)' }}>
            <span
              className="mb-3 inline-block self-start rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: 'var(--brand-gold, #F8D011)', color: '#020202' }}
            >
              One-Time
            </span>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              The 143 Assessment
            </p>
            <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
              $43 <span className="text-sm font-normal" style={{ color: 'var(--text-on-dark-muted)' }}>one-time</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2">
              {[
                "Your Light Signature (one of 36)",
                "Full 9-Ray capacity report with Eclipse Snapshot",
                "Personalised Rise Path with concrete next actions",
                "Energy-to-Eclipse Ratio and Gravitational Stability",
                "Downloadable PDF report",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                    <circle cx="8" cy="8" r="7" stroke="#F8D011" strokeWidth="1.5" />
                    <path d="M5 8l2 2 4-4" stroke="#F8D011" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coaching OS Plan */}
          <div className="glass-card flex flex-col p-6">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              The Coaching OS
            </p>
            <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
              $14.33 <span className="text-sm font-normal" style={{ color: 'var(--text-on-dark-muted)' }}>/month</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2">
              {[
                "Everything in the assessment",
                "Unlimited monthly retakes (43-question tracking set)",
                "Daily micro-practices matched to your Rise Path",
                "Watch your scores change month over month",
                "All results and reports stay even if you cancel",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                    <circle cx="8" cy="8" r="7" stroke="#F8D011" strokeWidth="1.5" />
                    <path d="M5 8l2 2 4-4" stroke="#F8D011" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Checkout Client */}
        <div className="glass-card mt-6 p-6">
          <UpgradeCheckoutClient />
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #F8D011, transparent)' }} />
      </div>

      {/* ── Feedback Widgets ── */}
      <section className="mx-auto max-w-[960px] space-y-4 px-5 py-12 sm:px-8">
        <div className="glass-card p-5">
          <FeedbackWidget
            feedback_type="upgrade_clarity"
            source_route="/upgrade"
            title="Offer clarity check"
          />
        </div>
        <div className="glass-card p-5">
          <FeedbackWidget
            feedback_type="checkout_friction"
            source_route="/upgrade"
            title="Checkout friction check"
          />
        </div>
      </section>
    </>
  );
}
