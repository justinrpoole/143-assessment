import Link from "next/link";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the 143 Leadership platform.",
};

const LAST_UPDATED = "21 February 2026";

export default async function TermsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_terms",
    sourceRoute: "/terms",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <MarketingNav />

      <article className="mx-auto max-w-[720px] px-5 pt-16 pb-20 sm:px-8 sm:pt-24">
        {/* ── Header ── */}
        <header className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Legal
          </p>
          <h1 className="mt-4 text-3xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Terms of Service
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        {/* ── Content ── */}
        <div className="glass-card space-y-8 p-6 sm:p-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              1. Agreement to Terms
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              By accessing or using the 143 Leadership platform (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the Service. We may update these terms from time to time and will notify you of material changes.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              2. Description of Service
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              143 Leadership provides a behavioural assessment platform that measures 9 trainable leadership capacities. The Service includes: the 143 Assessment (143-question behavioural evaluation), the Light Check (free eclipse screening), the Coaching OS (monthly subscription with retakes and training tools), report generation, and related educational content. The Service is for personal and professional development purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              3. Account Registration
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              To use certain features of the Service, you must create an account by providing a valid email address. Authentication is handled via magic link (passwordless). You are responsible for maintaining the security of your email account and for any activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              4. Payments and Subscriptions
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              Certain features require payment. The 143 Assessment is a one-time purchase. The Coaching OS is a monthly subscription. All payments are processed securely through Stripe. Prices are displayed at the time of purchase and may be updated with notice. Subscriptions automatically renew unless cancelled before the renewal date.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              5. Cancellation and Refunds
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              You may cancel your Coaching OS subscription at any time through the account settings or Stripe billing portal. Cancellation takes effect at the end of the current billing period. There are no cancellation fees, penalties, or exit interviews. Your assessment history and results remain accessible after cancellation. One-time assessment purchases are non-refundable once the assessment has been started.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              6. Intellectual Property
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              The 143 Assessment, Be The Light Framework, scoring methodology, Light Signature system, Eclipse concept, and all related content are the intellectual property of 143 Leadership. Your assessment results belong to you. You may share your results for personal purposes. You may not reproduce, distribute, or create derivative works from the assessment questions, scoring algorithms, or framework materials without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              7. Educational Purpose Disclaimer
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              The 143 Assessment is an educational and coaching tool. It is not a clinical diagnostic instrument, therapeutic intervention, or substitute for professional mental health services. The results are designed to support personal and professional development. If you are experiencing mental health difficulties, please consult a qualified professional.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              8. Limitation of Liability
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              143 Leadership provides the Service &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We make no warranties, expressed or implied, regarding the Service or your results. We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              9. Acceptable Use
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              You agree not to: attempt to reverse-engineer the scoring algorithm; submit assessments on behalf of others without their consent; use the platform for any unlawful purpose; attempt to gain unauthorised access to other users&apos; data; or use automated systems to access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              10. Termination
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              We reserve the right to suspend or terminate your account if you violate these Terms. You may delete your account at any time by contacting us. Upon termination, your right to use the Service ceases, but these Terms continue to apply to any prior use.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              11. Governing Law
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              These Terms shall be governed by the laws of the jurisdiction in which 143 Leadership operates. Any disputes arising from these Terms or the Service shall be resolved through good-faith negotiation before pursuing formal legal action.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              12. Contact
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              If you have questions about these Terms, please contact us through our website.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/privacy" className="text-sm underline underline-offset-2 transition-colors hover:text-brand-gold" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
            Read our Privacy Policy
          </Link>
        </div>
      </article>
    </main>
  );
}
