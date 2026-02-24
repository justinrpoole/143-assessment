import Link from "next/link";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Be The Light — 143 Leadership",
  description:
    "You want your life to mean something. Not look good. Mean something. Be The Light is what happens when you practice that message inward long enough that it shows up outward.",
};

export default async function BeTheLightPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_be_the_light",
    sourceRoute: "/be-the-light",
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
          The Third Commitment
        </p>
        <h1
          className="mt-4 text-3xl font-bold leading-tight sm:text-4xl"
          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
        >
          Be The Light.
        </h1>
        <p
          className="mt-4 text-lg leading-relaxed"
          style={{
            color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
          }}
        >
          I see you holding the room together while nobody holds you. You walk
          in and people feel steadier. You walk out and wonder who notices.
        </p>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{
            color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
          }}
        >
          They notice. And the question is not whether your light is there. It
          is whether you are accessing it or borrowing against it.
        </p>
      </section>

      {/* Leading the Witness — self-recognition */}
      <section className="mx-auto max-w-[720px] px-5 pb-12 sm:px-8">
        <div className="glass-card p-6 sm:p-8 space-y-5">
          <p
            className="text-sm font-semibold leading-relaxed"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            Have you ever crushed the presentation and come home empty?
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Performed confidence in a room where no one checks on you afterward.
            Chose the team over yourself, again. Felt the weight shift onto you
            and said nothing because you did not want to be the one who
            could not carry it.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            That is not selflessness. That is one Ray carrying the load while
            another is eclipsed. And it will not hold forever.
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
              You feel the weight of the room. You always have.
            </li>
            <li className="flex items-start gap-3">
              <span
                className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--brand-gold)" }}
              />
              You notice what people need before they say it. And you give it
              before you check whether you have it to give.
            </li>
            <li className="flex items-start gap-3">
              <span
                className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--brand-gold)" }}
              />
              You want your life to mean something. Not look good. Mean
              something.
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
            Your light shows up in a specific pattern
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            A Relational Light leads by making every person in the room feel
            seen. A Calm Center leads by staying steady when everyone else is
            spinning. A Servant Leader leads by building something that outlasts
            them. Each one is real. Each one has a cost when it runs on
            borrowed energy.
          </p>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-muted, rgba(255,255,255,0.5))",
            }}
          >
            There are 36 Light Signatures. The assessment shows you which one
            you are running, what it is costing you, and what to restore first.
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
            Your light is still there. The assessment shows you what is
            covering it.
          </h2>
          <p
            className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed"
            style={{
              color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))",
            }}
          >
            Not a personality label. A map of 9 trainable capacities. Where you
            are strong, where you are eclipsed, and the first rep to restore
            access. 143 means I love you. This is where you practice it.
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
