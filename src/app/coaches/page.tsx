import Link from 'next/link';
import { emitPageView } from '@/lib/analytics/emitter';
import { getUserStateFromRequest } from '@/lib/auth/user-state';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Light Activation Program — 143 Leadership',
  description: '10 weeks of structured practice. Understand your results. Work your top capacities. Address your eclipse. Retake with evidence.',
};

const PROGRAM_WEEKS = [
  {
    phase: 'Phase 1: Read Your Map',
    weeks: [
      {
        num: 1,
        title: 'Your Light Signature',
        focus: 'Understand what your top two Rays mean — not as labels, but as the pattern your leadership naturally follows.',
        practices: [
          'Read your full Gravitational Stability Report',
          'Name 3 moments this week where your top Ray showed up',
          'Journal: "When I lead from this capacity, people around me..."',
        ],
        tool: 'Presence Pause',
      },
      {
        num: 2,
        title: 'Your Eclipse Snapshot',
        focus: 'Understand what eclipse means. A low score is not a verdict — it is a signal that sustained load is temporarily covering real capacity.',
        practices: [
          'Review your Eclipse percentage and load dimensions',
          'Identify which load type (emotional, cognitive, relational) is highest',
          'Name the difference between "I cannot do this" and "I am depleted right now"',
        ],
        tool: 'Eclipse Snapshot Walkthrough',
      },
      {
        num: 3,
        title: 'Your Rise Path',
        focus: 'Your bottom Ray is not a flaw. It is the next capacity to train. This week, sit with what it would feel like to have more of it.',
        practices: [
          'Read the Rise Path section of your report',
          'Identify when your bottom Ray would have changed a recent situation',
          'Log 2 micro-reps focused on your bottom Ray',
        ],
        tool: 'If/Then Protocol',
      },
    ],
  },
  {
    phase: 'Phase 2: Work Your Strengths',
    weeks: [
      {
        num: 4,
        title: 'Leading from Your Top Ray',
        focus: 'Your highest capacity is where you have the most range. This week, use it deliberately — not on autopilot.',
        practices: [
          'Choose one meeting or conversation to lead from your top Ray intentionally',
          'Notice when you default to this capacity vs. when you choose it',
          'Log a rep after each intentional use',
        ],
        tool: 'REP Logger',
      },
      {
        num: 5,
        title: 'Your Signature Pair in Action',
        focus: 'Your two strongest Rays create a signature combination. This week, notice how they work together — and where one compensates for the other.',
        practices: [
          'Identify a situation where both Rays showed up together',
          'Identify a situation where one carried the load while the other hid',
          'Journal: "My signature combination helps me... but costs me..."',
        ],
        tool: 'Weekly Reflection',
      },
      {
        num: 6,
        title: 'Capacity Under Pressure',
        focus: 'Your strengths look different when you are depleted. This week, notice how your top Rays behave when you are tired, stressed, or stretched.',
        practices: [
          'Track your energy level before and after key moments',
          'Notice if your top Ray becomes a coping strategy under pressure',
          'Log one rep where you chose to rest instead of perform',
        ],
        tool: 'Energy Audit',
      },
    ],
  },
  {
    phase: 'Phase 3: Address Your Eclipse',
    weeks: [
      {
        num: 7,
        title: 'Separating Depletion from Deficit',
        focus: 'Your eclipsed areas might be skills to build — or they might be signs of overload. This week, find which is true for you.',
        practices: [
          'Review your eclipsed Rays — when did they last feel strong?',
          'Ask: "Is this low because I never learned it, or because I am running on empty?"',
          'If depletion: What is draining you? Name it.',
        ],
        tool: 'Presence Pause',
      },
      {
        num: 8,
        title: 'One Eclipsed Ray, One Week',
        focus: 'Choose one eclipsed area. Not to fix it — to practice it. Small, specific, daily.',
        practices: [
          'Pick the eclipsed Ray that would make the biggest difference this week',
          'Design one If/Then plan around it (e.g., "If I feel rushed, then I pause for 10 seconds")',
          'Log at least 3 reps this week focused on that Ray',
        ],
        tool: 'If/Then Protocol',
      },
      {
        num: 9,
        title: 'Sustainable Range',
        focus: 'Building a Ray is not about forcing it. It is about making space for it. This week, identify what conditions let your eclipsed capacity show up naturally.',
        practices: [
          'Notice when the eclipsed Ray appears without effort — what conditions are present?',
          'Journal: "This capacity shows up when I feel..."',
          'Adjust one routine to create those conditions more often',
        ],
        tool: 'Morning Protocol',
      },
    ],
  },
  {
    phase: 'Phase 4: Integration',
    weeks: [
      {
        num: 10,
        title: 'Integration and Retake',
        focus: 'You have been practicing for 9 weeks. Retake the assessment. Compare your results. See what moved, what held, and what you learned about how you lead.',
        practices: [
          'Review your original report one more time',
          'Retake the 143 Assessment with the same honesty',
          'Compare: Which Rays moved? Did your Light Signature shift?',
          'Journal: "What I know about my leadership now that I did not know 10 weeks ago..."',
        ],
        tool: 'Full Retake',
      },
    ],
  },
];

