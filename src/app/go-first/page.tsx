import Link from "next/link";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Go First — 143 Leadership",
  description:
    "You keep waiting for permission, certainty, or the perfect time. Go First is the practice that proves confidence shows up after you start.",
};

export default async function GoFirstPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_go_first",
    sourceRoute: "/go-first",
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
          The Second Commitment
        </p>
        <h1
          className="mt-4 text-3xl font-bold leading-tight sm:text-4xl"
          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
        >
          Go First.
        </h1>
        <p
          className="mt-4 text-lg leading-relaxed"
          style={{
            color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
          }}
        >
          I see you with 14 tabs open, three drafts saved, and zero things
          shipped. You are not lazy. You are waiting for a feeling that comes
          after the move, not before.
        </p>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{
            color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
          }}
        >
          Confidence is not born. It is built. And it only shows up after you
          start.
        </p>
      </section>

      {/* Leading the Witness — self-recognition */}
      <section className="mx-auto max-w-[720px] px-5 pb-12 sm:px-8">
        <div className="glass-card p-6 sm:p-8 space-y-5">
          <p
            className="text-sm font-semibold leading-relaxed"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            When was the last time you were fully prepared and still did not
            move?
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            You had the plan. You had the words. You had the time.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            But you told yourself you would do it tomorrow. And tomorrow you
            told yourself the same thing. Not because you are weak. Because the
            gap between knowing and doing is not a knowledge problem.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            That is not a motivation gap. That is your operating system
            protecting a capacity it does not trust yet. The assessment shows
            you which one.
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
              You plan and prepare, then hesitate at the edge. Every time.
            </li>
            <li className="flex items-start gap-3">
              <span
                className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--brand-gold)" }}
              />
              You tell yourself you will go when it feels clear. It never feels
              clear. So you wait.
            </li>
            <li className="flex items-start gap-3">
              <span
                className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--brand-gold)" }}
              />
              You watch someone else do the thing you almost did. And you think:
              I knew that. I had that.
            </li>
          </ul>
        </div>
      </section>

      {/* Archetype Teaser */}
      <section className="mx-auto max-w-[720px] px-5 pb-12 sm:px-8">
        <div className="glass-card p-6 sm:p-8">
          <h2
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            Where you hesitate depends on how you lead
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            A Charismatic Connector hesitates on the thing that might
            disappoint someone. A Truth Beacon hesitates on the thing that
            might be wrong. A Visionary Servant hesitates because the vision is
            so clear that any imperfect first step feels like a betrayal of it.
          </p>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
            }}
          >
            There are 36 Light Signatures. Each one has a Go First edge. The
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
            The first move is finding out where you stand.
          </h2>
          <p
            className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            The assessment names the specific capacity holding you back and
            gives you the rep to start this week. Not a pep talk. A map with a
            first step on it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/143" className="btn-primary">
              Start the 143 Challenge — Free
            </Link>
            <Link href="/preview" className="btn-watch">
              Take the 3-Minute Light Check
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
