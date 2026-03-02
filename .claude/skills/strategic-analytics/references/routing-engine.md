# Routing Engine — Path Selection Logic

This file defines how /strategic-analytics selects the right mode for any request.

---

## Scoring Algorithm

For every user request, score ALL eight modes on three dimensions:

### Dimension 1: Intent Match (40% weight)

Score 0-10 based on keyword/phrase presence and semantic intent:

**ARCHITECT (score high when):**
- Keywords: "set up", "build", "create", "define", "establish", "framework", "what should we measure"
- Intent: User wants to create something new (a measurement system)
- Context: No existing KPI framework, or user wants to rebuild/expand
- Score 10: "Build me a KPI framework for my coaching business"
- Score 5: "I need better metrics" (could be architect or research)
- Score 1: "Show me last month's numbers" (clearly a report)

**EXTRACT (score high when):**
- Keywords: "contract", "SOW", "SLA", "MSA", "agreement", "obligations", "committed"
- Intent: User has a document and wants to pull structured data from it
- Context: File attached or referenced
- Score 10: "Read this contract and tell me what we're on the hook for"
- Score 5: "What are our SLA requirements?" (might be extract or report)
- Score 1: "Set up tracking for our SLAs" (that's architect)

**OKR BUILDER (score high when):**
- Keywords: "OKR", "objectives", "key results", "quarterly goals", "planning"
- Intent: User wants to set goals for a time period
- Context: Quarterly planning cycle, goal-setting conversation
- Score 10: "Help me fill out our Q2 OKRs"
- Score 5: "What should our goals be?" (could be OKR or architect)
- Score 1: "How did we do against our OKRs?" (that's report)

**REPORT (score high when):**
- Keywords: "report", "update", "dashboard", "QBR", "scorecard", "numbers", "status"
- Intent: User wants to see current state or communicate it to others
- Context: Data exists, audience is specified or implied
- Score 10: "Give me a QBR deck for the board meeting next week"
- Score 5: "How are things going?" (could be report or analyze)
- Score 1: "Why are things going badly?" (that's analyze → solve)

**ANALYZE (score high when):**
- Keywords: "trend", "pattern", "over time", "cohort", "segment", "anomaly", "data says"
- Intent: User wants to understand what's happening in the data
- Context: Dataset available, exploratory question
- Score 10: "What trends do you see in this data over the last 6 months?"
- Score 5: "Revenue seems off" (could be analyze or solve)
- Score 1: "Fix this" (that's solve)

**SOLVE (score high when):**
- Keywords: "fix", "improve", "solve", "why is this dropping", "recommendations", "what should we do"
- Intent: User has identified a problem and wants solutions
- Context: Problem is defined or metric is off-track
- Score 10: "Our churn doubled last month — what should we do?"
- Score 5: "Revenue is down" (could be analyze first, then solve)
- Score 1: "What's our churn rate?" (that's report or analyze)

**PROJECT (score high when):**
- Keywords: "project", "sprint", "velocity", "milestone", "on track", "earned value", "resource"
- Intent: User wants project management intelligence
- Context: Active project with timeline/budget/scope
- Score 10: "Is Project Alpha on track for the March deadline?"
- Score 5: "How's the team doing?" (could be project or report)
- Score 1: "Set up metrics for the team" (that's architect)

**RESEARCH (score high when):**
- Keywords: "benchmark", "best practice", "industry standard", "what's normal", "compare to"
- Intent: User wants external intelligence
- Context: No internal data needed, looking outward
- Score 10: "What are the industry benchmarks for coaching business retention?"
- Score 5: "Are our numbers good?" (needs research + comparison to internal data)
- Score 1: "Show me our retention numbers" (that's report)

### Dimension 2: State Readiness (30% weight)

Score 0-10 based on whether prerequisites exist:

| Mode | Needs | Score if exists | Score if missing |
|---|---|---|---|
| ARCHITECT | Nothing (can cold-start) | 10 | 10 |
| EXTRACT | A contract document | 10 (file present) | 2 (no file — ask) |
| OKR BUILDER | KPI framework (helpful) | 10 | 6 (can build standalone) |
| REPORT | Data + framework | 10 | 3 (nothing to report on) |
| ANALYZE | Dataset | 10 | 2 (no data to analyze) |
| SOLVE | Defined problem | 10 | 4 (need to identify problem first) |
| PROJECT | Project context | 10 | 3 (need project details) |
| RESEARCH | Research question | 10 | 10 (can always start cold) |

### Dimension 3: Value Impact (30% weight)

Score 0-10 based on how much value this mode delivers right now:

Consider:
- How urgent is the user's need?
- Does this mode produce a direct deliverable?
- Does this mode unblock other modes?
- Is this the highest-leverage use of time?

**High value (8-10):** Mode directly answers the user's question with a deliverable.
**Medium value (5-7):** Mode provides useful context but isn't the direct answer.
**Low value (1-4):** Mode is tangential to the current need.

### Composite Score

```
Total = (Intent Match × 0.4) + (State Readiness × 0.3) + (Value Impact × 0.3)
```

Pick the highest-scoring mode. Present to user for confirmation.

---

## Multi-Mode Detection

If the request naturally spans two or more modes, chain them:

### Common Chains

| Request Pattern | Chain |
|---|---|
| "Read this contract and set up tracking" | EXTRACT → ARCHITECT |
| "Analyze this data and tell me what to fix" | ANALYZE → SOLVE |
| "Set up KPIs and build Q2 OKRs" | ARCHITECT → OKR BUILDER |
| "Research benchmarks and build a framework" | RESEARCH → ARCHITECT |
| "Score our OKRs and write the QBR" | OKR BUILDER (score) → REPORT (QBR) |
| "Find out why churn is up and recommend fixes" | ANALYZE → SOLVE |
| "Check project health and flag risks" | PROJECT → SOLVE (if risks found) |
| "Build KPIs, research benchmarks, set targets" | RESEARCH → ARCHITECT |

Present the chain to the user with time estimate:
"This is a 3-step workflow: Research → Architect → OKR Builder. ~25 min total."

---

## Fallback Routing

If no mode scores above 5.0, the request might not be an analytics request.
Check if another skill is more appropriate:

| If the request is about... | Route to... |
|---|---|
| Writing copy about metrics | /direct-response-copy |
| Building a dashboard UI | /app-developer |
| Creating a metrics presentation | /gamma |
| Tracking assessment scores | /assessment-engine |
| General business strategy | /positioning-angles |

If it truly is an analytics request but unclear, default to RESEARCH mode —
it's always safe to start by gathering information.

---

## Prerequisite Auto-Build

When a mode needs something that doesn't exist yet, offer to build it:

```
PREREQUISITE CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Mode: OKR BUILDER
  Needs: KPI framework (to connect KRs)
  Status: ✗ No KPI framework found

  Options:
  ① Build KPI framework first, then OKRs
     (~10 min + ~8 min = ~18 min total)
     Recommended — OKRs are stronger when
     connected to a measurement system.

  ② Build standalone OKRs now
     (~8 min)
     Faster, but KRs won't link to KPIs.

  Which approach?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## State Awareness

On every invocation, scan `./analytics/{brand}/` and report what exists:

```
ANALYTICS STATE: {brand}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  KPI Framework     ✓  (47 KPIs, last updated 2026-02-15)
  OKR Cycles        ✓  Q1 2026 (3 objectives, 12 KRs)
  Contracts         ✓  2 contracts, 31 obligations tracked
  Data Snapshots    ✓  6 snapshots (Sep 2025 - Feb 2026)
  Reports           ✓  12 reports generated
  Recommendations   ◑  3 recommendations, 1 pending outcome
  Decision Log      ✓  8 decisions tracked, 5 resolved
  Assumptions       ✓  14 assumptions, 9 validated
  Research          ✓  7 briefs on file

  Last activity: 2026-02-22 (Monthly Performance Report)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

This context helps route intelligently. A brand with 6 months of data and a
mature framework gets different treatment than a brand starting from scratch.
