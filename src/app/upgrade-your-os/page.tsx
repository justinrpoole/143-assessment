import Link from "next/link";

import HeroProofStrip from "@/components/marketing/HeroProofStrip";
import HeroVideoThumb from "@/components/marketing/HeroVideoThumb";
import StickyCtaBar from "@/components/marketing/StickyCtaBar";
import MiniAssessmentPreview from "@/components/marketing/MiniAssessmentPreview";
import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "143 Leadership — Upgrade Your Operating System",
  description: "You are performing. You are delivering. And something still does not add up. 143 Leadership maps 9 trainable capacities, detects when exhaustion is masking the real you, and gives you the reps to rebuild — with proof.",
};

/* ── static data ───────────────────────────────────────────────── */
const REFLECTION_QUESTIONS = [
  "You open your laptop and check email before your feet hit the floor. You had a plan this morning. It was gone by 8:15. By noon you have reacted to 40 things and initiated zero.",
  "Someone asks how you are doing and you say fine because the real answer would take 45 minutes and a drink. You ran three meetings today on borrowed energy and called it leadership.",
  "Your body has been braced since 7 AM and you have not noticed. Your jaw is tight. Your shoulders are around your ears. You are running on survival fuel and calling it discipline. Your kids get what is left. It is not enough and you know it.",
];

const NINE_RAYS = [
  { id: "R1", name: "Intention",    essence: "You wake up knowing your one thing. Your calendar is a decision, not a reaction. When this Ray is eclipsed, you start every day in someone else\u2019s agenda." },
  { id: "R2", name: "Joy",          essence: "Your energy comes from something deeper than pressure. You create it on purpose. When this Ray is eclipsed, everything feels like a grind and you cannot remember why you started." },
  { id: "R3", name: "Presence",     essence: "Your body is settled. Not numb \u2014 regulated. The gap between stimulus and response is yours. When this Ray is eclipsed, you react before you think and regret it by lunch." },
  { id: "R4", name: "Power",        essence: "You move before you feel ready and trust yourself after. Confidence is not loud. It is consistent. When this Ray is eclipsed, you wait for permission that never comes." },
  { id: "R5", name: "Purpose",      essence: "Your calendar matches your values. When this Ray is eclipsed, you are busy all the time and fulfilled none of it." },
  { id: "R6", name: "Authenticity", essence: "You are the same person in every room. No performance. No code-switching your soul. When this Ray is eclipsed, you shape-shift so often you forget which version is real." },
  { id: "R7", name: "Connection",   essence: "People feel safe enough to be honest around you. When this Ray is eclipsed, your team performs but never confides. You are respected but not trusted." },
  { id: "R8", name: "Possibility",  essence: "You see options where other people see walls. When this Ray is eclipsed, every problem feels permanent and you stop looking for the door." },
  { id: "R9", name: "Be The Light", essence: "Your presence lowers the noise in a room. You hold steady and somehow that is enough. When this Ray is eclipsed, you drain the room instead of grounding it." },
];

const WHAT_I_DONT_DO = [
  "This is not motivation theatre. No hype. No keynote high that fades by Friday. Structure that holds up at 3 PM on a Tuesday.",
  "This is not a personality quiz. No sorting you into a box you cannot leave. MBTI told you what you are. This shows you what you can build.",
  "This is not therapy and it is not medical care. It is leadership capacity training backed by behavioural science. The kind of training that gives you a tool Monday and measures whether it worked by Thursday.",
  "This is not a one-time event. Your scores are designed to change. That is the whole point. Take it now. Train. Retake in 90 days. Watch the numbers move.",
];

const ENTRY_POINTS = [
  {
    tag: "Free \u2014 3 minutes",
    title: "The 143 Challenge",
    body: "Rewire your brain\u2019s threat filter in 3 days using the same neuroscience behind the full assessment. Hand over heart. I love you. That is the protocol. Free. No account. No card.",
    href: "/143",
    cta: "Start the 143 Challenge \u2014 Free",
    highlight: false,
  },
  {
    tag: "Free \u2014 15 minutes",
    title: "The Light Check",
    body: "See your top 2 Rays and your Eclipse Snapshot. Find out if you are a Bold Authentic, a Relational Light, or one of 34 other leadership combinations. Enough to know if going deeper is worth it.",
    href: "/preview",
    cta: "Get Your Light Check \u2014 Free",
    highlight: false,
  },
  {
    tag: "One-time \u2014 $43",
    title: "Full Assessment + Report",
    body: "143 questions. 15 minutes. Your complete behavioural map: Light Signature, Eclipse Snapshot, Energy Ratio, Rise Path. Plus your personal identity opener and specific tool recommendations. Lifetime access.",
    href: "/upgrade",
    cta: "Get Your Full Report \u2014 $43",
    highlight: true,
  },
  {
    tag: "$14.33/mo",
    title: "Portal Membership",
    body: "Everything in the report plus daily micro-practices, unlimited monthly retakes, and a growth dashboard that proves your reps are landing. Cancel anytime. Your data stays.",
    href: "/upgrade",
    cta: "Start Portal Membership \u2014 $14.33/mo",
    highlight: false,
  },
];

