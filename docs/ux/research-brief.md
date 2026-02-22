# UX Research Brief — 143 Leadership Assessment

## Problem Space

Leaders receive abundant personality assessments (MBTI, StrengthsFinder, Enneagram, DISC) that label who they are but offer no structured path for growth. These tools describe fixed traits, not trainable states. Leaders leave with a type, not a training plan.

The gap: **no assessment tool treats leadership capacities as trainable skills with measurable improvement over time.**

Existing assessments also fail to account for *state* — whether a low score reflects a genuine skill gap or temporary depletion from sustained stress. This distinction (deficit vs. eclipse) changes the entire coaching response, yet no current tool makes it.

## Target Users

**Primary:** Mid-career leaders (5-15 years experience) who sense a gap between how they perform and how they want to lead. They have done personality assessments before and found them interesting but not actionable.

**Secondary:** Executive coaches and leadership development professionals who need a structured assessment tool with a debrief protocol and retake methodology.

**Tertiary:** HR/L&D teams evaluating team-level leadership development programs.

## Core Hypotheses

1. **Trainability hypothesis:** If leaders see their capacities framed as trainable (not fixed), they will engage in deliberate practice. Measured by: rep logging frequency, retake rate.

2. **Eclipse hypothesis:** Distinguishing depletion from deficit changes a leader's relationship to their low scores. Measured by: qualitative feedback, coaching session notes, score changes on retake.

3. **Specificity hypothesis:** A specific 30-day plan with named tools outperforms generic "areas for growth" advice. Measured by: tool usage, plan completion rate, retake score delta.

4. **Retake hypothesis:** Leaders who retake the assessment after structured practice show measurable improvement in targeted Rays. Measured by: pre/post score comparison across the 36-pair matrix.

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Assessment completion rate | >80% of started assessments | `assessment_runs` status field |
| Time to complete | 15-30 minutes median | Timestamp delta (start to complete) |
| Report engagement | >3 min average on results page | Page view duration analytics |
| Rep logging (Week 1) | >50% of completers log at least 1 rep | `reps` table join to `assessment_runs` |
| Retake rate (90 days) | >15% of completers retake | Repeat `assessment_runs` per user |
| Score improvement on retake | Measurable delta in targeted Ray | Pre/post scoring comparison |
| NPS / qualitative | >50 NPS in first cohort | Post-assessment survey |

## Research Questions (Beta Phase)

1. Where do users drop off during the 143-question flow?
2. Do users understand their Light Signature without external explanation?
3. Does the Eclipse Snapshot change how users interpret low scores?
4. Which tools from the 30-day plan do users actually try?
5. Do users return to the portal after initial results viewing?
6. What language do users use to describe the assessment to peers?

## Methodology

- **Beta launch:** Free public beta with email-gated access
- **Quantitative:** Event tracking (page views, completion, rep logging, retake)
- **Qualitative:** Post-assessment survey (5 questions), optional follow-up interviews
- **Duration:** 8-12 weeks of beta data collection before product decisions
