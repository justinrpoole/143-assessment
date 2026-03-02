---
name: trigger-patterns
parent: consultant-lead-agent
version: 1.0
protocol: append-only
purpose: "Track trigger type effectiveness at producing pipeline outcomes"
---

# Trigger Patterns — Performance Tracking

## Purpose

Not all triggers are equal. A trigger is a detectable business event that signals a potential consulting need. But some triggers produce meetings and revenue. Others produce noise. This file tracks which trigger types actually lead to meetings and deals so the Research Agent can prioritize the right signals and the Scoring Agent can weight them accurately.

The goal: over time, build a data-backed model of trigger effectiveness that replaces intuition with evidence.

---

## Trigger Taxonomy

The system recognizes these trigger types, organized by the business event they represent:

| Code           | Trigger Type          | Description                                                        |
|----------------|-----------------------|--------------------------------------------------------------------|
| MA             | M&A / Acquisition     | Merger, acquisition, divestiture, or joint venture announcement    |
| CAPEX          | Capital Expenditure   | New project approval, budget allocation, or capital plan filing    |
| REG            | Regulatory Action     | Enforcement, compliance mandate, rate case, or policy change       |
| TURN           | Turnaround / Outage   | Planned turnaround, major outage, or shutdown event                |
| HIRE           | Hiring Signal         | Job postings for roles that indicate project staffing needs        |
| DISTRESS       | Operational Distress  | Safety incident, compliance failure, or operational disruption     |
| INTCN          | Interconnection       | Queue activity, interconnection agreement, or grid access event    |
| LEAD           | Leadership Change     | New CEO, COO, VP Ops, or other key decision-maker appointment      |
| EARN           | Earnings Signal       | Earnings call guidance, capex outlook, or strategic pivot          |
| PART           | Partnership           | Strategic partnership, alliance, or technology adoption            |

---

## Trigger Performance Matrix

```
  TRIGGER TYPE PERFORMANCE — Ohio Energy Market
  Run 1 Baseline (2026-02-23) + Hardened Data (2026-02-24)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Type              Leads  Meetings  Proposals  Deals  Avg Score  Best Lead
  ├── MA              6       —          —        —      85       EOG (92)
  ├── CAPEX           8       —          —        —      72       MPLX (78)
  ├── REG             5       —          —        —      65       AEP Ohio (74)
  ├── TURN            4       —          —        —      70       PBF Energy (75)
  ├── HIRE            3       —          —        —      55       Gulfport (58)
  ├── DISTRESS        2       —          —        —      60       —
  ├── INTCN           3       —          —        —      78       AEP Queue (82)
  ├── LEAD            1       —          —        —      58       —
  ├── EARN            0       —          —        —      —        —
  ├── PART            0       —          —        —      —        —
  └── TOTAL          32       0          0        0      —        —

  Pipeline Status: Pre-outreach. Meeting, proposal, and deal
  columns will populate as outreach begins in March 2026.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Score Distribution by Trigger Type

```
  SCORE DISTRIBUTION
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Score Range     MA  CAPEX  REG  TURN  HIRE  DISTRESS  INTCN  LEAD
  ├── 90-100       2    0     0    0     0      0        0      0
  ├── 80-89        3    1     0    0     0      0        1      0
  ├── 70-79        1    4     2    3     0      0        2      0
  ├── 60-69        0    2     2    1     1      2        0      0
  ├── 50-59        0    1     1    0     2      0        0      1
  ├── 40-49        0    0     0    0     0      0        0      0
  └── Below 40     0    0     0    0     0      0        0      0

  Interpretation: MA triggers cluster 80+. CAPEX clusters 70-79.
  REG and TURN spread evenly. HIRE skews low. INTCN shows promise.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Trigger-to-Meeting Velocity

Track the elapsed time from trigger detection to first meeting, by trigger type. This measures how quickly a trigger converts to a real conversation.

