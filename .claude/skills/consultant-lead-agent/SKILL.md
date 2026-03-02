---
name: consultant-lead-agent
version: 1.0
description: "Evidence-backed consulting lead pipeline agent. Use when building a ranked, CRM-ready pipeline of near-term consulting opportunities in a target market. Runs 8-step intelligence workflow: market map, trigger radar, lead scoring, pipeline build, outreach sequences, landing pages, competitive intelligence, and executive brief. Orchestrates /research-tools, /positioning-angles, /brand-voice, /email-sequences, /direct-response-copy, and /creative through a defined pipeline. Triggers on: build lead pipeline, find consulting leads, consultant lead agent, sales pipeline, business development pipeline, consulting opportunities. Reads: voice-profile.md, positioning.md, audience.md, competitors.md, stack.md. Writes: ./campaigns/{agent-name}/deliverable-*.md, ./campaigns/{agent-name}/deliverable-*.csv, assets.md, learnings.md. Chains to: /email-sequences for outreach, /direct-response-copy for landing pages, /creative for visual assets."
---

# Consultant Lead Agent

A consultant lead agent is not a research project. It is a revenue machine. Most consulting business development efforts produce "research summaries" that sit in a drawer -- industry overviews that make the author feel productive but generate zero pipeline. The output looks impressive. It goes nowhere. No ranked leads. No outreach sequences. No landing pages. No next actions with deadlines. Just a PDF that confirms what the consultant already knew about their market.

This skill produces something different: a scored, ranked, CRM-ready pipeline with trigger evidence, outreach assets, and 48-hour next actions attached to every lead. The pipeline is not a list of companies that exist in your market. It is a list of companies that need you right now, ranked by how winnable they are, with the proof and the messaging already built.

The consultant lead agent does not duplicate what other skills do. It orchestrates them. When the engine needs outreach emails, it calls /email-sequences with the trigger data and voice profile pre-loaded. When it needs landing page copy, it calls /direct-response-copy with the diagnostic offer specs. When it needs competitive positioning, it reads the output of /positioning-angles. Every skill in the system was built to work standalone. The consultant lead agent wires them into a pipeline.

Read `./brand/` per `_system/brand-memory.md`

Follow all output formatting rules from `_system/output-format.md`

---

## Brand Memory Integration

This skill reads brand context to ensure every deliverable -- from the market map to the executive brief -- speaks in the brand's voice and builds on established positioning. It also enforces a hard dependency: positioning.md must exist before the engine runs, because the packaged offers defined there drive the entire scoring and outreach workflow.

**Reads:** `voice-profile.md`, `positioning.md`, `audience.md`, `competitors.md`, `stack.md`

On invocation, check for `./brand/` and load available context:

1. **Load `positioning.md`** (REQUIRED):
   - This file defines the packaged offers, differentiation wedges, and target buyer profiles
   - The engine cannot score leads without knowing what you sell and how you differentiate
   - If positioning.md does not exist, stop and route:

   ```
   ┌──────────────────────────────────────────────┐
   │                                              │
   │  ✗ POSITIONING NOT FOUND                     │
   │                                              │
   │  The consultant lead agent needs your packaged offers  │
   │  and differentiation wedges to score leads   │
   │  and build outreach. These live in           │
   │  positioning.md.                             │
   │                                              │
   │  → /positioning-angles  Build it (~15 min)   │
   │  → Cannot proceed without this file.         │
   │                                              │
   └──────────────────────────────────────────────┘
   ```

   - If it exists: "Your positioning defines [N] packaged offers and [N] differentiation wedges. Using those as the scoring and outreach foundation."

2. **Load `voice-profile.md`** (if exists):
   - Match the brand's tone, vocabulary, and rhythm in all outreach copy, messaging kits, and executive briefs
   - Apply voice DNA to email openers, LinkedIn notes, and discovery call agendas
   - Show: "Your voice is [tone summary]. All outreach assets will match that register."

3. **Load `audience.md`** (if exists):
   - Use buyer segments, pain points, and decision-making patterns to inform lead scoring and outreach personalization
   - Show: "Writing for [audience summary]. Targeting [buyer titles]."

4. **Load `competitors.md`** (if exists):
   - Use known competitors as intelligence targets for the competitive brief (Deliverable F)
   - Show: "Found [N] competitors in brand memory. Using them as competitive scan seeds."

5. **Load `stack.md`** (if exists):
   - Detect available research tools: Perplexity MCP, Firecrawl MCP, Playwright MCP
   - Detect CRM integrations for pipeline export
   - Show: "Stack loaded. [N] research tools available."

6. **If `./brand/` does not exist:**
   - Skip brand loading entirely. Do not error.
   - Note: "I don't see a brand profile yet. The consultant lead agent works best with positioning and voice defined. Run /positioning-angles first to set up your packaged offers, then come back."

### Context Loading Display

Show the user what was loaded using the standard tree format:

```
  Brand context loaded:
  ├── Positioning       ✓ [N] packaged offers, [N] wedges
  ├── Voice Profile     ✓ "[tone summary]"
  ├── Audience          ✓ "[audience summary]"
  ├── Competitors       ✓ [N] competitors
  ├── Stack             ✓ [N] research tools
  └── Learnings         ✓ [N] entries

  Using this to shape lead scoring, outreach
  copy, and competitive positioning.
```

If files are missing, show them as missing with a suggestion:

```
  ├── Audience          ✗ not found
  │   → Proceeding with defaults from positioning
  │   → /audience-research to build one (~15 min)
```

---

## Skill Orchestration Map

The consultant lead agent is an orchestrator. Each step calls the right skill at the right time with the right context pre-loaded. No skill runs blind. No skill runs redundantly.

```
  STEP 0 (Setup):
  /brand-switch → /preflight → Load brand memory

  STEP 1 (Map):
  /research-tools (Perplexity) → Deliverable A

  STEP 2 (Mine):
  /research-tools (Firecrawl) → Deliverables B1, B2

  STEP 3 (Triggers):
  /research-tools (Perplexity + Firecrawl) → Deliverable C

  STEP 4 (Pipeline):
  Internal scoring + ranking → Deliverable D

  STEP 5a (Outreach):
  /email-sequences → Deliverable I

  STEP 5b (Landing):
  /direct-response-copy → Deliverable J

  STEP 6 (Compete):
  /research-tools (Playwright) → Deliverable F

  STEP 7 (Message):
  Voice from /brand-voice → Deliverable G

  STEP 8 (Brief):
  Synthesis → Deliverable H

  ARTIFACTS:
  Internal → Deliverables E1-E4
```

When the consultant lead agent needs outreach emails, it calls /email-sequences with the trigger data and voice profile pre-loaded. When it needs landing page copy, it calls /direct-response-copy with the diagnostic offer specs from positioning.md. When it needs competitive intelligence, it calls Playwright to scrape competitor sites and Perplexity to analyze positioning gaps. Each skill receives only the context it needs per the Context Matrix in CLAUDE.md.

---

## Research Mode Signal

Every invocation of the consultant lead agent MUST display its research mode before producing any deliverable. The user must always know whether they are getting live intelligence or estimated analysis.

**When research MCPs are available:**
```
  RESEARCH MODE
  ├── Perplexity MCP     ✓ connected
  ├── Firecrawl MCP      ✓ connected
  ├── Playwright MCP     ✓ connected
  ├── WebSearch          ✓ connected
  └── Data quality: LIVE
```

**When some MCPs are missing:**
```
  RESEARCH MODE
  ├── Perplexity MCP     ✓ connected
  ├── Firecrawl MCP      ✗ not available
  ├── Playwright MCP     ✗ not available
  ├── WebSearch          ✓ connected (fallback)
  └── Data quality: LIVE (reduced depth)
      Firecrawl unavailable -- will use WebSearch
      for site-specific intelligence. Depth limited.
```

**When NO research tools are available:**
```
  RESEARCH MODE
  ├── Perplexity MCP     ✗ not available
  ├── Firecrawl MCP      ✗ not available
  ├── Playwright MCP     ✗ not available
  ├── WebSearch          ✗ not available
  ├── Data quality: ESTIMATED
  │   Using conceptual analysis based on brand
  │   context and training data. Leads, triggers,
  │   and competitive intelligence are directional,
  │   not verified.
  └── To upgrade:
      → Connect Perplexity, Firecrawl, or Playwright
        MCP servers for live market intelligence
      → Or ask me to proceed -- I will flag
        estimates clearly in every deliverable.
```

### Research Mode Rules

