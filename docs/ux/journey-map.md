# User Journey Map — 143 Leadership Assessment

## Stage 1: Discover

**Trigger:** Leader hears about 143 from a peer, sees a share card, or finds the site through search.

**Touchpoints:**
- Marketing home page (`/`)
- How It Works page (`/how-it-works`)
- Sample Report page (`/sample-report`)

**User thinking:**
- "Is this another personality test?"
- "What makes this different from StrengthsFinder?"
- "How long does this take?"

**Key design decisions:**
- Lead with "trainable capacities, not personality types" framing
- Show sample report to reduce uncertainty
- Emphasize "15 minutes, 143 questions" — specific commitment
- No paywall for beta — reduce friction to zero

**Success criteria:** User clicks "Take the Assessment" or signs up.

---

## Stage 2: Sign Up

**Trigger:** User decides to take the assessment.

**Touchpoints:**
- Sign-in page (`/auth/signin`)
- Magic link email
- Email verification (`/auth/verify`)

**User thinking:**
- "Why do I need an account?" (answer: to save results and enable retake)
- "Is this email thing going to spam me?" (answer: one magic link, that is it)

**Key design decisions:**
- Magic link auth — no passwords to remember
- 15-minute link TTL — urgent but not stressful
- Clear value proposition: "Your results are saved to your account. Return anytime."
- `BETA_FREE_MODE` — no payment step during beta

**Success criteria:** User is authenticated and lands on assessment setup.

---

## Stage 3: Prepare

**Trigger:** Authenticated user navigates to assessment.

**Touchpoints:**
- Assessment instructions page (`/assessment/instructions`)
- Assessment setup page (`/assessment/setup`)

**User thinking:**
- "What am I about to answer?"
- "How should I answer these?"
- "Can I come back if I do not finish?"

**Key design decisions:**
- Explicit instructions: answer for last 30 days, first instinct, no right answers
- Autosave promise: "Close the browser. Come back. Pick up where you left off."
- Context selection: choose role/focus area for tailored interpretation
- Clear "Begin" CTA after instructions are read

**Success criteria:** User starts the assessment with realistic expectations.

---

## Stage 4: Assess

**Trigger:** User begins answering questions.

**Touchpoints:**
- Assessment runner (`/assessment?run_id=...`)
- 143 questions across frequency scales, scenario cards, reflections

**User thinking:**
- "How far along am I?" (progress bar: 42 of 143)
- "Some of these are making me uncomfortable" (that is the point — honest self-assessment)
- "I need to stop — will this save?" (autosave every 350ms)

**Key design decisions:**
- Progress bar always visible (X of 143)
- Autosave with visual confirmation (no "submit" anxiety)
- Save & Exit option alongside autosave
- Question variety (frequency, scenario, reflection) to prevent survey fatigue
- Cosmic design maintains gravitas — this is not a quiz

**Critical moment:** Around question 80-100, fatigue risk is highest. Question variety and progress visibility are essential here.

**Success criteria:** User completes all 143 questions and submits.

---

## Stage 5: Results

**Trigger:** Assessment scoring completes (instant).

**Touchpoints:**
- Results page (`/results?run_id=...`)
- 14 report sections with cosmic visualizations
- Metric tooltips and glossary links

**User thinking:**
- "What does this mean?"
- "Is this good or bad?" (answer: no good or bad, just current state)
- "What do I do with this?"

**Key design decisions:**
- Welcome disclaimer sets framing: "This is a snapshot, not a verdict"
- Confidence band shown first (transparency about data quality)
- Light Signature (archetype) is the headline — memorable, shareable
- Eclipse Snapshot reframes low scores as "covered, not missing"
- Every metric has a tooltip explaining what it means
- 30-day plan with specific tools is the actionable payoff
- Share card generation for social proof

**Critical moment:** The first 30 seconds on the results page determine whether the user engages or bounces. Light Signature + Eclipse framing must land immediately.

**Success criteria:** User spends >3 minutes on results. User understands their Light Signature and Rise Path.

---

## Stage 6: Practice

**Trigger:** User reads their 30-day plan and starts practicing.

**Touchpoints:**
- Portal dashboard (`/portal`)
- Rep logger (`/reps`)
- Toolkit (`/toolkit`)
- 10-week program (`/coaches`)
- If/Then planning (`/plan`)
- Morning protocol (`/morning`)
- Weekly reflection (`/weekly`)

**User thinking:**
- "What should I practice today?"
- "Is this working?"
- "How do I stay consistent?"

**Key design decisions:**
- Portal shows today's focus based on bottom Ray and Eclipse level
- Rep logging is frictionless (one tap, optional reflection)
- Progress visible: streak, weekly count, total reps
- Phase check-ins adapt portal content to user's current stage
- Cue-based nudges appear contextually, not as push notifications

**Critical moment:** Days 3-7 after initial results. If the user does not log a rep in the first week, retention drops. The portal needs to reduce friction to near-zero.

**Success criteria:** User logs at least 3 reps in the first week. User returns to portal 3+ times in first 30 days.

---

## Stage 7: Retake

**Trigger:** User has practiced for 8-10+ weeks and wants to measure growth.

**Touchpoints:**
- Assessment setup (retake flow)
- Assessment runner (same 143 questions)
- Results comparison

**User thinking:**
- "Did the work actually work?"
- "Which Rays moved?"
- "Did my Light Signature change?"

**Key design decisions:**
- Retake uses identical questions for valid comparison
- Pre/post comparison highlights deltas
- Signature pair audit proves scoring consistency (SHA-256)
- Growth is celebrated but not inflated — "this is what moved" not "you are fixed"

**Success criteria:** User completes retake. User sees measurable improvement in targeted Rays. User shares results or recommends the assessment.

---

## Journey Summary

| Stage | Primary Emotion | Design Priority |
|-------|----------------|-----------------|
| Discover | Curiosity + Skepticism | Differentiation from personality tests |
| Sign Up | Commitment anxiety | Frictionless auth, no payment (beta) |
| Prepare | Uncertainty | Clear instructions, autosave promise |
| Assess | Focus + Fatigue | Progress visibility, question variety |
| Results | Recognition + Vulnerability | Non-shame framing, actionable output |
| Practice | Motivation + Inconsistency | Friction-free reps, streak tracking |
| Retake | Hope + Accountability | Measurable deltas, honest comparison |
