# Senior Analytics Playbook — The Complete Knowledge Base

Everything a VP of Analytics, Chief Strategy Officer, or senior PM carries in their
head. This is the reference brain. Modes draw from it contextually — never dump
all of this on the user at once.

---

## PART 1: METRIC DESIGN PRINCIPLES

### The AARRR Pirate Metrics (Dave McClure)
For any product or growth-stage business:
Acquisition → Activation → Retention → Revenue → Referral

Each stage has its own KPIs. If you're only measuring Revenue, you're missing
the funnel that feeds it.

### The North Star Metric
One metric that captures core value delivered to customers.
Everything else is a supporting metric.

Examples by business type:
- Airbnb: Nights booked
- Slack: Messages sent per team per week
- Spotify: Time spent listening
- Netflix: Hours watched per subscriber
- Coaching platform: Assessment completions + coaching sessions delivered
- E-commerce: Purchases per customer per year
- SaaS: Weekly active users completing core workflow

How to find yours: "What single metric, if it went up, would mean we're
delivering more value to more people?"

### Input vs. Output Metrics
**Inputs** = things you control (ad spend, content published, calls made)
**Outputs** = results (leads, revenue, NPS)

Teams should be measured on outputs but manage their inputs.
If outputs aren't moving, diagnose which inputs aren't working.

### Counter-Metrics (The Guardrail Principle)
For every metric you optimize, track what could break:

| Optimizing | Counter-Metric | Why |
|---|---|---|
| Speed | Quality / Error rate | Moving fast can create bugs |
| Revenue | Churn / Customer satisfaction | Revenue-pushing can alienate |
| Growth | Profitability / Burn rate | Growth at all costs kills companies |
| Efficiency | Employee satisfaction | Over-optimization burns people out |
| Quantity | Depth / Engagement | More content ≠ better content |
| Cost reduction | Customer experience | Cutting too deep degrades service |

### Goodhart's Law
"When a measure becomes a target, it ceases to be a good measure."

Real examples:
- Target: "Increase customer calls" → Result: More calls, worse service
- Target: "Reduce support tickets" → Result: Tickets closed prematurely
- Target: "Increase code commits" → Result: Smaller, meaningless commits
- Target: "Improve NPS" → Result: Only surveying happy customers

**Prevention:** Pair every target with a quality counter-metric. Measure the
system, not just the output.

### The RED/RITE/USE Framework for Metric Quality

**RED (is it a good metric?):**
- **R**elevant — Does it matter to a business objective?
- **E**xplainable — Can a non-analyst understand it in one sentence?
- **D**ecomposable — Can you drill into what's driving it?

**RITE (is it reliable?):**
- **R**eliable — Trustworthy, consistent data source?
- **I**ndependent — Can't be gamed by optimizing another metric?
- **T**imely — Available when decisions need to be made?
- **E**fficient — Cost of collection worth the insight?

**USE (is it useful?):**
- **U**seful — Does it change behavior or decisions?
- **S**pecific — Precise enough to act on?
- **E**volving — Updated as the business changes?

---

## PART 2: FINANCIAL METRICS MASTERY

### Unit Economics — The Foundation

**CAC (Customer Acquisition Cost)**
= Total sales & marketing spend / New customers acquired
- Include salaries, tools, ad spend, events, content production
- Calculate blended CAC and per-channel CAC
- Trend matters more than absolute number

**LTV (Lifetime Value)**
= ARPU × Gross Margin % × Average Customer Lifespan (months)
- Or: ARPU × Gross Margin % / Monthly Churn Rate
- Segment by customer type — enterprise LTV ≠ SMB LTV
- LTV should increase over time as you improve retention

**LTV:CAC Ratio**
- <1:1 = Losing money on every customer. Fix immediately.
- 1-3:1 = Unsustainable. Improve retention or reduce CAC.
- 3-5:1 = Healthy. Standard for growth-stage businesses.
- 5-8:1 = Strong. Indicates pricing power or viral growth.
- >8:1 = Possibly under-investing in growth.

**Payback Period**
= CAC / (Monthly ARPU × Gross Margin %)
- <6 months = Excellent. Can scale aggressively.
- 6-12 months = Good. Healthy growth pace.
- 12-18 months = Acceptable. Watch cash flow.
- >18 months = Concerning. Cash flow risk.

### SaaS Financial Metrics