```
  TRIGGER-TO-MEETING VELOCITY (days)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Type          Min    Avg    Max    Sample Size
  ├── MA         —      —      —        0
  ├── CAPEX      —      —      —        0
  ├── REG        —      —      —        0
  ├── TURN       —      —      —        0
  ├── HIRE       —      —      —        0
  ├── DISTRESS   —      —      —        0
  ├── INTCN      —      —      —        0
  ├── LEAD       —      —      —        0
  └── ALL        —      —      —        0

  Note: No outreach has been sent yet. This table will
  populate as meetings are booked starting March 2026.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Optimal Outreach Timing by Trigger Type

Based on analysis of buyer decision cycles and trigger lifecycle:

| Trigger Type    | Optimal Window              | Rationale                                                          |
|-----------------|-----------------------------|--------------------------------------------------------------------|
| MA              | Within 7 days of close      | Integration planning starts immediately. Day 1-30 is the chaos window where external help is most valued. |
| CAPEX           | Within 14 days of approval  | Procurement cycle begins. Early engagement positions you before the RFP is written. |
| REG             | Within 3 days of action     | Urgency is highest immediately. Regulatory pressure fades as companies develop internal responses. |
| TURN            | 90-120 days before event    | Planning window. By 60 days out, the team is locked. By 30 days out, you are too late. |
| HIRE            | Within 14 days of posting   | The need is real now. The longer the role stays open, the more likely they have found a workaround. |
| DISTRESS        | Within 48 hours             | Crisis response. They need help now. Waiting 2 weeks signals you are not serious. |
| INTCN           | Within 7 days of data       | Queue data releases trigger reassessment. Utilities re-evaluate their resource needs in the first week. |
| LEAD            | 30-60 days after start      | New leaders need 30 days to assess. Too early feels premature. Too late means they have already set their team. |

---

## Trigger Compound Effects

Track leads with multiple concurrent triggers. The hypothesis: leads with 2+ active triggers within a 90-day window convert at 2x the rate of single-trigger leads.

```
  COMPOUND TRIGGER ANALYSIS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Trigger Count    Leads    Avg Score    Meeting Rate
  ├── 1 trigger      22       65           —
  ├── 2 triggers      8       78           —
  ├── 3+ triggers     2       88           —
  └── TOTAL          32       —            —

  Notable Compound Leads:
  ├── EOG Resources:    MA + CAPEX + HIRE (Score: 92)
  ├── Infinity NR:      MA + INTCN (Score: 89)
  └── AEP Ohio:         INTCN + REG + CAPEX (Score: 82)

  Hypothesis: 2+ triggers = 2x meeting rate
  Status: UNVALIDATED — awaiting outreach data
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Trigger Decay Rates

How quickly does each trigger type lose relevance? A trigger's "heat" decays over time as companies address the underlying event or move past it.

```
  TRIGGER DECAY MODEL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Type        Peak Window     Moderate Window    Cold After    Notes
  ├── MA       0-30 days       30-120 days       120+ days    Integration decisions made in first 90 days
  ├── CAPEX    0-60 days       60-180 days       180+ days    Longer procurement cycles extend relevance
  ├── REG      0-14 days       14-60 days         90+ days    Urgency fades as internal response forms
  ├── TURN     -120 to -30d    -30 to 0 days     Post-event   Planning window only; irrelevant after execution
  ├── HIRE     0-30 days       30-90 days        120+ days    Ghost postings inflate decay; real roles fill in 60-90d
  ├── DISTRESS 0-7 days        7-30 days          60+ days    Crisis response is immediate or not at all
  ├── INTCN    0-14 days       14-60 days         90+ days    Queue data is periodic; relevance resets each release
  ├── LEAD     30-60 days      60-120 days       180+ days    New leaders set agendas in first 90 days
  ├── EARN     0-14 days       14-45 days         60+ days    Quarterly cycle resets relevance
  └── PART     0-30 days       30-90 days        120+ days    Partnership announcement fades as execution begins

  Scoring Adjustment: Apply decay multiplier to trigger score based on age.
  ├── Peak Window:     1.0x (full weight)
  ├── Moderate Window: 0.7x (reduced weight)
  ├── Cold:            0.4x (minimal weight — trigger is stale)
  └── Expired:         0.0x (remove from active scoring)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## False Positive Tracking

Which trigger types produce the most false positives — signals that look good but represent no real consulting opportunity?

```
  FALSE POSITIVE RATES (estimated from Run 1)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Signal Type                  Est. False Positive Rate    Notes
  ├── Ghost job postings              ~60%                 Roles posted but not actively being filled;
  │                                                        compliance postings; roles already filled internally
  ├── Industry award announcements    ~90%                 Removed from trigger taxonomy — no consulting signal
  ├── Conference speaking slots       ~80%                 Better as relationship signal, not direct trigger
  ├── Press release "plans to"        ~50%                 Announced plans frequently do not materialize
  ├── Earnings call "exploring"       ~70%                 Aspirational language, not committed capital
  ├── LinkedIn leadership updates     ~40%                 Some are title changes, not actual new hires
  └── Regulatory comment periods      ~75%                 Comment =/= action; most filings produce no change

  Mitigation:
  ├── Require 2nd source confirmation for HIRE triggers (reduces ghost posting FP)
  ├── Only count CAPEX triggers with dollar amounts or specific project names
  ├── Only count REG triggers with enforcement actions, not comment periods
  └── Cross-reference leadership changes with company press releases
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Trigger Source Reliability

