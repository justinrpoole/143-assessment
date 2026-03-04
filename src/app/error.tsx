"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="cosmic-page-bg page-shell">
      <div className="content-wrap--narrow flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--gold-primary)" }}
        >
          Something Went Wrong
        </p>
        <h1
          className="mt-3 text-2xl font-semibold"
          style={{ color: "var(--text-body)" }}
        >
          Your system hit a temporary glitch.
        </h1>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
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
            className="cta-secondary text-sm font-semibold"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
