---
name: market-intelligence
parent: consultant-lead-agent
version: 1.0
protocol: append-only
purpose: "Capture market-level intelligence and cross-market patterns"
---

# Market Intelligence — Macro Trends and Cross-Market Patterns

## Purpose

Individual lead intelligence lives in the pipeline CSV. This file captures MARKET-level intelligence — macro trends, industry shifts, regulatory changes, and cross-market patterns that affect the entire pipeline. A single lead might be interesting. A market trend makes 20 leads interesting simultaneously.

This file helps the agent answer: "What is happening in the market that creates consulting demand?" and "What is about to happen that we should prepare for?"

---

## Active Market Profiles

### Market: Ohio Energy

```
  MARKET PROFILE — Ohio Energy
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Status:            Active (since 2026-02-23)
  Pipeline Size:     32 leads (20 hardened, 12 unverified)
  Pipeline Value:    Estimated $800K-$2.4M (based on 3-5 engagements at $150K-$500K avg)
  Top Segment:       Upstream E&P (M&A driven) — 12 leads, avg score 78
  Secondary:         Midstream Infrastructure — 10 leads, avg score 72
  Tertiary:          Utility / Power Gen — 8 leads, avg score 68
  Undifferentiated:  Other / Cross-segment — 2 leads
  Key Competitors:   Burns & McDonnell, Black & Veatch, Montrose Environmental, GHD
  Regulatory Bodies: PUCO, Ohio EPA, FERC, PJM, PHMSA
  Primary Geography: Eastern Ohio (Utica/Marcellus), NW Ohio (refining corridor), Central Ohio (utility HQ)
  Market Health:     4 out of 5 (strong fundamentals, active M&A, infrastructure investment cycle)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Ohio Energy Market Segments

```
  SEGMENT DETAIL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Segment 1: Upstream E&P (Appalachian Basin)
  ├── Leads:         12
  ├── Avg Score:     78
  ├── Key Players:   EOG Resources, Encino Energy, Gulfport Energy,
  │                  Infinity Natural Resources, CNX Resources, Ascent Resources
  ├── Primary Trigger: M&A (acquisitions, acreage swaps, JVs)
  ├── Consulting Need: Integration PMO, operational harmonization, project controls
  ├── Buyer Profile:   VP Operations, COO, VP Development
  ├── Budget Cycle:    Quarterly (aligned with drilling program)
  └── Entry Strategy:  Operator-first voice, integration playbook offer

  Segment 2: Midstream Infrastructure
  ├── Leads:         10
  ├── Avg Score:     72
  ├── Key Players:   MPLX, EQT Midstream, Crestwood Equity,
  │                  Antero Midstream, Summit Midstream
  ├── Primary Trigger: CAPEX (pipeline construction, processing plant expansion)
  ├── Consulting Need: Project controls, construction management, commissioning
  ├── Buyer Profile:   VP Engineering, Director of Projects, SVP Operations
  ├── Budget Cycle:    Annual (aligned with FERC filings and capital programs)
  └── Entry Strategy:  Cost reduction angle, project controls diagnostic

  Segment 3: Utility / Power Generation
  ├── Leads:         8
  ├── Avg Score:     68
  ├── Key Players:   AEP Ohio, Duke Energy Ohio, FirstEnergy (Ohio Edison),
  │                  Ohio Valley Electric Corp
  ├── Primary Trigger: REG + INTCN (regulatory mandates, interconnection queue)
  ├── Consulting Need: Interconnection management, grid modernization, regulatory strategy
  ├── Buyer Profile:   VP Grid Operations, Director Resource Planning, VP Regulatory
  ├── Budget Cycle:    Biennial (aligned with rate cases and integrated resource plans)
  └── Entry Strategy:  Interconnection diagnostic, queue analysis as foot-in-the-door
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Market Signal Log — Ohio Energy

Chronological log of market signals detected. New signals are appended at the bottom.