Which data sources produce the most reliable triggers?

```
  SOURCE RELIABILITY MATRIX
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Source              Triggers Found    Verified Accurate    Reliability
  ├── SEC/EDGAR            8                 7                 88%
  ├── PUCO Dockets         5                 4                 80%
  ├── Company IR Pages     6                 5                 83%
  ├── Trade Press          9                 6                 67%
  ├── LinkedIn             4                 3                 75%
  ├── Job Boards           3                 1                 33%
  ├── WebSearch General    12                8                 67%
  └── TOTAL               47*               34                 72%

  * Some triggers found in multiple sources (deduplicated to 32 unique leads)

  Action: Prioritize SEC/EDGAR and Company IR for initial trigger detection.
  Use trade press and LinkedIn for enrichment and confirmation.
  Job boards are lowest reliability — always cross-reference.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Trigger Scoring Weight Recommendations

Based on Run 1 data, recommended scoring weights for the Scoring Agent:

```
  RECOMMENDED TRIGGER SCORING WEIGHTS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Type          Base Weight    Multiplier    Effective Weight    Rationale
  ├── MA           10            1.2x           12              Highest avg score, clear consulting demand
  ├── CAPEX        10            1.0x           10              Solid baseline, large deal potential
  ├── REG          10            0.9x            9              Lower avg score, slower conversion expected
  ├── TURN         10            1.0x           10              Strong but time-sensitive
  ├── HIRE         10            0.7x            7              High false positive rate, lower scores
  ├── DISTRESS     10            0.8x            8              Rare but high urgency when real
  ├── INTCN        10            1.1x           11              Strong scores, structural demand driver
  ├── LEAD         10            0.6x            6              Weak signal alone, better as compound
  ├── EARN         10            0.7x            7              Aspirational language risk
  └── PART         10            0.7x            7              Low direct consulting signal

  Note: These weights are preliminary. Update monthly based on
  actual meeting conversion data. Current confidence: Medium.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Monthly Update Protocol

At the end of each month, the Strategy Agent must:

1. **Update the Performance Matrix** with actual outcome data (meetings booked, proposals sent, deals closed).
2. **Calculate conversion rates** by trigger type (leads to meetings, meetings to proposals, proposals to deals).
3. **Update trigger scoring weights** based on actual conversion data — triggers that convert get higher weights, triggers that do not convert get lower weights.
4. **Review false positive rates** — are certain trigger types producing noise? Adjust thresholds or remove from taxonomy.
5. **Check trigger decay model** — are triggers converting within the expected windows? Adjust decay rates based on actual data.
6. **Identify new trigger types** — have any new signal types emerged that should be added to the taxonomy?
7. **Cross-reference with agent-learnings.md** — ensure trigger learnings are consistent between files.
8. **Write a monthly summary entry** at the bottom of this file with the format:

```
### Monthly Review — [Month Year]
**Trigger Activity:** [N] new triggers detected, [N] verified, [N] false positives removed
**Conversion Data:** [N] meetings from [trigger type], [N] proposals, [N] deals
**Weight Adjustments:** [List any scoring weight changes and rationale]
**New Patterns:** [Any new trigger patterns observed]
**Next Month Focus:** [Which trigger types to prioritize and why]
```

---

## Monthly Review Log

### Monthly Review — February 2026

**Trigger Activity:** 47 raw triggers detected across all sources. 32 unique leads after deduplication. 34 triggers verified accurate (72% verification rate). 7 triggers corrected during hardening. 0 false positives removed (no triggers were entirely fabricated, just inaccurate in details).

**Conversion Data:** Pre-outreach. No meetings, proposals, or deals. Pipeline is fully built and scored. Outreach begins March 2026.

**Weight Adjustments:** Initial weights established (see table above). No adjustments yet — need conversion data.

**New Patterns:** Compound triggers (2+ within 90 days) correlate with higher scores. AEP interconnection queue clearing is a market-level trigger affecting multiple leads simultaneously. Job postings for project controls roles cross-reference reliably with CAPEX triggers.

**Next Month Focus:** Prioritize MA and INTCN triggers for first outreach wave. These have the highest average scores and the clearest consulting demand signal. Monitor HIRE triggers for compound effect with CAPEX — do not use HIRE as a standalone trigger until false positive rate is better understood.
