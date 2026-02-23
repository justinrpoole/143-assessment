import Link from "next/link";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FAQ",
  description: "Everything you need to know about the 143 Assessment, your results, pricing, and the science behind the framework.",
};

const FAQS = [
  {
    category: "The Assessment",
    items: [
      {
        q: "What is the 143 Assessment?",
        a: "The 143 Assessment is a research-backed behavioural assessment that measures 9 trainable leadership capacities called Rays. It produces your Light Signature archetype (one of 36), your Eclipse Snapshot showing where stress is covering capacity, your Energy-to-Eclipse Ratio, and a personalised Rise Path with your next concrete step. It takes about 15 minutes to complete.",
      },
      {
        q: "How long does the assessment take?",
        a: "Most people complete the full 143-question assessment in 12 to 18 minutes. Your answers are automatically saved as you go, so you can close the browser and return later to pick up where you left off.",
      },
      {
        q: "What kind of questions are asked?",
        a: "The assessment uses three question types: frequency scales (how often you do something), scenario cards (what you would do in a specific situation), and reflections (open-ended self-observations). There are no right or wrong answers — the goal is an honest snapshot of how you are operating right now.",
      },
      {
        q: "Can I save and come back later?",
        a: "Yes. Answers are automatically saved every time you select a response. If you close the browser mid-assessment, you can return and pick up exactly where you left off. There is also a Save & Exit button if you prefer to be explicit about it.",
      },
      {
        q: "Is the assessment timed?",
        a: "No. Take as long as you need. The 15-minute estimate is an average, not a deadline.",
      },
      {
        q: "What happens after I submit?",
        a: "Your results are scored immediately using a deterministic scoring engine. You will see your full report — Light Signature, Eclipse Snapshot, 9-Ray scores, Energy-to-Eclipse Ratio, Gravitational Stability, and Rise Path — within seconds of submitting.",
      },
    ],
  },
  {
    category: "Results & Reports",
    items: [
      {
        q: "What is a Light Signature?",
        a: "Your Light Signature is a unique archetype based on your top two Rays. There are 36 possible combinations (the mathematical C(9,2) pairs). Examples include the Visionary Servant, the Bold Authentic, and the Driven Leader. Your Light Signature describes the combination of capacities that define your natural leadership force.",
      },
      {
        q: "What is the Eclipse Snapshot?",
        a: "The Eclipse Snapshot measures how much stress, depletion, or sustained pressure is covering your natural capacities. Think of it like a solar eclipse — your light is not gone, it is temporarily covered. The snapshot shows your eclipse level (Low, Moderate, Elevated, or High) and which specific dimensions are most affected.",
      },
      {
        q: "What is a Rise Path?",
        a: "Your Rise Path identifies the one Ray with the most potential for immediate growth and gives you a concrete next step. This is not your weakest point — it is the capacity where a small amount of training will create the biggest shift in how you lead.",
      },
      {
        q: "Can I download my results?",
        a: "Yes. A downloadable PDF report is available on paid tiers. Your online report is always accessible by signing in.",
      },
      {
        q: "Will my results change over time?",
        a: "Yes — that is by design. Unlike personality assessments that give you a fixed type, the 143 measures trainable capacities. With the Coaching OS subscription, you can retake a 43-question tracking version each month and watch your scores change over time.",
      },
    ],
  },
  {
    category: "Pricing & Plans",
    items: [
      {
        q: "What does the free Light Check include?",
        a: "The Light Check is a quick three-minute eclipse screening. It gives you a plain-language read on whether eclipse is currently affecting your capacities. No account or email required.",
      },
      {
        q: "What does the $43 one-time assessment include?",
        a: "The full 143-question assessment, your Light Signature archetype, Eclipse Snapshot, complete 9-Ray behavioural map, Energy-to-Eclipse Ratio, Gravitational Stability Score, Performance-Presence Delta analysis, Rise Path, and a downloadable PDF report. Permanent access to your results.",
      },
      {
        q: "What does the $14.33/month Coaching OS include?",
        a: "Everything in the assessment plus unlimited monthly retakes (43-question tracking set), the 10-week Light Activation Programme, daily micro-practices matched to your Rise Path, Energy Audit and Evening Reflection tools, and a growth tracking dashboard. Cancel anytime.",
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes. Cancel anytime. No penalties. No exit interviews. If your payment lapses, your assessment history stays. Your data does not disappear. When you come back, your map is waiting.",
      },
      {
        q: "Is there a free trial?",
        a: "The Light Check is free. The full assessment starts at $43 one-time. There is no trial period for the Coaching OS, but you can cancel at any time.",
      },
    ],
  },
  {
    category: "Science & Methodology",
    items: [
      {
        q: "Is the 143 Assessment scientifically validated?",
        a: "The framework draws on decades of published behavioural science, positive psychology, and neuroscience research. Key references include McEwen (2008) on allostatic load, Lieberman et al. (2007) on affect labelling, Gollwitzer (1999) on implementation intentions, and Kross et al. (2014) on self-distancing. Every capacity is mapped to peer-reviewed evidence.",
      },
      {
        q: "How is the assessment scored?",
        a: "The scoring engine is deterministic — the same answers always produce the same results. Scores are computed using weighted means with polarity correction, and every scored assessment produces a SHA-256 signature pair for audit verification. The engine is versioned and the scoring methodology is fully transparent.",
      },
      {
        q: "Is this a personality test?",
        a: "No. Personality tests give you a fixed type. The 143 measures trainable capacities — scores that are designed to change over time. Your results describe how you are operating right now, not who you are permanently.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    items: [
      {
        q: "Is my data private?",
        a: "Yes. Your responses are encrypted in transit and at rest. We never sell your data. Your behavioural map belongs to you. See our full privacy policy for details.",
      },
      {
        q: "Who can see my results?",
        a: "Only you. Your results are tied to your authenticated account and are not visible to anyone else unless you choose to share them. Enterprise administrators can see aggregate team patterns but not individual responses.",
      },
      {
        q: "Can I delete my data?",
        a: "Yes. You can request complete data deletion at any time. Contact us and we will remove all your assessment data, responses, and results from our systems.",
      },
    ],
  },
];

export default async function FaqPage() {
  const userState = await getUserStateFromRequest();

  emitPageView({
    eventName: "page_view_faq",
    sourceRoute: "/faq",
    userState,
  });

  return (
    <main className="cosmic-page-bg">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[720px] px-5 pt-16 pb-12 text-center sm:px-8 sm:pt-24 sm:pb-16">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Support
        </p>
        <h1 className="mt-4 text-3xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
          Everything you need to know about the 143 Assessment, your results, and how to get the
          most from the framework.
        </p>
      </section>

      {/* ── Quick Jump ── */}
      <section className="mx-auto max-w-[720px] px-5 pb-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {FAQS.map((section) => (
            <a
              key={section.category}
              href={`#faq-${section.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="rounded-full px-3 py-1 text-xs font-semibold transition-colors hover:bg-[rgba(248,208,17,0.15)]"
              style={{ color: 'var(--brand-gold, #F8D011)', border: '1px solid rgba(248,208,17,0.2)' }}
            >
              {section.category}
            </a>
          ))}
        </div>
      </section>

      {/* ── FAQ Sections ── */}
      <section className="mx-auto max-w-[720px] space-y-12 px-5 pb-16 sm:px-8">
        {FAQS.map((section) => (
          <div key={section.category} id={`faq-${section.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
            <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((faq) => (
                <details key={faq.q} className="glass-card group p-5">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
                    {faq.q}
                    <svg
                      className="ml-3 h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{ color: 'var(--brand-gold, #F8D011)' }}
                      aria-hidden="true"
                    >
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Bottom CTA ── */}
      <section className="mx-auto max-w-[720px] px-5 pb-20 text-center sm:px-8">
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
            Still have questions?
          </h2>
          <p className="mx-auto mt-2 max-w-[400px] text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            Start with the free Light Check and see the framework in action. Or jump straight
            into the full assessment.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/preview" className="btn-primary">
              Start the Light Check — Free
            </Link>
            <Link href="/upgrade" className="btn-watch">
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