1. Always show this signal. Never silently fall back to training knowledge.
2. Resolution order: Perplexity MCP first, then Firecrawl MCP, then Playwright MCP, then WebSearch, then training knowledge as last resort with ESTIMATED flag.
3. When using estimated data, prefix research-dependent claims with ~ to indicate estimates: "~$2B annual Ohio pipeline replacement spend" vs "$2.1B annual Ohio pipeline replacement spend (PHMSA 2025)."
4. Ask the user before proceeding with estimated data: "I don't have live research tools connected. I can produce a directional pipeline using what I know, but live data produces significantly better leads. Proceed or set up research tools first?"

---

## Business Context

The consultant lead agent operates in two modes — external pipeline building (new logos and account growth for IG Consulting's Utilities, Oil & Gas business) and internal capability positioning (143 Leadership as IG's proprietary development platform). Both modes run from the same intelligence engine with shared memory.

### Default Configuration

```
  Business Context (overridable defaults)

  OPERATING ENTITY
  ├── Company:     Insight Global (IG Consulting)
  ├── Division:    Technical Services → Utilities, Oil & Gas
  ├── Position:    Industry Business Unit (1 of 7 under Tech Delivery)
  ├── Scale:       ~120 active projects, ~20 customers, ~$80M+ PG&E alone
  └── Status:      Rebranding Evergreen → IG Consulting (April 2026)

  ACCOUNT ORGANIZATION (per Trevor Silva blueprint)
  ├── Key Accounts:        PG&E (70+ projects), major IOUs
  │   Leader: Director, Key Accounts
  ├── Investment/Established: Xcel Energy, NNG, growing accounts (5-6 SOWs)
  │   Leader: Assoc. Director, Investment & Established
  └── Setup/New Logo:      Duke Energy, new prospects, oil & gas greenfield
      Leader: Director, Setup & New Logo

  Geography
  ├── Primary:    Nationwide (IG operates across US)
  ├── Core:       Ohio, California (PG&E), Minnesota (Xcel), Nebraska (NNG)
  ├── Expansion:  Oil & gas (no current presence — stretch goal)
  └── Market map: Natural gas, electric, water/wastewater utilities + oil & gas

  SERVICE CAPABILITIES (technical solution domains)
  ├── Applied Engineering & GIS     95% of current U,O&G business
  ├── Data & AI                     < 3% — massive growth opportunity
  ├── Cloud                         < 1% — emerging capability
  ├── Applications                  < 1% — emerging capability
  └── Customer Experience (CX)      < 1% — emerging capability

  Target Deal Profile
  ├── Entry:      Contract-based SOWs (avg ~8 months duration)
  ├── Growth:     Extension + scope expansion within existing accounts
  ├── New logo:   Small initial engagement → prove value → extend
  ├── Retainers:  Steady-state service contracts (3-5 years for key accounts)
  └── Strategy:   Deliver elite quality → extend → get referred → new contract → scale

  DIFFERENTIATION WEDGES
  ├── Wedge 1: Not Staffing — Technical Consulting
  │   "We don't fill seats. We own deliverables.
  │   We consult on best practices. We understand
  │   your OKRs and organize our delivery around them."
  ├── Wedge 2: Human Connection + Shared Values
  │   Compete with Deloitte/Accenture on technical
  │   capability but differentiate through customer
  │   service, partnership, and relationship depth.
  ├── Wedge 3: Capacity Development Methodology (143)
  │   "We don't just place consultants. We measure
  │   their capacity, train their growth, and track
  │   their development quarterly. Here's the data."
  └── Wedge 4: Industry-Dedicated Delivery
      "Our delivery team is organized to YOUR industry
      and YOUR account. Not a shared pool. Dedicated."
```

### Transformation Context (from Trevor Silva All-Hands, Feb 25, 2026)

```
  IG CONSULTING TRANSFORMATION

  Current state:  $4.5B company, ~$700M in consulting (Evergreen)
  Target state:   Globally recognized technical consulting organization
  Aspiration:     Compete with Deloitte ($70.5B), Accenture ($64B)
  Differentiator: Technical capability + human connection + shared values
  Timeline:       10-15 year transformation, consulting becomes primary
  Core priority:  Elite delivery (2026 company priority #1)

  GROWTH FORMULA (proven — built $200M engineering practice from 1 contract)
  1. Do a great job on current engagement
  2. Customer extends the contract
  3. Customer refers you to a peer
  4. Win second contract
  5. Scale delivery team, promote from within
  6. Repeat across accounts

  SHARED VALUES
  ├── Everyone matters
  ├── We take care of each other
  ├── Leadership is here to serve
  ├── High character and hard work above all else
  └── Always know where you stand

  NAMED GAPS
  ├── Market perception: "50-60% of the time they think staffing"
  ├── Tools: "Immaturity and infancy of systems and tools"
  ├── Development: "Culture of development — historically broken, haphazard"
  ├── Services: "95% in engineering — massive room for other capabilities"
  └── Oil & gas: "No current presence — massive sales strategy underway"
```

### Ethics Guardrails

```
  Research Ethics
  ├── Public sources only (SEC, PUCO, FERC, ODNR,
  │   PJM, JobsOhio, LinkedIn, press releases,
  │   industry publications)
  ├── No PII collection (no personal phone numbers,
  │   home addresses, or private social media)
  ├── Respect robots.txt and rate limits on all
  │   scraped sources
  ├── No fabricated trigger events or evidence
  └── Every claim must cite a verifiable source URL
```

---

## Packaged Offers Registry

The consultant lead agent scores leads against packaged offers. These offers are defined in positioning.md and take precedence over the defaults below. If positioning.md contains different offers, use those. The defaults here exist for first-run scenarios and as a structural reference.

**IG Consulting Service Lens:** When scoring offers, consider ALL 5 technical solution domains — not just engineering. A lead that doesn't fit engineering offers A-F may fit a data/AI, cloud, apps, or CX engagement. Cross-domain leads are flagged in the service expansion playbook (Deliverable L).

### Offer A: Utility Interconnection Queue Diagnostic

```
  Offer A: INTERCONNECTION QUEUE DIAGNOSTIC
  ├── Scope:       4-week audit of utility developer
  │                interconnection intake and processing
  ├── Deliverables: Process map, error taxonomy, SLA
  │                gap analysis, throughput roadmap
  ├── Target buyer: Director of Interconnection Services,
  │                VP of Grid Operations at Ohio IOUs
  ├── Price signal: $75K-$125K fixed fee
  └── Expansion:   Ongoing throughput management retainer
                   ($15K-$25K/month)
```

### Offer B: Post-Acquisition Field Integration Sprint

```
  Offer B: FIELD INTEGRATION SPRINT
  ├── Scope:       6-week post-acquisition operations
  │                integration program
  ├── Deliverables: Operational assessment, unified
  │                framework, contractor rebasing,
  │                90-day monitoring plan
  ├── Target buyer: VP of Operations, Integration Office
  │                Lead at Ohio Utica operators
  ├── Price signal: $150K-$225K fixed fee
  └── Expansion:   Vendor performance management retainer
```

### Offer C: Turnaround Readiness Assessment

```
  Offer C: TURNAROUND READINESS ASSESSMENT
  ├── Scope:       4-week pre-turnaround diagnostic
  │                conducted 6-9 months before wrench turn
  ├── Deliverables: Scope maturity assessment, contractor
  │                competitiveness review, schedule realism
  │                check, readiness scorecard
  ├── Target buyer: Turnaround Manager, VP of Operations
  │                at Ohio refineries and processing plants
  ├── Price signal: $50K-$85K fixed fee
  └── Expansion:   Full turnaround PMO ($250K-$500K+)
```

### Offer D: Pipeline Replacement Program Governance

```
  Offer D: PIPELINE PROGRAM GOVERNANCE
  ├── Scope:       Quarterly program health assessment for
  │                gas LDC infrastructure replacement
  ├── Deliverables: Contractor productivity benchmarks,
  │                quality metrics, restoration backlog
  │                analysis, PHMSA documentation audit
  ├── Target buyer: VP of Capital Delivery, Director of
  │                Pipeline Replacement at Ohio gas LDCs
  ├── Price signal: $60K-$100K per quarterly assessment
  └── Expansion:   Embedded program governance retainer
```

### Offer E: Incentive Capture and Documentation

```
  Offer E: INCENTIVE CAPTURE DIAGNOSTIC
  ├── Scope:       4-week audit of eligible state/federal
  │                incentive programs for active or planned
  │                Ohio energy capital projects
  ├── Deliverables: Incentive eligibility matrix, application
  │                readiness assessment, documentation gap
  │                analysis, capture timeline with deadlines
  ├── Target buyer: CFO, VP of Business Development,
  │                Director of Government Affairs
  ├── Price signal: $40K-$75K fixed fee (or % of captured)
  └── Expansion:   Ongoing incentive compliance monitoring
```

### Offer F: Operational Excellence Diagnostic