const TESTIMONIALS = [
  { quote: "I have taken MBTI, Enneagram, DISC, and StrengthsFinder. None of them explained why I was performing well but feeling empty. The eclipse concept did in one sentence what four assessments could not.", attribution: "VP of Operations, SaaS" },
  { quote: "I retook the assessment 90 days after starting the Portal Membership. Three of my Ray scores moved. Not because I tried harder. Because I trained differently. First time a tool actually showed me I was growing.", attribution: "Senior Director, Healthcare" },
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
      {/* ── HERO — Story-First (The Stretched Leader) ── */}
      <section className="mx-auto max-w-[960px] px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
        <div>
          {/* SEO / qa:tone anchor — Upgrade Your OS */}
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            The Stretched Leader
          </p>
          <h1 className="mt-4 max-w-[720px] text-3xl font-bold leading-tight sm:text-4xl lg:text-[44px]" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            You are performing. You are delivering. And something still does not add up.
          </h1>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            You run the meeting well. Nobody knows the cost. By 3 PM your creativity
            is gone. By 6 PM you are giving what is left to the people who matter most.
            It is not enough. And you know it.
          </p>
          <p className="mt-3 max-w-[600px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            You are not underperforming. You are stretched. One capacity is carrying
            another, and the operating system running your decisions has not been
            upgraded in years. That is not a personal failure. That is biology.
          </p>
          <p className="mt-3 max-w-[600px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}>
            143 Leadership maps 9 trainable capacities. Names exactly where your light
            is strong and where it is covered. Gives you the reps to rebuild \u2014 with
            proof that it is working. Not a label. A behavioural map that changes as
            you do. 143 questions. 15 minutes. One mirror.
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
              q: "Have you ever left a leadership programme feeling changed \u2014 and watched the results fade by the next quarter?",
              a: "That was not a willpower failure. Those programmes taught tactics without upgrading the operating system that runs them. $240 billion spent on leadership development globally. The gap is not information. It is infrastructure.",
            },
            {
              q: "Have you ever delivered in every meeting and come home with nothing left for the people who matter most?",
              a: "That is not a discipline problem. That is one capacity carrying another \u2014 and you cannot see the pattern from inside it. The assessment names it in 15 minutes.",
            },
            {
              q: "When was the last time someone asked how you were and you told the truth?",
              a: "If you had to think about it, eclipse is running your week. It does not always look like falling apart. Sometimes it looks like performing perfectly while something underneath goes quiet.",
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
              judgement. That is not a character flaw. That is biology.
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
            9 Rays. Each one trainable. Together, they map your leadership capacity.
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            The first three train EQ with yourself. The last three train EQ with others. The
            middle three are where they meet. Not fixed labels. Capacities — built through
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
            Your light is not gone. It is covered. This is how you restore access.
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            143 questions. 15 minutes. The most honest mirror your leadership has seen.
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            You might be a Visionary Servant, a Truth Beacon, or a Driven Leader.
            There are 36 Light Signatures. The assessment reveals yours \u2014 along
            with the map of where to build first. Not who you are. What you can build.
          </p>
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

      {/* ── ABOUT JUSTIN (Brief) ── */}
      <section className="mx-auto max-w-[720px] px-5 py-12 sm:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Built by
        </p>
        <h2 className="mt-3 text-xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Justin Ray
        </h2>
        <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          Educator. Coach. System builder. I spent years inside executive
          development watching leaders leave programmes inspired and return
          to the same patterns within a week. So I built a system that
          measures capacity, trains it through daily reps, and proves it
          is changing. I built it because I needed it first.
        </p>
        <Link href="/about" className="mt-4 inline-block text-sm font-medium transition-colors hover:text-brand-gold" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Read the full story &rarr;
        </Link>
      </section>
    </main>
  );
}
