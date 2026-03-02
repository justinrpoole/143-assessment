---
name: brand-switch
description: >
  Brand context gate that runs before any skill session. Asks which business
  the user is working on, loads the correct voice profile and brand files,
  and prevents cross-contamination between brands. This is not optional —
  the orchestrator calls it on every session start. Without it, skills load
  whichever voice-profile.md happens to be in ./brand/ and output drifts.
  Triggers on: session start (automatic), "switch brand", "wrong voice",
  "which business", "change brand". Outputs: active-brand.md (written to
  ./brand/), correct voice and positioning files loaded into context.
  Reads: brands.md. Writes: active-brand.md.
---

# /brand-switch — Brand Context Gate

This skill exists because you wear four hats from one system.

Justin Ray / 143 Leadership writes like a friend who mapped the
terrain and hands you the map. "Not personality. Capacity."

JRW Design Co / Handmade Signs writes like your Disney bestie
saving you a seat on Main Street. "Your walls should feel like
Main Street."

Ohio Made has its own identity and audience.

Consulting is a full-time professional role — project management
and leadership deliverables for stakeholders who expect a
different tone entirely.

If the wrong voice loads, everything downstream sounds off. A
coaching session written in Disney warmth loses authority. A sign
listing written in clinical directness loses magic. A client
deliverable written in cosmic metaphors loses credibility.

This skill prevents that. It runs first. Every time.

Read ./brand/ per _system/brand-memory.md

Follow all output formatting rules from _system/output-format.md

---

## Brand Memory Integration

### Reads

| File | Purpose |
|------|---------|
| ./brand/brands.md | Registry of all businesses, their profile directories, and skill lanes |
| ./brand/active-brand.md | Previous session's selection (if exists) |

### Writes

| File | Purpose |
|------|---------|
| ./brand/active-brand.md | Current session's active brand — read by all skills |

---

## When This Skill Runs

### Automatic Triggers (orchestrator calls this)

1. **Every new session.** Before any skill executes, brand-switch runs.
2. **No active-brand.md exists.** First time or file was cleared.
3. **User says "switch brand" or "wrong voice."** Mid-session correction.

### Skip Conditions

1. **active-brand.md exists AND was written today AND user's request clearly matches the same brand.** Show a one-line confirmation instead of re-asking.
2. **User explicitly says "keep the same brand."** Proceed without asking.

---

## Execution Flow

### Step 1 — Read the Registry

Read `./brand/brands.md` to get the list of registered brands.

If brands.md does not exist, create it by scanning `./brand/profiles/`
for subdirectories. Each subdirectory with a voice-profile.md is a brand.

### Step 2 — Check for Returning Context

Read `./brand/active-brand.md` if it exists.

- If it was written today: show the current brand and ask to confirm or switch.
- If it was written on a previous day: treat as a new session — ask fresh.
- If it does not exist: ask fresh.

### Step 3 — Present the Selection

Output format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  BRAND SELECTION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Which business are we working on?

  ① Justin Ray / 143 Leadership
     Coaching, assessment, app, digital products
     Voice: direct, warm, science-translated
     "Not personality. Capacity."

  ② JRW Design Co / Handmade Signs
     Disney signs, Etsy, e-commerce
     Voice: warm insider, hopeful, whimsical
     "Your walls should feel like Main Street."

  ③ Ohio Made
     Holiday market, small business community
     Voice: not yet defined → /brand-voice
     Year-round hype + one big event

  ④ Consulting / PM & Leadership
     Full-time role — stakeholder comms,
     strategy docs, presentations, team dev
     Voice: not yet defined → /brand-voice

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Wait for the user to select ①, ②, ③, or ④.

### Step 4 — Load the Brand Context

Based on selection, read the brand's profile directory:

**If ① Justin Ray:**
- Load `./brand/profiles/justin-ray/voice-profile.md`
- Load `./brand/profiles/justin-ray/positioning.md` (if exists)
- Load `./brand/profiles/justin-ray/audience.md` (if exists)
- Load `./brand/profiles/justin-ray/competitors.md` (if exists)

**If ② Handmade Signs:**
- Load `./brand/profiles/handmade-signs/voice-profile.md`
- Load `./brand/profiles/handmade-signs/positioning.md` (if exists)
- Load `./brand/profiles/handmade-signs/audience.md` (if exists)
- Load `./brand/profiles/handmade-signs/competitors.md` (if exists)

**If ③ Ohio Made:**
- Load `./brand/profiles/ohio-made/voice-profile.md` (if exists)
- Load `./brand/profiles/ohio-made/positioning.md` (if exists)
- Load `./brand/profiles/ohio-made/audience.md` (if exists)
- If no voice-profile.md exists, flag it and offer to run /brand-voice

**If ④ Consulting:**
- Load `./brand/profiles/consulting/voice-profile.md` (if exists)
- Load `./brand/profiles/consulting/positioning.md` (if exists)
- Load `./brand/profiles/consulting/audience.md` (if exists)
- If no voice-profile.md exists, flag it and offer to run /brand-voice

**Always load (shared):**
- `./brand/stack.md`
- `./brand/learnings.md` (scan for brand-tagged entries)

### Step 5 — Write active-brand.md