```
  Offer F: OPERATIONAL EXCELLENCE DIAGNOSTIC
  ├── Scope:       6-week assessment of project controls,
  │                contractor management, and reporting
  │                maturity for energy operations
  ├── Deliverables: Maturity assessment across 20+
  │                dimensions, gap analysis, improvement
  │                roadmap with quick wins and strategic
  │                initiatives, benchmark vs industry
  ├── Target buyer: COO, VP of Operations, Director of
  │                Project Controls
  ├── Price signal: $100K-$175K fixed fee
  └── Expansion:   Implementation support retainer
```

---

## Lead Scoring Model

Every lead receives a composite score (0-100) and a confidence rating (1-5). The score determines pipeline ranking. The confidence rating determines how much you trust the score.

### Scoring Weights

```
  Lead Score (0-100)

  Trigger Recency                    0-30 points
  ├── Trigger within 30 days              30
  ├── Trigger within 90 days              20
  ├── Trigger within 180 days             10
  └── Trigger older than 180 days          0

  Budget Signal Strength             0-25 points
  ├── Public capex disclosure (SEC, PUCO)  25
  ├── Capital program announcement         20
  ├── Hiring for relevant roles            15
  ├── RFP/RFI issued                       25
  ├── Industry segment implies budget      10
  └── No budget signal                      0

  Package Fit                        0-25 points
  ├── Clear fit to 1 packaged offer        15
  ├── Clear fit to 2+ packaged offers      25
  ├── Partial fit (needs customization)    10
  └── No clear fit                          0

  Reachability                       0-10 points
  ├── Named contact identified             10
  ├── Title-level target identified         7
  ├── Company only (no contact path)        3
  └── No reachability signal                0

  Competitive Density Risk           0-10 NEGATIVE
  ├── No known competitor engagement        0
  ├── 1-2 competitors active               -5
  └── 3+ competitors or incumbent lock    -10
```

### Confidence Rating

```
  Confidence (1-5)

  5  Three or more independent public sources
     confirm the trigger and budget signal
  4  Two independent public sources confirm
  3  One strong public source plus reasonable
     inference from industry context
  2  Single source, inference-heavy
  1  Training knowledge or estimated data only
```

---

## Pipeline Stages and Movement Rules

Every lead enters the pipeline at Discover and moves forward based on clear criteria. No lead skips stages. No lead moves without evidence.

```
  Pipeline Stages

  DISCOVER
  ├── Entry:    Lead identified from research
  ├── Evidence: Company name + Ohio footprint +
  │            at least 1 trigger event
  └── Exit:     Passes relevance gate (see below)

  QUALIFY
  ├── Entry:    Passed relevance gate
  ├── Evidence: 2+ public sources, trigger within
  │            180 days, fit to 1-2 packaged offers,
  │            score calculated
  └── Exit:     Score >= 50 AND target buyer title
               identified

  WARM INTRO
  ├── Entry:    Score >= 50, buyer identified
  ├── Evidence: Outreach angle defined, email/LinkedIn
  │            message drafted, warm intro path mapped
  └── Exit:     First touch sent or intro requested

  MEETING SET
  ├── Entry:    Response received or meeting scheduled
  ├── Evidence: Calendar hold or confirmed conversation
  └── Exit:     Meeting completed, next steps defined

  PROPOSAL LIKELY
  ├── Entry:    Meeting completed, mutual fit confirmed
  ├── Evidence: Proposal scope discussed, budget range
  │            confirmed, decision timeline known
  └── Exit:     Proposal submitted or disqualified
```

---

## Relevance Gate

A lead qualifies for the PIPELINE only if ALL four criteria are met. This is a hard gate. Do not soften it.

```
  Relevance Gate (ALL must pass)

  ├── Ohio footprint confirmed
  │   Company has operations, assets, projects,
  │   or investment commitments in Ohio
  │
  ├── Trigger event within 180 days
  │   A verifiable event creating near-term need:
  │   acquisition, capital program, regulatory filing,
  │   leadership change, expansion announcement,
  │   turnaround cycle, interconnection backlog
  │
  ├── Two or more public sources
  │   The trigger must be corroborated by at least
  │   2 independent, citable public sources
  │
  └── Clear fit to 1-2 packaged offers
      The lead's situation maps to at least one
      offer in the Packaged Offers Registry

  FAILS GATE → Research Candidates list
  (tracked separately, revisited on weekly refresh)
```

---

## Data Model (CSV Schema)

The lead pipeline CSV (Deliverable D) uses this exact 19-column schema. Every lead must have every column populated. Use "N/A" for fields without available data, never leave blank.

```
  Column                          Type
  ────────────────────────────────────────
  Company                         text
  Segment                         text
  IG_Account_Bucket               text (Key / Investment / Setup / New Logo / N/A)
  Current_IG_Relationship         text (Active SOW / Former / None)
  Footprint                       text
  Trigger_Event                   text
  Trigger_Date                    YYYY-MM-DD
  Source_URLs                     text (pipe-delimited)
  Problem_1                       text
  Problem_2                       text
  Problem_3                       text
  Problem_4                       text
  Problem_5                       text
  Evidence_vs_Inferred_Flags      text (E/I per problem)
  Recommended_Package_Offers      text (A-F codes)
  Service_Domains                 text (ENG/DATA/CLOUD/APPS/CX)
  Deliverables_Summary            text
  Target_Titles                   text
  Outreach_Angle                  text
  Score_0_to_100                  integer
  Confidence_1_to_5               integer
  Stage                           text
  Next_Action_48hrs               text
  Customer_OKR_Alignment          text (which customer objective this serves)
  Procurement_Path                text
  Partner_Intro_Idea              text
  Extension_Potential             text (LOW / MEDIUM / HIGH / N/A)
  Notes                           text
```

### Evidence vs Inferred Flags

For each problem listed (Problem_1 through Problem_5), mark whether it is:
- **E** (Evidence): Stated explicitly in a public source
- **I** (Inferred): Reasonably inferred from the trigger event or industry context

Example: "E|E|I|I|E" means problems 1, 2, 5 are evidence-backed; problems 3, 4 are inferred.

---

## Operating Workflow (8 Steps)

Each step specifies what it does, which skill it calls, what deliverables it produces, what it reads from brand memory, and what it writes to disk.

### Step 0: Setup

```
  STEP 0: SETUP
  ├── What:     Select brand, verify tools, load context
  ├── Calls:    /brand-switch → /preflight
  ├── Reads:    ALL brand memory files
  ├── Writes:   Nothing (setup only)
  └── Output:   Brand context tree + research mode signal
```

Confirm brand selection. Run preflight to verify research tool connections. Display brand context loading tree. Display research mode signal. If positioning.md is missing, stop and route to /positioning-angles.

### Step 1: Map the Market

```
  STEP 1: MAP THE MARKET
  ├── What:     Build the opportunity landscape
  ├── Calls:    Perplexity MCP (or WebSearch fallback)
  ├── Reads:    positioning.md (industries, geography)
  ├── Writes:   deliverable-A-opportunity-map.md
  └── Produces: Deliverable A — Opportunity Map
```

Research queries:
- Active energy companies with Ohio operations by segment
- Recent M&A, expansions, and capital programs in Ohio energy
- Regulatory proceedings at PUCO, FERC, ODNR affecting Ohio energy
- JobsOhio energy-sector announcements and incentive programs
- PJM interconnection queue activity in Ohio zones

Deliverable A maps the market by segment: upstream, midstream, refining, electric utility, gas utility, data center, renewable. Each entry includes company name, Ohio footprint description, recent activity, and potential relevance to packaged offers.

### Step 2: Mine Intelligence Sources

```
  STEP 2: MINE INTELLIGENCE SOURCES
  ├── What:     Deep-scrape high-value intelligence sources
  ├── Calls:    Firecrawl MCP (or WebSearch fallback)
  ├── Reads:    positioning.md (wedge definitions)
  ├── Writes:   deliverable-B1-jobsohio-wins.md
  │             deliverable-B2-jobsohio-conversion-notes.md
  └── Produces: Deliverables B1, B2
```

Primary targets:
- JobsOhio project announcements and press releases
- PUCO docket filings and commission entries
- PJM interconnection queue data for Ohio zones
- SEC filings mentioning Ohio operations (10-K, 10-Q, 8-K)
- Industry publication coverage (Oil & Gas Journal, Utility Dive, S&P Global)

Deliverable B1 catalogs recent JobsOhio energy-sector wins with company names, investment amounts, job commitments, and project descriptions. Deliverable B2 converts those wins into conversion notes -- which wins signal consulting needs and which packaged offers apply.

### Step 3: Build the Trigger Radar

```
  STEP 3: BUILD THE TRIGGER RADAR
  ├── What:     Identify time-sensitive trigger events
  ├── Calls:    Perplexity MCP + Firecrawl MCP
  ├── Reads:    Deliverables A, B1, B2
  ├── Writes:   deliverable-C-trigger-log.md
  └── Produces: Deliverable C — Trigger Log
```

