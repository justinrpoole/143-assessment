'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// ---------------------------------------------------------------------------
// Tool catalog — all 13 OS tools with science grounding + RAS hooks
// ---------------------------------------------------------------------------
const TOOLS = [
  {
    key: '90_second_window',
    name: '90-Second Window',
    emoji: '⏱️',
    essence: 'Ride the chemical wave instead of reacting inside it.',
    whyItWorks: 'Emotion chemicals clear in ~90 seconds — after that, you choose whether to stay activated.',
    science: 'Jill Bolte Taylor (2008): the neurological lifespan of an emotion is 90 seconds.',
    rasHook: 'Your RAS learns that pausing is power, not retreat. It stops routing straight to reaction.',
    time: '90 sec',
    category: 'reset',
    category_label: 'Reset',
    protocol: ['Name it: "This is activation."', 'Slow exhale (longer out than in).', 'Drop shoulders, relax jaw.', 'Wait. Do not respond until the wave drops.'],
  },
  {
    key: 'presence_pause',
    name: 'Presence Pause',
    emoji: '🌬️',
    essence: 'Feet on floor. One breath. Three things you can see, hear, or feel.',
    whyItWorks: 'Anchors attention to now — disrupts the Default Mode Network in 10–30 seconds.',
    science: 'Jha (2013): interoception training improves sustained attention and emotional regulation.',
    rasHook: 'Trains your brain to notice the present before defaulting to the narrative.',
    time: '10–30 sec',
    category: 'reset',
    category_label: 'Reset',
    protocol: ['Feet: feel contact points.', 'Breath: one slow inhale, longer exhale.', 'Name 3: things you can see / hear / feel.', 'Choose: one intention for the next minute.'],
  },
  {
    key: 'watch_me',
    name: 'Watch Me',
    emoji: '🎯',
    essence: 'Tell your brain what to lock onto next. Re-select the signal.',
    whyItWorks: 'Stops the loudest stimulus from running your attention. You choose what to focus on.',
    science: 'Prefrontal top-down attention control (Desimone & Duncan, 1995): deliberate focus overrides reactive focus.',
    rasHook: 'Every Watch Me rep trains your RAS to prioritise signal over noise.',
    time: '30–60 sec',
    category: 'action',
    category_label: 'Action',
    protocol: ['Command: "Watch me."', 'Select: one target (priority, person, outcome).', 'Anchor: one breath.', 'Action: one small step toward the target.'],
  },
  {
    key: 'go_first',
    name: 'Go First',
    emoji: '🚀',
    essence: 'Do the first rep before you feel ready. Starting is the skill.',
    whyItWorks: 'Execution activates the prefrontal cortex. Waiting to feel ready keeps you waiting.',
    science: 'Behavioral activation (Martell et al.): action precedes motivation, not the other way around.',
    rasHook: 'Your brain stops waiting for readiness when you prove readiness isn\'t required.',
    time: '1 min',
    category: 'action',
    category_label: 'Action',
    protocol: ['Name the next smallest action (30–120 seconds).', 'Do it immediately.', 'Then decide what\'s next.'],
  },
  {
    key: 'i_rise',
    name: 'I Rise',
    emoji: '☀️',
    essence: 'Name the drift. Own it. Return to your standard.',
    whyItWorks: 'Naming the emotion reduces amygdala reactivity. The declaration shifts processing to prefrontal cortex.',
    science: 'Lieberman et al. (2007): affect labeling reduces amygdala activation within seconds.',
    rasHook: 'Naming the pattern creates a gap. In that gap, you choose differently.',
    time: '60–120 sec',
    category: 'reset',
    category_label: 'Reset',
    protocol: ['Name: "I drifted."', 'Own: "That\'s on me."', 'Reset: "I Rise — this is who I am."', 'Rep: one aligned action now.'],
  },
  {
    key: 'reflection_loop',
    name: 'Reflection Loop',
    emoji: '🔁',
    essence: 'What worked? Where did I drift? Smallest change tomorrow?',
    whyItWorks: 'Reflection is compounding — converts experience into usable insight. Stops you repeating the same week.',
    science: 'Metacognition research (Flavell, 1979): reflection on process improves future performance.',
    rasHook: 'Your RAS starts scanning for patterns automatically once you make reflection habitual.',
    time: '3–10 min',
    category: 'reflect',
    category_label: 'Reflect',
    protocol: ['What worked?', 'Where did I drift?', 'What\'s the smallest change tomorrow?'],
  },
  {
    key: 'if_then_planning',
    name: 'If/Then Planning',
    emoji: '🗺️',
    essence: 'Pre-decide: "If X happens, then I do Y." Protect execution under stress.',
    whyItWorks: 'Removes in-the-moment decision making when willpower and clarity are lowest.',
    science: 'Gollwitzer (1999): implementation intentions more than double follow-through rates.',
    rasHook: 'Pre-loaded plans bypass the amygdala. Your brain executes the plan before panic arrives.',
    time: '5 min',
    category: 'plan',
    category_label: 'Plan',
    protocol: ['Identify the barrier.', 'Define the action (specific, small).', 'State it: "If [X], then I will [Y]."', 'Review weekly.'],
  },
  {
    key: 'boundary_of_light',
    name: 'Boundary of Light',
    emoji: '🛡️',
    essence: 'Name it. State it clean. Hold it. Protect your energy.',
    whyItWorks: 'Boundaries reduce energy borrowing — they are a performance strategy, not selfishness.',
    science: 'McEwen (2008): sustained boundary violations increase energy borrowing and deplete executive function.',
    rasHook: 'Boundaries tell your RAS where your energy belongs. Less leak, more light.',
    time: 'Ongoing',
    category: 'protect',
    category_label: 'Protect',
    protocol: ['Name the boundary (what you will/won\'t do).', 'State it cleanly (no apology).', 'Hold it consistently.', 'Reinforce every held boundary.'],
  },
  {
    key: 'ras_reset',
    name: 'RAS Reset',
    emoji: '🧠',
    essence: 'Name 3 things you want to notice today. Prime your attention.',
    whyItWorks: 'Your brain finds what you tell it to look for — but defaults to threats unless you redirect it.',
    science: 'Reticular Activating System (Moruzzi & Magoun, 1949): the brain\'s attention filter is trainable.',
    rasHook: 'The core move. Everything else builds on this. Tell your RAS what matters.',
    time: '30 sec',
    category: 'plan',
    category_label: 'Plan',
    protocol: ['Name 3 things you want to notice today (opportunities, calm cues, truth moments).', 'Say them out loud or write them.', 'At the end of the day: what did you notice?'],
  },
  {
    key: 'question_loop',
    name: 'Question Loop',
    emoji: '💬',
    essence: 'One real question. Listen to understand. Ask the next one.',
    whyItWorks: 'Questions shift the nervous system from defend to explore — reducing threat rigidity.',
    science: 'Edmondson (1999): curiosity-based questioning builds psychological safety and decision quality.',
    rasHook: 'Questions rewire your RAS from "prove and defend" to "discover and connect".',
    time: '3–10 min',
    category: 'connect',
    category_label: 'Connect',
    protocol: ['Ask one real question.', 'Reflect back what you heard.', 'Confirm.', 'Ask the next question.'],
  },
  {
    key: 'witness',
    name: 'Witness',
    emoji: '👁️',
    essence: 'See what is real. Do not manipulate the answer.',
    whyItWorks: 'Separates observation from narrative — reduces confirmation bias and restores clarity.',
    science: 'Cognitive debiasing research: witnessing facts before interpretation improves decision accuracy.',
    rasHook: 'Witnessing trains the RAS to see what is, not what it expects to see.',
    time: '5 min',
    category: 'reflect',
    category_label: 'Reflect',
    protocol: ['Ask open questions (not leading).', 'Track facts, not assumptions.', 'Name assumptions when they appear.', 'Confirm before concluding.'],
  },
  {
    key: '143_challenge',
    name: '143 Challenge',
    emoji: '💛',
    essence: 'Every :43 on the clock, say "I love you" — the number before it tells you how many times.',
    whyItWorks: 'Your brain can\'t tell who says "I love you." Self-directed love activates the same reward pathways as external validation. The changing count (1×, 7×, 12×) prevents habituation.',
    science: 'RAS pattern recognition (Moruzzi & Magoun, 1949) + affect labeling (Lieberman et al., 2007): telling your brain what matters changes what it finds. 21 days to interrupt old patterns, 63 days for new defaults.',
    rasHook: 'You program your RAS to scan for 143 — and every time it finds it, you get a micro-dose of self-love. Your brain stops collecting evidence of "not enough" and starts building evidence of love.',
    time: 'All day',
    category: 'practice',
    category_label: 'Practice',
    protocol: ['Notice: Train your RAS — look for 143 on clocks, addresses, receipts, anywhere.', 'Act: At every :43, say "I love you" based on the hour (1:43 = 1×, 7:43 = 7×, 12:43 = 12×).', 'Direct it: To yourself ("I love you, [your name]"), to someone you care about, or as gratitude.', 'REP it: Recognition (I noticed) + Encouragement (I showed up) = Performance & Sustainability.'],
  },
  {
    key: 'let_them',
    name: 'Let Them / Let Me',
    emoji: '🕊️',
    essence: 'Let them choose. Let me choose my response. Release what I cannot control.',
    whyItWorks: 'Releasing control reduces cortisol and restores agency — the foundation of leadership.',
    science: 'Deci & Ryan (2000): autonomy support (for self and others) is a core driver of wellbeing and performance.',
    rasHook: 'Letting go rewires the RAS to scan for what you can control, not what you can\'t.',
    time: '30 sec',
    category: 'release',
    category_label: 'Release',
    protocol: ['Identify what you\'re trying to control.', 'Let them: release their choice.', 'Let me: choose your response, boundary, or next rep.'],
  },
] as const;

