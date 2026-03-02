---
name: outreach-performance
parent: consultant-lead-agent
version: 1.0
protocol: append-only
purpose: "Track outreach effectiveness by channel, angle, sequence, and personalization tier"
---

# Outreach Performance — Effectiveness Tracking

## Purpose

Track every outreach metric so the system knows what works and stops doing what does not. This is the feedback loop that makes outreach improve over time. Without measurement, outreach degrades into guesswork. With measurement, every send makes the next send better.

This file answers three questions:
1. **What channels produce meetings?** (Email, LinkedIn, phone, conference, referral)
2. **What messaging produces responses?** (Angles, subject lines, CTAs, personalization)
3. **What sequences produce conversions?** (Multi-touch cadences and their completion rates)

---

## Channel Performance Matrix

```
  CHANNEL PERFORMANCE — Ohio Energy Market
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Channel          Sent  Opens  Open%  Replies  Reply%  Meetings  Meeting%  Cost/Meeting
  ├── Cold Email     0     —      —      —        —        —         —          —
  ├── Warm Email     0     —      —      —        —        —         —          —
  ├── LinkedIn DM    0     —      —      —        —        —         —          —
  ├── LinkedIn InM   0     —      —      —        —        —         —          —
  ├── Phone          0     —      —      —        —        —         —          —
  ├── Conference     0     —      —      —        —        —         —          —
  ├── Referral       0     —      —      —        —        —         —          —
  ├── Direct Mail    0     —      —      —        —        —         —          —
  └── TOTAL          0     —      —      —        —        —         —          —

  Status: Pre-launch. Outreach begins March 2026.
  First data expected by end of March 2026.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Channel Definitions

| Channel        | Definition                                                                   |
|----------------|------------------------------------------------------------------------------|
| Cold Email     | First-touch email to a contact with no prior relationship                    |
| Warm Email     | Email to a contact where a prior connection exists (mutual contact, event)   |
| LinkedIn DM    | LinkedIn direct message (free tier — must be 1st degree connection)          |
| LinkedIn InMail| LinkedIn InMail (paid — can reach 2nd/3rd degree connections)                |
| Phone          | Direct phone call (cold or warm)                                             |
| Conference     | In-person or virtual event interaction                                       |
| Referral       | Introduction through a mutual contact                                        |
| Direct Mail    | Physical mail to company address                                             |

---

## Angle Performance Tracking

Which positioning angles produce the highest response rates? An "angle" is the primary value proposition used in outreach messaging.

```
  ANGLE PERFORMANCE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Angle                        Sends  Replies  Reply%  Meetings  Meeting%
  ├── Operations Expertise       0       —       —        —         —
  │   ("I've run turnarounds")
  ├── Interconnection Spec.      0       —       —        —         —
  │   ("Queue diagnostic")
  ├── Integration PMO            0       —       —        —         —
  │   ("Post-acquisition")
  ├── Cost Reduction             0       —       —        —         —
  │   ("Efficiency mandate")
  ├── Compliance Urgency         0       —       —        —         —
  │   ("Regulatory pressure")
  ├── Talent Gap                 0       —       —        —         —
  │   ("Skills you need now")
  └── TOTAL                      0       —       —        —         —

  Status: Pre-launch. Angles defined, templates built.
  Outreach begins March 2026.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Angle-to-Segment Mapping

Not every angle works for every market segment. Initial hypotheses:

| Angle                  | Best For Segment       | Rationale                                                  |
|------------------------|------------------------|------------------------------------------------------------|
| Operations Expertise   | Upstream E&P           | Operators respect operators. Turnaround experience resonates. |
| Interconnection Spec.  | Utility / Power Gen    | Specific, technical, high-value. Solves their #1 problem now. |
| Integration PMO        | Upstream E&P (M&A)     | Post-acquisition chaos is universal. PMO is the fix.         |
| Cost Reduction         | Midstream Infra        | Capital-intensive operations have the most to save.          |
| Compliance Urgency     | All segments           | Regulatory pressure is universal but timing-dependent.       |
| Talent Gap             | All segments           | Works when paired with a specific trigger (job posting).     |

