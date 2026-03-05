import type { Metadata } from "next";

import ChallengeLeadCaptureClient from "./ChallengeLeadCaptureClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The I Love Challenge | 143",
  description:
    "143 means I love you. Join the I Love Challenge and unlock the workbook by email.",
};

export default function ChallengePage() {
  return (
    <main className="cosmic-page-bg page-shell min-h-screen">
      <section className="content-wrap--wide px-6 py-20 sm:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--gold-primary)" }}>
          1:43 • The I Love Challenge
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text-body)" }}>
          143 means I love you.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed" style={{ color: "var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 78%, transparent))" }}>
          This challenge is built to teach self-love under pressure. Enter your name and email
          to unlock the workbook — that is where the full reps and sequence live.
        </p>

        <div className="mt-10">
          <ChallengeLeadCaptureClient />
        </div>
      </section>
    </main>
  );
}
