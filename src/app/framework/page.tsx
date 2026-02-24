import Link from "next/link";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Be The Light Framework — 9 Rays, 3 Phases, 1 OS Upgrade",
  description: "Nine trainable leadership capacities. Three developmental phases. Backed by peer-reviewed science from McEwen, Jha, Lieberman, Gollwitzer, and Dweck. Not a personality label. A behavioural map that changes as you do.",
};

const THREE_PHASES = [
  {
    phase: "Phase 1",
    title: "Reconnect",
    rays: "Rays 1\u20133: Intention, Joy, Presence",
    body: "Emotional intelligence with yourself. Before you lead others, you need access to yourself \u2014 and that access starts with self-directed compassion. 143 means I love you. That is the foundation principle. Intention sets direction so your calendar becomes a decision, not a reaction. Joy creates fuel independent of conditions so you stop running on borrowed energy. Presence settles your nervous system so the gap between stimulus and response is yours. You might discover you are a Strategic Optimist or a Deep Listener. This is where the ground forms.",
  },
  {
    phase: "Phase 2",
    title: "Expand",
    rays: "Rays 4\u20136: Power, Purpose, Authenticity",
    body: "Where self-regulation meets self-expression. You stop waiting for permission and start moving. Power is consistent action despite fear \u2014 moving before you feel ready and trusting yourself after. Purpose is alignment between your calendar and your values. Authenticity is being the same person in every room without code-switching your soul. A Decisive Director or a Bold Authentic leads from here. When these Rays are eclipsed, you perform but never feel aligned.",
  },
  {
    phase: "Phase 3",
    title: "Become",
    rays: "Rays 7\u20139: Connection, Possibility, Be The Light",
    body: "Emotional intelligence with others. Your capacity extends beyond yourself. Connection builds trust so people feel safe enough to be honest. Possibility opens doors where others see walls. Be The Light holds the room steady \u2014 your presence lowers the noise. A Charismatic Connector or a Visionary Servant leads from this force. When these Rays are online, you do not just lead. You multiply.",
  },
];

const SCIENCE_BACKING = [
  { label: "Allostatic Load", source: "McEwen (2008)", use: "When stress stays elevated, your body borrows energy from future capacity. The Eclipse Snapshot makes the cost visible before you go bankrupt. That is biology, not weakness." },
  { label: "Attention Training", source: "Jha (2019), Damasio", use: "Attention is not a personality trait. It is a muscle. Dr. Amishi Jha\u2019s research shows 12 minutes of daily practice measurably improves focus. The Presence and Possibility Rays train it." },
  { label: "Affect Labelling", source: "Lieberman et al. (2007)", use: "Naming an emotion reduces amygdala reactivity by up to 50%. The assessment gives you the language. Naming is not therapy. It is the first intervention." },
  { label: "Self-Distancing", source: "Kross et al. (2014)", use: "Perspective is a skill, not a gift. Speaking about yourself in the third person reduces emotional reactivity. The coaching OS trains this through specific language practices." },
  { label: "Implementation Intentions", source: "Gollwitzer (1999)", use: "If-then plans increase goal achievement by 2\u20133x. The Rise Path gives you pre-decided moves. The negotiation with yourself is already over." },
  { label: "Growth Mindset", source: "Dweck (2006), Oyserman", use: "When you believe the score can move, you train differently. The 143 Assessment is designed to be outgrown. The belief that change is possible changes the behaviour itself." },
];

export default async function FrameworkPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_how_it_works",
    sourceRoute: "/framework",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[720px] px-5 pt-16 pb-12 text-center sm:px-8 sm:pt-24 sm:pb-16">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Not a theory. A training system.
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Nine dimensions. Three phases. One operating system upgrade.
        </h1>
        <p className="mx-auto mt-4 max-w-[540px] text-base leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          The Be The Light Framework maps 9 trainable leadership capacities across 3
          developmental phases. Each one backed by peer-reviewed science. Each one designed
          to move — because you are not a fixed type, and your assessment should prove it.
        </p>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #F8D011, transparent)' }} />
      </div>

      {/* ── Problem ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <div className="glass-card p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            The $240 billion question
          </p>
          <h2 className="mt-3 text-xl font-bold sm:text-2xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Have you ever attended a leadership programme, felt genuinely changed, and watched the results fade by the following quarter?
          </h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            That is not a reflection of your commitment. That is a $240 billion design gap.
            Most programmes teach tactics without upgrading the internal operating system that
            runs them. The Be The Light Framework starts with the operating system. It names the
            9 capacities that underlie every leadership behaviour, detects when those capacities
            are eclipsed, and gives you the reps to restore access — with measurement to prove
            it is working.
          </p>
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #F8D011, transparent)' }} />
      </div>

      {/* ── 3 Phases ── */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Three Phases. One Path.
          </p>
          <h2 className="mt-3 text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Emotional intelligence made trainable.
          </h2>
        </div>
        <div className="space-y-4">
          {THREE_PHASES.map((phase, i) => (
            <div key={phase.phase} className="glass-card flex gap-5 p-5 sm:gap-6 sm:p-6">
              <div className="shrink-0 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)', opacity: 0.7 }}>{phase.phase}</p>
                <p className="mt-1 text-3xl font-bold" style={{ color: 'var(--brand-gold, #F8D011)' }}>{i + 1}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>{phase.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)', opacity: 0.8 }}>{phase.rays}</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>{phase.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #F8D011, transparent)' }} />
      </div>

      {/* ── Eclipse ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Eclipse does not mean failure. It means covered.
        </p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Your light is not gone. It is covered.
        </h2>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          Sustained stress narrows attention, shrinks emotional range, and compromises decision
          quality. Dr. Bruce McEwen&apos;s research shows exactly what happens — and Dr. Matthew
          Lieberman&apos;s work shows that simply naming what you feel reduces threat reactivity.
          The Eclipse Snapshot names the pattern. Not as failure. As a temporary state with a
          clear path out.
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
          Your strongest Ray may be compensating for your most eclipsed one — and that
          compensation pattern is invisible until someone names it. The assessment names it.
          The first step out is not trying harder. It is creating stability to train.
        </p>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #F8D011, transparent)' }} />
      </div>

      {/* ── Science ── */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            The Science
          </p>
          <h2 className="mt-3 text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            The science of the system.
          </h2>
          <p className="mt-2 max-w-[540px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            Every tool in the 143 OS maps to published, peer-reviewed research. The number itself
            encodes the foundation: self-compassion as the ground state. 143 = I love you. The science
            is real. The language is human. Each mechanism is translated into plain daily practice
            you can use Monday.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCIENCE_BACKING.map((s) => (
            <div key={s.label} className="glass-card p-4">
              <p className="text-sm font-bold" style={{ color: 'var(--brand-gold, #F8D011)' }}>{s.label}</p>
              <p className="mt-1 text-xs italic" style={{ color: 'rgba(248,208,17,0.5)' }}>{s.source}</p>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>{s.use}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            The framework works. The question is where you start.
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            Nine dimensions. Three phases. Each one backed by research. Each one designed to
            move. You might be a Strategic Optimist, a Truth Beacon, or a Servant Leader. There
            are 36 Light Signatures. The assessment reveals yours — along with the map of what
            to build first.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/upgrade" className="btn-primary">
              Take the Assessment — $43
            </Link>
            <Link href="/preview" className="btn-watch">
              Check My Stability — Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