Trigger categories:
- Acquisition announced or closed (integration window)
- Capital program announced or expanded
- Regulatory filing submitted (creates compliance needs)
- Leadership change (new VP/Director = new priorities)
- Turnaround cycle approaching (based on known schedules)
- Interconnection backlog growing (PJM queue data)
- Expansion or new facility announced
- RFP/RFI issued for consulting or technical services
- JobsOhio incentive awarded (signals active investment)
- Workforce reduction or restructuring (creates capability gaps)

Each trigger entry includes: company, event description, date, source URLs, assessed urgency (HIGH / MEDIUM / LOW), and which packaged offers the trigger maps to.

### Step 4: Score, Rank, and Build the Pipeline

```
  STEP 4: SCORE, RANK, BUILD PIPELINE
  ├── What:     Apply scoring model, rank leads, build CSV
  ├── Calls:    Internal (no external skill)
  ├── Reads:    Deliverables A, B1, B2, C + scoring model
  ├── Writes:   deliverable-D-lead-pipeline.csv
  │             deliverable-D-top10-summary.md
  │             deliverable-D-hardened-intelligence.md
  │             research-candidates.md
  └── Produces: Deliverable D — Lead Pipeline
```

Process:
1. Compile all companies from Steps 1-3 into candidate list
2. Apply relevance gate to each candidate
3. Passing candidates: score using the Lead Scoring Model
4. Failing candidates: route to research-candidates.md
5. Rank passing leads by composite score (descending)
6. Build the 19-column CSV with every field populated
7. Write top-10 summary with detailed narratives per lead
8. Write hardened intelligence brief with evidence audit

Target: 25-50 ranked leads in the pipeline. Minimum 10 with trigger events within 180 days.

### Step 5a: Build Outreach Sequences

```
  STEP 5a: BUILD OUTREACH SEQUENCES
  ├── What:     Create email and LinkedIn outreach assets
  ├── Calls:    /email-sequences
  ├── Reads:    voice-profile.md, positioning.md,
  │             Deliverables C, D, G
  ├── Writes:   deliverable-I-outreach-sequences.md
  └── Produces: Deliverable I — Outreach Sequences
```

For each segment represented in the top-10 leads, generate:
- 3 email openers (trigger-specific, outcome-focused, 3-4 sentences)
- 3 LinkedIn connection notes (under 300 characters)
- 1 follow-up sequence template (3 emails: initial, value-add, meeting request)

Each outreach asset references a specific trigger from Deliverable C and a specific packaged offer from positioning.md. No generic outreach. Every message has a reason, a reference, and a clear next step.

### Step 5b: Build Landing Page Copy

```
  STEP 5b: BUILD LANDING PAGE COPY
  ├── What:     Create diagnostic offer landing pages
  ├── Calls:    /direct-response-copy
  ├── Reads:    voice-profile.md, positioning.md,
  │             Deliverables D, G
  ├── Writes:   deliverable-J-landing-page-copy.md
  └── Produces: Deliverable J — Landing Page Copy
```

For the top 2-3 packaged offers that appear most frequently in the pipeline, generate landing page copy following /direct-response-copy methodology:
- Outcome-focused headline (not capability claims)
- Problem quantification with industry-specific math
- Diagnostic engagement description with defined deliverables
- Proof elements (if available from brand memory)
- Single CTA: schedule a scoping conversation

### Step 6: Competitive Intelligence

```
  STEP 6: COMPETITIVE INTELLIGENCE
  ├── What:     Map competitor positioning and gaps
  ├── Calls:    Playwright MCP (or WebSearch fallback)
  ├── Reads:    competitors.md, positioning.md
  ├── Writes:   deliverable-F-competitor-brief.md
  └── Produces: Deliverable F — Competitor Brief
```

For each known competitor and any competitors discovered during Steps 1-3:
- Scrape their website messaging (service pages, about, case studies)
- Catalog their positioning language and claims
- Identify saturated angles they all share
- Map white-space opportunities they collectively miss
- Note specific messaging phrases to avoid (because they are generic)

Deliverable F is structured as: competitor profiles, shared positioning patterns, saturated angles catalog, white-space map, and recommended differentiation language.

### Step 7: Messaging Kit

```
  STEP 7: MESSAGING KIT
  ├── What:     Arm BD with positioning bullets, openers,
  │             LinkedIn notes, discovery call agendas
  ├── Calls:    /brand-voice (for voice injection)
  ├── Reads:    voice-profile.md, positioning.md,
  │             Deliverables C, D, F
  ├── Writes:   deliverable-G-messaging-kit.md
  └── Produces: Deliverable G — Messaging Kit
```

The messaging kit includes:
- 6 positioning bullets (outcomes-focused, not capability claims)
- 3 email openers per target segment
- 3 LinkedIn connection notes per target segment
- 3 discovery call agendas (structured around buyer pain, not seller pitch)
- Saturated phrases to never use (sourced from Deliverable F)

Every message in the kit demonstrates the differentiation wedges. No generic consulting language.

### Step 8: Executive Brief

```
  STEP 8: EXECUTIVE BRIEF
  ├── What:     One-page action brief for leadership
  ├── Calls:    Internal (synthesis)
  ├── Reads:    ALL previous deliverables
  ├── Writes:   deliverable-H-executive-brief.md
  │             brief.md (campaign brief)
  └── Produces: Deliverable H — Executive Brief
```

The executive brief is a decision document. It contains:
- Top 5 most winnable leads with trigger evidence and 48-hour next actions
- Top 3 white-space offers to productize (with pricing signals and target buyers)
- Saturated angles to avoid (with specific examples from competitor research)
- Pipeline summary statistics (total leads, average score, segment distribution)
- Recommended focus: which 3 leads to pursue first and why

### Workflow Artifacts (E1-E4)

These are internal engine artifacts that support the pipeline but are not primary deliverables.

```
  ARTIFACTS (generated throughout workflow)

  E1: Action Queue
  ├── 48-hour next actions for top-10 leads
  ├── Responsible party assignment (if known)
  └── Written during Step 4

  E2: Top-10 Lead Briefs
  ├── Detailed narrative per top-10 lead
  ├── Trigger + evidence + outreach angle + offer fit
  └── Written during Step 4

  E3: Trigger Watchlist
  ├── 25 weekly trigger queries for monitoring
  ├── 12 company monitoring URLs
  ├── Query templates for each research tool
  └── Written during Step 3

  E4: Delta Report
  ├── Changes since last pipeline run
  ├── New leads, score changes, trigger updates
  ├── Leads that moved stages or fell off
  └── Written during weekly refresh only
```

---

## Output Format

Follow `_system/output-format.md` exactly. All four required sections in this order.

### Section 1: Header

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  CONSULTANT LEAD AGENT: [AGENT NAME]
  Generated [Month Day, Year]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Section 2: Content

After the header, display in order:
1. Research mode signal (full tool status tree)
2. Brand context loading tree
3. Pipeline summary statistics
4. Deliverable summaries (not full dumps -- files first, output second)

Pipeline summary format:

```
  PIPELINE SUMMARY

  Total leads:        [N]
  Avg score:          [N]/100
  Leads with trigger
  within 180 days:    [N]

  By segment:
  ├── Upstream         [N] leads
  ├── Midstream        [N] leads
  ├── Refining         [N] leads
  ├── Electric Util    [N] leads
  ├── Gas Utility      [N] leads
  ├── Data Center      [N] leads
  └── Renewable        [N] leads

  By IG account bucket:
  ├── Key Accounts         [N] growth opportunities
  ├── Investment/Estab.    [N] growth opportunities
  └── Setup/New Logo       [N] new targets

  Service expansion:
  ├── Data & AI            [N] opportunities across [N] accounts
  ├── Cloud                [N] opportunities across [N] accounts
  ├── Applications         [N] opportunities across [N] accounts
  └── Customer Experience  [N] opportunities across [N] accounts

  Research candidates
  (did not pass gate): [N]
```

### Section 3: Files Saved

