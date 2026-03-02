# Data Analysis Playbook — Large Dataset & Contract Intelligence

This reference file covers the advanced data analysis and contract intelligence
capabilities of /strategic-analytics. Read this when the user brings a large dataset,
a contract, or needs deep quantitative analysis.

---

## Large Dataset Analysis Protocol

When the user provides a big dataset (CSV, XLSX, Airtable export, database dump,
or multiple files), follow this systematic protocol.

### Phase 1: Intake & Profiling

Before analyzing anything, understand what you're working with:

1. **Record count** — How many rows? How many columns?
2. **Schema inventory** — List every column with data type, fill rate, and sample values
3. **Date range** — What time period does this cover?
4. **Grain** — What does one row represent? (A transaction? A day? A customer? An event?)
5. **Source** — Where did this data come from? (CRM, billing system, survey, manual entry?)
6. **Known issues** — Ask: "Is there anything I should know about this data? Missing periods, system changes, known errors?"

Present a Data Profile Summary before proceeding:
```
DATA PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Source:     {source system}
  Records:    {count}
  Columns:    {count}
  Date Range: {start} to {end}
  Grain:      {what one row represents}

  Column Health
  ├── {column}: {type}, {fill%}, {sample}
  ├── {column}: {type}, {fill%}, {sample}
  └── {column}: {type}, {fill%} ⚠ {issue}

  Data Quality Flags
  ├── {issue description}
  └── {issue description}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Phase 2: Cleaning & Preparation

Common data quality issues and how to handle them:

| Issue | Detection | Treatment |
|---|---|---|
| Missing values | Fill rate < 95% | Document. Impute if < 5% and non-critical. Flag if pattern suggests system issue. |
| Duplicates | Identical rows or identical on key columns | Deduplicate. Document how many removed and why. |
| Outliers | Values > 3 SD from mean or obviously impossible | Flag but don't auto-remove. Present to user: "Is $0.01 revenue realistic or a data error?" |
| Inconsistent formats | Dates in multiple formats, mixed case categories | Standardize. Document transformations. |
| Broken time series | Gaps in date sequence | Identify gaps. Note: "No data for March 2025 — system outage or just no activity?" |
| Schema changes | Column names or types change partway through | Split analysis at the break point. Note the change. |

**Critical rule: Never silently discard data.** Always tell the user what you cleaned, how many records were affected, and why.

### Phase 3: Exploratory Analysis

Before answering specific questions, look at the data holistically:

**Distributions:**
- For every numeric column: min, max, mean, median, std dev, quartiles
- For every categorical column: unique count, top 5 values with frequency, long tail %
- For date columns: range, gaps, volume by period (daily/weekly/monthly)

**Correlations:**
- Identify which numeric columns move together
- Flag unexpected correlations (might reveal data leaks or confounders)
- Check for multicollinearity if building any models

**Segmentation:**
- Break key metrics by every categorical dimension available
- Which segments drive the majority of volume/revenue/cost?
- Which segments are growing/declining?
- Are there segments performing dramatically differently from the average?

**Time-Series Patterns:**
- Trend (direction and rate of change)
- Seasonality (recurring patterns at weekly/monthly/quarterly intervals)
- Cyclicality (longer-term patterns tied to business or economic cycles)
- Level shifts (sudden permanent changes — did something happen?)

### Phase 4: Answering the "So What"

This is where analysis becomes insight. For every finding:

1. **State the finding** — Plain language, one sentence. "Enterprise churn doubled in Q4."
2. **Quantify the impact** — What does this cost the business? "At current rates, this represents $240K in lost annual revenue."
3. **Identify the cause** — What changed? "All 8 churned accounts cited 'lack of integration support' in exit surveys."
4. **Recommend action** — What should the business do? "Hire a dedicated integration specialist. Projected cost: $80K/year. Projected recovery: $180K+ in retained revenue."
5. **Define success metric** — How will we know the action worked? "Enterprise churn rate returns to <2% within 90 days of specialist hire."

### Phase 5: Forward-Looking Analysis

Go beyond "what happened" to "what's likely to happen":

**Simple Projections:**
- Linear trend extrapolation (if current trend continues...)
- Moving average forecasts (next 4-8 periods based on recent trajectory)
- Seasonal adjustment (same-period-last-year comparison + growth rate)

**Scenario Analysis:**
- Best case: Top-quartile performance on key drivers
- Expected case: Current trajectory continues
- Worst case: Key risk materializes
- For each: revenue impact, resource needs, timeline

**Cohort Analysis:**
- Group customers/users by when they started
- Track behavior over their lifecycle
- Compare cohorts to see if you're getting better or worse at retention/engagement

**Sensitivity Analysis:**
- Which inputs have the biggest impact on the output?
- If pricing increases 10%, what happens to conversion?
- If churn decreases 1%, what happens to LTV?

---

## Contract Deep-Dive Protocol

For large, complex contracts (MSAs, SOWs, SLAs, partnership agreements, vendor
contracts, government contracts), go beyond simple extraction.

### Phase 1: Full Document Mapping

Create a structural map of the contract:

```
CONTRACT MAP: {Contract Name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Parties:     {Party A} ↔ {Party B}
  Effective:   {date} to {date}
  Value:       {total contract value}
  Type:        {MSA / SOW / SLA / Partnership / etc.}

  Section Map
  ├── §1  Definitions
  ├── §2  Scope of Work
  │   ├── §2.1 Deliverables (7 items)
  │   ├── §2.2 Milestones (4 phases)
  │   └── §2.3 Exclusions
  ├── §3  Service Levels (SLA)
  │   ├── §3.1 Availability (99.9%)
  │   ├── §3.2 Response Time (4 tiers)
  │   └── §3.3 Resolution Time
  ├── §4  Pricing & Payment
  ├── §5  Reporting Requirements
  ├── §6  Governance
  ├── §7  Termination
  └── §8  General Provisions

  Key Dates
  ├── {date}: {milestone/obligation}
  ├── {date}: {milestone/obligation}
  └── {date}: {renewal/termination window}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Phase 2: Obligation Extraction (Comprehensive)

Extract EVERY measurable commitment, categorized:

**Performance Obligations:**
- SLA targets (uptime, response time, resolution time)
- Quality standards (defect rates, accuracy requirements)
- Volume commitments (minimum/maximum thresholds)
- Performance benchmarks (improvement targets over time)

**Delivery Obligations:**
- Deliverables with acceptance criteria
- Milestone dates with dependencies
- Reporting deliverables (what reports, to whom, how often)
- Documentation requirements

**Financial Obligations:**
- Payment terms and schedules
- Price escalation clauses
- Penalty/credit mechanisms for SLA misses
- Bonus/incentive triggers
- True-up provisions

**Governance Obligations:**
- Meeting cadence (steering committees, operational reviews)
- Escalation procedures and timelines
- Change management process
- Audit rights and cooperation requirements

**Compliance Obligations:**
- Regulatory requirements (GDPR, HIPAA, SOC2, etc.)
- Insurance requirements
- Background check requirements
- Subcontracting restrictions

### Phase 3: Risk Assessment

Score every obligation on two dimensions:

| Risk Factor | Low (1) | Medium (3) | High (5) |
|---|---|---|---|
| **Likelihood of miss** | Easy to meet, well within capability | Achievable but requires attention | Stretch target or dependent on external factors |
| **Impact of miss** | Minor inconvenience | Financial penalty or relationship damage | Contract termination, legal action, or revenue loss |

**Risk Score = Likelihood × Impact** (1-25 scale)
- 1-5: Monitor quarterly
- 6-12: Track monthly, have mitigation plan
- 13-25: Track weekly, escalate immediately on any deviation

### Phase 4: Monitoring Framework

For every extracted obligation, define:

| Element | Description |
|---|---|
| What to measure | The specific metric |
| How to measure | Data source, calculation method |
| How often | Measurement cadence |
| Who owns it | Responsible party |
| Threshold | When to escalate |
| Reporting | Where/how it gets reported |

### Phase 5: Gap Analysis

Compare what the contract requires against what the business currently tracks:

```
MONITORING GAP ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Obligation              Tracked?  Gap
  ├── 99.9% uptime SLA    ✓        None — monitored in Datadog
  ├── 4hr P1 response     ✓        None — ticketing system tracks
  ├── Monthly exec report  ✗        No automated report exists
  ├── Quarterly NPS > 40   ◑        NPS measured but not segmented
  └── Annual audit ready   ✗        No SOC2 compliance tracking

  Summary: 2 of 5 obligations fully tracked
  Action needed: Build reporting for 3 gaps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Solution Generation Framework

When data or contract analysis reveals problems, generate solutions using this
structured approach.

### The SCQA Framework (Situation, Complication, Question, Answer)

For every problem identified:

1. **Situation** — What's the current state? (Neutral, factual)
2. **Complication** — What changed or went wrong? (The tension)
3. **Question** — What decision needs to be made? (Framed as a question)
4. **Answer** — What should be done? (Your recommendation)

Example:
- S: "Our SLA requires 99.9% uptime. We've maintained 99.95% for 18 months."
- C: "In the last 3 months, we've had 4 incidents bringing us to 99.7%. The contract
  allows 3 SLA credits before triggering a termination review."
- Q: "How do we get uptime back above 99.9% before the next quarterly review?"
- A: "Three actions: (1) Implement redundant failover for the DB cluster — prevents
  2 of the 4 incident types. (2) Add synthetic monitoring with 1-minute intervals.
  (3) Create an incident response runbook to cut MTTR from 45 min to 15 min."

### Solution Prioritization: ICE Framework

| Solution | Impact (1-10) | Confidence (1-10) | Ease (1-10) | ICE Score |
|---|---|---|---|---|
| {solution 1} | 8 | 7 | 9 | 24 |
| {solution 2} | 9 | 5 | 3 | 17 |

ICE Score = Impact + Confidence + Ease. Higher = do first.

### Solution Categories

Always consider solutions across these dimensions:

1. **Process fix** — Change how work gets done (cheapest, fastest)
2. **People fix** — Training, hiring, reorganization (medium cost, medium time)
3. **Technology fix** — New tools, automation, infrastructure (highest cost, longest time)
4. **Commercial fix** — Renegotiate terms, adjust pricing, change partners (variable)

Present options across categories when possible. Let the user choose the dimension
that fits their constraints.

---

## Data Storytelling Templates

### The Executive Summary (1-page)

```
{METRIC} is {UP/DOWN/FLAT} — here's what it means.

KEY NUMBER: {headline metric with comparison}

WHY: {2-3 sentence root cause}

IMPACT: {quantified business impact}

ACTION: {1-2 recommended next steps}

TIMELINE: {when to act, when to expect results}
```

### The Deep Dive (3-5 pages)

```
1. HEADLINE (the answer, one sentence)
2. CONTEXT (what we measured, time period, data source)
3. FINDINGS (3-5 key findings, each with data + visual)
4. ROOT CAUSE (why this is happening)
5. OPTIONS (2-3 paths forward with tradeoffs)
6. RECOMMENDATION (what we suggest and why)
7. NEXT STEPS (who does what by when)
```

### The Trend Alert (ad hoc, 1 page)

```
⚠ {METRIC} crossed {THRESHOLD} on {DATE}

What happened: {1-2 sentences}
Severity: {Low / Medium / High / Critical}
Trend: {chart or description}
Previous occurrences: {pattern or "first time"}
Likely cause: {hypothesis}
Recommended action: {what to do now}
Monitoring: {what to watch going forward}
```

---

## Industry Benchmark Quick Reference

These are starting points — always validate with Perplexity/Firecrawl research
for current and industry-specific benchmarks.

### SaaS Metrics

| Metric | Poor | Median | Good | Excellent |
|---|---|---|---|---|
| Monthly churn | >5% | 3-5% | 1-3% | <1% |
| Net Revenue Retention | <100% | 100-105% | 105-120% | >120% |
| LTV:CAC | <3:1 | 3:1 | 5:1 | >8:1 |
| CAC Payback | >18 mo | 12-18 mo | 6-12 mo | <6 mo |
| Gross Margin | <60% | 65-75% | 75-85% | >85% |
| Rule of 40 | <20 | 20-40 | 40-60 | >60 |
| Magic Number | <0.5 | 0.5-0.75 | 0.75-1.0 | >1.0 |

### Professional Services

| Metric | Poor | Median | Good | Excellent |
|---|---|---|---|---|
| Utilization rate | <60% | 65-70% | 70-80% | >80% |
| Realization rate | <85% | 85-90% | 90-95% | >95% |
| Project margin | <20% | 25-35% | 35-45% | >45% |
| Client retention | <70% | 75-85% | 85-90% | >90% |
| Revenue per employee | <$100K | $100-150K | $150-200K | >$200K |

### E-commerce / DTC

| Metric | Poor | Median | Good | Excellent |
|---|---|---|---|---|
| Conversion rate | <1% | 1-2% | 2-4% | >4% |
| Cart abandonment | >80% | 70-80% | 60-70% | <60% |
| AOV growth | Flat | 5-10% YoY | 10-20% YoY | >20% YoY |
| Return rate | >30% | 20-30% | 10-20% | <10% |
| Email revenue % | <10% | 15-25% | 25-35% | >35% |

### Coaching / Assessment Businesses

| Metric | Poor | Median | Good | Excellent |
|---|---|---|---|---|
| Client completion rate | <50% | 60-70% | 70-85% | >85% |
| Assessment completion | <60% | 70-80% | 80-90% | >90% |
| Session show rate | <75% | 80-85% | 85-92% | >92% |
| NPS | <20 | 30-40 | 40-60 | >60 |
| Client renewal rate | <50% | 60-70% | 70-80% | >80% |
| Revenue per coach | <$80K | $80-120K | $120-180K | >$180K |

### Project Management

| Metric | Red | Yellow | Green | Blue (Elite) |
|---|---|---|---|---|
| On-time delivery | <60% | 60-75% | 75-90% | >90% |
| Budget variance | >15% | 10-15% | 5-10% | <5% |
| Scope change rate | >20% | 10-20% | 5-10% | <5% |
| Stakeholder satisfaction | <3.0/5 | 3.0-3.5 | 3.5-4.2 | >4.2 |
| Defect escape rate | >10% | 5-10% | 2-5% | <2% |
| Sprint velocity stability | >30% variance | 20-30% | 10-20% | <10% |
