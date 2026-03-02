# Pattern Engine Reference

## How Pattern Detection Works

The pattern engine does NOT use embeddings, vector databases, or ML models.
It uses structured frontmatter analysis + text frequency analysis that any
LLM can perform by reading vault files. No external dependencies.

The engine analyzes ALL vault content — research, decisions, creations,
ideas, feedback, and coaching sessions. Patterns emerge across the full
LEARN → DECIDE → CREATE → OBSERVE → THINK cycle.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Algorithm 1: Tag Frequency Analysis

### Input
  All vault notes with YAML frontmatter containing `tags:` arrays.

### Process
  1. Extract all tags from all notes
  2. Count occurrences of each tag
  3. Weight by recency:
     - Last 7 days:  weight = 3x
     - Last 30 days: weight = 2x
     - Older:        weight = 1x
  4. Rank by weighted count

### Output
  Sorted list of tags with weighted counts and raw counts.

### Pattern Signal
  - Tags with high weighted count = ACTIVE FOCUS
  - Tags with high raw count but low weighted count = HISTORICAL (may be stale)
  - Tags appearing for the first time in last 7 days = EMERGING
  - Tags that were top-5 last month but absent this month = ABANDONED
  - Category-specific signals:
    - #decision/ tags spiking = you're in a DECISION PHASE
    - #creation/ tags spiking = you're in a BUILD PHASE
    - #idea/ tags without matching #creation/ = UNREALIZED IDEAS
    - #feedback/ without follow-up #decision/ = UNPROCESSED FEEDBACK

