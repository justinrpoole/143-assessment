import Link from "next/link";

import HeroProofStrip from "@/components/marketing/HeroProofStrip";
import HeroVideoThumb from "@/components/marketing/HeroVideoThumb";
import StickyCtaBar from "@/components/marketing/StickyCtaBar";
import MiniAssessmentPreview from "@/components/marketing/MiniAssessmentPreview";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upgrade Your OS",
  description: "Your operating system runs every decision you make. 143 Leadership measures 9 trainable capacities and gives you the tools to rebuild.",
};

/* ── static data ───────────────────────────────────────────────── */
const REFLECTION_QUESTIONS = [
  "You open your laptop and check email before your feet hit the floor. You had a plan this morning. It is gone by 8:15.",
  "Someone asks how you are doing and you say fine because the real answer would take too long. You are running meetings on borrowed energy and calling it leadership.",
  "Your body has been braced since 7 AM and you have not noticed. Your shoulders are around your ears. You are running on survival fuel and calling it discipline.",
];

const NINE_RAYS = [
  { id: "R1", name: "Ray of Intention",    essence: "You wake up and already know your one thing. Your calendar is a decision, not a reaction." },
  { id: "R2", name: "Ray of Joy",          essence: "Your energy does not come from pressure. It comes from something deeper. You create it on purpose." },
  { id: "R3", name: "Ray of Presence",     essence: "Your body is settled. Not numb — regulated. The space between what happens and what you do is yours." },
  { id: "R4", name: "Ray of Power",        essence: "You move before you feel ready — and you trust yourself after. Confidence is not loud. It is consistent." },
  { id: "R5", name: "Ray of Purpose",      essence: "Your calendar matches your values. The gap between what you say matters and where you spend time is closing." },
  { id: "R6", name: "Ray of Authenticity", essence: "You are the same person in every room. No performance. No code-switching your soul." },
  { id: "R7", name: "Ray of Connection",   essence: "People feel safe enough to be honest around you. Your stability is a leadership multiplier." },
  { id: "R8", name: "Ray of Possibility",  essence: "You see options where other people see walls. Your brain scans for openings because you trained it to." },
  { id: "R9", name: "Be The Light",        essence: "Your presence lowers the noise in a room. You hold steady. And somehow that is enough." },
];

const WHAT_I_DONT_DO = [
  "This is not motivation theatre. No hype. No pep talks. Structure.",
  "This is not a personality quiz. No types. No labels. No sorting you into a box you cannot leave.",
  "This is coaching and education. I do not provide medical care. I train leadership capacity backed by behavioural science.",
  "This is not a one-time event. Your scores are designed to change. That is the whole point.",
];

const ENTRY_POINTS = [
  {
    tag: "Start here",
    title: "The Light Check",
    body: "A free preview that names what you are feeling and why. No account. No commitment. Three minutes to find out whether eclipse is running your week.",
    href: "/143",
    cta: "Take the Light Check — Free",
    highlight: false,
  },
  {
    tag: "Go deeper",
    title: "The Ray Snapshot",
    body: "See your top 2 Rays and your Eclipse Snapshot. Enough to understand what is working and what is covered — and whether you might be a Bold Authentic, a Relational Light, or one of 34 other combinations.",
    href: "/preview",
    cta: "Get Your Snapshot",
    highlight: false,
  },
  {
    tag: "The full map",
    title: "The 143 Assessment",
    body: "A map of exactly where your light is strong, where it is covered, and what to do about it this week. Your Light Signature. Your Eclipse Snapshot. Your Energy Ratio. Your Rise Path.",
    href: "/upgrade",
    cta: "Take the Assessment — $43",
    highlight: true,
  },
  {
    tag: "The operating system",
    title: "143 Coaching OS",
    body: "The assessment plus daily tools, micro-practices, and unlimited retakes. Retake in 90 days and watch your scores move — proof the reps are landing.",
    href: "/upgrade",
    cta: "Start the Coaching OS — $14.33/mo",
    highlight: false,
  },
];