---

## Subject Line Performance

Track open rates by subject line category. Subject lines are the single biggest determinant of email open rates.

```
  SUBJECT LINE PERFORMANCE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Category                    Sends  Opens  Open%  Best Performer
  ├── Trigger Reference         0      —      —     —
  │   "Re: your Antero deal"
  ├── Question Format           0      —      —     —
  │   "Who's running your PMO?"
  ├── Value Offer               0      —      —     —
  │   "3 things in the AEP queue"
  ├── Direct / Company Name     0      —      —     —
  │   "Project controls for [Co]"
  ├── Mutual Connection         0      —      —     —
  │   "[Name] suggested..."
  ├── Blank / Re:               0      —      —     —
  │   (reply-style subjects)
  └── TOTAL                     0      —      —     —

  Hypotheses:
  ├── Trigger Reference will outperform (specificity signals relevance)
  ├── Question Format will produce highest reply rate (invites response)
  ├── Mutual Connection will produce highest meeting rate (trust transfer)
  └── Value Offer will produce highest "send more info" rate
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Sequence Performance

Multi-touch outreach sequences and their completion and conversion rates.

```
  SEQUENCE PERFORMANCE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Sequence             Target Score  Steps  Active  Completed  Meetings  Meeting%
  ├── Full Court Press    90+          7       0        0          —         —
  │   (Email→LI→Phone→Email→LI→Phone→Email)
  ├── Warm Approach       80+          5       0        0          —         —
  │   (Referral→Email→LI→Phone→Email)
  ├── Standard Cadence    60-79        5       0        0          —         —
  │   (Email→Email→LI→Email→Phone)
  ├── Long Game           40-59        3       0        0          —         —
  │   (Email→LI connect→Nurture)
  ├── Post-Conference     Any          4       0        0          —         —
  │   (Follow-up email→LI→Email→Phone)
  └── TOTAL                —           —       0        0          —         —

  Status: Sequences defined in outreach templates. No sequences
  have been initiated yet. First sequences launch March 2026.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Sequence Step Dropout Rates

Track where in a sequence leads go cold:

```
  DROPOUT ANALYSIS — Full Court Press (7-step)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Step    Channel    Reached    Responded    Dropout%
  ├── 1   Email        —           —            —
  ├── 2   LinkedIn     —           —            —
  ├── 3   Phone        —           —            —
  ├── 4   Email        —           —            —
  ├── 5   LinkedIn     —           —            —
  ├── 6   Phone        —           —            —
  └── 7   Email        —           —            —

  Note: Populate after first 10 Full Court Press
  sequences complete (expected April-May 2026).
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Personalization Tier Performance

Three tiers of outreach personalization, each requiring different time investment. Track ROI by tier.

```
  PERSONALIZATION TIER PERFORMANCE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Tier    Score Range    Time/Lead    Sends  Replies  Reply%  Meetings  Meeting%
  ├── 1   40-59 (Spray)    5 min       0       —       —        —         —
  │       Generic template, company name swap, minimal personalization
  ├── 2   60-79 (Target)  15 min       0       —       —        —         —
  │       Trigger-specific angle, company research, personalized opening
  ├── 3   80+ (Hyper)     45 min       0       —       —        —         —
  │       Deep research, custom case study reference, specific deliverable proposal
  └── ALL                   —          0       —       —        —         —

  ROI Question: Does 9x time investment (Tier 3 vs Tier 1) produce 9x meeting rate?
  Hypothesis: Tier 3 produces 5-8x meeting rate. Still positive ROI but diminishing.
  Status: UNVALIDATED — awaiting outreach data.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Response Type Distribution

Track what types of replies you receive across all outreach. This reveals buyer sentiment and messaging effectiveness.