```
  MARKET SIGNALS — Ohio Energy
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [2026-02-23] AEP interconnection queue dropped from 30GW to 13GW
               Source: PJM queue data, AEP regulatory filings
               Impact: Clearing event — remaining projects are real. Utility needs
               help processing smaller but more serious queue faster.
               Pipeline Effect: AEP and FirstEnergy leads score higher.

  [2026-02-23] Infinity Natural Resources / Antero asset acquisition closed
               Source: SEC filing, company press release (Feb 23, 2026)
               Impact: Integration window is now open. 30-90 day window for
               integration consulting is active. Lean corporate team (~200) likely
               needs external PMO support.
               Pipeline Effect: Infinity lead upgraded to Score 89.

  [2026-02-23] EOG Resources continuing Utica Shale expansion program
               Source: Q4 2025 earnings, investor presentation
               Impact: Multi-year drilling program with expanding well count.
               Contractor demand increasing. Project controls and
               operational support opportunities.
               Pipeline Effect: EOG lead scored 92 (highest in pipeline).

  [2026-02-23] PBF Energy Toledo refinery turnaround expected H2 2026
               Source: Trade press, Q4 2025 earnings commentary
               Impact: Major turnaround events create 6-12 month consulting
               windows for planning, execution, and post-turnaround optimization.
               Pipeline Effect: PBF lead scored 75.

  [2026-02-24] Columbia Gas of Ohio pipeline replacement program continues
               Source: PUCO filing, infrastructure modernization plan
               Impact: Multi-year mandated pipeline replacement. Ongoing demand
               for construction management, project controls, and compliance.
               Pipeline Effect: Columbia Gas lead scored 68 (regulatory-driven,
               longer sales cycle).

  [2026-02-24] Encino Energy maintains Utica position as largest private operator
               Source: Industry analysis, production data
               Impact: Private companies are more accessible than public companies
               for boutique consulting. No public procurement requirements. Decision
               cycles are faster. Direct access to CEO/COO.
               Pipeline Effect: Encino scored 74, accessibility multiplier applied.

  [2026-02-25] Data center demand driving Ohio grid stress
               Source: PJM analysis, AEP investor communications
               Impact: Multiple data center projects seeking Ohio grid
               interconnection. Creates compound demand for interconnection
               consulting, transmission planning, and generation siting.
               Pipeline Effect: Broad uplift to utility segment scores.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Macro Trend Tracking

Industry-wide trends that affect multiple leads across the pipeline. Updated monthly or when significant shifts occur.

```
  MACRO TRENDS — Last Updated 2026-02-26
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Trend                    Status           Direction         Impact on Pipeline
  ├── Energy Transition    Mixed            Stable            Neutral
  │   Solar/wind growing but fossil investment sustained in Appalachian Basin.
  │   Ohio is not a transition-first state — natural gas remains dominant.
  │
  ├── Data Center Demand   Very High        Accelerating      Positive
  │   Hyperscale data centers driving power demand in Ohio and PJM footprint.
  │   Grid interconnection bottleneck creates consulting demand for utilities
  │   and developers. AEP queue clearing is a direct result.
  │
  ├── Regulatory Environ.  Active           Tightening        Positive
  │   PUCO modernization mandates, EPA compliance deadlines, PHMSA
  │   enforcement on pipeline safety. All create compliance consulting demand.
  │   Federal deregulation talk has not changed state-level enforcement pace.
  │
  ├── Commodity Prices     Moderate         Stable            Neutral-Positive
  │   WTI ~$70-75/bbl, Henry Hub ~$3.00-3.50/MMBtu. High enough to sustain
  │   drilling programs but not high enough to trigger boom-phase spending.
  │   Sweet spot for consulting — companies investing but cost-conscious.
  │
  ├── Interest Rates       Elevated         Stable-Declining  Neutral
  │   Fed funds rate ~4.5%. Infrastructure projects still viable but
  │   marginal projects delayed. Rate cuts expected H2 2026 could
  │   unlock deferred capex.
  │
  ├── Tariff / Trade       Uncertain        Volatile          Negative Risk
  │   Steel tariffs affect pipeline construction costs. Equipment import
  │   costs rising. Could delay some capex projects. Monitor closely.
  │   AEP queue drop partially attributed to tariff uncertainty.
  │
  ├── Labor Market         Tight            Stable            Positive
  │   Skilled labor shortage in energy sector continues. Project controls
  │   specialists, turnaround planners, and commissioning engineers in
  │   short supply. This is the fundamental demand driver for consulting.
  │
  └── Technology Adoption  Growing          Accelerating      Positive
      Digital twins, AI-assisted operations, predictive maintenance
      gaining traction. Creates demand for implementation consulting
      and change management. Not our primary focus but worth monitoring.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Cross-Market Pattern Recognition

When the system operates in 2+ markets, this section tracks patterns that repeat across markets. Currently operating in Ohio only — this section will activate when a second market is added.