const TESTIMONIALS = [
  { quote: "I have taken MBTI, Enneagram, DISC, and StrengthsFinder. None of them explained why I was performing well but feeling empty. The eclipse concept did in one sentence what four assessments could not.", attribution: "VP of Operations, SaaS" },
  { quote: "I retook the assessment 90 days after starting the coaching OS. Three of my Ray scores moved. Not because I tried harder. Because I trained differently. First time a tool actually showed me I was growing.", attribution: "Senior Director, Healthcare" },
  { quote: "My team noticed before I did. My presence score went from eclipsed to emerging. My direct reports said I was calmer in meetings. That was not an accident — it was reps.", attribution: "Engineering Lead, Fortune 500" },
];

const SUN_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/* ── page ───────────────────────────────────────────────────────── */
export default async function UpgradeYourOsPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_upgrade_os",
    sourceRoute: "/upgrade-your-os",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      {/* ── HERO ── */}
      <section className="mx-auto max-w-[960px] px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
        <div>
          {/* SEO / qa:tone anchor — Upgrade Your OS */}
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Upgrade Your OS. Leadership is not personality. It is capacity.
          </p>
          <h1 className="mt-4 max-w-[720px] text-3xl font-bold leading-tight sm:text-4xl lg:text-[44px]" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Your operating system runs every decision you make. When was the last time you upgraded it?
          </h1>
          <p className="mt-4 max-w-[560px] text-base leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            143 Leadership measures 9 trainable capacities, detects when exhaustion is masking
            the real you, and gives you the tools to rebuild — with proof that it is working.
            Not a personality label. A behavioural map that changes as you do. 143 questions.
            15 minutes. A map of where your light is strong, where it is covered, and what to
            do about it this week.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/preview" className="btn-primary">
              See Your Ray Snapshot — Free
            </Link>
            <Link href="/143" className="btn-watch">
              Start the 143 Challenge
            </Link>
          </div>
          <HeroVideoThumb />
        </div>
      </section>

      {/* Proof strip — social proof below hero */}
      <HeroProofStrip />

      {/* Sticky CTA bar for mobile — appears after hero scrolls out */}
      <StickyCtaBar />

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── CONVERSION QUESTIONS ── */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              q: "Have you ever learned something powerful and lost it by Monday?",
              a: "That is not your fault. Those programmes taught tactics without upgrading the system that runs them.",
            },
            {
              q: "Have you ever delivered in every meeting and still come home empty?",
              a: "That is not a discipline problem. That is one capacity carrying another. The assessment names that pattern.",
            },
            {
              q: "When was the last time someone asked how you were and you told the truth?",
              a: "If you had to think about it, that is the eclipse talking. It does not always look like falling apart.",
            },
          ].map((item) => (
            <div key={item.q} className="glass-card p-5">
              <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                {item.q}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REFLECTION BAND ── */}
      <section className="mx-auto max-w-[960px] px-5 py-12 sm:px-8">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Sound familiar?
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {REFLECTION_QUESTIONS.map((q) => (
            <div key={q} className="glass-card p-5">
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
                &ldquo;{q}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── WHAT THIS IS NOT ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          No hype. No shortcuts.
        </p>
        <h2 className="mt-3 text-center text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          What This Is Not
        </h2>
        <div className="mt-8 space-y-3">
          {WHAT_I_DONT_DO.map((item) => (
            <div key={item} className="glass-card flex items-start gap-3 p-4">
              <span className="shrink-0 font-bold" style={{ color: 'var(--brand-gold)' }}>&#x2715;</span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>{item}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          I map your pattern. I give you the next rep. I help you track progress so growth
          stays visible — not hoped for, measured.
        </p>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── ECLIPSE CONCEPT ── */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              The Eclipse Concept
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
              Your light is not gone. It is covered.
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              When sustained stress stays elevated too long, it changes how you think, feel,
              and decide. Research on stress chemistry and energy borrowing shows that cumulative
              strain narrows your attention, shrinks your emotional range, and compromises your
              judgement. That is not a personal failure. That is biology.
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
              High-performers often do not realise their biggest strength is compensating for an
              eclipsed capacity — until it crashes. Your Power Ray might be carrying your
              Presence Ray, which is why you deliver at work and come home empty. The assessment
              names that specific pattern.
            </p>
          </div>
          <div className="grid gap-4">
            {/* Eclipsed day */}
            <div className="glass-card p-5" style={{ borderLeft: '3px solid rgba(248,208,17,0.3)' }}>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold)', opacity: 0.5 }}>
                Eclipsed Monday
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
                7am: alarm goes off, already dreading the 9am. You run the meeting well. Nobody
                knows the cost. By 3pm your creativity is gone. By 6pm you are running on fumes
                and calling it discipline.
              </p>
            </div>
            {/* Light-online day */}
            <div className="glass-card p-5" style={{ borderLeft: '3px solid var(--brand-gold)' }}>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
                Light-Online Monday
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
                7am: you wake up knowing your one thing. The 9am is clear. By 3pm you have energy
                left for thinking. By 6pm you chose what to give, not what was taken.
              </p>
            </div>
            <p className="mt-1 text-center text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
              The assessment tells you which version you are running right now — and what is underneath.
            </p>
          </div>
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── 9 RAYS ── */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            The 9 Rays
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            9 dimensions. Each one trainable. Together, they map your emotional intelligence.
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            The first three train EQ with yourself. The last three train EQ with others. The
            middle three are where they meet. Not personality types. Capacities — built through
            reps, not revelation.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NINE_RAYS.map((ray) => (
            <div key={ray.id} className="glass-card p-4">
              <p className="text-sm font-bold" style={{ color: 'var(--brand-gold, #F8D011)' }}>{ray.name}</p>
              <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>{ray.essence}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── TRY 3 QUESTIONS ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <MiniAssessmentPreview />
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── ENTRY POINTS ── */}
      <section className="mx-auto max-w-[960px] px-5 py-16 sm:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Four Ways In
          </p>
          <h2 className="mt-3 text-2xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Start where you are. Every path leads to the same light.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENTRY_POINTS.map((ep) => (
            <div
              key={ep.title}
              className="glass-card flex flex-col p-5"
              style={ep.highlight ? { border: '1.5px solid var(--brand-gold, #F8D011)', boxShadow: '0 0 24px rgba(248,208,17,0.12)' } : undefined}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)', opacity: ep.highlight ? 1 : 0.7 }}>{ep.tag}</p>
              <p className="mt-2 text-lg font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>{ep.title}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>{ep.body}</p>
              <Link
                href={ep.href}
                className={ep.highlight ? "btn-primary mt-4 block text-center" : "btn-watch mt-4 block text-center"}
              >
                {ep.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="mx-auto max-w-[200px]">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-gold), transparent)' }} />
      </div>

      {/* ── TESTIMONIALS ── */}
      <section className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
        <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          What Leaders Say
        </p>
        <div className="space-y-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.attribution} className="glass-card p-5">
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold" style={{ color: 'var(--brand-gold, #F8D011)', opacity: 0.7 }}>
                — {t.attribution}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
        <div className="glass-card p-8">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Your light is still there. This is how you restore access.
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            143 questions. 15 minutes. One mirror.
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            Not a personality label. A behavioural map of 9 trainable capacities — with the
            tools to build them and the proof that they are changing. You might be a Visionary
            Servant, a Truth Beacon, or a Driven Leader. There are 36 Light Signatures. The
            assessment reveals yours.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/preview" className="btn-primary">
              See Your Light Signature — Free
            </Link>
            <Link href="/143" className="btn-watch">
              Start the 143 Challenge
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT JUSTIN (Brief) ── */}
      <section className="mx-auto max-w-[720px] px-5 py-12 sm:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Built by
        </p>
        <h2 className="mt-3 text-xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Justin Ray
        </h2>
        <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          Educator. Coach. System builder. I spent years watching leadership
          programmes teach information that never landed. So I built a
          different system — one that measures capacity, trains it through
          daily reps, and proves it is changing. Not a motivator. A builder.
        </p>
        <Link href="/about" className="mt-4 inline-block text-sm font-medium transition-colors hover:text-brand-gold" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Read the full story &rarr;
        </Link>
      </section>
    </main>
  );
}