Write `./brand/active-brand.md` with the selection:

```markdown
# Active Brand

**Brand:** {brand name}
**Selected:** {timestamp}
**Profile directory:** ./brand/profiles/{brand-slug}/
**Voice file:** ./brand/profiles/{brand-slug}/voice-profile.md
**Positioning file:** ./brand/profiles/{brand-slug}/positioning.md

## Loaded Files
- voice-profile.md ✓
- positioning.md ✓ (or ✗ not yet created)
- audience.md ✓ (or ✗ not yet created)
- competitors.md ✓ (or ✗ not yet created)

## Skill Lanes
{list of skills that apply to this brand}
```

### Step 6 — Confirm and Route

Output format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  BRAND LOADED

  {Brand Name}
  Voice: {one-line voice summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  FILES LOADED

  voice-profile.md          ✓
  positioning.md            ✓
  audience.md               ✗ (not yet created)
  stack.md                  ✓ (shared)

  WHAT'S NEXT

  → Tell me what you are working on
  → Or name a skill: /coaching-engine, /seo-content, etc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## How Other Skills Use active-brand.md

Every skill's brand memory loading step changes from:

```
OLD: Read ./brand/voice-profile.md
NEW: Read ./brand/active-brand.md to get the profile directory,
     then read {profile-directory}/voice-profile.md
```

If active-brand.md does not exist when a skill starts:
1. Do NOT load any voice profile
2. Show: "No brand selected this session. Which business?"
3. Run brand-switch before proceeding

If active-brand.md exists:
1. Read the profile directory path
2. Load voice-profile.md from that directory
3. Load positioning.md from that directory
4. Proceed with the skill

---

## Returning Session — Quick Confirm

When active-brand.md exists and was written today, do not re-ask.
Show a one-line confirmation:

```
  Brand: Justin Ray / 143 Leadership ✓
  (Say "switch brand" to change)
```

Then proceed directly to routing.

---

## Mid-Session Brand Switch

If the user says "switch brand" or "wrong voice" or "use the other brand":

1. Re-run the selection (Step 3)
2. Overwrite active-brand.md
3. Reload all brand files from the new profile directory
4. Confirm the switch
5. Continue with the new brand context

---

## Lane Protection

After brand selection, if the user requests a skill outside the brand's
lanes (listed in brands.md), show a warning:

```
┌──────────────────────────────────────────────────┐
│  LANE WARNING                                    │
│                                                  │
│  /coaching-engine is not in JRW Design Co's      │
│  skill lanes. This skill uses Justin Ray's       │
│  voice and 143 Leadership framework.             │
│                                                  │
│  → Switch to Justin Ray first?                   │
│  → Or proceed anyway?                            │
└──────────────────────────────────────────────────┘
```

This prevents running coaching with Disney voice or writing
Disney marketing copy in Justin Ray's clinical directness.

---

## Adding a New Brand

To register a new business:

1. Create `./brand/profiles/{brand-slug}/`
2. Run `/brand-voice` to generate a voice-profile.md in that directory
3. Run `/positioning-angles` to generate positioning.md
4. Add the brand entry to `./brand/brands.md`
5. List its skill lanes

The system supports unlimited brands. Each brand gets its own
profile directory. Shared files (stack, assets, learnings) stay
at the `./brand/` root.

---

## Error States

```
┌──────────────────────────────────────────────────┐
│  NO BRANDS REGISTERED                            │
│                                                  │
│  ./brand/brands.md is empty or missing.          │
│  No profile directories found.                   │
│                                                  │
│  → /brand-voice    Create your first brand       │
└──────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────┐
│  VOICE PROFILE MISSING                           │
│                                                  │
│  Brand "{name}" has no voice-profile.md          │
│  in {profile-directory}                          │
│                                                  │
│  → /brand-voice    Build it now (~10 min)        │
│  → Proceed without voice (output will be         │
│    generic)                                      │
└──────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────┐
│  CROSS-BRAND CONTAMINATION DETECTED              │
│                                                  │
│  Active brand is "{Brand A}" but the request     │
│  references "{Brand B}" language or concepts.    │
│                                                  │
│  → Switch to {Brand B}?                          │
│  → Stay on {Brand A}?                            │
└──────────────────────────────────────────────────┘
```

---

## Implementation Notes for the LLM

1. **This skill is a gate, not a suggestion.** It runs before other skills.
   Do not skip it. Do not assume the brand from context. Ask.

2. **Same-day returns get a one-liner, not the full menu.** Respect
   the user's time. If they picked Justin Ray 10 minutes ago, do not
   make them pick again.

3. **The profile directory is the source of truth.** Do not load
   voice-profile.md from `./brand/` root. Load it from
   `./brand/profiles/{brand-slug}/voice-profile.md`.

4. **When writing assets.md, tag the brand.** Every entry should include
   `[Justin Ray]` or `[Handmade Signs]` so the append-only file stays
   organized across brands.

5. **Lane warnings are soft, not hard blocks.** The user can override.
   Sometimes you need coaching-engine concepts for Handmade Signs
   content. But always flag it so the voice does not drift.

6. **active-brand.md is ephemeral.** It represents the current session's
   choice. It gets overwritten every time brand-switch runs. Do not
   treat it as permanent state.
