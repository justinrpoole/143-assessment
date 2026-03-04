import type { Metadata } from "next";

import ChallengeLeadCaptureClient from "./ChallengeLeadCaptureClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "143 Challenge | 143 Leadership",
  description:
    "143 means I love you. Join the 143 Challenge and unlock your workbook after email capture.",
};

export default function ChallengePage() {
  return (
    <main className="cosmic-page-bg page-shell min-h-screen">
      <section className="content-wrap--wide px-6 py-20 sm:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--gold-primary)" }}>
          The 143 Challenge
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text-body)" }}>
          143 means I love you. Here is the challenge.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed" style={{ color: "var(--text-on-dark-secondary, color-mix(in srgb, var(--text-body) 78%, transparent))" }}>
          Enter your name and email to unlock the workbook instantly. No workbook preview,
          no download link, and no giveaway without capture.
        </p>

        <div className="mt-10">
          <ChallengeLeadCaptureClient />
        </div>
      </section>
    </main>
  );
}
