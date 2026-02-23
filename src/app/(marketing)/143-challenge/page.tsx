import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The 143 Challenge — Reprogram Your Brain in 3 Days",
  description:
    "Your brain is running a threat filter you never installed. The 143 Challenge uses your Reticular Activating System to reprogram it in 3 days. 3 minutes a day. Free.",
};

const POWER_REPS = [
  {
    num: "01",
    instruction: 'See 143 (or your chosen cue). Hand over heart. "I love you." One breath.',
    note: "That's a rep.",
  },
  {
    num: "02",
    instruction: 'Before a hard moment: "I\'m safe. I\'m happy. I\'m loved." Then move.',
    note: "Stability before performance.",
  },
  {
    num: "03",
    instruction: 'In-the-moment anxiety shift: "I\'m excited. I\'m happy." Name what you\'re looking forward to.',
    note: "Reframe the signal.",
  },
  {
    num: "04",
    instruction: 'One identity declaration per day: "I\'m the type of person who ______, and I do it anyway."',
    note: "Encode the upgrade.",
  },
  {
    num: "05",
    instruction: 'After a brave moment: "That was the rep. Keep going."',
    note: "Reinforce the prediction error.",
  },
];

const CHALLENGE_DAYS = [
  {
    day: "Day 1",
    label: "Recognition",
    instruction:
      "Notice three things that went right. Write them down. You are feeding your RAS new search instructions.",
  },
  {
    day: "Day 2",
    label: "Encouragement",
    instruction:
      'Connect each moment to a capacity. "I stayed steady" becomes "I can regulate."',
  },
  {
    day: "Day 3",
    label: "Direction",
    instruction:
      'Pick one word. Carry it all day. When you see it reflected, say: "There it is."',
  },
];

