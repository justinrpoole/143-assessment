import Link from "next/link";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Justin Ray — The Builder Behind 143 Leadership",
  description: "I built the 143 Assessment because I needed it first. Executive development background. Real pressure. A framework built on behavioural science and tested where leadership actually happens.",
};

const DO_LIST = [
  "Name the real problem in plain language. No jargon. No cushion.",
  "Back every claim with published research you can read yourself.",
  "Build tools that measure change \u2014 and show you the receipt at retake.",
  "Use non-shame language. Your gaps are not failures. They are covered capacities. People develop faster when they feel safe to be honest.",
];

const DONT_LIST = [
  "Wrap hard truths in motivational cotton that fades by Friday.",
  "Make promises backed by enthusiasm alone. If there is no mechanism, there is no tool.",
  "Sort you into a personality box and call it self-awareness. Your scores are designed to change.",
  "Use urgency manufactured from shame. That spikes cortisol. I build systems that lower it.",
];

const CREDENTIALS = [
  "Executive development consulting across tech, healthcare, finance, and education \u2014 inside the rooms where leadership pressure is real, not theoretical",
  "Trained in behavioural science, positive psychology, and applied neuroscience \u2014 every tool in the system maps to published, peer-reviewed research",
  "Built and validated the 143 Assessment from the ground up \u2014 143 questions measuring 9 trainable leadership capacities",
  "Designed a deterministic scoring engine \u2014 auditable, reproducible, SHA-256 verified. No black boxes. No vibes.",
  "Created the Eclipse concept \u2014 a non-shame framework for explaining why high-performers lose access to their strongest capacities under sustained stress",
  "Developed 36 Light Signature archetypes from C(9,2) ray pair combinations \u2014 a combinatorial identity system, not a personality label",
];

export default async function AboutPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_justin",
    sourceRoute: "/about",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[720px] px-5 pt-16 pb-12 text-center sm:px-8 sm:pt-24 sm:pb-16">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Not a motivator. A builder.
        </p>
        <h1 className="mx-auto mt-4 max-w-[600px] text-3xl font-bold leading-tight sm:text-4xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          I built the map so you do not have to wander for 20 years.
        </h1>
        <p className="mx-auto mt-4 max-w-[540px] text-base leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          Executive development background. Real-world pressure. A framework built on
          behavioural science and tested in the rooms where leadership actually happens — not conference stages.
        </p>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── The Story ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <div className="glass-card p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            The short version
          </p>
          <h2 className="mt-3 text-xl font-bold sm:text-2xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            I watched the same gap for years. Then I built the bridge.
          </h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            I spent years inside executive development. Real organisations. Real pressure.
            And I watched the same pattern on repeat: a leader finishes a programme, feels
            genuinely changed, and by the following week the old patterns are back. Not because
            the programme was bad. Because it taught tactics without upgrading the operating
            system that runs them. Have you ever had that experience? That is not a willpower
            failure. That is a $240 billion design gap.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            So I built the operating system. The 143 Assessment measures 9 leadership capacities
            backed by peer-reviewed science. It detects when depletion is masking real capacity.
            And your scores are designed to change \u2014 because you are not a fixed type. I built
            it because I needed it first. I was the stretched leader. Performing well. Coming
            home empty. Running on borrowed energy and calling it discipline. These tools changed
            my own pattern before I offered them to anyone else.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
            Why 143? One letter. Four letters. Three letters. I love you. That is the foundation.
            Not as a platitude \u2014 as an operating condition. Self-directed compassion lowers cortisol.
            Self-criticism spikes it. A regulated nervous system sustains high standards. A shamed
            one collapses. The number is not decoration. It is the principle the entire system is
            built on: you cannot lead others until you stop running a threat filter against yourself.
          </p>
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── Credentials ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Background
        </p>
        <h2 className="mt-3 text-center text-xl font-bold sm:text-2xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Built from the inside out.
        </h2>
        <div className="mt-8 space-y-3">
          {CREDENTIALS.map((item) => (
            <div key={item} className="glass-card flex items-start gap-3 p-4">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                <circle cx="8" cy="8" r="7" stroke="#F8D011" strokeWidth="1.5" />
                <path d="M5 8l2 2 4-4" stroke="#F8D011" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── Do / Don't ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <h2 className="text-center text-xl font-bold sm:text-2xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          What you will get. What you will not.
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>What I do</p>
            <div className="space-y-3">
              {DO_LIST.map((item) => (
                <div key={item} className="glass-card flex items-start gap-3 p-4">
                  <span className="shrink-0 font-bold" style={{ color: 'var(--brand-gold)' }}>&#x2713;</span>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(248,208,17,0.55)' }}>What I don&apos;t do</p>
            <div className="space-y-3">
              {DONT_LIST.map((item) => (
                <div key={item} className="glass-card flex items-start gap-3 p-4">
                  <span className="shrink-0 font-bold" style={{ color: 'rgba(248,208,17,0.5)' }}>&#x2715;</span>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── The Method ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          The method is the message
        </p>
        <h2 className="mt-3 text-xl font-bold sm:text-2xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Fix the operating system first. Then every tactic works.
        </h2>
        <p className="mx-auto mt-4 max-w-[540px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          The 9 Rays are emotional intelligence made trainable and measurable. Rays 1 through 3
          train EQ with yourself. Rays 7 through 9 train EQ with others. Rays 4 through 6 are
          where they meet. That is the map. 143 questions. 15 minutes. The most honest mirror
          your leadership has seen. Not who you are. What you can build.
        </p>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
        <div className="glass-card p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Ready to see your map?
          </p>
          <h2 className="mt-3 text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            143 questions. 15 minutes. The most honest mirror your leadership has seen.
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/preview" className="btn-primary">
              See Your Light Signature \u2014 Free
            </Link>
            <Link href="/143" className="btn-watch">
              Start the 143 Challenge \u2014 Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
