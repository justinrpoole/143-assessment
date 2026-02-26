import Link from "next/link";

import { GlossaryClient } from "@/components/glossary/GlossaryClient";
import { FadeInSection } from "@/components/ui/FadeInSection";
import GoldDividerAnimated from "@/components/ui/GoldDividerAnimated";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Glossary — 143 Leadership",
  description:
    "Every term used in the 143 Leadership assessment and Gravitational Stability Report, defined and searchable.",
};

/* ── page ───────────────────────────────────────────────────── */

export default async function GlossaryPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_glossary",
    sourceRoute: "/glossary",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16 space-y-12">

        {/* ─── HEADER ──────────────────────────────────────────── */}
        <header className="space-y-3">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            Reference
          </p>
          <h1
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Glossary
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Every term used in the 143 Leadership assessment and report,
            defined and searchable.
          </p>
        </header>

        {/* ─── GLOSSARY CLIENT ─────────────────────────────────── */}
        <GlossaryClient />

        <GoldDividerAnimated />

        {/* ─── CTA ─────────────────────────────────────────────── */}
        <FadeInSection>
          <section>
            <div className="glass-card p-8 text-center space-y-5">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-on-dark, #FFFEF5)" }}
              >
                Ready to see these concepts mapped to your own leadership
                pattern?
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/assessment" className="btn-primary">
                  Take the Assessment
                </Link>
                <Link href="/preview" className="btn-watch">
                  Try the Free Stability Check
                </Link>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>
    </main>
  );
}
