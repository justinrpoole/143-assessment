# Report Templates — Pre-Built Shells

Populate these templates with data. Every report follows the Pyramid Principle:
lead with the answer, support with arguments, back with data, end with "so what."

---

## Template 1: Weekly Pulse

```
WEEKLY PULSE: {Brand} — Week of {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  HEADLINE: {one sentence — the most important thing this week}

  TOP 3 METRICS
  ┌──────────────┬─────────┬─────────┬────────┬────────┐
  │ Metric       │ Actual  │ Target  │ WoW Δ  │ Status │
  ├──────────────┼─────────┼─────────┼────────┼────────┤
  │ {metric 1}   │ {val}   │ {val}   │ {+/-}  │ ✓/⚠/✗ │
  │ {metric 2}   │ {val}   │ {val}   │ {+/-}  │ ✓/⚠/✗ │
  │ {metric 3}   │ {val}   │ {val}   │ {+/-}  │ ✓/⚠/✗ │
  └──────────────┴─────────┴─────────┴────────┴────────┘

  WINS THIS WEEK
  ├── {win 1 — specific, quantified}
  ├── {win 2}
  └── {win 3}

  RISKS / BLOCKERS
  ├── {risk 1 — what, impact, mitigation}
  ├── {risk 2}
  └── {risk 3}

  DECISIONS NEEDED
  └── {decision — who needs to decide what by when}

  NEXT WEEK FOCUS
  └── {1-2 sentences on priorities}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template 2: Monthly Performance

```
MONTHLY PERFORMANCE: {Brand} — {Month Year}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  EXECUTIVE SUMMARY
  {2-3 sentences. Lead with the conclusion. What happened,
  why it matters, what to do about it.}

  KEY METRICS
  ┌──────────────┬─────────┬─────────┬─────────┬────────┬────────┐
  │ Metric       │ Actual  │ Target  │ MoM Δ   │ YoY Δ  │ Status │
  ├──────────────┼─────────┼─────────┼─────────┼────────┼────────┤
  │ {metric}     │ {val}   │ {val}   │ {+/-%}  │ {+/-%} │ ✓/⚠/✗ │
  │ ...          │ ...     │ ...     │ ...     │ ...    │ ...    │
  └──────────────┴─────────┴─────────┴─────────┴────────┴────────┘

  TREND NARRATIVE
  {For each off-track or notable metric:}

  {Metric Name}: {status}
    What: {what happened — 1 sentence}
    Why:  {root cause hypothesis — 1-2 sentences}
    So what: {business impact — quantified}
    Action: {recommended action — specific}

  DECISION LOG UPDATE
  ┌────────┬────────────────────┬──────────────────┬────────┐
  │ ID     │ Decision           │ Expected Outcome │ Status │
  ├────────┼────────────────────┼──────────────────┼────────┤
  │ D-{n}  │ {decision}         │ {expected}       │ {✓/◑/✗}│
  └────────┴────────────────────┴──────────────────┴────────┘

  ASSUMPTIONS CHECKED
  ├── A-{n}: {validated / invalidated / pending}
  └── A-{n}: {validated / invalidated / pending}

  NEXT MONTH PRIORITIES
  ├── {priority 1 — tied to a metric}
  ├── {priority 2}
  └── {priority 3}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template 3: QBR (Quarterly Business Review)

