---
name: critic
version: 1.0
description: >
  Universal quality gate that sits between any content-producing skill
  and the user. Scores output against brand voice, positioning, audience
  resonance, and format-specific metrics. Loops: produce → critique →
  improve → re-critique → ship when threshold met. Logs quality data
  to learnings.md for system-wide improvement over time. The critic
  pattern from Nebula-style agent architectures, built into the Power
  Skills system.
triggers:
  - /critic
  - /critique
  - critique this
  - score this
  - is this good enough
  - quality check
  - review this output
  - rate this
  - does this match my voice
  - brand check
  - voice check
  - ready to ship
outputs:
  - Quality scorecard (terminal display)
  - Revised output (if below threshold)
  - ./brand/learnings.md (append quality data)
dependencies:
  - ./brand/profiles/{brand}/voice-profile.md (required)
  - ./brand/profiles/{brand}/positioning.md (recommended)
  - ./brand/profiles/{brand}/audience.md (recommended)
layer: 0 (SYSTEM — quality gate that all content skills can chain to)
reads:
  - ./brand/profiles/{brand}/voice-profile.md
  - ./brand/profiles/{brand}/positioning.md
  - ./brand/profiles/{brand}/audience.md
  - ./brand/learnings.md
writes:
  - ./brand/learnings.md (appends quality scores + patterns)
chains_from:
  - /direct-response-copy
  - /email-sequences
  - /seo-content
  - /newsletter
  - /content-atomizer
  - /lead-magnet
  - /creative
  - /gamma
  - /assessment-brain
chains_to:
  - Publishing / shipping the output
  - /knowledge-vault (logs quality data)
---


# /critic — Universal Quality Gate

## THE CORE JOB

Nothing ships without passing the critic. This skill scores ANY
content output against brand voice, positioning, audience, and
format-specific quality metrics. If the score is below threshold,
it rewrites with specific feedback and re-scores until the
threshold is met.

The critic is not a proofreader. It is a brand guardian, audience
advocate, and quality enforcer. It answers one question:
"Would I be proud to publish this under this brand?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## HOW IT WORKS

### The Loop

  ┌─────────────────────────────────────────────┐
  │                                             │
  │   SKILL OUTPUT                              │
  │       ↓                                     │
  │   /critic SCORES (6 dimensions)             │
  │       ↓                                     │
  │   Score ≥ 8/10 on all? ──YES──→ SHIP ✓     │
  │       │                                     │
  │       NO                                    │
  │       ↓                                     │
  │   SPECIFIC FEEDBACK (what + why + fix)      │
  │       ↓                                     │
  │   REWRITE (targeted improvements)           │
  │       ↓                                     │
  │   RE-SCORE ──→ (loop until threshold met)   │
  │                                             │
  └─────────────────────────────────────────────┘

  Maximum loops: 3. If still below 8/10 after 3 rewrites,
  ship with a quality flag and log the pattern to learnings.md.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## THE 6 SCORING DIMENSIONS

### 1. Voice Alignment (loads voice-profile.md)

  Does this sound like the brand?

  CHECK:
  - Vocabulary: uses approved words, avoids banned words
  - Rhythm: matches sentence pattern (short declaratives,
    "Not X. Y." transitions, plain naming)
  - Tone: matches the tone spectrum (warmth, directness,
    authority, humor, precision levels)
  - Signature patterns: uses at least 1 signature sentence
    pattern from the voice profile
  - Anti-patterns: contains zero off-brand phrases

  SCORE 1-10:
  10 = Could not distinguish from hand-written by brand owner
   8 = Clearly on-brand with minor adjustments needed
   5 = Generic — could be any brand
   3 = Wrong tone — sounds like a different brand
   1 = Actively off-brand — violates voice guidelines

### 2. Positioning Alignment (loads positioning.md)

  Does this reinforce the market position?

  CHECK:
  - Uses language from the primary positioning angle
  - Avoids saturated competitor claims
  - Reinforces white space territory
  - Mechanism is named or implied (not just promise)
  - Differentiation from competitors is clear

  SCORE 1-10:
  10 = Actively reinforces market position in every line
   8 = Position is clear without being forced
   5 = Neutral — doesn't reinforce or contradict
   3 = Uses competitor language or saturated claims
   1 = Actively undermines positioning