**MRR Decomposition:**
Net New MRR = New MRR + Expansion MRR - Contraction MRR - Churned MRR

This decomposition tells you WHERE growth comes from:
- Mostly New MRR → Growth is acquisition-driven (healthy early stage)
- Mostly Expansion MRR → Growth is product-driven (healthy mature stage)
- Contraction > Expansion → Product-market fit issues
- Churn > New → Business is shrinking despite sales effort

**Net Revenue Retention (NRR)**
= (Starting MRR + Expansion - Contraction - Churn) / Starting MRR × 100%
- >100% = Existing customers are growing (the holy grail)
- Top SaaS companies: 120-140% NRR
- <100% = You need new customers just to stand still

**Gross Revenue Retention (GRR)**
= (Starting MRR - Contraction - Churn) / Starting MRR × 100%
- Ignores expansion. Shows raw retention.
- Healthy SaaS: >85% GRR
- Enterprise SaaS: >90% GRR

**Rule of 40**
= Revenue Growth Rate % + Profit Margin %
- >40 = Healthy balance of growth and profitability
- <40 = Sacrificing one for the other (acceptable if intentional)
- Used by investors to evaluate SaaS businesses

**Burn Multiple**
= Net Burn / Net New ARR
- <1x = Excellent efficiency (generating more ARR than burning cash)
- 1-2x = Good. Efficient growth.
- 2-4x = Concerning. Burning too much per dollar of new revenue.
- >4x = Unsustainable. Course-correct immediately.

**Magic Number**
= Net New ARR (this Q) / Sales & Marketing Spend (last Q)
- >1.0 = Spend more on S&M — it's working
- 0.5-1.0 = Healthy. Continue optimizing.
- <0.5 = S&M spend is inefficient. Diagnose why.

### Cash Flow Intelligence

**Runway = Cash on hand / Monthly burn rate**
- <6 months: Alarm. Fundraise or cut costs immediately.
- 6-12 months: Caution. Start planning next round or path to profitability.
- 12-18 months: Comfortable. Can focus on growth.
- >18 months: Strong position. Can be strategic.

**DSO (Days Sales Outstanding)**
= (Accounts Receivable / Revenue) × Days in Period
- Lower = better. Cash is collected faster.
- Increasing DSO = customers paying slower. Investigate.

---

## PART 3: CUSTOMER METRICS DEEP DIVE

### NPS (Net Promoter Score)
Promoters (9-10) minus Detractors (0-6) as percentage.

**Benchmarks by industry:**
| Industry | Poor | Median | Good | Excellent |
|---|---|---|---|---|
| SaaS/Tech | <20 | 30-40 | 40-60 | >60 |
| Financial services | <15 | 25-35 | 35-50 | >50 |
| Healthcare | <10 | 20-30 | 30-45 | >45 |
| Consulting/Coaching | <25 | 35-45 | 45-65 | >65 |
| E-commerce | <20 | 30-40 | 40-55 | >55 |

**NPS analysis tips:**
- Segment by customer type, tenure, product, region
- Track trend, not just point-in-time
- Read the verbatims (open-text responses) — that's where insight lives
- Follow up with detractors within 48 hours (closed-loop NPS)

### Churn Analysis Framework

**Types of churn:**
- Logo churn: % of customers lost
- Revenue churn: % of MRR lost
- Net revenue churn: Revenue churn minus expansion
- Voluntary churn: Customer chose to leave
- Involuntary churn: Failed payment, expired card

**Churn cohort analysis:**
Group customers by signup month. Track survival rate over time.
The shape of the curve tells you everything:
- Steep early drop → Onboarding problem
- Gradual decline → Value erosion over time
- Plateau then drop → Life-stage change or competitor entry
- Flat after initial drop → Strong core retention

**Root cause investigation (priority order):**
1. Exit surveys / cancellation reasons
2. Usage data before churn (did engagement drop?)
3. Support ticket history (were they frustrated?)
4. Competitive analysis (did they go somewhere else?)
5. Economic factors (budget cuts? business closure?)

### Time to Value (TTV)
The most underrated metric in SaaS and coaching businesses.

TTV = Days from signup/purchase to first meaningful outcome

**Why it matters:**
- Shorter TTV → Higher activation → Higher retention → Higher LTV
- Every day of delay is a day the customer might churn
- The "aha moment" must happen fast