```
  FILES SAVED

  BASE PIPELINE (A-J)
  ./campaigns/{name}/brief.md                    ✓
  ./campaigns/{name}/deliverable-A-*.md           ✓  Opportunity Map
  ./campaigns/{name}/deliverable-B1-*.md          ✓  Intelligence Source 1
  ./campaigns/{name}/deliverable-B2-*.md          ✓  Intelligence Source 2
  ./campaigns/{name}/deliverable-C-*.md           ✓  Trigger Log
  ./campaigns/{name}/deliverable-D-*.csv          ✓  Lead Pipeline
  ./campaigns/{name}/deliverable-D-top10-*.md     ✓  Top 10 Summary
  ./campaigns/{name}/deliverable-D-hardened-*.md  ✓  Hardened Intelligence
  ./campaigns/{name}/deliverable-E1-*.md          ✓  Action Queue
  ./campaigns/{name}/deliverable-E2-*.md          ✓  Top 10 Briefs
  ./campaigns/{name}/deliverable-E3-*.md          ✓  Trigger Watchlist
  ./campaigns/{name}/deliverable-E4-*.md          ✓  Delta Report (refresh)
  ./campaigns/{name}/deliverable-F-*.md           ✓  Competitor Brief
  ./campaigns/{name}/deliverable-G-*.md           ✓  Messaging Kit
  ./campaigns/{name}/deliverable-H-*.md           ✓  Executive Brief
  ./campaigns/{name}/deliverable-I-*.md           ✓  Outreach Sequences
  ./campaigns/{name}/deliverable-J-*.md           ✓  Landing Page Copy

  IG-NATIVE OUTPUTS (K-P)
  ./campaigns/{name}/deliverable-K-*.md           ✓  Account Growth Intel
  ./campaigns/{name}/deliverable-L-*.md           ✓  Service Expansion
  ./campaigns/{name}/deliverable-M-*.md           ✓  Elite Delivery Framework
  ./campaigns/{name}/deliverable-N-*.md           ✓  Customer OKR Map
  ./campaigns/{name}/deliverable-O-*.md           ✓  Thought Leadership
  ./campaigns/{name}/deliverable-P-*.md           ✓  143 Integration Brief

  SYSTEM
  ./campaigns/{name}/research-candidates.md       ✓
  ./campaigns/{name}/refresh-prompt.md            ✓
  ./campaigns/{name}/weekly-refresh-runbook.md    ✓
  ./brand/assets.md                               ✓ (updated)
  ./brand/learnings.md                            ✓ (updated)
```

### Section 4: What's Next

```
  WHAT'S NEXT

  Your pipeline is built. [N] ranked leads with
  outreach assets, account growth maps, service
  expansion plays, and 143 integration brief.

  WORK THE PIPELINE:
  → deliverable-E1         48-hour action queue
  → deliverable-H          Executive brief
  → deliverable-K          Account growth — which
                           accounts to expand NOW

  GROW THE BUSINESS:
  → deliverable-L          Service expansion — cross-sell
                           data/AI, cloud, apps, CX
  → deliverable-N          Customer OKR map — know what
                           they need before they ask

  BUILD YOUR POSITION:
  → deliverable-O          Thought leadership — 12 weeks
                           of ready content
  → deliverable-M          Elite delivery framework — the
                           quality measurement system

  DEPLOY 143 INTERNALLY:
  → deliverable-P          143 integration brief — pilot
                           program, team dashboard,
                           shared values alignment,
                           ROI calculator. Ready to go.

  MAINTAIN:
  → Weekly refresh         Paste refresh-prompt.md

  Or tell me what to focus on and I'll route you.
```

---

## Weekly Refresh Protocol

The consultant lead agent is not a one-time run. It is a living pipeline that improves weekly. The refresh protocol updates trigger intelligence, re-scores leads, detects new opportunities, and produces a delta report.

### Refresh Components

```
  Weekly Refresh Protocol

  ├── Trigger queries (25 from E3)
  │   Run each query against Perplexity/WebSearch.
  │   Log new triggers to Deliverable C (append).
  │
  ├── Company monitoring (12 URLs from E3)
  │   Scrape each URL for changes since last check.
  │   Flag new press releases, filings, announcements.
  │
  ├── Re-score pipeline
  │   Recalculate scores for all existing leads
  │   using updated trigger data. Flag score changes
  │   of +/- 10 points or more.
  │
  ├── New lead identification
  │   Any company surfacing from trigger queries that
  │   is not in the current pipeline. Run through
  │   relevance gate and scoring model.
  │
  ├── Delta report (Deliverable E4)
  │   New leads added, leads removed, score changes,
  │   stage movements, new triggers detected.
  │
  └── Baseline management
      Archive current CSV before updating:
      ./campaigns/{name}/archives/
        deliverable-D-lead-pipeline-YYYY-MM-DD.csv
```

### How to Run a Refresh

The engine generates a refresh prompt file at `./campaigns/{name}/refresh-prompt.md` during the initial run. To execute a weekly refresh:

1. Paste the contents of refresh-prompt.md into a new session
2. The prompt pre-loads the engine context, current pipeline state, trigger queries from E3, and monitoring URLs
3. The engine runs Steps 1-4 in refresh mode (update, not rebuild)
4. New Deliverable E4 (Delta Report) is generated
5. Updated CSV replaces the current version; old version archived

---

## Feedback Collection

After delivering the pipeline, collect feedback to improve future runs.

```
  FEEDBACK

  How did this perform?

  a) Great -- leads are converting
  b) Good -- leads are relevant but need refinement
  c) Mixed -- some strong, some off-target
  d) Haven't used yet

  (You can answer later -- just run this skill
  again and tell me.)
```

### Processing Feedback

**If (a) "Great -- leads are converting":**
- Log to learnings.md under "What Works" with specifics about which segments, triggers, and offers produced conversions
- Example: `- [2026-02-24] [/consultant-lead-agent] Utility interconnection leads converting. AEP Ohio meeting set from email opener #2. Trigger-specific outreach outperforms generic.`

**If (b) "Good -- leads are relevant but need refinement":**
- Ask: "Which leads felt off-target? What would make the scoring tighter?"
- Adjust scoring weights or relevance gate criteria for next refresh
- Log adjustments to learnings.md

**If (c) "Mixed -- some strong, some off-target":**
- Ask: "Can you identify the strong ones vs the off-target ones? I'll analyze the pattern."
- Look for scoring model failures -- leads that scored high but were not relevant
- Suggest relevance gate tightening or scoring weight adjustments
- Log patterns to learnings.md

**If (d) "Haven't used yet":**
- Note it. Do not log to learnings.md.
- On next run: "Last time I built a pipeline for you. Did you pursue any leads? I'd learn from the results."

---

## File Output Protocol

### Directory Structure

```
  ./campaigns/{agent-name}/
  ├── brief.md
  ├── deliverable-A-opportunity-map.md
  ├── deliverable-B1-jobsohio-wins.md
  ├── deliverable-B2-jobsohio-conversion-notes.md
  ├── deliverable-C-trigger-log.md
  ├── deliverable-D-lead-pipeline.csv
  ├── deliverable-D-top10-summary.md
  ├── deliverable-D-hardened-intelligence.md
  ├── deliverable-E1-action-queue.md
  ├── deliverable-E2-top10-briefs.md
  ├── deliverable-E3-trigger-watchlist.md
  ├── deliverable-E4-delta-report.md
  ├── deliverable-F-competitor-brief.md
  ├── deliverable-G-messaging-kit.md
  ├── deliverable-H-executive-brief.md
  ├── deliverable-I-outreach-sequences.md
  ├── deliverable-J-landing-page-copy.md
  ├── refresh-prompt.md
  ├── weekly-refresh-runbook.md
  ├── research-candidates.md
  └── archives/
      └── deliverable-D-lead-pipeline-YYYY-MM-DD.csv
```

### File Naming

Use lowercase-kebab-case. Deliverable prefix matches the letter code. Campaign directory name matches the agent name specified by the user (default: industry-geo-lead-agent, e.g., ohio-energy-lead-agent).

### Campaign Brief Format

Every engine run creates a brief.md in the campaign directory:

```
  # Campaign: [Engine Name]

  ## Goal
  Build a ranked, CRM-ready pipeline of [N]+
  consulting opportunities in [market].

  ## Angle
  Differentiation through [wedge 1] and [wedge 2].
  Packaged diagnostic offers as entry engagements.

  ## Audience Segment
  [Target buyer titles] at [target company types]
  with Ohio operations.

  ## Timeline
  Initial build: [date]. Weekly refresh ongoing.

  ## Channels
  Email outreach, LinkedIn, warm introductions,
  diagnostic offer landing pages.

  ## Status
  [active]

  ## Voice Notes
  [Voice profile summary or "default"]
```

---

## Saturated Angles to Avoid

The consultant lead agent explicitly avoids these positioning approaches in all outreach assets, messaging kits, and landing page copy. These are cataloged in detail in Deliverable F for each specific competitor, but the universal avoidance list is:

