import Link from "next/link";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Watch Me — 143 Leadership",
  description:
    "You already know what to do. Your body will not let you start. Watch Me is the practice that moves you from frozen to forward.",
};

export default async function WatchMePage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_watch_me",
    sourceRoute: "/watch-me",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      {/* Hero — I See You */}
      <section className="mx-auto max-w-[720px] px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--brand-gold, #F8D011)" }}
        >
          The First Commitment
        </p>
        <h1
          className="mt-4 text-3xl font-bold leading-tight sm:text-4xl"
          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
        >
          Watch Me.
        </h1>
        <p
          className="mt-4 text-lg leading-relaxed"
          style={{
            color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
          }}
        >
          I see you rehearsing the conversation in the shower for the third day
          in a row. You know what to say. Your body will not let you start.
        </p>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{
            color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
          }}
        >
          That is not a flaw. That is your system protecting you from a risk it
          has not measured yet. Watch Me is two words that change the
          measurement.
        </p>
      </section>

      {/* Leading the Witness — self-recognition */}
      <section className="mx-auto max-w-[720px] px-5 pb-12 sm:px-8">
        <div className="glass-card p-6 sm:p-8 space-y-5">
          <p
            className="text-sm font-semibold leading-relaxed"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            Have you ever been completely ready in your head and completely
            frozen in your body?
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Not confused. Not unprepared. Ready. And still stuck. You know the
            email to send. You know the boundary to set. You know the first
            step. But your hand does not move.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            That is not a discipline problem. That is one capacity carrying
            another. The assessment names that specific pattern.
          </p>
        </div>
      </section>

      {/* What it looks like */}
      <section className="mx-auto max-w-[720px] px-5 pb-12 sm:px-8">
        <div className="glass-card p-6 sm:p-8">
          <h2
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            Sound familiar?
          </h2>
          <ul
            className="space-y-3 text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            <li className="flex items-start gap-3">
              <span
                className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--brand-gold)" }}
              />
              You encourage everyone else to take the leap. When it is your
              turn, you stall.
            </li>
            <li className="flex items-start gap-3">
              <span
                className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--brand-gold)" }}
              />
              You wait until it feels right. It never feels right. So you wait
              some more.
            </li>
            <li className="flex items-start gap-3">
              <span
                className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--brand-gold)" }}
              />
              You call it overthinking. It is not overthinking. It is your
              system trying to feel safe before it moves.
            </li>
          </ul>
        </div>
      </section>

      {/* Archetype Teaser — create the pull */}
      <section className="mx-auto max-w-[720px] px-5 pb-12 sm:px-8">
        <div className="glass-card p-6 sm:p-8">
          <h2
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            This shows up differently in different leaders
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            A Strategic Optimist freezes because they see too many paths and
            cannot pick. A Deep Listener freezes because they absorbed
            everyone else&apos;s weight and forgot their own. A Driven Leader
            freezes because the one thing they cannot power through is
            uncertainty.
          </p>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
            }}
          >
            There are 36 Light Signatures. Each one has a Watch Me pattern. The
            assessment reveals yours.
          </p>
        </div>
      </section>

      {/* CTA Block */}
      <section className="mx-auto max-w-[720px] px-5 pb-20 sm:px-8">
        <div className="glass-card p-8 text-center">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Watch Me is not a moment. It is a practice.
          </h2>
          <p
            className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            The assessment shows you why you freeze, which capacity to train
            first, and the specific rep to start this week. Not motivation. A
            map.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/assessment" className="btn-primary">
              Take the Assessment
            </Link>
            <Link href="/143" className="btn-watch">
              Start 143
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