type Category = 'all' | 'reset' | 'action' | 'reflect' | 'plan' | 'connect' | 'protect' | 'practice' | 'release';

const CATEGORY_FILTERS: { key: Category; label: string; color: string }[] = [
  { key: 'all', label: 'All tools', color: '#F8D011' },
  { key: 'reset', label: 'Reset', color: '#2ECC71' },       // aurora-green — recovery
  { key: 'action', label: 'Action', color: '#C0392B' },      // ray-power — courage/motion
  { key: 'reflect', label: 'Reflect', color: '#8E44AD' },    // ray-presence — attention
  { key: 'plan', label: 'Plan', color: '#60A5FA' },          // ray-intention — direction
  { key: 'connect', label: 'Connect', color: '#E74C8B' },    // ray-connection — relationship
  { key: 'protect', label: 'Protect', color: '#1ABC9C' },    // ray-possibility — boundaries
  { key: 'release', label: 'Release', color: '#C39BD3' },    // aurora-pink — letting go
  { key: 'practice', label: 'Practice', color: '#D4770B' },  // ray-purpose — meaning
];

export default function ToolkitClient() {
  useReducedMotion(); // ensures Framer Motion respects prefers-reduced-motion
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const filteredTools = activeCategory === 'all'
    ? TOOLS
    : TOOLS.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-6">

      {/* Header / framing */}
      <div className="glass-card p-5 space-y-2" style={{ borderColor: 'rgba(96, 5, 141, 0.3)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          🛠️ Your tool stack — 13 protocols from the OS
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Every tool here is a rep. Pick one. Run it. Log it.{' '}
          <strong style={{ color: 'var(--brand-gold, #F8D011)' }}>That&apos;s the whole thing.</strong>
          {' '}Each rep rewires your Reticular Activating System — training your brain to find what you practice, not just what threatens it.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map((f) => {
          const active = activeCategory === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveCategory(f.key)}
              className="px-3 py-1.5 rounded-full text-sm border transition-all"
              style={{
                background: active ? `${f.color}22` : 'rgba(255,255,255,0.04)',
                color: active ? f.color : 'var(--text-on-dark-muted)',
                borderColor: active ? `${f.color}66` : 'var(--surface-border)',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Tool cards */}
      {filteredTools.length === 0 ? (
        <div className="glass-card p-6 text-center space-y-2">
          <p className="text-2xl">🛠️</p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>
            No tools in this category yet.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Try &quot;All tools&quot; to see the full library.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredTools.map((tool, i) => {
            const isExpanded = expandedTool === tool.key;
            const catFilter = CATEGORY_FILTERS.find((f) => f.key === tool.category);
            return (
              <motion.li
                key={tool.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedTool(isExpanded ? null : tool.key)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{tool.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                            {tool.name}
                          </p>
                          <span className="text-xs rounded-full px-2 py-0.5"
                            style={{
                              color: 'var(--text-on-dark-muted)',
                              border: '1px solid var(--surface-border)',
                            }}>
                            {tool.time}
                          </span>
                          <span className="text-xs rounded-full px-2 py-0.5"
                            style={{
                              color: catFilter?.color ?? '#7B4BAE',
                              background: `${catFilter?.color ?? '#7B4BAE'}15`,
                              border: `1px solid ${catFilter?.color ?? '#7B4BAE'}33`,
                            }}>
                            {tool.category_label}
                          </span>
                        </div>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                          {tool.essence}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-lg flex-shrink-0 transition-transform duration-200"
                      style={{
                        color: 'var(--text-on-dark-muted)',
                        transform: isExpanded ? 'rotate(45deg)' : 'rotate(0)',
                      }}
                    >
                      +
                    </span>
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 pt-2"
                        style={{ borderTop: '1px solid var(--surface-border)' }}>

                        {/* Why it works */}
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: 'var(--brand-gold, #F8D011)' }}>
                            Why it works
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                            {tool.whyItWorks}
                          </p>
                          <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
                            📚 {tool.science}
                          </p>
                        </div>

                        {/* RAS connection */}
                        <div className="glass-card p-3" style={{ borderColor: 'rgba(96, 5, 141, 0.2)' }}>
                          <p className="text-xs font-medium" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                            🧠 RAS connection
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>
                            {tool.rasHook}
                          </p>
                        </div>

                        {/* Protocol */}
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: 'var(--brand-gold, #F8D011)' }}>
                            The protocol
                          </p>
                          <ol className="space-y-1">
                            {tool.protocol.map((step, si) => (
                              <li key={si} className="flex gap-2 text-sm"
                                style={{ color: 'var(--text-on-dark-secondary)' }}>
                                <span className="font-semibold flex-shrink-0"
                                  style={{ color: 'var(--brand-gold, #F8D011)' }}>
                                  {si + 1}.
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* CTA */}
                        <Link
                          href={`/reps?tool=${tool.key}`}
                          className="btn-primary block text-center"
                        >
                          Run this rep → log it
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      )}

      <p className="text-center text-xs py-2" style={{ color: 'var(--text-on-dark-muted)' }}>
        {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} ·{' '}
        <Link href="/reps" className="underline underline-offset-2"
          style={{ color: 'var(--brand-gold, #F8D011)' }}>
          See your rep history →
        </Link>
      </p>
    </div>
  );
}