```
  RESPONSE TYPE DISTRIBUTION
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Response Type               Count    Percentage
  ├── Positive / Interested     —         —
  ├── Send More Info            —         —
  ├── Not the Right Person      —         —
  ├── Not Now / Timing          —         —
  ├── Not Interested            —         —
  ├── Unsubscribe               —         —
  ├── Auto-Reply / OOO          —         —
  ├── No Response               —         —
  └── TOTAL                     0         —

  Healthy Distribution Targets:
  ├── Positive:          > 5% of sends
  ├── Send More Info:    > 8% of sends
  ├── Not Right Person:  < 10% (means targeting is accurate)
  ├── Not Now:           10-20% (timing issue, add to nurture)
  ├── Not Interested:    < 5% (means messaging is relevant)
  ├── Unsubscribe:       < 2% (means we are not spamming)
  └── No Response:       50-60% (normal for cold outreach)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Response Handling Protocol

| Response Type          | Action                                                          |
|------------------------|-----------------------------------------------------------------|
| Positive / Interested  | Schedule meeting within 48 hours. Move to proposal pipeline.    |
| Send More Info         | Send one-pager + case study within 24 hours. Follow up in 5 days. |
| Not the Right Person   | Ask for referral to the right contact. Log the correction.      |
| Not Now / Timing       | Add to 90-day nurture sequence. Set calendar reminder.          |
| Not Interested         | Remove from active outreach. Add to annual check-in list.       |
| Unsubscribe            | Remove immediately. Do not contact again via that channel.      |
| Auto-Reply / OOO       | Reschedule send for their return date + 2 days.                 |
| No Response            | Continue sequence. If no response after full sequence, move to Long Game. |

---

## Time-of-Day and Day-of-Week Performance

Track which send times produce highest open and reply rates.

```
  SEND TIME PERFORMANCE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Day             Sends  Opens  Open%  Replies  Reply%
  ├── Monday        —      —      —      —        —
  ├── Tuesday       —      —      —      —        —
  ├── Wednesday     —      —      —      —        —
  ├── Thursday      —      —      —      —        —
  ├── Friday        —      —      —      —        —
  ├── Saturday      —      —      —      —        —
  └── Sunday        —      —      —      —        —

  Time of Day (ET)  Sends  Opens  Open%  Replies  Reply%
  ├── 6:00-7:59       —      —      —      —        —
  ├── 8:00-9:59       —      —      —      —        —
  ├── 10:00-11:59     —      —      —      —        —
  ├── 12:00-13:59     —      —      —      —        —
  ├── 14:00-15:59     —      —      —      —        —
  ├── 16:00-17:59     —      —      —      —        —
  └── 18:00+          —      —      —      —        —

  Initial Hypothesis: Tuesday-Thursday, 7:00-8:30 AM ET
  produces highest open and reply rates for energy sector
  executives in Ohio (they check email before meetings start).

  Validation Threshold: Need 50+ sends per time slot to draw
  conclusions. Expected by May 2026.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## A/B Test Log

Track all controlled tests and their outcomes. Every outreach improvement should be driven by a test, not a guess.

