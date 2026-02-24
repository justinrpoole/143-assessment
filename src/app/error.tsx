"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-center justify-center px-5 py-16 text-center">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--brand-gold, #F8D011)" }}
        >
          Something Went Wrong
        </p>
        <h1
          className="mt-3 text-2xl font-semibold"
          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
        >
          Your system hit a temporary glitch.
        </h1>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.70))" }}
        >
          This is not you — it is us. The operating system is recalibrating.
          Try again or head home.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="btn-primary text-sm font-semibold"
          >
            Try Again
          </button>
          <Link
            href="/upgrade-your-os"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold"
            style={{
              border: "1px solid var(--brand-gold, #F8D011)",
              color: "var(--brand-gold, #F8D011)",
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