const PRINCIPLES = [
  {
    title: 'Every score is a skill to build',
    description: 'No shame. No labels. Low scores are temporary patterns with a training path, not permanent limitations.',
  },
  {
    title: 'Practice beats insight',
    description: 'Reading your report is step one. Logging reps is everything after. The nervous system learns from repetition, not revelation.',
  },
  {
    title: 'Eclipse is information, not identity',
    description: 'When a capacity is eclipsed, the first question is not "how do I fix this?" It is "what is covering it?"',
  },
  {
    title: 'Specificity over volume',
    description: 'One targeted rep per day is more valuable than ten unfocused ones. The protocol gives you the target. You show up.',
  },
];

export default async function CoachingPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: 'page_view_coach',
    sourceRoute: '/coaches',
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      {/* Hero */}
      <section className="px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">
            10-Week Light Activation Program
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ color: 'var(--text-on-dark)' }}>
            Your assessment gave you a map. This program teaches you to walk it.
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            10 weeks. Structured practices. Specific tools matched to your results. Retake at the end to see what moved.
          </p>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-on-dark-muted)' }}>
            Not a course. Not content to consume. A protocol you follow — one week at a time, one rep at a time — until the data says you grew.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Link href="/assessment/setup" className="btn-primary">
              Take the assessment first
            </Link>
            <Link href="#program" className="btn-watch">
              See the full program
            </Link>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 py-12 max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">How this works</p>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-on-dark)' }}>Four principles. No shortcuts.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="glass-card p-6 space-y-2">
              <h3 className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10-Week Program */}
      <section id="program" className="px-6 py-16 max-w-4xl mx-auto space-y-10">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">The Program</p>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-on-dark)' }}>10 weeks. Four phases. One protocol.</h2>
        </div>

        {PROGRAM_WEEKS.map((phase) => (
          <div key={phase.phase} className="space-y-4">
            <h3 className="text-lg font-bold text-brand-gold">{phase.phase}</h3>

            {phase.weeks.map((week) => (
              <details key={week.num} className="glass-card group">
                <summary className="p-6 cursor-pointer list-none flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-brand-gold flex-shrink-0 w-10">
                      {String(week.num).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>{week.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
                        Tool: {week.tool}
                      </p>
                    </div>
                  </div>
                  <span className="text-brand-gold text-xl transition-transform group-open:rotate-45 flex-shrink-0">+</span>
                </summary>
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                    {week.focus}
                  </p>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-brand-gold font-semibold mb-2">This week&apos;s practices</p>
                    <ul className="space-y-2">
                      {week.practices.map((practice) => (
                        <li key={practice} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                          <span className="text-brand-gold flex-shrink-0 mt-0.5">&#x2022;</span>
                          {practice}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            ))}
          </div>
        ))}
      </section>

      {/* What you need */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">Before you start</p>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>What you need</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-on-dark)' }}>Your completed assessment</p>
              <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                The program is built on your actual results. If you have not taken the assessment yet, start there.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-on-dark)' }}>15 minutes per day</p>
              <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                One practice, one rep log, one reflection. Not a second course to add to your calendar. A protocol that fits inside your real day.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-on-dark)' }}>Honesty, not aspiration</p>
              <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                The protocol works when you practice where you actually are. Not where you wish you were. Show up real. The data will follow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-16 text-center space-y-6">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
          Take the assessment. Start Week 1.
        </h2>
        <p className="max-w-xl mx-auto text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
          The program is included with your assessment. No upsell. No coaching packages. Just the protocol, the tools, and 10 weeks of structured practice.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/assessment/setup" className="btn-primary">
            Take the assessment
          </Link>
          <Link href="/portal" className="btn-watch">
            Return to your portal
          </Link>
        </div>
      </section>
    </main>
  );
}