```
  CROSS-MARKET PATTERNS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Status: Single market (Ohio Energy). Cross-market analysis
  will activate when a second market is added.

  Patterns to Watch (when 2+ markets active):
  ├── Do M&A triggers in one basin predict activity in adjacent basins?
  │   (e.g., Appalachian M&A predicting Permian M&A)
  ├── Do regulatory changes in one state spread to neighboring states?
  │   (e.g., Ohio pipeline modernization mandates spreading to PA/WV)
  ├── Do commodity price shifts affect all markets simultaneously?
  │   (Yes in theory — validate with cross-market timing data)
  ├── Do the same competitors appear across markets?
  │   (Burns & McDonnell and Black & Veatch are national — validate)
  ├── Do buyer personas differ by market or stay consistent?
  │   (VP Ops is the buyer everywhere — validate)
  └── Does outreach messaging that works in Market A transfer to Market B?
      (Operator-first voice may be universal in energy — validate)

  Candidate Next Markets:
  ├── Pennsylvania (Marcellus Shale — adjacent basin, shared operators)
  ├── West Virginia (Appalachian overlap, pipeline infrastructure buildout)
  ├── Texas / Permian (largest U.S. basin, high activity, high competition)
  └── Gulf Coast (refining, petrochemical, LNG export — different segment)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Regulatory Calendar

Upcoming regulatory events by market. These create predictable consulting demand windows.

```
  REGULATORY CALENDAR — Ohio Energy
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  2026 Q1 (Jan-Mar)
  ├── [Mar] PUCO Q1 filing deadline — Ohio electric and gas utilities
  │         Impact: Compliance consulting demand, rate case preparation
  ├── [Mar] Ohio EPA annual air permit renewals begin processing
  │         Impact: Environmental compliance support for refineries and plants
  └── [Mar] PJM spring planning cycle — interconnection study updates
            Impact: Queue management consulting for utilities and developers

  2026 Q2 (Apr-Jun)
  ├── [Apr] Ohio EPA annual compliance reports due for major sources
  │         Impact: Environmental consulting demand for refinery and plant operators
  ├── [May] PUCO infrastructure modernization progress reports due
  │         Impact: Pipeline replacement program reporting — project controls demand
  ├── [Jun] PJM interconnection queue refresh — new study cycle opens
  │         Impact: Major trigger window for utility and developer outreach
  └── [Jun] FERC Form 2 filings due (interstate pipeline operators)
            Impact: Financial and operational data release — trigger for capex analysis

  2026 Q3 (Jul-Sep)
  ├── [Jul] Ohio EPA ozone season monitoring intensifies
  │         Impact: Incremental compliance consulting for industrial sources
  ├── [Aug] PUCO IRP (Integrated Resource Plan) update cycle for AEP Ohio
  │         Impact: Major strategic planning event — generation and grid consulting
  └── [Sep] PHMSA enforcement review cycle — pipeline safety compliance
            Impact: Safety consulting demand for pipeline operators

  2026 Q4 (Oct-Dec)
  ├── [Oct] PUCO rate case filing window opens
  │         Impact: Rate case consulting for utilities
  ├── [Nov] PJM Regional Transmission Expansion Plan (RTEP) update
  │         Impact: Transmission project consulting opportunities
  └── [Dec] FERC annual compliance filings — interstate gas and electric
            Impact: Year-end compliance rush creates short-term consulting demand

  Outreach Timing Rule: Contact targets 30-45 days BEFORE their regulatory
  deadline. They are thinking about it but have not yet hired help.
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Industry Event Calendar

Conferences, association meetings, and industry events relevant to the pipeline. Scored for attendance priority.