### 3. Audience Resonance (loads audience.md)

  Would the target audience care about this?

  CHECK:
  - Speaks to the pain points of at least 1 defined segment
  - Uses language the audience actually uses (not jargon)
  - Addresses their desires, not just features
  - Would trigger a "that's exactly how I feel" response
  - Respects their sophistication level (don't talk down)

  SCORE 1-10:
  10 = Audience would screenshot and send to a friend
   8 = Clearly resonant with target segment
   5 = Generic — could be for anyone
   3 = Wrong audience — speaks to different segment
   1 = Would alienate the target audience

### 4. Clarity & Specificity

  Is this clear, specific, and actionable?

  CHECK:
  - No vague claims ("better results", "transform your life")
  - Specific numbers, names, or examples where applicable
  - One idea per paragraph (no compound-idea sentences)
  - CTA is clear and specific (if applicable)
  - Reader knows exactly what to do next after reading

  SCORE 1-10:
  10 = Crystal clear, specific, impossible to misunderstand
   8 = Clear with minor vagueness in 1-2 spots
   5 = Generally clear but lacks specificity
   3 = Confusing or overly abstract
   1 = Incomprehensible or entirely vague

### 5. Format Execution

  Does this nail the format it's supposed to be?

  FORMAT-SPECIFIC CHECKS:
  - Landing page: hook → problem → mechanism → proof → CTA flow
  - Email: subject line power, preview text, single CTA
  - Blog/SEO: target keyword usage, headers, readability, schema
  - Social post: hook in first line, platform length, CTA
  - Newsletter: value-first, scannable, personality, single ask
  - Assessment report: evidence-led, confidence-rated, tools-first
  - Presentation: one idea per slide, visual hierarchy, narrative

  SCORE 1-10:
  10 = Best-in-class for this format
   8 = Solid execution with minor format improvements
   5 = Acceptable but doesn't leverage format strengths
   3 = Wrong format conventions applied
   1 = Doesn't function as this format

### 6. Conversion Power

  Will this actually produce the desired action?

  CHECK:
  - Opens with tension, curiosity, or recognition (not description)
  - Builds desire through the body (not just informs)
  - Addresses the primary objection (even if subtly)
  - CTA is specific, low-friction, and high-reward framing
  - Risk reversal or urgency present (if appropriate)
  - Would YOU take the action after reading this?

  SCORE 1-10:
  10 = Would convert a cold stranger into a buyer
   8 = Strong conversion with minor optimization possible
   5 = Informative but passive — doesn't drive action
   3 = Actively creates friction or doubt
   1 = Would drive the audience away

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## OUTPUT FORMAT

### Scorecard Display

  ┌─────────────────────────────────────────────┐
  │  CRITIC SCORECARD                           │
  │  [Content type]: [title/description]        │
  │  Brand: [active brand]                      │
  │                                             │
  │  ① Voice Alignment     [N]/10  [bar]        │
  │  ② Positioning         [N]/10  [bar]        │
  │  ③ Audience Resonance  [N]/10  [bar]        │
  │  ④ Clarity & Specifics [N]/10  [bar]        │
  │  ⑤ Format Execution    [N]/10  [bar]        │
  │  ⑥ Conversion Power    [N]/10  [bar]        │
  │  ──────────────────────────────────         │
  │  OVERALL               [N]/10               │
  │                                             │
  │  VERDICT: [SHIP ✓ / REVISE / REWRITE]      │
  │                                             │
  │  [If REVISE/REWRITE:]                       │
  │  FIXES NEEDED:                              │
  │  → [Dimension]: [specific fix]              │
  │  → [Dimension]: [specific fix]              │
  │  → [Dimension]: [specific fix]              │
  └─────────────────────────────────────────────┘

  Bar format: ████████░░ (filled/empty blocks, 10 chars)

### Verdicts

  SHIP ✓    All 6 dimensions ≥ 8/10. Ready to publish.
  REVISE    1-2 dimensions below 8. Targeted fixes only.
  REWRITE   3+ dimensions below 8. Structural issues.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## REVISION PROTOCOL

When the verdict is REVISE or REWRITE:

  1. IDENTIFY the specific lines/sections that fail
  2. EXPLAIN why they fail (reference the scoring criteria)
  3. PROVIDE the rewritten version
  4. RE-SCORE the revision against all 6 dimensions
  5. If still below 8: loop (max 3 times)
  6. If still below 8 after 3 loops: ship with quality flag

  Revision feedback is SPECIFIC, not generic:

  ✗ BAD:  "Make this more on-brand"
  ✓ GOOD: "Line 3 uses 'optimize your leadership' — this is
           banned vocabulary per voice-profile.md. Replace with
           'build your capacity' to match the Trainable Capacity
           Engine positioning."

  ✗ BAD:  "Add more specificity"
  ✓ GOOD: "The CTA 'Learn more' scores 3/10 on conversion.
           Replace with 'Check My Stability' (first-person,
           action-specific, per naming conventions)."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## LEARNING LOOP

After every critique (pass or fail), log to learnings.md:

  Format:
  - [date] [/critic] [content-type] [overall-score]/10
    [brand]. Lowest dimension: [dimension] at [score]/10.
    [One-sentence note on what was strong or weak.]

  Examples:
  - [2026-02-24] [/critic] Landing page 9/10 justin-ray.
    Lowest: Format Execution at 8/10. Strong voice match,
    excellent audience resonance. CTA alignment perfect.

  - [2026-02-24] [/critic] Email sequence 6/10 justin-ray.
    Lowest: Voice Alignment at 5/10. Subject lines used
    banned word "optimize." Revised to 8/10 after 1 loop.

  Over time, learnings.md builds a quality profile:
  - Which content types score highest/lowest
  - Which dimensions consistently fail
  - Which brands are hardest to match
  - What patterns get flagged repeatedly (systemic issues)

  Pattern detection (read by /knowledge-vault scan):
  - Same dimension fails 3+ times → systemic voice issue
  - Same content type always rewrites → skill needs tuning
  - Scores trending up over time → system is learning

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## INVOCATION MODES

### Mode 1: Inline (auto-triggered by other skills)

  After /direct-response-copy, /email-sequences, /seo-content,
  or /newsletter produces output, /critic runs automatically
  before presenting the final version to the user.

  The user sees the FINAL output (post-critique), plus the
  scorecard showing what was adjusted.

### Mode 2: Manual (user-triggered)

  User pastes or points to content and says:
  "critique this" / "is this good enough" / "score this"

  /critic scores and provides the full scorecard + revision
  if needed.

### Mode 3: Compare (A/B evaluation)

  User provides 2+ versions:
  "which is better — A or B?"

  /critic scores both independently, then recommends with
  a side-by-side comparison scorecard.

### Mode 4: Voice Check (quick mode)

  User says "does this match my voice?" or "brand check"

  /critic runs ONLY Dimension 1 (Voice Alignment) — fast,
  focused, returns just the voice score + specific fixes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## THRESHOLD CUSTOMIZATION

  Default threshold: 8/10 on all dimensions.

  User can override:
  "ship at 7" → lowers threshold to 7/10 for this session
  "be strict" → raises threshold to 9/10
  "voice only" → only enforce Voice Alignment dimension

  For internal/draft content: threshold can drop to 6/10.
  For public-facing/paid content: never below 8/10.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## WHAT THIS SKILL IS NOT

  - Not a grammar checker (use Grammarly for that)
  - Not a plagiarism detector
  - Not a legal reviewer
  - Not a replacement for human taste (it enforces brand
    standards, not creative direction)
  - Not a content strategy tool (that's /positioning-angles
    or /keyword-research)

  The critic ensures EXECUTION quality against ESTABLISHED
  standards. It does not set the standards — the brand memory
  files do that.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## CONNECTIONS

  INPUTS (skills that feed the critic):
  /direct-response-copy → critique landing pages, sales copy
  /email-sequences      → critique subject lines, email body
  /seo-content          → critique articles, SEO compliance
  /newsletter           → critique newsletter editions
  /content-atomizer     → critique platform-specific posts
  /lead-magnet          → critique lead magnet content
  /creative             → critique ad copy (not visuals)
  /gamma                → critique presentation text
  /assessment-brain     → critique report language

  OUTPUTS (what the critic feeds):
  Publishing / shipping (content that passes)
  /knowledge-vault      → quality scores logged to learnings.md
  Future skill runs     → learnings.md informs better output