export default function ChallengeLandingPage() {
  return (
    <>
      {/* Hero — Proof of Concept */}
      <section className="mx-auto max-w-[720px] px-5 pt-16 pb-12 text-center sm:px-8 sm:pt-24 sm:pb-16">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--brand-gold, #F8D011)" }}
        >
          Free 3-Day Challenge
        </p>
        <h1
          className="mt-4 text-3xl font-bold sm:text-4xl"
          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
        >
          Your brain is running a threat filter you never installed.
        </h1>
        <p
          className="mx-auto mt-2 max-w-[560px] text-xl font-semibold"
          style={{ color: "var(--brand-gold, #F8D011)" }}
        >
          3 days to reprogram it.
        </p>
        <p
          className="mx-auto mt-4 max-w-[520px] text-sm leading-relaxed"
          style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.75))" }}
        >
          Your Reticular Activating System filters 11 million bits of sensory data every second.
          It decides what reaches your conscious awareness. Right now, it is tuned to find threat.
          The 143 Challenge gives it new search instructions &mdash; in 3 minutes a day.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/toolkit" className="btn-primary">
            Start the Challenge &mdash; Free
          </Link>
          <Link href="#proof" className="btn-watch">
            See Why It Works
          </Link>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #F8D011, transparent)",
          }}
        />
      </div>

      {/* The Dare */}
      <section className="mx-auto max-w-[720px] space-y-4 px-5 py-12 sm:px-8">
        <div className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            The Inner Critic Is Not a Character Flaw
          </p>
          <h2
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            It is a miscalibrated filter. And I can prove it.
          </h2>
        </div>
        <div className="glass-card p-6 space-y-3">
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            Think of the last time you felt like you made a mistake. Did you use phrases like
            &ldquo;I&apos;m so stupid&rdquo; or other negative self-talk? That is not a character flaw.
            That is your RAS running a threat filter you never installed on purpose.
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            Your RAS decides what reaches conscious awareness from 11 million bits of sensory data
            per second. It takes cues from what you rehearse. Rehearse threat, it finds threat.
            Rehearse evidence of capacity, it finds that instead.
          </p>
          <p
            className="text-sm font-medium leading-relaxed"
            style={{ color: "var(--text-on-dark)" }}
          >
            Self-compassion lowers cortisol. Self-criticism spikes it. A regulated nervous system
            sustains high standards. A shamed nervous system collapses. This is not soft. This is how you stay sharp.
          </p>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #F8D011, transparent)",
          }}
        />
      </div>

      {/* The Protocol — Permission Slip */}
      <section
        id="protocol"
        className="mx-auto max-w-[720px] space-y-6 px-5 py-12 sm:px-8"
      >
        <div className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            The 143 Protocol
          </p>
          <h2
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            143 means &ldquo;I love you.&rdquo;
          </h2>
          <p
            className="mx-auto mt-2 max-w-[480px] text-sm leading-relaxed"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            One letter. Four letters. Three letters. This is your permission to say it
            to yourself out loud &mdash; and proof that it changes something real.
          </p>
        </div>
        <div className="glass-card p-6 space-y-4">
          <div className="flex gap-4 items-start">
            <span
              className="shrink-0 text-2xl font-bold"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              1
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
              Hand over heart. One breath.
            </p>
          </div>
          <div className="flex gap-4 items-start">
            <span
              className="shrink-0 text-2xl font-bold"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              2
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
              Say: &ldquo;I love you.&rdquo;
            </p>
          </div>
          <div className="flex gap-4 items-start">
            <span
              className="shrink-0 text-2xl font-bold"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              3
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
              Add: &ldquo;I&apos;m safe. I&apos;m happy. I&apos;m loved.&rdquo;
            </p>
          </div>
          <div className="flex gap-4 items-start">
            <span
              className="shrink-0 text-2xl font-bold"
              style={{ color: "var(--brand-gold, #F8D011)" }}
            >
              4
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
              Choose one aligned action immediately.
            </p>
          </div>
        </div>
        <p
          className="text-xs italic text-center"
          style={{ color: "var(--text-on-dark-muted)" }}
        >
          &ldquo;Self-compassion isn&apos;t soft. It&apos;s stability.&rdquo;
        </p>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #F8D011, transparent)",
          }}
        />
      </div>

      {/* 3-Day Challenge — The Proof */}
      <section className="mx-auto max-w-[720px] space-y-6 px-5 py-12 sm:px-8">
        <div className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            3 Minutes. 3 Days. Proof.
          </p>
          <h2
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Your brain starts scanning for possibility instead of threat.
          </h2>
        </div>
        <div className="space-y-4">
          {CHALLENGE_DAYS.map((d) => (
            <div key={d.day} className="glass-card flex gap-5 p-6">
              <div className="shrink-0">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--brand-gold, #F8D011)" }}
                >
                  {d.day}
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--text-on-dark)" }}
                >
                  {d.label}
                </p>
              </div>
              <p
                className="text-sm leading-relaxed self-center"
                style={{ color: "var(--text-on-dark-secondary)" }}
              >
                {d.instruction}
              </p>
            </div>
          ))}
        </div>
        <p
          className="text-sm text-center leading-relaxed"
          style={{ color: "var(--text-on-dark-secondary)" }}
        >
          No account required. A notebook and three minutes a day
          for three days. When you finish, you will catch yourself scanning for
          possibility instead of threat. That feeling has a name. It is called restored access.
        </p>
        <div className="text-center">
          <Link href="/toolkit" className="btn-primary">
            Start the Challenge &mdash; Free
          </Link>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #F8D011, transparent)",
          }}
        />
      </div>

      {/* 5 Power REPs */}
      <section className="mx-auto max-w-[720px] space-y-6 px-5 py-12 sm:px-8">
        <div className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            Beyond the 3 Days
          </p>
          <h2
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            The 5 Power REPs
          </h2>
        </div>
        <div className="space-y-3">
          {POWER_REPS.map((rep) => (
            <div key={rep.num} className="glass-card flex gap-4 p-5">
              <span
                className="shrink-0 text-xl font-bold"
                style={{ color: "var(--brand-gold, #F8D011)" }}
              >
                {rep.num}
              </span>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-on-dark)" }}
                >
                  {rep.instruction}
                </p>
                <p
                  className="text-xs mt-1 italic"
                  style={{ color: "var(--text-on-dark-muted)" }}
                >
                  {rep.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #F8D011, transparent)",
          }}
        />
      </div>

      {/* Why It Works — Science */}
      <section id="proof" className="mx-auto max-w-[720px] space-y-6 px-5 py-12 sm:px-8">
        <div className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            The Science
          </p>
          <h2
            className="mt-2 text-2xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            Why it works
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="glass-card p-5 space-y-2">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-on-dark)" }}
            >
              Attention Programming (RAS)
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--text-on-dark-secondary)" }}
            >
              Your brain filters 11 million bits per second. What you repeat becomes
              easier to notice. Rehearse self-directed compassion and your brain starts
              catching alignment instead of failure. That is not positive thinking. That
              is giving your filter new search instructions.
            </p>
          </div>
          <div className="glass-card p-5 space-y-2">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-on-dark)" }}
            >
              Prediction Error
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--text-on-dark-secondary)" }}
            >
              Your brain expected &ldquo;I can&apos;t.&rdquo; You did the new behavior anyway.
              That gap between expectation and action is a prediction error &mdash; and prediction
              errors are how your brain updates its model of who you are. Three days of reps.
              Three prediction errors. The identity shift begins.
            </p>
          </div>
          <div className="glass-card p-5 space-y-2">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-on-dark)" }}
            >
              Cortisol Regulation
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--text-on-dark-secondary)" }}
            >
              Self-compassion lowers cortisol. Self-criticism spikes it. A regulated nervous
              system sustains high standards. A shamed nervous system collapses. This is why
              the hardest-driving people need this the most &mdash; not because they are soft,
              but because their operating system needs stability to perform.
            </p>
          </div>
        </div>
        <p
          className="text-xs text-center italic"
          style={{ color: "var(--text-on-dark-muted)" }}
        >
          Research: Dr. Rick Hanson (converting positivity into neural traits) &bull;
          Dr. Carol Dweck (micro-wins strengthen growth mindset) &bull;
          Dr. Amishi Jha (attention training enhances executive function)
        </p>
      </section>

      {/* Gold Divider */}
      <div className="mx-auto max-w-[200px] py-4">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #F8D011, transparent)",
          }}
        />
      </div>

      {/* Bottom CTA — Bridge to Assessment */}
      <section className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
        <div className="glass-card p-8">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--brand-gold, #F8D011)" }}
          >
            143 = I Love You
          </p>
          <h2
            className="mt-3 text-xl font-bold"
            style={{ color: "var(--text-on-dark, #FFFEF5)" }}
          >
            &ldquo;I choose what my mind magnifies.&rdquo;
          </h2>
          <p
            className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            One letter. Four letters. Three letters. Every clock at 1:43.
            Every address. Every receipt. The number embeds in your day and becomes a cue
            your brain cannot ignore. The challenge proves the filter can shift. The assessment
            measures the full picture &mdash; 9 leadership capacities, 143 questions, your complete map.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/toolkit" className="btn-primary">
              Start the Challenge &mdash; Free
            </Link>
            <Link href="/assessment/setup" className="btn-watch">
              Take the Full Assessment &mdash; $43
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
