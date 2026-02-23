import Link from "next/link";
import Image from "next/image";

import { ToolkitDeliveryClient } from "@/components/retention/ToolkitDeliveryClient";
import { PAGE_COPY_V1 } from "@/content/page_copy.v1";
import { emitPageView } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The 143 Challenge",
  description: "Your brain is running a threat filter you never installed. The 143 Challenge uses your Reticular Activating System to reprogram it in 3 days. 3 minutes a day. Free.",
};

export default async function Challenge143Page() {
  const auth = await getRequestAuthContext();
  const copy = PAGE_COPY_V1.challenge143;

  emitPageView({
    eventName: "page_view_143",
    sourceRoute: "/143",
    userState: auth.userState,
    userId: auth.userId,
  });

  return (
    <>
      {/* Hero */}
      <section className="lead-hero">
        <div className="lead-hero__inner">
          <div>
            <p className="lead-hero__kicker">Your brain is running a threat filter you never installed.</p>
            <h1 className="lead-hero__title">3 days to reprogram it. 3 minutes a day. Free.</h1>
            <p className="lead-hero__body">
              Your Reticular Activating System filters 11 million bits of sensory data every second. It decides what you notice. Right now, it is tuned to find threat. The 143 Challenge gives it new search instructions &mdash; through self-directed compassion plus structured repetition that rewires the filter. Not affirmation. Not positive thinking. A reprogramming act. 143 means &ldquo;I love you.&rdquo; One letter, four letters, three letters. That is the protocol. That is the proof.
            </p>
            <div className="lead-hero__cta-row">
              <Link href="/toolkit" className="btn-primary">
                Start the Challenge
              </Link>
              <Link href="/upgrade" className="btn-watch">
                Take the Full Assessment — $43
              </Link>
            </div>
          </div>
          <div className="lead-portrait" aria-hidden="true">
            <Image
              src="/images/justin-ray.svg"
              alt="Justin Ray"
              width={320}
              height={390}
              priority
            />
          </div>
        </div>
      </section>

      {/* Gold question band */}
      <section className="gold-band">
        <div className="gold-band__inner">
          <div>
            <p className="gold-band__item">Your inner critic is not a character flaw. It is a miscalibrated filter.</p>
            <p className="gold-band__sub">Self-compassion lowers cortisol. Self-criticism spikes it. A regulated nervous system sustains high standards.</p>
          </div>
          <div>
            <p className="gold-band__item">Hand over heart. &ldquo;I love you.&rdquo; That is the protocol.</p>
            <p className="gold-band__sub">143 = I love you. One letter, four letters, three letters. Every clock at 1:43 becomes a cue your brain cannot ignore.</p>
          </div>
          <div>
            <p className="gold-band__item">&ldquo;I choose what my mind magnifies.&rdquo;</p>
            <p className="gold-band__sub">3 days. 3 minutes. Your brain starts scanning for possibility instead of threat. That is restored access.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        <header className="glass-card p-6 mb-8 sm:p-8">
          <p className="chip mb-3">{copy.label}</p>
          <h2 className="mb-3 text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>
            {copy.headline}
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {copy.subhead}
          </p>
          <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.introQuestion}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={copy.ctas.primary.href} className="btn-primary">
              {copy.ctas.primary.label}
            </Link>
            <Link href={copy.ctas.secondary.href} className="btn-watch">
              {copy.ctas.secondary.label}
            </Link>
          </div>
        </header>

        <section id="challenge-start-now" className="glass-card p-6 mb-8 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.startNowTitle}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.startNowBody}</p>
          <ol className="mt-4 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {copy.challengeSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="mt-5">
            <Link href="/toolkit" className="font-semibold underline">
              Send me the Challenge Kit (free)
            </Link>
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <h2 className="mb-3 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>{copy.kitTitle}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.kitBody}</p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {copy.kitIncludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="mt-5">
            <ToolkitDeliveryClient isAuthenticated={auth.isAuthenticated} />
          </div>

          <p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{copy.close}</p>
          <div className="mt-4">
            <Link href="/toolkit" className="font-semibold underline">
              Get the Challenge Kit (free)
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
