'use client';

import { useState } from 'react';

/**
 * Conversation starters mapped by bottom ray.
 * Each ray has 4 starters: 1 for manager, 1 for peer, 1 for coach, 1 for team.
 * Written in first person so the user can use them directly.
 */
const STARTERS_BY_RAY: Record<string, { context: string; opener: string }[]> = {
  R1: [
    { context: 'With your manager', opener: 'I have been spreading my attention too thin. Can we look at my priorities and decide what I should stop doing — not add?' },
    { context: 'With a peer', opener: 'I notice I say yes to everything. Would you be willing to check me when I take on something that is not mine?' },
    { context: 'With a coach or mentor', opener: 'I know what my priorities should be, but I keep getting pulled away. What pattern am I missing?' },
    { context: 'In a team meeting', opener: 'Before we add this, can we name what we are choosing not to do? I want to protect our focus.' },
  ],
  R2: [
    { context: 'With your manager', opener: 'I have been running on obligation for a while. I want to find what energizes me here again. Can we talk about that?' },
    { context: 'With a peer', opener: 'I have been noticing I skip past wins. Would you remind me to celebrate the small ones — even just acknowledging them?' },
    { context: 'With a coach or mentor', opener: 'I am productive but not enjoying the work. That worries me. What would you ask me to look at?' },
    { context: 'In a team meeting', opener: 'What is one thing we did this week that actually worked? I want to name it before we move on.' },
  ],
  R3: [
    { context: 'With your manager', opener: 'I have been noticing I check out in long meetings. A nudge — even a small one — would help me stay present.' },
    { context: 'With a peer', opener: 'I rush through conversations sometimes. If you notice me doing that, would you slow me down?' },
    { context: 'With a coach or mentor', opener: 'I know I am not fully present. I can feel it. What is the smallest thing I could practice to change that?' },
    { context: 'In a team meeting', opener: 'Can we start with 30 seconds of quiet before we jump in? I want to actually be here for this.' },
  ],
  R4: [
    { context: 'With your manager', opener: 'There is a decision I have been avoiding. I would rather make the wrong call than keep stalling. Can we talk through it?' },
    { context: 'With a peer', opener: 'I have been holding back on something I need to say. Can I practice being direct with you right now?' },
    { context: 'With a coach or mentor', opener: 'I avoid conflict and I know it costs me. What would bold look like for someone in my position?' },
    { context: 'In a team meeting', opener: 'I want to name the elephant: we have been avoiding a decision on this. What would it take to make a call today?' },
  ],
  R5: [
    { context: 'With your manager', opener: 'I have been doing the work, but I have lost track of why it matters. Can we reconnect this to something bigger?' },
    { context: 'With a peer', opener: 'I feel like I am drifting. Not burned out, just disconnected from the point. Have you ever felt that? What helped?' },
    { context: 'With a coach or mentor', opener: 'I can perform but I cannot tell you what I am building toward. That gap is starting to bother me.' },
    { context: 'In a team meeting', opener: 'Before we plan next quarter, can we spend 5 minutes on why this work matters to each of us?' },
  ],
  R6: [
    { context: 'With your manager', opener: 'I have been performing a version of myself that is not quite real. I want to be more honest here. Can we create space for that?' },
    { context: 'With a peer', opener: 'I hold back things I actually think. I want to practice saying the real thing. Can I try that with you?' },
    { context: 'With a coach or mentor', opener: 'I am good at reading a room. But I think I am disappearing into what other people need me to be.' },
    { context: 'In a team meeting', opener: 'I want to share something I have been holding back. It might not be polished, but it is honest.' },
  ],
  R7: [
    { context: 'With your manager', opener: 'I have been more isolated than usual. I think I need to invest in relationships here. What would you suggest?' },
    { context: 'With a peer', opener: 'I have not been great at staying connected. I want to change that. Can we set up a regular check-in?' },
    { context: 'With a coach or mentor', opener: 'I default to independence. But I think I am missing something by not letting people in. What am I not seeing?' },
    { context: 'In a team meeting', opener: 'I want us to hear from the people who have not spoken yet. Not because they should — because we need what they see.' },
  ],
  R8: [
    { context: 'With your manager', opener: 'I have been playing it safe. I want permission to try something that might not work. Can we create space for that?' },
    { context: 'With a peer', opener: 'I had an idea I dismissed because it seemed too different. Can I run it by you before I let it go?' },
    { context: 'With a coach or mentor', opener: 'I think I am limiting myself to what I already know how to do. How do I think bigger without being reckless?' },
    { context: 'In a team meeting', opener: 'What if we tried something we have never done before? Even a small experiment. What would we learn?' },
  ],
  R9: [
    { context: 'With your manager', opener: 'I want to be someone people learn from, not just someone who gets things done. What does that look like in my role?' },
    { context: 'With a peer', opener: 'You have helped me more than you know. I wanted to say that out loud.' },
    { context: 'With a coach or mentor', opener: 'I want my leadership to matter beyond my results. But I do not know how to measure that. What would you look at?' },
    { context: 'In a team meeting', opener: 'What is one thing each of us could do this week that would make someone else\u2019s job easier?' },
  ],
};

/** Fallback starters when no bottom ray is identified */
const GENERIC_STARTERS = [
  { context: 'With your manager', opener: 'I have been thinking about where I am as a leader. Can we set aside time to talk about my growth, not just my output?' },
  { context: 'With a peer', opener: 'I am trying to be more intentional about how I show up. Would you be willing to give me honest feedback sometimes?' },
  { context: 'With a coach or mentor', opener: 'I just took an assessment that surfaced some patterns. I want to talk about what I am seeing.' },
  { context: 'In a team meeting', opener: 'What is one thing we could do differently this week that would make us better, not just busier?' },
];

interface ConversationStartersProps {
  bottomRayId: string | null;
  bottomRayName: string | null;
  eclipseLevel: string | null;
}

export default function ConversationStarters({
  bottomRayId,
  bottomRayName,
  eclipseLevel,
}: ConversationStartersProps) {
  const [copied, setCopied] = useState<number | null>(null);

  const starters = bottomRayId && STARTERS_BY_RAY[bottomRayId]
    ? STARTERS_BY_RAY[bottomRayId]
    : GENERIC_STARTERS;

  async function copyStarter(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard not available
    }
  }

  const eclipseLabel = eclipseLevel === 'high'
    ? 'significant eclipse'
    : eclipseLevel === 'medium'
      ? 'moderate eclipse'
      : 'some eclipse';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          Conversation Starters
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Your assessment found {eclipseLabel} on{' '}
          <span className="text-brand-gold font-medium">{bottomRayName ?? 'your training ray'}</span>.
          These are ready-to-use openers for real conversations — with a manager, peer, coach, or team.
          Copy one and use it this week.
        </p>
      </div>

      <div className="grid gap-3">
        {starters.map((s, i) => (
          <div
            key={i}
            className="glass-card p-4 space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
                {s.context}
              </p>
              <button
                type="button"
                onClick={() => void copyStarter(s.opener, i)}
                className="text-xs font-medium transition-colors opacity-60 group-hover:opacity-100"
                style={{ color: copied === i ? 'var(--brand-gold)' : 'var(--text-on-dark-muted)' }}
              >
                {copied === i ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-on-dark)' }}>
              &ldquo;{s.opener}&rdquo;
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
        These are starting points, not scripts. Change the words to fit your voice.
        The point is to open a conversation you would not have opened otherwise.
      </p>
    </div>
  );
}