```
  Saturated Angles (never use)

  ├── "We provide great PMs"
  │   Without packaged outcomes, methodology, or
  │   measurable results. This is commodity staffing.
  │
  ├── Generic "digital transformation"
  │   Without a specific trigger, workflow target,
  │   and measurable outcome. This is a slide deck.
  │
  ├── Commodity staff augmentation framing
  │   "We place skilled professionals on your
  │   projects" competes on rate cards alone.
  │
  ├── "End-to-end solutions"
  │   Appears in every competitor's messaging.
  │   Registers as filler with experienced buyers.
  │
  ├── "Trusted partner"
  │   Self-declared trust is not trust.
  │   Trust is demonstrated through specificity.
  │
  ├── "Safety culture"
  │   Every energy company claims safety culture.
  │   It is table stakes, not differentiation.
  │
  ├── "We do everything" positioning
  │   Saying you do everything means you are known
  │   for nothing. The engine positions around
  │   specific diagnostic engagements with defined
  │   outcomes and pricing.
  │
  ├── ANY staffing language in consulting context
  │   "We place skilled professionals" / "staff your
  │   project" / "fill the seat" / "provide resources"
  │   This is the #1 perception trap Trevor identified.
  │   IG is seen as staffing 50-60% of the time.
  │   Every word must reinforce consulting, not staffing.
  │
  ├── "We're not just staffing"
  │   Negation frames reinforce the thing you deny.
  │   Never say what you're NOT. Show what you ARE
  │   through specificity of deliverables and outcomes.
  │
  └── Capability claims without deliverable specificity
      "We have deep expertise in utilities" says nothing.
      "We reduced interconnection queue processing time
      by 40% across 3 IOUs" says everything. Always
      lead with the outcome, not the capability.
```

---

## Success Criteria (Hard Requirements)

The consultant lead agent run is not complete until ALL of the following are met. These are pass/fail. No partial credit.

```
  Success Criteria

  ├── 25-50 leads in the pipeline, ranked by score
  │   Fewer than 25 means the market map was too
  │   narrow. More than 50 means the relevance gate
  │   was too loose. Adjust and re-run.
  │
  ├── Minimum 10 leads tied to trigger event
  │   within 180 days
  │   A pipeline without recent triggers is a
  │   research report, not a revenue tool.
  │
  ├── Every lead has full data model populated
  │   All 19 columns in the CSV schema. No blanks.
  │   "N/A" for unavailable data, never empty.
  │
  ├── Consultant lead agent artifacts (E1-E4) included
  │   Action queue, top-10 briefs, trigger
  │   watchlist, and delta report template.
  │
  └── Research candidates separate from pipeline
      Leads that failed the relevance gate live in
      research-candidates.md, not in the pipeline
      CSV. They are revisited on weekly refresh.
```

---

## Iteration Detection

Before starting, check if a consultant lead agent has already been run for this market:

### If campaign files exist in `./campaigns/{agent-name}/`

Do not start from scratch. Instead:

```
  Existing pipeline found:
  ├── Pipeline CSV        ✓ [N] leads (last updated [date])
  ├── Trigger Log         ✓ [N] triggers
  ├── Executive Brief     ✓ (last updated [date])
  ├── Outreach Sequences  ✓ [N] segments
  └── Refresh Prompt      ✓ ready
```

Ask: "Do you want to run a weekly refresh, rebuild from scratch, or expand to a new segment?"
- **Refresh** -- run the Weekly Refresh Protocol
- **Rebuild** -- archive the current CSV, run the full 8-step workflow
- **Expand** -- add a new industry segment or geography to the existing pipeline

### If no campaign files exist

Proceed directly with the full 8-step workflow.

---

## Pre-Generation Checklist

Before starting the engine, confirm:

- [ ] Brand selected (/brand-switch completed)
- [ ] positioning.md exists (REQUIRED -- route to /positioning-angles if missing)
- [ ] Research tools detected and research mode signal displayed
- [ ] Business context confirmed (default Ohio energy or user-specified)
- [ ] Packaged offers confirmed (from positioning.md or defaults)
- [ ] Ethics guardrails acknowledged (public sources only)

## Post-Generation Checklist

Before delivering the pipeline, verify:

- [ ] 25-50 leads ranked in the CSV
- [ ] Minimum 10 leads with triggers within 180 days
- [ ] All 19 CSV columns populated for every lead
- [ ] Relevance gate applied -- failing leads in research-candidates.md
- [ ] All deliverables (A through J) written to disk
- [ ] Artifacts (E1-E4) generated
- [ ] Refresh prompt and weekly runbook created
- [ ] assets.md updated with all new deliverables
- [ ] learnings.md updated with pipeline generation insights
- [ ] Executive brief (H) includes 48-hour action items
- [ ] Outreach assets (G, I) avoid all saturated angles
- [ ] Output follows _system/output-format.md exactly

---

## IG-Native Deliverables (K through P)

These deliverables extend the base pipeline (A-J) with outputs designed for IG Consulting's transformation. They run after the base pipeline and use its data as inputs.

### Deliverable K: Account Growth Intelligence

```
  DELIVERABLE K: ACCOUNT GROWTH INTELLIGENCE
  ├── What:     Per-account growth map for IG's utility clients
  ├── Inputs:   Pipeline CSV, trigger log, market intelligence memory
  ├── Format:   One section per account bucket (Key, Investment, Setup/New Logo)
  └── Outputs:  Growth opportunities, extension signals, peer referral paths
```

For each account in the pipeline, produce:

**Key Accounts:**
- Current IG project inventory (number of active SOWs, service types, approximate revenue)
- Contract renewal/extension timeline (when do current contracts expire?)
- Service expansion opportunities (which of the 5 technical domains are NOT currently served?)
- Customer OKR alignment (what is the customer trying to achieve that IG could help with beyond current scope?)
- Peer referral targets (who at this customer can introduce IG to a peer at another utility?)
- Risk signals (any triggers suggesting the customer may reduce scope or change vendors?)

**Investment/Established Accounts:**
- Growth trajectory (trending up, flat, or down?)
- Path to key account status (what would it take to go from 5 SOWs to 15?)
- Whitespace analysis (customer needs not currently served by IG)
- Competitive displacement opportunities (where are competitors entrenched that IG can challenge?)