```
  A/B TEST LOG
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Test #1: Subject Line — Trigger Reference vs. Question Format
  ├── Variant A: "Re: [Company]'s [trigger event]"
  ├── Variant B: "Who's running your [project type]?"
  ├── Sample Size Target: 50 sends per variant
  ├── Primary Metric: Open rate
  ├── Secondary Metric: Reply rate
  ├── Status: PLANNED — launches with first outreach wave
  └── Results: Pending

  Test #2: Email Length — Short (Under 100 words) vs. Medium (150-200 words)
  ├── Variant A: 3-sentence email. Trigger reference, credential, CTA.
  ├── Variant B: 5-paragraph email. Trigger context, background, value prop, case study, CTA.
  ├── Sample Size Target: 50 sends per variant
  ├── Primary Metric: Reply rate
  ├── Secondary Metric: Meeting rate
  ├── Status: PLANNED — launches with first outreach wave
  └── Results: Pending

  Test #3: CTA — Meeting Request vs. Resource Offer
  ├── Variant A: "Do you have 20 minutes this week to discuss?"
  ├── Variant B: "I put together a 2-page analysis of [topic] — want me to send it over?"
  ├── Sample Size Target: 50 sends per variant
  ├── Primary Metric: Reply rate (any reply, including "send the analysis")
  ├── Secondary Metric: Meeting rate (within 14 days of first reply)
  ├── Status: PLANNED — launches with first outreach wave
  └── Results: Pending

  Test #4: Personalization Depth — Tier 2 vs. Tier 3 for Score 80+ leads
  ├── Variant A: Tier 2 (15 min per lead, trigger-specific template)
  ├── Variant B: Tier 3 (45 min per lead, custom research and deliverable reference)
  ├── Sample Size Target: 20 leads per variant (limited by Tier 3 time cost)
  ├── Primary Metric: Meeting rate
  ├── Secondary Metric: Time-to-meeting
  ├── Status: PLANNED — launches after first 40 Tier 2 sends complete
  └── Results: Pending

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### A/B Test Rules

1. Never run more than 2 tests simultaneously (prevents confounding).
2. Each test needs a minimum of 50 sends per variant to be statistically meaningful.
3. Run each test for at least 14 days to account for day-of-week variation.
4. Declare a winner only when one variant outperforms the other by >20% relative improvement with 50+ sends each.
5. If no clear winner after 100 sends per variant, declare a draw and test a different variable.
6. Document all test results in this file — including failures and draws. They are all learnings.
7. After a winner is declared, update the outreach templates and agent-learnings.md.

---

## Monthly Performance Review Protocol

At the end of each month, the Strategy Agent produces a performance review:

```
  MONTHLY OUTREACH REVIEW — [Month Year]
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Volume:
  ├── Total sends:         [N]
  ├── Total replies:       [N] ([X]%)
  ├── Total meetings:      [N] ([X]%)
  └── Total proposals:     [N]

  Top Performing:
  ├── Best channel:        [Channel] ([X]% meeting rate)
  ├── Best angle:          [Angle] ([X]% reply rate)
  ├── Best subject:        [Category] ([X]% open rate)
  ├── Best sequence:       [Sequence] ([X]% completion rate)
  └── Best time slot:      [Day, Time] ([X]% open rate)

  Worst Performing:
  ├── Worst channel:       [Channel] ([X]% meeting rate)
  ├── Worst angle:         [Angle] ([X]% reply rate)
  ├── Worst subject:       [Category] ([X]% open rate)
  ├── Worst sequence:      [Sequence] ([X]% completion rate)
  └── Worst time slot:     [Day, Time] ([X]% open rate)

  Decisions:
  ├── Double down on:      [What to do more of]
  ├── Fix or retire:       [What to change or stop]
  ├── New test:            [Next A/B test to run]
  └── Template updates:    [Changes to outreach templates]
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Monthly Review Log

### Monthly Review — February 2026

**Volume:** Zero outreach sent. February was pipeline build and system construction month.

**Key Accomplishments:**
- 32 leads scored and hardened with live verification
- 6 outreach templates built (one per angle)
- 4 A/B tests designed and ready to launch
- Voice profile documented (operator-first positioning)
- Sequence cadences defined for all 5 sequence types

**March 2026 Plan:**
- Launch outreach to top 10 leads (Score 80+) using Full Court Press and Warm Approach sequences
- Begin A/B Tests #1 and #2 simultaneously
- Target: 40+ total sends across email and LinkedIn
- Target: 3-5 meetings booked by end of March
- Begin populating all performance tables with real data

**Open Questions:**
- LinkedIn InMail vs. free DM — do we need LinkedIn Sales Navigator?
- Direct mail (physical) — test for Score 90+ leads where email gets no response?
- Conference attendance decision needed for OOGA Annual Meeting (March 15-17)