```
QUARTERLY BUSINESS REVIEW: {Brand} — {Quarter Year}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  EXECUTIVE SUMMARY (1 paragraph)
  {Quarter result in one sentence. Key driver. Key risk.
  Strategic outlook for next quarter.}

  ─── FINANCIAL PERFORMANCE ───

  ┌──────────────┬──────────┬──────────┬──────────┬────────┐
  │ Metric       │ Q{n}     │ Q{n-1}   │ QoQ Δ    │ Target │
  ├──────────────┼──────────┼──────────┼──────────┼────────┤
  │ Revenue      │ ${val}   │ ${val}   │ {+/-%}   │ ${val} │
  │ Gross Margin │ {val}%   │ {val}%   │ {+/-pp}  │ {val}% │
  │ Net New MRR  │ ${val}   │ ${val}   │ {+/-%}   │ ${val} │
  │ CAC          │ ${val}   │ ${val}   │ {+/-%}   │ ${val} │
  │ LTV:CAC      │ {val}:1  │ {val}:1  │ {+/-%}   │ {val}  │
  │ Burn Rate    │ ${val}/mo│ ${val}/mo│ {+/-%}   │ ${val} │
  └──────────────┴──────────┴──────────┴──────────┴────────┘

  ─── OKR SCORECARD ───

  Objective 1: {objective text}
  Overall Score: {0.0-1.0} │ Status: {✓/⚠/✗}
  ├── KR 1: {description} — {score} ({current}/{target})
  ├── KR 2: {description} — {score} ({current}/{target})
  └── KR 3: {description} — {score} ({current}/{target})
  Learning: {what we learned from this objective}

  {Repeat for each objective}

  ─── CUSTOMER HEALTH ───

  ├── NPS: {score} (vs {benchmark})
  ├── Retention: {%} (vs {target})
  ├── Churn: {%} — {n} customers lost
  │   └── Top reasons: {reason 1}, {reason 2}
  └── Expansion: ${val} new revenue from existing

  ─── STRATEGIC OUTLOOK ───

  What went well:
  ├── {1}
  └── {2}

  What didn't:
  ├── {1}
  └── {2}

  Key risks for next quarter:
  ├── {risk 1 — likelihood, impact, mitigation}
  └── {risk 2}

  Strategic priorities for Q{n+1}:
  ├── {priority 1 — why, expected impact}
  ├── {priority 2}
  └── {priority 3}

  Decisions needed from leadership:
  └── {decision — options, recommendation, deadline}

  ─── CONFIDENCE & ASSUMPTIONS ───

  Report confidence: {score}/100
  Key assumptions: {top 3}
  Research sources: {n} benchmarks, {n} citations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template 4: Contract Compliance Report

```
CONTRACT COMPLIANCE: {Contract Name}
Period: {date range}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  SUMMARY: {n} of {total} obligations met │ {n} at risk │ {n} breached

  SLA PERFORMANCE
  ┌──────────────┬──────────┬──────────┬──────────┬────────┐
  │ Obligation   │ Target   │ Actual   │ Variance │ Status │
  ├──────────────┼──────────┼──────────┼──────────┼────────┤
  │ {SLA 1}      │ {val}    │ {val}    │ {+/-%}   │ ✓/⚠/✗ │
  │ ...          │ ...      │ ...      │ ...      │ ...    │
  └──────────────┴──────────┴──────────┴──────────┴────────┘

  EXCEPTIONS / BREACHES
  {For each breach:}
  ├── Obligation: {what was required} (§{clause})
  ├── Performance: {what actually happened}
  ├── Root cause: {why}
  ├── Remediation: {what's being done}
  └── Timeline: {when it will be resolved}

  MILESTONE STATUS
  ├── {milestone 1}: {status} ({date})
  ├── {milestone 2}: {status} ({date})
  └── {milestone 3}: {status} ({date})

  REPORTING OBLIGATIONS MET
  ├── {report 1}: ✓ Delivered {date}
  └── {report 2}: ✓ Delivered {date}

  UPCOMING OBLIGATIONS
  ├── {date}: {what's due}
  └── {date}: {what's due}

  RISK ITEMS
  └── {risk — impact if not addressed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template 5: OKR Score Card

```
OKR SCORECARD: {Brand} — {Quarter Year}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  OVERALL: {avg score} │ {n}/{total} objectives on track

  {For each objective:}

  OBJECTIVE {n}: {text}
  Type: {Committed / Aspirational}
  Score: {0.0-1.0} │ Grade: {A/B/C/D/F}
  ┌─────────────────────┬────────┬─────────┬───────┬────────┐
  │ Key Result           │ Target │ Current │ Score │ Status │
  ├─────────────────────┼────────┼─────────┼───────┼────────┤
  │ {KR 1}              │ {val}  │ {val}   │ {0-1} │ ✓/⚠/✗ │
  │ {KR 2}              │ {val}  │ {val}   │ {0-1} │ ✓/⚠/✗ │
  │ {KR 3}              │ {val}  │ {val}   │ {0-1} │ ✓/⚠/✗ │
  └─────────────────────┴────────┴─────────┴───────┴────────┘
  What worked: {1 sentence}
  What didn't: {1 sentence}
  Carry forward: {what continues to next quarter}

  ──────────────────────────────────

  QUARTER LEARNINGS
  ├── {learning 1 — specific, actionable}
  ├── {learning 2}
  └── {learning 3}

  NEXT QUARTER PREVIEW
  └── {high-level direction for Q{n+1} objectives}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template 6: Trend Alert

```
⚠ TREND ALERT: {Metric Name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  What:      {description of anomaly/trend}
  When:      {date/period detected}
  Severity:  {Low / Medium / High / Critical}
  Magnitude: {how far from normal — quantified}

  Trend Data
  {text-based sparkline or period comparison}
  {period 1}: {val}
  {period 2}: {val} ({Δ})
  {period 3}: {val} ({Δ})
  {current}:  {val} ({Δ}) ← anomaly

  Previous Occurrences
  └── {pattern or "first time observed"}

  Likely Causes (ranked)
  ├── {cause 1} — confidence: {High/Med/Low}
  ├── {cause 2} — confidence: {High/Med/Low}
  └── {cause 3} — confidence: {High/Med/Low}

  Recommended Action
  └── {what to do — specific and immediate}

  Monitoring
  └── {what to watch and when to escalate}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template 7: Strategic Recommendation Memo

```
STRATEGIC MEMO: {Topic}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  RECOMMENDATION: {one sentence — the answer}

  SITUATION
  {2-3 sentences. Current state. Neutral, factual.}

  COMPLICATION
  {2-3 sentences. What changed. Why this matters now.}

  ANALYSIS
  Root Cause:
  ├── {cause 1} — {evidence}
  ├── {cause 2} — {evidence}
  └── {cause 3} — {evidence}

  Research Findings:
  ├── {finding 1 — source, citation}
  ├── {finding 2 — source, citation}
  └── {finding 3 — source, citation}

  OPTIONS
  ┌─────────────┬────────┬──────────┬──────┬─────────┬──────────┐
  │ Option      │ Impact │ Confidence│ Ease │ ICE     │ Timeline │
  ├─────────────┼────────┼──────────┼──────┼─────────┼──────────┤
  │ {option 1}  │ {1-10} │ {1-10}   │{1-10}│ {total} │ {weeks}  │
  │ {option 2}  │ {1-10} │ {1-10}   │{1-10}│ {total} │ {weeks}  │
  │ {option 3}  │ {1-10} │ {1-10}   │{1-10}│ {total} │ {weeks}  │
  └─────────────┴────────┴──────────┴──────┴─────────┴──────────┘

  RECOMMENDATION (detailed)
  {Which option and why. Implementation steps.
  Who owns what. Cost estimate.}

  EXPECTED IMPACT
  ├── Scenario A (conservative): {outcome}
  ├── Scenario B (expected): {outcome}
  └── Scenario C (optimistic): {outcome}

  SUCCESS METRICS
  ├── {how we'll know in 30 days}
  ├── {how we'll know in 90 days}
  └── {how we'll know in 6 months}

  COST OF INACTION
  └── {what happens if we do nothing}

  CONFIDENCE: {score}/100
  ASSUMPTIONS: {list top 3}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template 8: Project Health Scorecard

```
PROJECT HEALTH: {Project Name}
Report Date: {date} │ Sprint: {n}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  OVERALL: {Green / Yellow / Red}

  ┌────────────┬────────┬────────────────────────────┐
  │ Dimension  │ Status │ Key Indicator              │
  ├────────────┼────────┼────────────────────────────┤
  │ Scope      │ ✓/⚠/✗ │ {change rate or completion}│
  │ Schedule   │ ✓/⚠/✗ │ {SPI or milestone status}  │
  │ Budget     │ ✓/⚠/✗ │ {CPI or burn rate}         │
  │ Quality    │ ✓/⚠/✗ │ {defect rate or coverage}  │
  │ Risk       │ ✓/⚠/✗ │ {top risk summary}         │
  └────────────┴────────┴────────────────────────────┘

  VELOCITY TREND
  Sprint {n-2}: {points} │ Sprint {n-1}: {points} │ Sprint {n}: {points}
  3-sprint avg: {avg} │ Trend: {up/down/stable}

  MILESTONE STATUS
  ├── {milestone}: {status} ({date})
  └── {milestone}: {status} ({date})

  TOP RISKS
  ├── {risk 1}: {impact} — {mitigation status}
  └── {risk 2}: {impact} — {mitigation status}

  BLOCKERS
  └── {blocker — age, owner, path to resolution}

  DECISIONS PENDING
  └── {decision — impact of delay, owner}

  FORECAST
  └── Projected completion: {date range}
      (based on current velocity + risk factors)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template 9: Data Story

```
{COMPELLING TITLE THAT REVEALS THE INSIGHT}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  THE HOOK
  {1-2 sentences. A surprising finding, a counterintuitive
  insight, or a question that demands an answer.}

  THE CONTEXT
  {What we looked at. Time period. Data source.
  Why this matters right now.}

  THE FINDINGS

  Finding 1: {headline}
  {2-3 sentences with specific numbers.}
  Evidence: {data point with comparison}

  Finding 2: {headline}
  {2-3 sentences with specific numbers.}
  Evidence: {data point with comparison}

  Finding 3: {headline}
  {2-3 sentences with specific numbers.}
  Evidence: {data point with comparison}

  THE IMPLICATION
  {What this means for the business. Why the reader
  should care. What changes if we act on this.}

  THE CALL TO ACTION
  {Specific next step. Who, what, when.}

  METHODOLOGY NOTE
  Data source: {source}
  Period: {dates}
  Confidence: {score}/100
  Assumptions: {key caveats}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template 10: Competitive Brief

```
COMPETITIVE BRIEF: {Competitor or Market}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  HEADLINE: {one sentence — the key competitive insight}

  COMPETITOR OVERVIEW
  ├── {Competitor 1}: {positioning, size, recent moves}
  ├── {Competitor 2}: {positioning, size, recent moves}
  └── {Competitor 3}: {positioning, size, recent moves}

  BENCHMARK COMPARISON
  ┌──────────────┬─────────┬─────────┬─────────┬─────────┐
  │ Metric       │ Us      │ Comp 1  │ Comp 2  │ Industry│
  ├──────────────┼─────────┼─────────┼─────────┼─────────┤
  │ {metric}     │ {val}   │ {val}   │ {val}   │ {val}   │
  │ ...          │ ...     │ ...     │ ...     │ ...     │
  └──────────────┴─────────┴─────────┴─────────┴─────────┘

  COMPETITIVE ADVANTAGES (ours)
  ├── {advantage 1 — with evidence}
  └── {advantage 2 — with evidence}

  COMPETITIVE GAPS (theirs are better)
  ├── {gap 1 — with evidence}
  └── {gap 2 — with evidence}

  THREATS
  ├── {threat 1 — likelihood, timeline, impact}
  └── {threat 2 — likelihood, timeline, impact}

  OPPORTUNITIES
  ├── {opportunity 1 — based on competitor weakness}
  └── {opportunity 2 — based on market gap}

  RECOMMENDED RESPONSE
  └── {what we should do about all this}

  Sources: {citations from research}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