```
  EVENT CALENDAR — 2026
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [Mar 15-17] OOGA Annual Meeting — Columbus, OH
  ├── Buyer Density:       4/5 (Ohio upstream operators attend in force)
  ├── Competitor Presence: 3/5 (regional firms exhibit, nationals sometimes)
  ├── Speaking Oppty:      2/5 (typically reserved for operators and regulators)
  ├── Attendance Cost:     ~$800 (registration + travel within Ohio)
  ├── Recommendation:      ATTEND — highest density of Ohio E&P decision-makers
  └── Pipeline Targets:    EOG, Encino, Gulfport, Ascent, Infinity likely attend

  [Apr 8-10] COGA Midstream Conference — Location TBD
  ├── Buyer Density:       3/5 (midstream operators, pipeline companies)
  ├── Competitor Presence: 3/5 (engineering firms exhibit)
  ├── Speaking Oppty:      3/5 (panel discussions on infrastructure)
  ├── Attendance Cost:     ~$1,200
  ├── Recommendation:      CONSIDER — good for midstream segment specifically
  └── Pipeline Targets:    MPLX, EQT Midstream, Crestwood, Summit

  [May 12-14] AGA Operations Conference — Location TBD
  ├── Buyer Density:       3/5 (gas utility operations leadership)
  ├── Competitor Presence: 4/5 (major engineering firms exhibit heavily)
  ├── Speaking Oppty:      2/5 (competitive application process)
  ├── Attendance Cost:     ~$2,000
  ├── Recommendation:      MONITOR — attend if AEP or Columbia Gas confirmed
  └── Pipeline Targets:    AEP Ohio, Columbia Gas, Duke Energy Ohio

  [Jun 16-18] Hart Energy DUG East — Pittsburgh, PA
  ├── Buyer Density:       5/5 (highest concentration of Appalachian operators)
  ├── Competitor Presence: 4/5 (major firms exhibit)
  ├── Speaking Oppty:      3/5 (panel opportunities available)
  ├── Attendance Cost:     ~$1,500
  ├── Recommendation:      ATTEND — must-attend for Appalachian Basin coverage
  └── Pipeline Targets:    Nearly all upstream and midstream pipeline targets

  [Sep 8-10] Turbomachinery Symposium — Houston, TX
  ├── Buyer Density:       2/5 (specialized audience, less Ohio relevance)
  ├── Competitor Presence: 4/5 (major engineering firms dominate)
  ├── Speaking Oppty:      3/5 (technical paper submission)
  ├── Attendance Cost:     ~$3,000 (Houston travel)
  ├── Recommendation:      SKIP — low ROI for Ohio energy focus
  └── Pipeline Targets:    Limited Ohio overlap

  [Nov 3-5] POWER-GEN International — Location TBD
  ├── Buyer Density:       3/5 (power generation and utility operations)
  ├── Competitor Presence: 5/5 (all major firms exhibit)
  ├── Speaking Oppty:      3/5 (large conference, many tracks)
  ├── Attendance Cost:     ~$2,500
  ├── Recommendation:      CONSIDER — attend if utility segment shows traction
  └── Pipeline Targets:    AEP, Duke Energy, FirstEnergy

  ATTENDANCE BUDGET — 2026
  ├── Must Attend: OOGA Annual Meeting, DUG East ($2,300 total)
  ├── Consider:    COGA Midstream, POWER-GEN ($3,700 total)
  ├── Skip:        Turbomachinery Symposium
  └── Total Budget: $2,300-$6,000 depending on traction
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Economic Indicator Dashboard

Macro indicators that predict consulting demand in the Ohio energy market. Updated monthly.

```
  ECONOMIC INDICATORS — February 2026
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Indicator               Value           MoM Change    Implication
  ├── WTI Crude Oil       ~$72/bbl        Stable        Supports drilling programs, not boom-level
  ├── Henry Hub Nat Gas   ~$3.25/MMBtu    Stable        Above breakeven for Utica/Marcellus wells
  ├── PJM Avg Power       ~$45/MWh        Stable        Supports generation investment
  ├── Ohio Unemployment   ~4.0%           Stable        Tight labor = consulting demand
  ├── Fed Funds Rate      ~4.50%          Stable        Elevated but expected to decline H2 2026
  ├── Ohio Rig Count      ~18 rigs        Stable        Moderate activity, not peaking
  ├── Permit Applications Pending         Pending       Need to source this data from ODNR
  └── Steel Price Index   Elevated        Rising        Tariff effect — raises pipeline construction costs

  DEMAND SIGNAL MATRIX:
  ├── Oil >$70 + Gas >$3.00     = Bullish for upstream capex          [ACTIVE]
  ├── Low unemployment           = Hiring difficulty = consulting      [ACTIVE]
  ├── Rising interest rates      = Slower capex, fewer new projects    [MODERATE RISK]
  ├── Rising steel prices        = Higher project costs, potential delays [WATCH]
  ├── Increasing permits         = Leading indicator of construction    [DATA NEEDED]
  └── Falling rig count          = Bearish for upstream consulting      [NOT ACTIVE]

  Overall Market Signal: MODERATELY BULLISH
  ├── Commodity prices support activity
  ├── Labor tightness supports consulting demand
  ├── Tariff/steel costs are headwinds but not deal-breakers
  └── Rate cuts in H2 2026 could unlock deferred capex
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Intelligence Source Effectiveness

Which intelligence sources produce the most actionable market intel? Track and optimize.

