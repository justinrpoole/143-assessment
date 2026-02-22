import Link from "next/link";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

const LAST_UPDATED = "21 February 2026";

export default async function PrivacyPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_privacy",
    sourceRoute: "/privacy",
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
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        {/* ── Content ── */}
        <div className="glass-card space-y-8 p-6 sm:p-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              1. Introduction
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              143 Leadership (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the 143 Assessment platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this policy carefully. By accessing or using the platform, you agree to this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              2. Information We Collect
            </h2>
            <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>Personal Information</p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              When you create an account, we collect your email address. This is the only personally identifiable information required to use the assessment.
            </p>
            <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>Assessment Data</p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              When you take the assessment, we collect your responses to the 143 questions. These responses are used solely to compute your results, generate your Light Signature, Eclipse Snapshot, and Rise Path.
            </p>
            <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>Usage Data</p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              We automatically collect certain information when you visit the platform, including page views, session identifiers, and interaction events. This data is used to improve the user experience and diagnose technical issues.
            </p>
            <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>Payment Information</p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              Payment processing is handled entirely by Stripe. We do not store credit card numbers, bank account details, or other financial information on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              3. How We Use Your Information
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              <li>• To compute your assessment results and generate your report</li>
              <li>• To provide access to your results when you return</li>
              <li>• To deliver the services you have purchased (assessment, coaching OS, enterprise)</li>
              <li>• To send you account-related communications (magic link, session notifications)</li>
              <li>• To improve our platform and user experience through anonymised analytics</li>
              <li>• To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              4. Data Storage and Security
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              Your data is stored on secure, encrypted servers provided by Supabase (PostgreSQL). All data is encrypted in transit (TLS) and at rest. Authentication uses HMAC-SHA256 signed magic links with 15-minute expiration. Assessment scoring is deterministic and auditable, with SHA-256 signature pairs verifying that stored results match stored responses.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              5. Data Sharing
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              We do not sell, rent, or trade your personal information. We share data only with service providers necessary to operate the platform: Supabase (database hosting), Stripe (payment processing), and Vercel (hosting). Enterprise clients may receive aggregate team analysis, but individual responses are never shared with employers or team administrators.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              6. Your Rights
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              <li>• <strong style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>Access:</strong> You can view all your assessment data and results by signing in.</li>
              <li>• <strong style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>Correction:</strong> You can retake the assessment at any time to update your results.</li>
              <li>• <strong style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>Deletion:</strong> You can request complete deletion of your data at any time.</li>
              <li>• <strong style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>Portability:</strong> You can download your results as a PDF report.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              7. Cookies
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              We use essential cookies for authentication (session tokens) and analytics cookies for anonymised usage tracking. We do not use advertising cookies or third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              8. Changes to This Policy
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              We may update this Privacy Policy from time to time. The updated version will be indicated by the &ldquo;Last updated&rdquo; date at the top. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              9. Contact
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us through our website.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/terms" className="text-sm underline underline-offset-2 transition-colors hover:text-[#F8D011]" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
            Read our Terms of Service
          </Link>
        </div>
      </article>
    </main>
  );
}