**Setup/New Logo Accounts:**
- Entry strategy (which packaged offer creates the lowest-friction first engagement?)
- Champion identification (who inside the target is most likely to advocate for IG?)
- Competitive landscape at this account (who else is serving them? What's their perception?)
- First 90-day plan (first SOW → deliver well → extension → second SOW)

### Deliverable L: Service Expansion Playbook

```
  DELIVERABLE L: SERVICE EXPANSION PLAYBOOK
  ├── What:     Cross-sell map for non-engineering services
  ├── Inputs:   Account growth intelligence, market trends, industry research
  ├── Format:   Matrix of accounts × service capabilities with readiness scores
  └── Outputs:  Top 5 service expansion opportunities with action plans
```

IG's U,O&G business is 95% applied engineering. The remaining 4 technical domains represent the largest growth opportunity. For each domain:

| Service Domain | Utility Application | Market Signal | IG Readiness |
|---|---|---|---|
| Data & AI | Predictive maintenance, grid analytics, outage prediction, demand forecasting | Every major utility investing in digital twins, AMI data analytics | Score 1-10 |
| Cloud | SCADA/OT cloud migration, enterprise cloud for utility operations, DR/BC | Cloud mandates in rate cases, OT/IT convergence trend | Score 1-10 |
| Applications | CIS modernization, work/asset management, GIS platform upgrades | Oracle/SAP utility implementations, mobile workforce apps | Score 1-10 |
| Customer Experience | Digital customer platforms, billing UX, outage communication, IVR modernization | PUC mandates for customer service improvements, J.D. Power scores | Score 1-10 |

For each domain, produce:
- Top 3 accounts where this service has the highest probability of sale
- Trigger events that signal demand (regulatory mandates, technology refresh cycles, vendor sunsets)
- Competitive landscape (who currently serves this need for the target account?)
- Internal capability assessment (does IG have the people? Need to hire? Partner?)
- Recommended entry point (what's the first small engagement that proves capability?)

### Deliverable M: Elite Delivery Framework

```
  DELIVERABLE M: ELITE DELIVERY FRAMEWORK
  ├── What:     Measurable delivery quality criteria for IG projects
  ├── Inputs:   IG shared values, 143 Leadership framework, industry benchmarks
  ├── Format:   Scoring rubric + measurement protocol + reporting template
  └── Outputs:  Delivery quality scorecard, team development dashboard
```

Trevor named "elite delivery" as the 2026 company core priority. This deliverable creates the measurement system:

**Delivery Quality Dimensions (mapped to IG shared values):**

| Dimension | Shared Value | 143 Ray | Measurement |
|---|---|---|---|
| Deliverable Quality | High character & hard work | R4 (Power/Act) | On-time, on-budget, defect rate, rework rate |
| Customer Partnership | Everyone matters | R7 (Connection/Attune) | NPS, CSAT, escalation frequency, proactive communication |
| Team Development | We take care of each other | R2 (Joy/Expand) | Retention rate, internal promotion rate, skill development |
| Proactive Consulting | Leadership is here to serve | R9 (Be The Light/Inspire) | Customer OKR alignment, unsolicited recommendations, scope expansions |
| Transparency | Always know where you stand | R6 (Authenticity/Reveal) | Reporting accuracy, risk disclosure, honest status updates |

**For each IG project, produce:**
- Quarterly delivery quality scorecard (5 dimensions × 1-10 score)
- Trend analysis (improving, stable, declining)
- Team capacity assessment via 143 (if pilot is active)
- Recommended actions for next quarter
- Customer impact statement (how delivery quality connects to customer OKRs)

### Deliverable N: Customer OKR Alignment Map

```
  DELIVERABLE N: CUSTOMER OKR ALIGNMENT MAP
  ├── What:     Reverse-engineer each customer's priorities and map IG delivery to them
  ├── Inputs:   Customer annual reports, rate cases, investor presentations, strategic plans
  ├── Format:   Customer objective → IG project contribution → growth opportunity
  └── Outputs:  Per-account OKR alignment document
```

Trevor said: "Know what the customer's objectives and key results are. Organize yourself to that. Deliver to that." This deliverable operationalizes that directive.

**For each key/investment account, produce:**

1. **Customer's stated objectives** (sourced from annual reports, rate cases, 10-K filings, investor day presentations, public strategic plans)
2. **How IG's current projects contribute** (map each active SOW to a customer objective)
3. **Gaps** (customer objectives that IG is NOT currently supporting — these are expansion opportunities)
4. **Language alignment** (use the customer's own language in proposals and delivery reports, not IG's internal jargon)
5. **Decision-maker priorities** (what does the VP who signs IG's contracts care about most?)

### Deliverable O: Thought Leadership Package

```
  DELIVERABLE O: THOUGHT LEADERSHIP PACKAGE
  ├── What:     Position IG (and Justin) as technical consulting authority in utilities
  ├── Inputs:   Market intelligence, competitive analysis, industry trends
  ├── Format:   Conference talking points, LinkedIn content calendar, industry POV pieces
  └── Outputs:  12-week thought leadership calendar with ready-to-publish content
```

Trevor mentioned IG is investing in thought leadership — LinkedIn posts, conference appearances, and industry interviews. This deliverable arms Justin with content that changes the market's perception from staffing to consulting:

1. **3 Industry POV Pieces** (750-1000 words each)
   - Topics derived from market intelligence and customer OKR analysis
   - Written to demonstrate deep utility industry knowledge
   - Formatted for LinkedIn long-form posts and IG's content channels

2. **12-Week LinkedIn Content Calendar**
   - 3 posts/week: 1 industry insight, 1 delivery excellence story, 1 team/culture post
   - Each post reinforces "technical consulting, not staffing" positioning
   - Each post demonstrates knowledge of customer priorities

3. **Conference Talking Points**
   - For 3 upcoming industry events (from market-intelligence.md event calendar)
   - 5 conversation starters per event (trigger-based, not generic)
   - Follow-up templates for contacts made at events

4. **Internal Thought Leadership**
   - Monthly All-Hands contribution topics (things Justin can present to Trevor's team)
   - Cross-industry insight sharing (what can U,O&G learn from other IG industries?)
   - "Here's what I'm seeing in the market" weekly email template for leadership

### Deliverable P: 143 Integration Brief

```
  DELIVERABLE P: 143 INTEGRATION BRIEF
  ├── What:     Ready-to-deploy pilot program for 143 inside IG
  ├── Inputs:   143 framework, IG shared values, elite delivery priority
  ├── Format:   Pilot design + team dashboard template + internal pitch
  └── Outputs:  Everything needed to run a 143 pilot on one IG delivery team
```

This deliverable packages the entire 143 internal play into a ready-to-execute format:

1. **Pilot Program Design** (1 page)
   - Team selection criteria (10-15 people, key account, delivery pressure)
   - Assessment administration plan (20-30 min per person, 1-week window)
   - Data analysis plan (individual reports + team composite)
   - Presentation plan (30-min readout to team leader)
   - Success criteria (what constitutes a successful pilot)
   - Timeline (4 weeks from launch to readout)

2. **Team Capacity Dashboard Template**
   - Aggregate Ray distribution across the team
   - Eclipse pattern analysis (where does this team break under pressure?)
   - BRI distribution (who is approaching burnout?)
   - Light Signature diversity (team balance analysis)
   - Top 3 development priorities with specific tool prescriptions
   - Comparison to elite delivery dimensions (Deliverable M)

3. **Shared Values → Rays Alignment Visual**
   - One-page mapping of IG's 5 shared values to the 9 Rays
   - Designed for presentation to leadership
   - Shows: "Your values are now measurable. Here's how."

4. **ROI Calculator**
   - Cost: $43/person × team size
   - Value: reduced attrition (BRI catches burnout early), improved delivery scores, measurable development curves
   - Comparison: $43/person vs $300-600/hr for Deloitte consulting on the same problem

---

## Updated Operating Workflow (12 Steps)

Steps 1-8 remain unchanged (base pipeline). Steps 9-12 extend the engine for IG Consulting operations.

### Step 9: Account Growth Analysis

```
  STEP 9: ACCOUNT GROWTH ANALYSIS
  ├── What:     Map growth paths for every IG utility account
  ├── Calls:    Internal + research tools for customer OKR research
  ├── Reads:    Pipeline CSV, trigger log, market intelligence
  ├── Writes:   deliverable-K-account-growth.md
  │             deliverable-N-customer-okr-map.md
  └── Produces: Deliverables K, N
```

Research customer strategic plans, rate case filings, annual reports, and investor presentations. Map each customer's stated priorities. Overlay IG's current projects. Identify gaps = growth opportunities. For new logos, build the entry strategy and 90-day plan.

### Step 10: Service Expansion Mapping

```
  STEP 10: SERVICE EXPANSION MAP
  ├── What:     Cross-sell matrix for non-engineering services
  ├── Calls:    Research tools for service demand signals
  ├── Reads:    Account growth intelligence, market trends
  ├── Writes:   deliverable-L-service-expansion.md
  └── Produces: Deliverable L
```

For each of the 4 underserved technical domains (data/AI, cloud, apps, CX), identify which accounts have the highest probability of sale, what trigger events signal demand, and what the first small engagement looks like.

### Step 11: Elite Delivery + Thought Leadership

```
  STEP 11: ELITE DELIVERY + THOUGHT LEADERSHIP
  ├── What:     Build delivery quality framework + content calendar
  ├── Calls:    /content-atomizer for LinkedIn content, /brand-voice for POV pieces
  ├── Reads:    IG shared values, 143 framework, market intelligence
  ├── Writes:   deliverable-M-elite-delivery-framework.md
  │             deliverable-O-thought-leadership.md
  └── Produces: Deliverables M, O
```

### Step 12: 143 Integration Package

```
  STEP 12: 143 INTEGRATION
  ├── What:     Package the 143 pilot for internal deployment
  ├── Calls:    /assessment-brain for dashboard templates
  ├── Reads:    143 framework, IG shared values, elite delivery framework
  ├── Writes:   deliverable-P-143-integration-brief.md
  └── Produces: Deliverable P
```

---

## Updated File Output Protocol

### Full Directory Structure

```
  ./campaigns/{agent-name}/
  ├── brief.md
  ├── deliverable-A-opportunity-map.md
  ├── deliverable-B1-jobsohio-wins.md
  ├── deliverable-B2-jobsohio-conversion-notes.md
  ├── deliverable-C-trigger-log.md
  ├── deliverable-D-lead-pipeline.csv
  ├── deliverable-D-top10-summary.md
  ├── deliverable-D-hardened-intelligence.md
  ├── deliverable-E1-action-queue.md
  ├── deliverable-E2-top10-briefs.md
  ├── deliverable-E3-trigger-watchlist.md
  ├── deliverable-E4-delta-report.md
  ├── deliverable-F-competitor-brief.md
  ├── deliverable-G-messaging-kit.md
  ├── deliverable-H-executive-brief.md
  ├── deliverable-I-outreach-sequences.md
  ├── deliverable-J-landing-page-copy.md
  ├── deliverable-K-account-growth.md           ← NEW
  ├── deliverable-L-service-expansion.md         ← NEW
  ├── deliverable-M-elite-delivery-framework.md  ← NEW
  ├── deliverable-N-customer-okr-map.md          ← NEW
  ├── deliverable-O-thought-leadership.md        ← NEW
  ├── deliverable-P-143-integration-brief.md     ← NEW
  ├── refresh-prompt.md
  ├── weekly-refresh-runbook.md
  ├── research-candidates.md
  └── archives/
      └── deliverable-D-lead-pipeline-YYYY-MM-DD.csv
```

### Updated Post-Generation Checklist

Before delivering the full engine output, verify ALL of the following:

**Base Pipeline (A-J):**
- [ ] 25-50 leads ranked in the CSV
- [ ] Minimum 10 leads with triggers within 180 days
- [ ] All 19+ CSV columns populated for every lead
- [ ] Relevance gate applied — failing leads in research-candidates.md
- [ ] All deliverables (A through J) written to disk
- [ ] Artifacts (E1-E4) generated
- [ ] Refresh prompt and weekly runbook created

**IG-Native Outputs (K-P):**
- [ ] Account growth maps cover all 3 account buckets (Key, Investment, Setup/New Logo)
- [ ] Service expansion identifies top 5 cross-sell opportunities with action plans
- [ ] Elite delivery framework maps to IG shared values AND 143 Rays
- [ ] Customer OKR maps cite public sources (annual reports, rate cases, 10-K filings)
- [ ] Thought leadership calendar has 12 weeks of ready-to-publish content
- [ ] 143 integration brief is a complete, ready-to-deploy pilot package

**Quality Gates:**
- [ ] assets.md updated with all new deliverables
- [ ] learnings.md updated with pipeline generation insights
- [ ] Executive brief (H) includes 48-hour action items
- [ ] Outreach assets (G, I) avoid all saturated angles
- [ ] Nothing reads as "staffing language" — all framing is technical consulting
- [ ] Output follows _system/output-format.md exactly

---

## Updated Success Criteria

```
  Success Criteria (Hard Requirements)

  BASE PIPELINE
  ├── 25-50 leads in the pipeline, ranked by score
  ├── Minimum 10 leads tied to trigger event within 180 days
  ├── Every lead has full data model populated
  ├── Artifacts (E1-E4) included
  └── Research candidates separate from pipeline

  IG-NATIVE OUTPUTS
  ├── Account growth maps for all 3 buckets
  ├── At least 5 service expansion opportunities identified
  ├── Elite delivery framework with measurable dimensions
  ├── Customer OKR alignment for top 5 accounts
  ├── 12-week thought leadership calendar populated
  └── 143 pilot brief ready to deploy (no further preparation needed)

  LANGUAGE QUALITY
  ├── Zero instances of staffing language
  │   ("We place," "staff augmentation," "fill the seat")
  ├── Every outreach message references customer OKRs
  ├── Every proposal framework leads with deliverable outcomes
  └── Differentiation wedges visible in every client-facing asset
```

---

## Sub-Agent Architecture

The consultant lead agent orchestrates 4 specialized sub-agents. Each sub-agent has its own SKILL.md-style spec, can be invoked independently, and writes to shared memory files.

### Agent Registry

| Agent | File | Activation | Feeds |
|-------|------|-----------|-------|
| Research Agent | `agents/research-agent.md` | Every refresh cycle, new market entry | Trigger log, lead pipeline, market intelligence memory |
| Competitive Agent | `agents/competitive-agent.md` | Monthly deep refresh, pre-proposal, competitive displacement sequence | Outreach agent (counter-positioning), revenue agent (pricing intel) |
| Outreach Agent | `agents/outreach-agent.md` | New lead scored 60+, stage change, conference prep | Revenue agent (pipeline progression), memory (outreach performance) |
| Revenue Agent | `agents/revenue-agent.md` | Post-diagnostic, quarterly review, deal close/loss | All agents (win/loss feedback routing), memory (agent learnings) |

### Activation Rules

```
IF refresh_cycle:
  → Research Agent (always)
  → Competitive Agent (if monthly_deep OR quarterly)

IF new_lead_scored >= 60:
  → Outreach Agent (select sequence from multi-channel-outreach.md)

IF stage_change TO "Engage" OR "Propose":
  → Revenue Agent (activate diagnostic-to-engagement.md)
  → Competitive Agent (pre-proposal competitive brief)

IF deal_close OR deal_loss:
  → Revenue Agent (win-loss-feedback.md)
  → Feedback routes to ALL agents via correction matrix
```

### Communication Protocol

Sub-agents communicate through shared memory files, not direct calls:

1. **Research → Pipeline:** New triggers written to `memory/trigger-patterns.md`, scores updated in pipeline CSV
2. **Competitive → Outreach:** Counter-positioning insights written to `memory/agent-learnings.md` category COMPETITIVE
3. **Outreach → Revenue:** Engagement signals logged to `memory/outreach-performance.md`
4. **Revenue → All:** Win/loss feedback routed per `protocols/win-loss-feedback.md` correction matrix
5. **All → Memory:** Every agent appends learnings to `memory/agent-learnings.md` after each run

---

## Protocol Library

Protocols define multi-step workflows that sub-agents execute. Each protocol is a standalone document.

| Protocol | File | Used By | Trigger |
|----------|------|---------|---------|
| Trigger Cascade | `protocols/trigger-cascade.md` | Research Agent | When Trigger A fires, predict Trigger B. 20 chains, compound scoring, validation states |
| Multi-Channel Outreach | `protocols/multi-channel-outreach.md` | Outreach Agent | New lead enters sequence. 7 pre-built sequences, channel conflict resolution, compliance |
| Diagnostic-to-Engagement | `protocols/diagnostic-to-engagement.md` | Revenue Agent | Lead enters Engage stage. Full funnel from diagnostic ($50-225K) to engagement ($150-600K) to retainer ($3-10K/mo) |
| Win/Loss Feedback | `protocols/win-loss-feedback.md` | Revenue Agent | Deal closes or is lost. 20-question win analysis, 26-question loss analysis, correction matrix routes to all agents |
| Market Expansion | `protocols/market-expansion.md` | Orchestrator | Decision to enter adjacent market. 10-factor readiness, adjacency rings, 90-day launch protocol |

---

## Template Library

Templates are fill-in frameworks that produce specific deliverables.

| Template | File | Produces | When |
|----------|------|----------|------|
| Conference Prep | `templates/conference-prep.md` | Pre-event intelligence packet, conversation playbook, post-event follow-up | 3 weeks before any industry event |
| Market Launch Brief | `templates/market-launch-brief.md` | 10-section market entry plan | New market decision via market-expansion.md |
| Proposal from Diagnostic | `templates/proposal-from-diagnostic.md` | 8-section engagement proposal with pricing | Diagnostic findings delivered, client signals proceed |
| Case Study Builder | `templates/case-study-builder.md` | Full/one-pager/snippet case studies | Engagement completion + 30 days |
| Relationship Map | `templates/relationship-map.md` | 3-layer connection map with intro templates | New market entry, quarterly relationship review |

---

## Agent Memory System

Four persistent memory files compound intelligence across runs. All files are append-only (entries are never deleted, only superseded).

### Memory Files

| File | Purpose | Write Frequency | Read Frequency |
|------|---------|----------------|----------------|
| `memory/agent-learnings.md` | Cross-agent insights (8 categories) | Every agent run | Session start, before outreach, before scoring |
| `memory/trigger-patterns.md` | Trigger taxonomy, decay rates, source reliability | Every refresh cycle | Before scoring, before trigger queries |
| `memory/outreach-performance.md` | Channel/angle/sequence performance data | After every outreach action | Before sequence selection, monthly review |
| `memory/market-intelligence.md` | Market profiles, macro trends, event calendar | Every refresh cycle | Session start, before market decisions |

### Memory Read Protocol

At session start, every sub-agent MUST read:
1. `memory/agent-learnings.md` — last 10 entries for its category
2. Its own dedicated memory file (e.g., Research Agent reads `trigger-patterns.md`)
3. `memory/market-intelligence.md` — current market context

### Memory Write Protocol

After every run, the active sub-agent MUST append:
1. At least 1 entry to `memory/agent-learnings.md` with category, context, evidence, action
2. Performance data to the appropriate memory file
3. Any new market signals to `memory/market-intelligence.md`

---

## Multi-Market Operations

The consultant lead agent supports expansion beyond the initial Ohio energy market.

### Launch Sequence for New Markets

1. Run readiness assessment from `protocols/market-expansion.md` (must score 70+)
2. Generate market launch brief from `templates/market-launch-brief.md`
3. Build relationship map from `templates/relationship-map.md`
4. Fork the refresh cycle — adapt trigger queries and monitoring URLs for new market
5. Create new campaign directory: `campaigns/{market-name}-lead-engine/`
6. Run initial pipeline build (same 8-step workflow, new market context)

### Cross-Market Intelligence

Insights transfer between markets on a schedule:
- **Monthly:** Trigger patterns that generalize (e.g., M&A integration PMO demand)
- **Quarterly:** Outreach performance data (what channels/angles convert across markets)
- **Annually:** Full package and pricing recalibration based on all-market data

### Portfolio View

When operating in multiple markets, the orchestrator maintains a portfolio dashboard:
- Total pipeline value across all markets
- Top 5 leads across all markets (regardless of geography)
- Cross-market leads (companies operating in multiple tracked markets)
- Resource allocation recommendations (which market gets outreach priority this week)