```
  SOURCE EFFECTIVENESS — Ohio Energy (Feb 2026 baseline)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Source              Triggers Found    Verified Accurate    Actionable    Efficiency
  ├── SEC/EDGAR            8                 7 (88%)            6             75%
  ├── PUCO Dockets         5                 4 (80%)            3             60%
  ├── Company IR Pages     6                 5 (83%)            4             67%
  ├── Trade Press          9                 6 (67%)            5             56%
  ├── LinkedIn Activity    4                 3 (75%)            2             50%
  ├── JobsOhio / ODNR      2                 2 (100%)           1             50%
  ├── Job Boards           3                 1 (33%)            1             33%
  ├── WebSearch General   12                 8 (67%)            6             50%
  └── TOTAL              49*                36 (73%)           28             57%

  * Some triggers found in multiple sources; deduplicated pipeline = 32 leads

  Top Sources (prioritize monitoring):
  1. SEC/EDGAR — highest accuracy, most actionable for M&A and CAPEX triggers
  2. Company IR Pages — direct source, reliable, good for earnings and capex signals
  3. Trade Press — high volume but lower accuracy, needs verification

  Bottom Sources (deprioritize or refine):
  1. Job Boards — lowest accuracy, highest false positive rate
  2. LinkedIn — useful for enrichment but not primary trigger detection
  3. General WebSearch — high volume but noisy, use as verification layer

  Source Mix Recommendation:
  ├── Daily monitoring: SEC/EDGAR, Company IR, Trade Press (top 3)
  ├── Weekly monitoring: PUCO Dockets, LinkedIn, Job Boards
  ├── Trigger verification: WebSearch (use to verify, not discover)
  └── Periodic: JobsOhio/ODNR, Industry associations
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Competitive Intelligence — Ohio Energy

```
  COMPETITIVE LANDSCAPE — Ohio Energy Market
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Tier 1 — National Engineering/Consulting Firms (established, large teams)
  ├── Burns & McDonnell
  │   ├── Ohio Presence: Columbus and regional offices
  │   ├── Strengths: Full-service EPC, utility relationships, scale
  │   ├── Weakness: Expensive, slow to mobilize, generic approach
  │   └── Threat Level: High for utility segment, Medium for upstream
  ├── Black & Veatch
  │   ├── Ohio Presence: Regional coverage from Midwest offices
  │   ├── Strengths: Power generation expertise, utility planning
  │   ├── Weakness: Less upstream/midstream focus in Ohio
  │   └── Threat Level: High for utility, Low for upstream
  └── Stantec
      ├── Ohio Presence: Columbus office
      ├── Strengths: Environmental, permitting, infrastructure
      ├── Weakness: Less operational consulting, more design/engineering
      └── Threat Level: Medium across all segments

  Tier 2 — Regional Specialty Firms (our primary competition)
  ├── Montrose Environmental
  │   ├── Focus: Environmental compliance and remediation
  │   ├── Weakness: Narrow focus, no project controls or turnaround capability
  │   └── Threat Level: Low (different service offering)
  ├── GHD (Columbus office)
  │   ├── Focus: Environmental, water, infrastructure
  │   ├── Weakness: Not focused on energy operations consulting
  │   └── Threat Level: Low
  └── Regional independents
      ├── Numerous 1-5 person consulting shops
      ├── Compete on price and relationships, not capability
      └── Threat Level: Medium (established relationships in niche segments)

  Competitive Advantage — JRW:
  ├── Operator-first credibility (ran operations, not just advised)
  ├── Trigger-based speed (reach targets before competitors know about the event)
  ├── Mid-market focus (too small for nationals, too sophisticated for independents)
  └── Specific deliverables (integration playbook, queue diagnostic, controls audit)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Monthly Market Intelligence Summary

### Market Intelligence Summary — February 2026

```
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MARKET INTELLIGENCE — February 2026
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Key Developments
  ├── AEP interconnection queue cleared from 30GW to 13GW — remaining
  │   projects are real, creating structural demand for utility consulting
  ├── Infinity/Antero acquisition closed Feb 23 — 90-day integration
  │   window is open, highest-urgency consulting opportunity in pipeline
  └── Commodity prices stable at levels that support continued drilling
      and infrastructure investment without triggering boom-phase spending

  Market Direction: Expanding (moderate pace)
  Pipeline Impact: Positive — M&A and infrastructure investment
                   are active demand drivers for consulting

  Recommended Actions
  ├── Begin outreach to top 10 leads (Score 80+) in March 2026
  ├── Attend OOGA Annual Meeting (Mar 15-17) for in-person contact
  │   with upstream operators
  └── Monitor tariff/steel price developments — could shift capex
      timeline for midstream pipeline projects

  Intelligence Gaps to Fill
  ├── Ohio ODNR permit application data (leading indicator)
  ├── AEP Ohio IRP timeline and scope (utility segment planning)
  ├── Encino Energy capital program details (largest private operator)
  └── PBF Toledo turnaround exact schedule (H2 2026 — need month)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