**How to improve:**
1. Identify the activation event (what do retained customers do first?)
2. Measure time to that event
3. Remove every friction point between signup and that event
4. Automate the path (onboarding sequences, guided tours)
5. Measure again. Repeat.

---

## PART 4: PROJECT MANAGEMENT METRICS

### Earned Value Management (EVM)

**Core Concepts:**
- **BAC** (Budget at Completion) = Total project budget
- **PV** (Planned Value) = How much work should be done by now ($)
- **EV** (Earned Value) = How much work IS done by now ($)
- **AC** (Actual Cost) = What it cost to do the work that's done

**Performance Indices:**
- **SPI** = EV / PV (Schedule Performance Index)
  - 1.0 = On schedule
  - >1.0 = Ahead of schedule
  - <1.0 = Behind schedule
  - <0.8 = Serious trouble

- **CPI** = EV / AC (Cost Performance Index)
  - 1.0 = On budget
  - >1.0 = Under budget
  - <1.0 = Over budget
  - <0.9 at 20% complete = Almost certainly going to overrun

**Forecasting:**
- **EAC** (Estimate at Completion) = BAC / CPI
- **ETC** (Estimate to Complete) = EAC - AC
- **TCPI** (To-Complete Performance Index) = (BAC - EV) / (BAC - AC)
  - >1.0 = Must improve efficiency to meet budget
  - >1.2 = Extremely unlikely to meet budget — rebaseline

### Agile Metrics That Matter

**Velocity:**
Story points completed per sprint. Use for planning, not performance.
- 3-sprint rolling average for planning
- Significant decrease (>20%) = investigate
- Significant increase (>30%) = possible point inflation

**Cycle Time:**
Time from "in progress" to "done" for a single item.
- Decreasing = team is getting more efficient
- Increasing = bottlenecks, dependencies, or complexity growing
- High variance = unpredictable — break work into smaller pieces

**Throughput:**
Number of items completed per period (regardless of size).
- More reliable than velocity for forecasting
- Use for Monte Carlo simulations of completion dates

**WIP (Work in Progress):**
Items currently in progress.
- WIP limits prevent overloading
- High WIP = context switching = slower everything
- Ideal: WIP ≈ Team size (one item per person)

**Escaped Defects:**
Bugs found after release.
- Increasing trend = quality process breaking down
- Correlate with: test coverage, review thoroughness, sprint velocity

### The Iron Triangle + Quality

```
       SCOPE
      /     \
     /       \
  TIME ─── COST
       \   /
      QUALITY
```

You can fix any three. The fourth adjusts.
- Need to deliver everything on time? Budget increases or quality drops.
- Need high quality on budget? Scope decreases or timeline extends.
- Need it all? Something will break. The PM's job is to make the tradeoff explicit.

---

## PART 5: STRATEGIC FRAMEWORKS

### Balanced Scorecard (Kaplan & Norton, 1992)
Four perspectives, all connected:

```
FINANCIAL ←── "What do shareholders want?"
    ↑
CUSTOMER ←── "What must we deliver to customers?"
    ↑
INTERNAL PROCESS ←── "What processes must we excel at?"
    ↑
LEARNING & GROWTH ←── "What capabilities do we need to build?"
```

The bottom drives the top. Invest in learning → improve processes →
delight customers → drive financial results.

### OKR (Objectives & Key Results — Intel/Google)
- Objectives: Qualitative, ambitious, inspiring
- Key Results: Quantitative, measurable, time-bound
- Cadence: Quarterly (typical), with weekly check-ins
- Scoring: 0.0-1.0 scale. 0.7 = good delivery.

### V2MOM (Salesforce)
- **V**ision: Where are we going?
- **V**alues: What's important to us?
- **M**ethods: How do we get there?
- **O**bstacles: What's in the way?
- **M**easures: How do we know we arrived?

### 4DX — Four Disciplines of Execution (FranklinCovey)
1. Focus on the wildly important (1-2 WIG goals)
2. Act on lead measures (not lag measures)
3. Keep a compelling scoreboard (visible, simple)
4. Create a cadence of accountability (weekly WIG sessions)

### OGSM (Objective, Goals, Strategies, Measures)
Popular in consumer goods/FMCG. More structured than OKRs:
- Objective: Qualitative direction (one sentence)
- Goals: Quantitative targets
- Strategies: How we'll achieve the goals (3-5 approaches)
- Measures: KPIs that prove the strategies are working

---

## PART 6: DATA STORYTELLING