### Example Output
```
  TAG                          WEIGHTED   RAW   TREND
  #assessment/adaptive              18     8    ↑ emerging
  #competitor/betterup              15     9    → stable
  #science/neuroscience             12    12    ↓ cooling
  #market/enterprise                 9     3    ↑ new
  #assessment/pricing                6     6    → stable
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Algorithm 2: Temporal Clustering

### Input
  All vault notes grouped by creation date.

### Process
  1. Group notes by date (same-day = same research session)
  2. For each session, extract the tag set
  3. Find tag pairs that co-occur across multiple sessions
  4. Build co-occurrence matrix
  5. Identify clusters: groups of 3+ tags that frequently co-occur

### Output
  Cluster definitions with member tags, co-occurrence count, and
  session dates.

### Pattern Signal
  - Clusters represent WORK THEMES (topics you always explore together)
  - Growing clusters (more co-occurrences over time) = CONVERGENCE
  - Splitting clusters (tags diverging into separate sessions) = REFINEMENT
  - Merging clusters (previously separate tags now co-occurring) = INSIGHT
  - Cross-category clusters (learn + decide + create on same topic) = COMPLETE CYCLE
  - Learn-only clusters (research without decisions or creations) = ANALYSIS PARALYSIS

### Example Output
```
  CLUSTER: "AI Assessment"
  Tags: #assessment/adaptive, #tech/ai, #competitor/betterup
  Co-occurrences: 5 sessions
  First seen: 2026-01-15
  Last seen: 2026-02-24
  Trend: GROWING (added #science/measurement in week 3)

  CLUSTER: "Market Entry"
  Tags: #market/enterprise, #assessment/pricing, #competitor/gallup
  Co-occurrences: 3 sessions
  First seen: 2026-02-10
  Trend: NEW (formed last 2 weeks)
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Algorithm 3: Reference Graph Analysis

### Input
  All [[wiki-links]] parsed from vault note bodies and frontmatter
  `related:` fields.

### Process
  1. Build adjacency list: note → [linked notes]
  2. Calculate metrics per note:
     - In-degree: how many notes link TO this note
     - Out-degree: how many notes this note links TO
     - Total degree: in + out
  3. Classify notes:
     - HUB: total degree >= 5 (central to the knowledge graph)
     - BRIDGE: connects two otherwise disconnected clusters
     - ORPHAN: total degree = 0 (isolated, no connections)
     - LEAF: total degree = 1 (barely connected)

### Output
  Classified note list with degree counts.

### Pattern Signal
  - HUBS are your CORE KNOWLEDGE — the concepts everything connects to
  - ORPHANS are either NEW (just captured) or NEGLECTED (need linking)
  - BRIDGES reveal CROSS-DOMAIN INSIGHTS (where two fields connect)
  - LEAVES need enrichment (research more or link to existing notes)

### Example Output
```
  HUBS (5+ connections)
  ─────────────────────
  [[AI-Adaptive Assessment]]         in:8  out:4  total:12
  [[BetterUp Platform Analysis]]     in:6  out:3  total:9
  [[Neuroscience-Based Coaching]]    in:5  out:5  total:10

  BRIDGES
  ───────
  [[Coaching Automation]]
    Connects: "AI Assessment" cluster ←→ "Coaching" cluster

  ORPHANS (0 connections)
  ───────────────────────
  [[Korn Ferry Architecture]]        created 3 days ago
  [[Pymetrics Acquisition Details]]  created 7 days ago
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Algorithm 4: Gap Detection

### Input
  All note bodies scanned for entity-like references (capitalized names,
  company names, framework names) that do NOT have a matching vault note.

### Process
  1. Extract named entities from all note bodies:
     - Capitalized multi-word phrases (likely people/companies)
     - Text following "see also:", "related:", "compare with:"
     - Text in parenthetical citations
     - Text following "like", "such as", "similar to"
  2. Check each entity against existing note titles in 01_Sources/
  3. Count mentions across all notes
  4. Rank unmatched entities by mention count

### Output
  "Referenced but never researched" list with mention counts and
  source notes.

### Pattern Signal
  - High-mention gaps = BLIND SPOTS (important but under-researched)
  - Single-mention gaps = PASSING REFERENCES (low priority)
  - Gaps in competitor/ = COMPETITIVE BLIND SPOTS
  - Gaps in people/ = INFLUENCER BLIND SPOTS

### Example Output
```
  BLIND SPOTS (referenced but no vault note)
  ───────────────────────────────────────────
  "Korn Ferry Leadership Architect"   3 mentions across 3 notes
  "Hogan Dark Side Scales"            2 mentions across 2 notes
  "BetterUp ROI Study 2025"           2 mentions across 1 note
  "Patrick Lencioni"                  1 mention  across 1 note
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Algorithm 5: Staleness Detection

### Input
  All vault notes with `date:` frontmatter and reference graph data.

### Process
  1. For each note, calculate days since last modified/created
  2. Cross-reference with connection count (degree from Algorithm 3)
  3. Flag notes that are:
     - HIGH-DEGREE (5+ connections) AND STALE (30+ days untouched)
     - These are important-but-forgotten topics

### Output
  "Stale but important" list sorted by degree (most connected first).

### Pattern Signal
  - Stale hubs = FOUNDATION DRIFT (your core knowledge is aging)
  - Stale bridges = LOST CONNECTIONS (cross-domain insights fading)
  - Stale project notes = ABANDONED WORK (started but not finished)
  - Stale decisions = REVIEW NEEDED (conditions may have changed)
  - Stale feedback = UNPROCESSED RESULTS (data sitting idle)
  - Stale ideas = FORGOTTEN POTENTIAL (may still be valid)

### Staleness Thresholds
```
  Age           Status       Action
  ─────────────────────────────────────
  < 7 days      FRESH        No action
  7-30 days     AGING        Flag if high-degree
  30-90 days    STALE        Flag always
  > 90 days     ARCHIVED     Suggest archive or refresh
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Algorithm 6: Focus Drift Tracking

### Input
  Daily notes (05_Daily/) with tag summaries over time.

### Process
  1. For each week, aggregate tags from all daily notes
  2. Calculate each tag's share of total research activity
  3. Compare week-over-week:
     - SUSTAINED: Same tag in top-5 for 3+ weeks
     - OSCILLATION: Tag appears, disappears, reappears
     - ABANDONMENT: Tag was top-5, then drops completely
     - CONVERGENCE: Multiple related tags merging into one cluster
     - NEW THREAD: Tag appears for first time in top-10

### Output
  Week-by-week focus visualization with drift analysis.

### Pattern Signal
  - SUSTAINED focus = your actual priorities (even if unstated)
  - OSCILLATION = unresolved question (you keep circling back)
  - ABANDONMENT = either resolved or lost interest
  - CONVERGENCE = building toward a decision or insight
  - PHASE SHIFTS = moving from learn→decide or decide→create
    (healthy when sequential; concerning when skipping steps)

### Example Output
```
  FOCUS DRIFT — Last 4 Weeks

  Week 1  █████████░  Assessment Design
          ████░░░░░░  Competitor Research
          ██░░░░░░░░  Pricing Models

  Week 2  ████░░░░░░  Assessment Design
          ████████░░  Competitor Pricing     ← pivot to pricing
          ███░░░░░░░  AI Integration

  Week 3  ██░░░░░░░░  Assessment Design
          ██████░░░░  AI Integration         ← AI taking over
          ████░░░░░░  Coaching Automation

  Week 4  █████████░  AI + Assessment        ← CONVERGENCE
          ███░░░░░░░  Enterprise Sales
          ██░░░░░░░░  Coaching Automation

  INSIGHT: "Assessment Design" and "AI Integration" are converging
  into a single "AI + Assessment" focus. This is likely your core
  thesis. The pricing thread was intense but short — either resolved
  or needs revisiting.
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Algorithm 7: Cross-Brand Pattern Detection

### Input
  All vault notes with `brand:` frontmatter field.
  Only runs when ./brand/profiles/ contains 2+ brand slugs.

### Process
  1. Separate notes by brand tag
  2. Find tags that appear across multiple brands
  3. Identify brand-specific vs. universal research
  4. Flag cross-pollination opportunities

### Output
  Brand research matrix with shared vs. unique insights.

### Pattern Signal
  - UNIVERSAL tags = insights that apply to all your businesses
  - BRAND-SPECIFIC tags = niche knowledge per business
  - CROSS-POLLINATION = insight from brand A that could help brand B
    (e.g., pricing psychology research for one brand applies to another)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Running the Full Scan

When /vault scan is invoked, run ALL algorithms in sequence:

  1. Tag Frequency Analysis      → hot topics, emerging, abandoned
  2. Temporal Clustering         → research themes, convergence
  3. Reference Graph Analysis    → hubs, orphans, bridges
  4. Gap Detection               → blind spots
  5. Staleness Detection         → important but forgotten
  6. Focus Drift Tracking        → priority shifts over time
  7. Cross-Brand Detection       → shared vs. unique insights

Compile results into a pattern report note saved to:
  ./vault/07_Patterns/pattern-{YYYY-MM-DD}.md

Present the compiled Pattern Radar display (see SKILL.md MODE 4).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Minimum Viable Pattern Detection

The pattern engine degrades gracefully with vault size:

  < 5 notes:    Tag frequency only. Skip graph/drift.
  5-20 notes:   Tag frequency + gap detection.
  20-50 notes:  All algorithms except drift (need 3+ weeks of data).
  50+ notes:    Full pattern suite.
  100+ notes:   High-confidence patterns. MOC auto-generation.
  200+ notes:   Cross-category cycle analysis (learn→decide→create→observe).

Never run pattern detection on fewer than 5 notes — the signal-to-noise
ratio is too low to produce actionable insights.

### Category-Specific Thresholds

  LEARN notes only:     Standard research pattern detection.
  DECIDE notes appear:  Enable decision-pattern tracking.
  CREATE notes appear:  Enable idea→creation conversion tracking.
  OBSERVE notes appear: Enable feedback→decision loop tracking.
  All 5 categories:     Full LEARN→DECIDE→CREATE→OBSERVE→THINK cycle analysis.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Pattern Report Template

```markdown
---
title: "Pattern Report — YYYY-MM-DD"
type: pattern
date: YYYY-MM-DD
scan_date: YYYY-MM-DD
notes_analyzed: 147
time_window: all
patterns_detected: 5
tags:
  - meta/pattern-report
status: processed
---

# Pattern Report — YYYY-MM-DD

## Vault Stats
- Total notes: 147
- Notes this week: 12
- Inbox pending: 3
- Active projects: 2

## Hot Topics (7-day weighted)
1. #assessment/adaptive — 18 weighted (8 raw)
2. #competitor/betterup — 15 weighted (9 raw)
...

## Research Clusters
### Cluster: "AI Assessment"
- Tags: #assessment/adaptive, #tech/ai, #competitor/betterup
- Sessions: 5
- Trend: GROWING

## Knowledge Graph
### Hubs
- [[AI-Adaptive Assessment]] — 12 connections
...

### Orphans
- [[Korn Ferry Architecture]] — 0 connections

## Blind Spots
- "Hogan Dark Side Scales" — 2 references, no vault note
...

## Focus Drift
[weekly visualization]

## Insights
1. [Actionable insight from pattern analysis]
2. [Cross-reference opportunity]
3. [Suggested next research action]
```
