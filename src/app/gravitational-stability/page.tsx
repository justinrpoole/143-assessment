import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "@/components/marketing/cosmic-hero-static.css";

export const metadata: Metadata = {
  title: "Gravitational Stability Check — Coming Online",
  description:
    "Free Gravitational Stability preview is coming online. Use the challenge and assessment routes in the meantime.",
};

export default function GravitationalStabilityPage() {
  return (
    <main className="cosmic-page-bg page-shell">
      <div className="content-wrap content-wrap--narrow py-16">
        <section className="glass-card p-7 sm:p-9 space-y-4">
          <p className="pill pill--yellow" data-tone="yellow">
            <span className="dot" /> Free Preview
          </p>
          <h1 className="text-3xl font-bold text-header">Gravitational Stability Check</h1>
          <p className="text-sm leading-relaxed text-body">
            This free preview route is being finalized. You can start the 143 Challenge now or jump to the
            full assessment.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/challenge" className="btn-cta">
              Start The 143 Challenge
            </Link>
            <Link href="/assessment" className="cta">
              Go To Assessment
            </Link>
          </div>
          <div className="flex justify-center pt-2">
            <div data-cosmic-hero-static>
              <div className="eclipse-stage" aria-hidden="true" style={{ width: "220px" }}>
                <Image className="hero-square-logo" src="/images/143-square-logo.svg" alt="" width={220} height={220} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