### The Three Elements (Brent Dykes, "Effective Data Storytelling")
1. **Data** — Accurate, relevant, properly analyzed
2. **Narrative** — The "so what" that connects data to decisions
3. **Visuals** — Charts and frameworks that make patterns obvious

Data alone = informative but not persuasive.
Narrative alone = persuasive but not credible.
Visuals alone = engaging but not actionable.
All three together = compelling, credible, and actionable.

### Story Structure for Data
1. **Setup** — Establish the context (what are we looking at? why now?)
2. **Rising tension** — Present the unexpected finding or trend
3. **Climax** — The key insight (the "aha" moment)
4. **Resolution** — What to do about it
5. **Call to action** — Specific next step

### Chart Selection Guide

| Purpose | Best Chart | Avoid |
|---|---|---|
| Compare categories | Vertical bar | Pie (>6 categories) |
| Show trend over time | Line chart | Bar chart (for time series) |
| Part-to-whole | Pie/donut (<6 cats) or stacked bar | Pie with too many slices |
| Distribution | Histogram or box plot | Bar chart |
| Correlation | Scatter plot | Line chart |
| Ranking | Horizontal bar | Vertical bar (hard to read labels) |
| Geographic | Map / choropleth | Table with locations |
| KPI status | Bullet chart, gauge, or big number | Complex dashboard |
| Composition over time | Stacked area | Multiple pie charts |

### Number Formatting Rules
- Always round appropriately (don't say "$1,247,832.17" — say "$1.25M")
- Use consistent decimal places within a table
- Percentages: 1 decimal place max (73.2%, not 73.217%)
- Currency: Appropriate precision for the magnitude ($1.2M, $47K, $832)
- Always label units. Always.

---

## PART 7: TOOLS, TRICKS, AND PATTERNS

### The "Start With Why" Filter
Before building any metric or report, ask: "What decision will this inform?"
If you can't name the decision, you don't need the metric.

### The 80/20 Rule for Analytics
80% of actionable insights come from 20% of your data. Find the 20%.
Don't build a 200-KPI dashboard. Find the 5-7 that drive decisions.

### The "Would I Bet?" Test
For any assumption or forecast: "Would I bet $100 of my own money on this?"
If not, what additional data would make you confident enough to bet?

### Proxy Metrics (When You Can't Measure What You Want)
Sometimes the ideal metric isn't available. Use proxies:
- Can't measure customer satisfaction? Track support ticket volume + resolution time
- Can't measure brand awareness? Track direct traffic + branded search volume
- Can't measure employee engagement? Track voluntary turnover + Glassdoor ratings
- Can't measure content quality? Track time-on-page + scroll depth + return visits

### The Data Quality Pyramid
```
DECISIONS (what we're here for)
    ↑
INSIGHTS (patterns that matter)
    ↑
ANALYSIS (structured examination)
    ↑
CLEAN DATA (accurate, complete, consistent)
    ↑
RAW DATA (the source of truth)
```

Garbage in → garbage out. If you're getting bad insights, check the foundation.
The most common analytics problem isn't bad analysis — it's bad data.

### Signal vs. Noise
- Single data point = noise (might be random)
- Trend over 3+ periods = weak signal (worth watching)
- Trend over 5+ periods = strong signal (act on it)
- Trend confirmed by multiple metrics = very strong signal (prioritize)

### Survivorship Bias in Metrics
You're only measuring what exists. Consider what's missing:
- Customer satisfaction surveys miss churned customers (who were probably less satisfied)
- Revenue per customer excludes free users (who might convert if nurtured)
- Sprint velocity only counts completed items (not blocked or deprioritized work)
- NPS surveys miss non-responders (often the most disengaged)

### The Streetlight Effect
"Looking where the light is" instead of where the answer is.
Just because a metric is easy to measure doesn't make it important.
Revenue is easy to measure. Customer trust is hard to measure. Both matter.

### Regression to the Mean
Extreme performance in one period tends to be followed by average performance.
- Don't celebrate a great month as a new trend
- Don't panic about a bad month as a new trend
- Look at 3-6 month rolling averages for true signal

### Simpson's Paradox
A trend that appears in several groups can reverse when the groups are combined.
Always segment before concluding. The aggregate can lie.

Example: Hospital A has better outcomes than Hospital B overall, but Hospital B
is better for BOTH mild AND severe cases. The paradox: Hospital B takes more
severe cases, dragging its average down.
