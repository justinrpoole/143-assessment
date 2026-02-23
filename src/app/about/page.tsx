import Link from "next/link";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Justin Ray",
  description: "The 20-year journey behind the 143 Leadership framework. From burnout to breakthrough — the story of how the Be The Light operating system was built.",
};

const DO_LIST = [
  "Name the real problem in plain language.",
  "Back every claim with research you can read.",
  "Build tools that measure change — and let you see the proof.",
  "Use non-shame language because people develop faster when they feel safe to be honest about gaps.",
];

const DONT_LIST = [
  "Wrap hard truths in motivational cotton.",
  "Make promises backed by enthusiasm alone.",
  "Call your gaps a skill to train or a capacity that is covered.",
  "Give you a fixed label and call it self-awareness.",
];

const CREDENTIALS = [
  "Executive development consulting across industries — tech, healthcare, finance, education",
  "Trained in behavioural science, positive psychology, and neuroscience research application",
  "Built and validated the 143 Assessment framework from peer-reviewed evidence",
  "Designed the scoring engine: deterministic, auditable, SHA-256 verified",
  "Created the Eclipse concept to explain capacity suppression without shame",
  "Developed 36 Light Signature archetypes mapped to C(9,2) ray pair combinations",
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
            What I saw over and over was the same gap.
          </h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            I spent years inside executive development. Real organisations. Real pressure.
            A leader finishes a programme, feels energised, and by the following week the old
            patterns are back. Not because the programme was bad. Because it never addressed
            what was underneath. Have you ever had that experience? That is not a willpower failure.
            That is an operating system problem.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
            So I built one. The 143 Assessment measures 9 leadership capacities backed by
            peer-reviewed behavioural science. It detects when depletion is masking real capacity.
            And your scores are designed to change. I love watching someone open their report and
            realise what they have been carrying — the moment they read their Light Signature
            and something shifts. That is the moment I built this for.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
            Why 143? One letter. Four letters. Three letters. I love you. That is the foundation.
            Not as a platitude — as an operating condition. Self-directed compassion lowers cortisol.
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
            The assessment takes 15 minutes. The clarity lasts.
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/upgrade" className="btn-primary">
              Take the Assessment — $43
            </Link>
            <Link href="/upgrade-your-os" className="btn-watch">
              See the Framework
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
