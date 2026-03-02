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
    <main className="cosmic-page-bg min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#F8D011" }}>
          The 143 Challenge
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl" style={{ color: "var(--text-on-dark, #FFFEF5)" }}>
          143 means I love you. Here is the challenge.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed" style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.78))" }}>
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
