import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import "@/components/marketing/cosmic-hero-static.css";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

const HOMEPAGE_TITLE = "The 143 Challenge | See Your Filter Reprogram in 3 Days";
const HOMEPAGE_DESCRIPTION =
  "Your light was never gone. It was only eclipsed. In 3 days, you'll see 143 everywhere—proof that your Reticular Activating System (attention filter) works exactly as we're about to reprogram it. Free challenge. Self-directed. Evidence-based.";

export const metadata: Metadata = {
  title: HOMEPAGE_TITLE,
  description: HOMEPAGE_DESCRIPTION,
  openGraph: {
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
  },
};

export default async function UpgradeYourOsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_upgrade_os",
    sourceRoute: "/upgrade-your-os",
    userState,
  });

  return (
    <main className="cosmic-page-bg page-shell relative">
      <div className="content-wrap content-wrap--wide py-8 sm:py-12">
        <section className="grid min-h-[100svh] items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            <h1 className="hero-h1 text-4xl font-bold leading-[1.03] sm:text-5xl lg:text-6xl">
              <span className="hero-hl-yellow block">YOUR LIGHT WAS NEVER GONE.</span>
              <span className="hero-hl-purple block">IT WAS ONLY ECLIPSED.</span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-body sm:text-lg">
              In 3 days, you&apos;ll see 143 everywhere. Not because it&apos;s magic. Because your Reticular
              Activating System—your brain&apos;s attention filter—works exactly how we&apos;re about to
              reprogram it. This is proof that change is possible.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/challenge" className="cta">
                Start The 143 Challenge
              </Link>
              <p className="pill pill--yellow" data-tone="yellow">
                <span className="dot" />
                Free • 3 Days • Self-Directed Proof
              </p>
            </div>

            <p className="text-sm text-secondary">
              <Link href="/assessment" className="underline decoration-current/50 underline-offset-4 hover:opacity-90">
                Or skip to the full assessment
              </Link>
            </p>

            <p className="text-sm text-muted">
              10,000+ leaders who saw 143 everywhere and recognized their filter
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div data-cosmic-hero-static>
              <div className="eclipse-stage" aria-hidden="true">
                <Image
                  className="sunnova-svg"
                  src="/marketing/143-sun-nova.png"
                  alt=""
                  width={420}
                  height={420}
                  priority
                />
                <Image
                  className="sun-svg"
                  src="/marketing/Sun-143.svg"
                  alt=""
                  width={420}
                  height={420}
                  priority
                />
                <Image
                  className="moon"
                  src="/marketing/Purple-Moon-143.svg"
                  alt=""
                  width={320}
                  height={320}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6 pb-12">
          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-header sm:text-3xl">
              Your Brain Processes 11 Million Bits Per Second
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body">
              Your Reticular Activating System filters that down to 40-50 bits of consciousness. Right
              now, it&apos;s tuned to find threat and self-criticism. The 143 Challenge rewires it to find
              what you actually want to notice.
            </p>
          </section>

          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-header sm:text-3xl">
              See 143 Everywhere in 72 Hours
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body">
              Day 1: Notice. Your brain will start filtering for 143 everywhere (clocks at :43, receipts,
              addresses, license plates). This proves the RAS works.
              <br />
              Day 2: Activate. Variable reps with the hand-over-heart protocol.
              <br />
              Day 3: Recognize. Name what you see in your own leadership pattern.
            </p>
            <div className="mt-5">
              <Link href="/challenge" className="btn-cta">
                Start Day 1 Now
              </Link>
            </div>
          </section>

          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-header sm:text-3xl">
              The 143 Hand-Over-Heart Protocol
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body">
              Hand to heart. Say &quot;I love you, I am safe, I am loved.&quot; Choose one aligned action
              immediately. This is 3 minutes of self-directed compassion that interrupts your threat filter
              and trains a new pattern.
            </p>
          </section>

          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-header sm:text-3xl">
              Backed By Neuroscience
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed text-body">
              <li>
                Dr. Jill Bolte Taylor — The 90-second chemical window (after that, you&apos;re re-triggering
                through thought)
              </li>
              <li>
                Dr. Albert Bandura — Micro-mastery reps that prove to your nervous system you can do the
                thing
              </li>
              <li>
                Dr. Rick Hanson — Repeated practice creates new neural pathways (neuroplasticity)
              </li>
              <li>Variable repetition — Your brain stays engaged; habituation doesn&apos;t lock in</li>
            </ul>
          </section>

          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-header sm:text-3xl">
              What Happens After 3 Days
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body">
              You&apos;ve proven to yourself that your filter can change. Now see the full map. Take the
              Gravitational Stability Check (free preview) or jump straight to the Be The Light Assessment
              (see all 9 Rays, your Light Signature, your Rise Path).
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/assessment" className="cta">
                See My Light Signature
              </Link>
              <Link href="/gravitational-stability" className="btn-cta">
                Start With the Free Preview
              </Link>
            </div>
          </section>

          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-header sm:text-3xl">The Full System</h2>
            <p className="mt-3 text-base leading-relaxed text-body">
              After the 143 Challenge, your toolkit includes: 9 Ray scores, Eclipse detection, Rise Path
              with daily tools, weekly retake access to track growth. One-time purchase: $43. Monthly
              retakes: $14.33/mo.
            </p>
            <div className="mt-5">
              <Link href="/assessment" className="cta">
                Get The Be The Light Assessment
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
