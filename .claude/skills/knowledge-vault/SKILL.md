---
name: knowledge-vault
version: 2.0
description: >
  Persistent knowledge operating system that captures EVERYTHING — research,
  decisions, creations, ideas, coaching sessions, campaign results, feedback,
  and patterns — into an Obsidian-compatible vault. The memory layer for the
  entire skill system. Every skill feeds it. Every session compounds it.
triggers:
  - /knowledge-vault
  - /vault
  - vault this
  - save this
  - save this research
  - log this decision
  - log this idea
  - what have I been working on
  - what have I been researching
  - show me patterns
  - scan my vault
  - dump to vault
  - knowledge base
  - what do I keep looking up
  - what do I keep coming back to
  - ingest this folder
  - scan and vault this folder
  - vault everything in
  - import this folder
  - make this my brain
  - build my vault from
  - turn this folder into a vault
  - brain builder
outputs:
  - ./vault/**/*.md (Obsidian-compatible markdown notes)
  - ./vault/06_Maps/*.md (Maps of Content — pattern summaries)
  - ./vault/05_Daily/*.md (daily logs)
dependencies: none (standalone-first)
layer: 0 (SYSTEM — memory layer that all skills feed into and read from)
reads:
  - ./brand/profiles/{brand-slug}/voice-profile.md (optional — for tagging by brand)
  - ./brand/assets.md (optional — cross-references created assets)
  - ./brand/learnings.md (optional — enriches pattern detection)
  - ./brand/stack.md (optional — checks tool availability)
  - ./brand/active-brand.md (optional — determines active brand for tagging)
writes:
  - ./brand/assets.md (appends vault assets created)
  - ./brand/learnings.md (appends pattern insights)
  - ./brand/stack.md (appends vault_path, vault_note_count, last_scan_date)
chains_to:
  - every skill (vault is the knowledge layer beneath all skills)
chains_from:
  - every skill (all skills auto-vault when ./vault/ exists)
---


# /knowledge-vault — Persistent Knowledge Operating System

## THE CORE JOB

Turn every action into compounding knowledge. Research, decisions,
copy written, campaigns launched, coaching sessions, assessment results,
ideas, feedback — everything becomes a linked, tagged, searchable note
in an Obsidian-compatible vault. The vault is the memory layer beneath
the entire skill system. Every skill feeds it. Every session compounds it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## WHY THIS EXISTS

Work in chat is disposable. You research competitors, write killer copy,
make strategic decisions, coach clients — and it all disappears when
the session ends. Next month you're re-researching the same competitors,
re-making the same decisions, losing the patterns that only emerge
when you can see everything together.

This skill creates a local-first, Obsidian-compatible vault that:

  1. AUTO-CAPTURES everything across all skills as it happens
  2. LINKS related work across sessions, brands, and projects
  3. DETECTS patterns in what you research, create, and decide
  4. SURFACES forgotten connections when they become relevant
  5. COMPOUNDS knowledge instead of resetting every session

Five categories of knowledge that compound:

  LEARN    Research, sources, data, competitive intel
  DECIDE   Positioning choices, strategy calls, architecture decisions
  CREATE   Copy written, content produced, campaigns launched
  OBSERVE  Feedback, results, metrics, learnings
  THINK    Ideas, hypotheses, brainstorms, connections

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## VAULT ARCHITECTURE

The vault is a standard folder of markdown files. No database. No vendor
lock-in. Works with Obsidian, any markdown editor, or raw filesystem.

```
./vault/
  .obsidian/                    ← Obsidian config (auto-generated)
    app.json
    appearance.json
    community-plugins.json
    graph.json
  00_Inbox/                     ← Raw captures, unsorted
  01_Sources/                   ← LEARN — External knowledge
    people/                     ← Researchers, thought leaders, clients
    companies/                  ← Competitors, market players, vendors
    concepts/                   ← Frameworks, models, theories, methods
    tools/                      ← Software, platforms, APIs, services
    data/                       ← Statistics, benchmarks, studies
  02_Decisions/                 ← DECIDE — Strategic choices made
    positioning/                ← Angles chosen, market positions taken
    architecture/               ← Technical decisions, stack choices
    strategy/                   ← Business strategy, pricing, go-to-market
    brand/                      ← Voice decisions, naming, identity choices
  03_Creations/                 ← CREATE — Work product log
    copy/                       ← Headlines, landing pages, emails written
    content/                    ← Blog posts, newsletters, social content
    campaigns/                  ← Campaign briefs, launch plans, results
    assessments/                ← Assessment designs, scoring decisions
    coaching/                   ← Coaching session notes, client patterns
  04_Projects/                  ← Active project folders
    {project-slug}/             ← One folder per project/campaign
  05_Daily/                     ← Daily work logs (not just research)
  06_Maps/                      ← Maps of Content (MOCs) — topic indexes
  07_Patterns/                  ← Auto-detected recurring themes
  08_Ideas/                     ← THINK — Hypotheses, brainstorms, sparks
  09_Feedback/                  ← OBSERVE — Results, metrics, learnings
  10_Archive/                   ← Completed project work
  _templates/                   ← Note templates for each type
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## OPERATING MODES

### MODE 1: INIT — Create the Vault

  Trigger: /vault init OR first invocation with no ./vault/ directory

  Questions before acting: ZERO. Init creates the vault immediately.
  (The 2-question rule applies to research queries, not infrastructure.)

  What happens:
  1. Create ./vault/ directory structure
  2. Generate .obsidian/ config with recommended plugins list
  3. Create _templates/ with all note templates
  4. Create first daily note
  5. Write vault path to ./brand/stack.md
  6. Offer git init (one yes/no question — the only question asked)

  Output:

  ┌─────────────────────────────────────────────────┐
  │  KNOWLEDGE VAULT INITIALIZED                     │
  │  Generated {date}                               │
  │                                                 │
  │  Location   ./vault/                            │
  │  Structure  11 directories created              │
  │  Templates  13 note templates installed         │
  │  Status     Ready for captures                  │
  │                                                 │
  │  Open in Obsidian:                              │
  │  → Open Obsidian → Open folder as vault         │
  │  → Select: ./vault/                             │
  │                                                 │
  │  Or just start researching — notes accumulate   │
  │  as plain markdown regardless of Obsidian.      │
  └─────────────────────────────────────────────────┘


### MODE 2: CAPTURE — Auto-Log Everything

  Trigger: Runs automatically during any skill operation

  When the vault exists, every significant action creates a note:

  ┌──────────────────────────┬──────────────────────────────┐
  │  ACTION                  │  VAULT BEHAVIOR              │
  ├──────────────────────────┼──────────────────────────────┤
  │  LEARN                   │                              │
  │  Web search              │  → 00_Inbox/ search note     │
  │  Firecrawl scrape        │  → 01_Sources/companies/     │
  │  Perplexity query        │  → 00_Inbox/ synthesis note  │
  │  Competitor analysis     │  → 01_Sources/companies/     │
  │  Person research         │  → 01_Sources/people/        │
  │  Framework discovered    │  → 01_Sources/concepts/      │
  │                          │                              │
  │  DECIDE                  │                              │
  │  Positioning angle chosen│  → 02_Decisions/positioning/ │
  │  Architecture decision   │  → 02_Decisions/architecture/│
  │  Strategy pivot          │  → 02_Decisions/strategy/    │
  │  Brand voice finalized   │  → 02_Decisions/brand/       │
  │                          │                              │
  │  CREATE                  │                              │
  │  Copy written            │  → 03_Creations/copy/        │
  │  Content published       │  → 03_Creations/content/     │
  │  Campaign launched       │  → 03_Creations/campaigns/   │
  │  Assessment designed     │  → 03_Creations/assessments/ │
  │  Coaching session done   │  → 03_Creations/coaching/    │
  │                          │                              │
  │  THINK                   │                              │
  │  Idea or hypothesis      │  → 08_Ideas/                 │
  │  Connection spotted      │  → 08_Ideas/                 │
  │                          │                              │
  │  OBSERVE                 │                              │
  │  Performance results     │  → 09_Feedback/              │
  │  Client/user feedback    │  → 09_Feedback/              │
  │  Audit findings          │  → 09_Feedback/              │
  └──────────────────────────┴──────────────────────────────┘

  Each note includes:
  - YAML frontmatter (date, source, tags, type, project, brand)
  - Distilled content (key findings, decisions, outcomes)
  - Source context (what skill produced it, what prompted it)
  - Auto-generated tags from content analysis
  - Wiki-links to related existing notes (if matches found)

  IMPORTANT: Capture is DISTILLED, not raw. A 5,000-word scraped page
  becomes a 200-word note. A 2,000-word email sequence becomes a note
  with subject lines, hooks, and the strategic rationale — not the
  full copy. Raw content goes nowhere useful. Distilled content compounds.


### MODE 3: PROCESS — Sort the Inbox

  Trigger: /vault process OR "sort my research"

  What happens:
  1. Read all notes in 00_Inbox/
  2. Categorize each note by type (person, company, concept, tool, data)
  3. Move to appropriate 01_Sources/ subfolder
  4. Add wiki-links between related notes
  5. Update or create Maps of Content in 06_Maps/
  6. Append to today's daily note in 05_Daily/

  Display:

  ┌─────────────────────────────────────────────────┐
  │  INBOX PROCESSED                                │
  │  Generated {date}                               │
  │                                                 │
  │  Notes sorted     12                            │
  │  → people/         3                            │
  │  → companies/      4                            │
  │  → concepts/       2                            │
  │  → tools/          2                            │
  │  → data/           1                            │
  │                                                 │
  │  New links added   8                            │
  │  MOCs updated      2  (AI-coaching, competitor) │
  │  Inbox remaining   0                            │
  └─────────────────────────────────────────────────┘


### MODE 4: SCAN — Detect Patterns

  Trigger: /vault scan OR "what patterns do you see" OR "what do I keep
  researching"

  The pattern engine analyzes your vault for:

  1. FREQUENCY — What topics appear most across notes?
  2. RECENCY — What has been researched in the last 7/30/90 days?
  3. CLUSTERS — What topics co-occur in the same sessions?
  4. GAPS — What was started but never finished?
  5. EVOLUTION — How has your focus shifted over time?
  6. BLIND SPOTS — What competitors/concepts are referenced but
     never directly researched?

  Output:

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    PATTERN RADAR — {date}

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    HOT TOPICS (last 7 days)

    ★ behavioral assessment pricing     │ 6 notes
      AI coaching integration           │ 4 notes
      personality test competitors      │ 3 notes

    RECURRING THEMES (30-day window)

      leadership development market     │ 12 notes
      neuroscience-based coaching       │ 9 notes
      subscription assessment models    │ 7 notes

    EMERGING CLUSTERS

    ┌─ "AI + Assessment" cluster
    │  Appears in 8 notes across 3 sessions
    │  Linked concepts: adaptive testing, personalized
    │  feedback, coaching automation
    │  → This cluster is growing. Consider a deep-dive.
    └──────────────────────────────────

    GAPS & BLIND SPOTS

    ✗ Referenced but never researched:
      - "Korn Ferry Leadership Architect"  (3 mentions)
      - "Hogan Dark Side scales"           (2 mentions)
      - "BetterUp ROI methodology"         (2 mentions)

    ○ Started but stalled:
      - Enterprise pricing models (last touched 22 days ago)
      - Team assessment workflows (last touched 18 days ago)

    FOCUS DRIFT

    Week 1  ████████░░  Assessment design
    Week 2  ██████████  Competitor pricing
    Week 3  ████░░░░░░  AI integration
    Week 4  ██████████  Back to assessment ← you're here

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    PATTERN INSIGHTS

    → You keep circling back to "assessment + AI
      personalization." This might be your highest-
      conviction opportunity.

    → Competitor pricing has been researched 3x but
      no positioning angle has been written. Route
      to /positioning-angles?

    → 3 blind-spot items are all enterprise-tier
      competitors. Your research skews individual/
      SMB. Intentional?

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


### MODE 5: FORCE — Manual Capture

  Trigger: /vault add OR "vault this" OR "save this to vault"

  For when you're working on something and want to capture it NOW
  without waiting for auto-scan.

  Usage:
  - "vault this" — captures the current conversation context
  - "vault this as [project]" — files under 02_Projects/{project}/
  - "vault this competitor analysis" — files under 01_Sources/companies/
  - "vault this research on [person]" — files under 01_Sources/people/

  The skill distills the current context into a vault note, auto-tags it,
  links to existing related notes, and confirms the save.


### MODE 6: RESEARCH — Deep Dive with Auto-Vault

  Trigger: /vault research [topic] OR "research and vault [topic]"

  Combines Firecrawl + Perplexity + vault capture in one operation:

  1. PERPLEXITY QUERY — Ask Perplexity for synthesis on the topic
  2. FIRECRAWL SCRAPE — Scrape top sources mentioned in Perplexity results
  3. DISTILL — Extract key findings, data points, quotes, frameworks
  4. VAULT — Create interconnected notes for each source + a synthesis note
  5. LINK — Connect to existing vault notes on related topics
  6. MAP — Update or create a Map of Content for the topic

  This is the power mode. One command produces 5-15 linked vault notes
  from a single research question.

  Example:

  /vault research "AI-adaptive assessment engines 2026"

  Produces:
  ┌─────────────────────────────────────────────────┐
  │  RESEARCH COMPLETE — vaulted                    │
  │  Generated {date}                               │
  │                                                 │
  │  Query        AI-adaptive assessment engines    │
  │  Sources      8 pages scraped via Firecrawl     │
  │  Synthesis    1 Perplexity summary note          │
  │  Notes        12 total (8 source + 3 concept    │
  │               + 1 synthesis)                    │
  │  Links        19 wiki-links to existing notes   │
  │  MOC          06_Maps/ai-adaptive-assessment.md │
  │                                                 │
  │  New connections discovered:                    │
  │  → Links to your existing notes on Hogan,       │
  │    CliftonStrengths, and BetterUp               │
  │  → Overlaps with "neuroscience coaching" cluster│
  └─────────────────────────────────────────────────┘


### MODE 7: DAILY — Daily Work Log

  Trigger: Automatic at session start OR /vault daily

  Creates or appends to today's daily note (05_Daily/YYYY-MM-DD.md).
  Summarizes all actions taken in the session — research, decisions,
  creations, ideas, everything.

  Daily notes accumulate into a work journal. The pattern engine
  reads daily notes to detect trends over time.


### MODE 8: EXPORT — Extract for Other Skills

  Trigger: /vault export [topic] OR "pull vault research on [topic]"

  Extracts and formats vault knowledge for use in other skills:

  - /vault export for /positioning-angles → competitor insights + gaps
  - /vault export for /seo-content → source material + data points
  - /vault export for /keyword-research → topic clusters + search patterns
  - /vault export for /email-sequences → stories + proof points

  This is how vault knowledge feeds back into the skill system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## FIRECRAWL INTEGRATION

When Firecrawl is available (check ./brand/stack.md or /preflight):

  SCRAPE MODE:
  - Accept URL → Firecrawl scrape → distill to vault note
  - Extract: title, author, date, key arguments, data points,
    frameworks mentioned, quotes worth saving
  - Auto-tag based on content analysis
  - Link to existing vault notes on matching topics

  CRAWL MODE:
  - Accept domain → Firecrawl crawl (depth 2) → create source map
  - Produces one note per significant page
  - Creates a company/domain MOC linking all pages
  - Used for competitor deep-dives

  MONITOR MODE (advanced):
  - Track URLs for changes → diff against previous scrape
  - Flag new content, pricing changes, messaging shifts
  - Append diffs to existing source notes with timestamps

  FALLBACK (no Firecrawl):
  - Use WebFetch tool for single-page capture
  - Manual paste of content for distillation
  - Degraded but functional — vault still works

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## PERPLEXITY INTEGRATION

When Perplexity is available:

  SYNTHESIS MODE:
  - Send research question → get AI-synthesized answer with citations
  - Create synthesis note in vault with source links
  - Scrape cited sources via Firecrawl for deeper capture
  - Cross-reference against existing vault knowledge

  EXPANSION MODE:
  - Take an existing vault note → ask Perplexity for related research
  - "What else should I know about [topic from note]?"
  - Produces satellite notes that link back to the original

  VALIDATION MODE:
  - Take a vault pattern/insight → ask Perplexity to verify
  - "Is [pattern insight] supported by current research?"
  - Append validation results to the pattern note

  FALLBACK (no Perplexity):
  - Use WebSearch tool for standard search
  - Manual synthesis (skill still guides the distillation)
  - Pattern detection still works from accumulated notes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## NOTE FORMAT

Every vault note follows this structure:

```markdown
---
title: Note Title
date: YYYY-MM-DD
type: search | scrape | synthesis | manual | decision | creation | idea | feedback | coaching | pattern | daily | moc
category: learn | decide | create | observe | think
source: URL or "manual" or skill name
source_skill: skill that created this note (if auto-vaulted)
query: original search/research query (if applicable)
project: project-slug (if applicable)
brand: brand-slug (if multi-brand)
tags:
  - topic-tag
  - category-tag
  - source-type-tag
related: []  ← auto-populated wiki-links
status: inbox | processed | archived
---

# Note Title

## Key Findings

- Finding 1
- Finding 2
- Finding 3

## Data Points

- Stat or benchmark (source)
- Stat or benchmark (source)

## Quotes Worth Saving

> "Quote" — Attribution

## Connections

- [[Related Note 1]] — how it connects
- [[Related Note 2]] — how it connects

## Source

- URL: https://...
- Retrieved: YYYY-MM-DD
- Method: firecrawl | perplexity | websearch | manual
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## PATTERN ENGINE

The pattern engine runs during MODE 4 (SCAN) and reads all vault notes
to detect:

### 1. TAG FREQUENCY ANALYSIS

  Count tag occurrences across all notes. Weight by recency
  (last 7 days = 3x, last 30 days = 2x, older = 1x).

  Output: Ranked list of hot topics with note counts and trend arrows.

### 2. TEMPORAL CLUSTERING

  Group notes by session/date. Identify topics that co-occur
  in the same research sessions.

  Output: Cluster map showing which topics you research together.

### 3. REFERENCE GRAPH

  Parse all [[wiki-links]] to build a connection graph.
  Identify:
  - Hub notes (many connections — core concepts)
  - Orphan notes (no connections — potential gaps)
  - Bridge notes (connect otherwise separate clusters)

  Output: Graph summary with hub/orphan/bridge lists.

### 4. GAP DETECTION

  Find text references to concepts/people/companies that don't
  have their own vault note yet.

  Output: "Referenced but never researched" list with mention counts.

### 5. STALENESS DETECTION

  Flag notes/topics not touched in 30+ days that have high
  connection counts (important but forgotten).

  Output: "Stale but important" list with last-touched dates.

### 6. FOCUS DRIFT TRACKING

  Compare research topics week-over-week to show how focus
  has shifted. Identify:
  - Sustained focus (same topic, multiple weeks)
  - Oscillation (topic A → B → A → B pattern)
  - Abandonment (topic disappears after initial burst)
  - Convergence (multiple threads merging toward one topic)

  Output: Weekly focus visualization + drift analysis.

### 7. CROSS-BRAND PATTERN DETECTION

  When multi-brand (./brand/profiles/ has multiple slugs):
  - Which research spans brands vs. brand-specific?
  - Are insights from one brand applicable to another?
  - Cross-pollination opportunities.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## AUTO-SCAN PROTOCOL

When this skill is loaded, it activates a capture protocol for the
current session:

### PASSIVE CAPTURE (always on)

  Every significant action in the session gets logged:

  ┌──────────────────────────────────────────────────┐
  │  IF action = web_search                          │
  │    → Create search note (01_Sources/)            │
  │                                                  │
  │  IF action = web_fetch OR firecrawl_scrape       │
  │    → Create source note with distilled content   │
  │                                                  │
  │  IF action = perplexity_query                    │
  │    → Create synthesis note with sources           │
  │                                                  │
  │  IF action = skill_completed                     │
  │    → Create work note per Skill Integration      │
  │      Protocol (copy, decision, content, etc.)    │
  │                                                  │
  │  IF action = strategic_decision                  │
  │    → Create decision note with rationale         │
  │                                                  │
  │  IF action = user_says "vault this"              │
  │    → Create manual capture of current context    │
  │                                                  │
  │  ALL notes → add to today's daily log            │
  └──────────────────────────────────────────────────┘

### ACTIVE CAPTURE (on demand)

  User says "vault this" or /vault add at any point.
  Captures the current working context as a vault note.

### SESSION END SUMMARY

  At end of session (or on request), produce:

  ┌─────────────────────────────────────────────────┐
  │  SESSION KNOWLEDGE SUMMARY                      │
  │  Generated {date}                               │
  │                                                 │
  │  Notes created    7                             │
  │  Notes linked     4 (to existing vault notes)   │
  │  New tags         2 (#ai-coaching, #adaptive)   │
  │  Inbox items      3 (need processing)           │
  │                                                 │
  │  Today's vault:   ./vault/05_Daily/2026-02-24   │
  │                                                 │
  │  Run /vault scan to check for new patterns      │
  └─────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## OBSIDIAN CONFIGURATION

On vault init, generate these .obsidian/ config files:

### app.json
```json
{
  "alwaysUpdateLinks": true,
  "newFileLocation": "folder",
  "newFileFolderPath": "00_Inbox",
  "attachmentFolderPath": "_attachments",
  "showLineNumber": true,
  "strictLineBreaks": false
}
```

### appearance.json
```json
{
  "baseFontSize": 16,
  "theme": "obsidian"
}
```

### community-plugins.json
```json
[
  "dataview",
  "templater-obsidian",
  "obsidian-git",
  "graph-analysis",
  "smart-connections"
]
```

### Recommended Plugins (install manually in Obsidian)

  ★ Dataview — Query vault notes like a database
    Used for: Pattern reports, tag frequencies, project dashboards
    Example: TABLE date, tags FROM "01_Sources" SORT date DESC

  ★ Templater — Auto-apply note templates
    Used for: Consistent note format on creation

  ★ Obsidian Git — Auto-backup vault to git repo
    Used for: Version history, cross-device sync

  ○ Smart Connections — AI-powered note linking
    Used for: Discovering connections the pattern engine misses

  ○ Graph Analysis — Advanced graph metrics
    Used for: Visualizing knowledge clusters

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## BRAND MEMORY INTEGRATION

### Reads (optional, enhances output)

  ./brand/active-brand.md
    → Determines active brand for auto-tagging notes

  ./brand/profiles/{brand-slug}/voice-profile.md
    → Tags notes with brand context when multi-brand

  ./brand/assets.md
    → Cross-references vault research with created assets

  ./brand/learnings.md
    → Enriches pattern detection with performance data

  ./brand/stack.md
    → Checks Firecrawl/Perplexity availability
    → Reads vault path if already initialized

### Writes

  ./brand/assets.md
    → Appends: "Research vault note: {title}" with date and path

  ./brand/learnings.md
    → Appends: Pattern insights tagged #knowledge-vault

  ./brand/stack.md
    → Writes: vault_path, vault_note_count, last_scan_date

### Graceful Degradation (3 Tiers)

  TIER 1: No brand directory (standalone)
    Vault works at zero context. No brand tagging, no multi-brand
    separation, no cross-reference with assets. Research captures
    and pattern detection work fully.
    Shows: "No brand profile found — vault works standalone."

  TIER 2: Partial brand directory
    Some files exist (e.g., stack.md but no voice-profile.md).
    Loads what's available. Uses defaults for the rest.
    Shows: "Brand profile partial (loaded stack.md; voice
    not yet created)."

  TIER 3: Full brand directory
    All relevant files present. Notes tagged by active brand.
    Cross-references with assets and learnings. Full multi-brand
    pattern detection.
    Shows context loading display below.

### Context Loading Display

  ┌─ Brand Memory ─────────────────────────────────┐
  │                                                 │
  │  ./brand/stack.md              ✓  loaded        │
  │    └─ Firecrawl API            ✓  available     │
  │    └─ Perplexity API           ✓  available     │
  │    └─ Vault path               ✓  ./vault/      │
  │  ./brand/voice-profile.md      ✓  loaded        │
  │  ./brand/assets.md             ✓  loaded (42)   │
  │  ./brand/learnings.md          ✓  loaded (18)   │
  │                                                 │
  │  Vault Status                                   │
  │    Notes total     147                           │
  │    Inbox pending   6                             │
  │    Last scan       2 days ago                    │
  │    Last capture    today                         │
  │                                                 │
  └─────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## MAPS OF CONTENT (MOCs)

MOCs are index notes that organize vault knowledge by topic. They
live in 06_Maps/ and serve as entry points into topic clusters.

### Auto-Generated MOCs

  When the pattern engine detects a topic cluster with 5+ notes,
  it auto-creates a MOC:

  ```markdown
  ---
  title: "MAP: AI-Adaptive Assessment"
  type: moc
  date: 2026-02-24
  auto_generated: true
  note_count: 8
  ---

  # AI-Adaptive Assessment

  ## Core Concepts
  - [[Computerized Adaptive Testing]] — foundation tech
  - [[Item Response Theory]] — scoring methodology
  - [[AI Personalization in Assessment]] — synthesis

  ## Market Players
  - [[Hogan Assessment]] — enterprise standard
  - [[BetterUp Platform Analysis]] — AI coaching angle
  - [[Pymetrics Acquisition by Harver]] — M&A signal

  ## Data Points
  - [[Assessment Market Size 2025-2033]] — $6.31B → $15.95B
  - [[Adaptive vs Fixed Test Accuracy]] — 23% fewer items needed

  ## Open Questions
  - How do adaptive engines handle test-retest reliability?
  - What's the minimum item pool size for stable CAT?
  - ROI data on adaptive vs. fixed-form for employers?
  ```

### Manual MOCs

  Create with: /vault map [topic]
  Generates a MOC from all notes matching the topic, organized
  by type (concepts, people, companies, data, open questions).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## GIT REPOSITORY INTEGRATION

On vault init, the skill offers to initialize a git repo:

  OPTION A: Git-backed vault (recommended)
  - git init in ./vault/
  - .gitignore for .obsidian/workspace.json (local state)
  - Auto-commit after each /vault process or /vault scan
  - Enables: version history, cross-device sync, collaboration

  OPTION B: Plain folder (simpler)
  - No git, just files on disk
  - Works fine for single-device use
  - Can add git later with /vault git-init

### .gitignore for vault
```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
.DS_Store
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## DATAVIEW QUERIES (for Obsidian users)

Pre-built queries to paste into Obsidian notes:

### Recent Activity (all types)
```dataview
TABLE date, type, category, tags
FROM "01_Sources" OR "02_Decisions" OR "03_Creations" OR "08_Ideas" OR "09_Feedback"
SORT date DESC
LIMIT 20
```

### Hot Tags (all vaulted work)
```dataview
TABLE length(rows) AS "Count"
FROM "01_Sources" OR "02_Decisions" OR "03_Creations" OR "08_Ideas" OR "09_Feedback" OR "00_Inbox"
FLATTEN tags AS tag
GROUP BY tag
SORT length(rows) DESC
LIMIT 15
```

### Unprocessed Inbox
```dataview
TABLE date, type, query
FROM "00_Inbox"
SORT date DESC
```

### Notes by Project
```dataview
TABLE date, type, category, status
FROM ""
WHERE project = "143-assessment"
SORT date DESC
```

### Recent Decisions
```dataview
TABLE date, tags, source_skill
FROM "02_Decisions"
SORT date DESC
LIMIT 10
```

### Orphan Notes (no links)
```dataview
LIST
FROM "01_Sources" OR "02_Decisions" OR "03_Creations" OR "08_Ideas" OR "09_Feedback"
WHERE length(file.outlinks) = 0 AND length(file.inlinks) = 0
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ADDITIONAL MODES

### MODE 9: SEARCH — Find in Vault

  Trigger: /vault search [query] OR "find in vault"

  Search across all vault notes by content, tags, or frontmatter.

  Search types:
  - TAG SEARCH: /vault search #assessment/pricing
    → All notes with matching tags
  - CONTENT SEARCH: /vault search "adaptive testing ROI"
    → Full-text search across note bodies
  - ENTITY SEARCH: /vault search @betterup
    → All notes referencing an entity (person, company, tool)
  - DATE SEARCH: /vault search --since 7d
    → All notes from last 7 days (also: 30d, 90d, YYYY-MM-DD)

  Output: Ranked list of matching notes with excerpts and tags.

  ┌─────────────────────────────────────────────────┐
  │  VAULT SEARCH: "adaptive testing"               │
  │  Generated {date}                               │
  │                                                 │
  │  12 notes found                                 │
  │                                                 │
  │  ★ [[AI-Adaptive Assessment]]     01_Sources/   │
  │    "...adaptive engines reduce item count by     │
  │    23% while maintaining .91 reliability..."     │
  │    Tags: #assessment/adaptive #tech/ai           │
  │                                                 │
  │  ○ [[BetterUp Platform Analysis]]  01_Sources/  │
  │    "...BetterUp uses adaptive coaching paths     │
  │    based on initial assessment scores..."        │
  │    Tags: #competitor/betterup #coaching/ai       │
  │                                                 │
  │  ... 10 more results                            │
  └─────────────────────────────────────────────────┘


### MODE 10: MERGE — Combine Related Notes

  Trigger: /vault merge [note1] [note2] OR "merge these vault notes"

  When two notes cover the same entity (e.g., BetterUp scraped in
  January and again in February), merge into a single evolving note
  with timestamped sections.

  What happens:
  1. Read both notes
  2. Identify overlapping vs. unique content
  3. Create merged note with:
     - Combined frontmatter (union of tags, earliest date as created,
       latest date as updated)
     - Timestamped sections showing when each finding was captured
     - Deduplicated data points
     - Combined connections
  4. Archive the two originals to 10_Archive/merged/
  5. Update all wiki-links across the vault to point to the merged note

  Use case: You scraped a competitor's pricing page in January.
  You scraped it again in February. Merge shows what changed.

  ┌─────────────────────────────────────────────────┐
  │  NOTES MERGED                                   │
  │  Generated {date}                               │
  │                                                 │
  │  Merged    [[BetterUp Jan]] + [[BetterUp Feb]]  │
  │  Into      [[BetterUp Platform Analysis]]       │
  │                                                 │
  │  Changes detected:                              │
  │  + New pricing tier added ($499/seat/yr)        │
  │  + AI coaching feature expanded                 │
  │  ~ Team dashboard UI refreshed                  │
  │  - Free trial removed from homepage             │
  │                                                 │
  │  Links updated   4 notes now point to merged    │
  │  Originals       10_Archive/merged/             │
  └─────────────────────────────────────────────────┘


### MODE 11: QUEUE — Research Queue from Patterns

  Trigger: /vault queue OR /vault research-next

  The pattern engine's gap detection (blind spots, stalled topics)
  feeds a prioritized research queue.

  /vault queue shows the queue:

  ┌─────────────────────────────────────────────────┐
  │  RESEARCH QUEUE                                 │
  │  Generated {date}                               │
  │                                                 │
  │  Priority  Topic                     Source      │
  │  ─────────────────────────────────────────────  │
  │  ① "Korn Ferry Architect"          blind spot   │
  │     3 references, 0 vault notes                 │
  │  ② "Hogan Dark Side Scales"        blind spot   │
  │     2 references, 0 vault notes                 │
  │  ③ Enterprise pricing models       stalled      │
  │     Last touched 22 days ago                    │
  │  ④ Team assessment workflows       stalled      │
  │     Last touched 18 days ago                    │
  │  ⑤ "BetterUp ROI methodology"      blind spot   │
  │     2 references, 0 vault notes                 │
  │                                                 │
  │  → /vault research-next                         │
  │    Picks ① and runs deep-dive automatically     │
  └─────────────────────────────────────────────────┘

  /vault research-next picks the top item and runs MODE 6 (RESEARCH)
  on it automatically. One command to fill your biggest knowledge gap.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


### MODE 12: BRAIN BUILDER — Scan Any Folder, Build Your Second Brain

  Trigger: /vault ingest [folder-path]
          OR /vault brain [folder-path]
          OR "vault this folder"
          OR "ingest everything in [path]"
          OR "scan and vault [path]"
          OR "make this my brain"
          OR "build my vault from [path]"
          OR "turn this folder into a vault"

  The full-power brain builder. Point it at ANY folder on your
  machine — research notes, bookmarks exports, downloaded articles,
  project folders, Apple Notes exports, Notion exports, Google Docs
  dumps, or literally anything — and it reads every file, deeply
  analyzes the content, auto-categorizes, builds intelligent tags,
  creates semantic cross-links, generates Maps of Content for
  clusters, and produces a master brain dashboard.

  This is not a file copier. It is a knowledge architect.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  THE 8-STEP PIPELINE:

  1. SCAN       Read every file recursively
  2. IDENTIFY   Detect file types + read content + EXTRACT DATES
  3. ANALYZE    7-dimension analysis (entities, themes, intent,
               key content, relationships, quality, VERSION DETECTION)
  4. CLASSIFY   Route to vault category (business-first routing)
  5. DISTILL    Create vault note with rich frontmatter
               (dates, versions, hashes, business tags)
  6. TAG        Build hierarchical tag taxonomy
  7. LINK       Wire semantic cross-references + version chains
  8. MAP        Auto-MOCs + BRAIN-INDEX + TIMELINE + INGEST-REPORT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  STEP 1: SCAN — Read the Target Folder

  Recursively walk every directory. Build a manifest:

  Supported file types:
  ├── Text:     .md, .txt, .rtf, .org, .tex
  ├── Data:     .json, .csv, .tsv, .yaml, .yml, .xml
  ├── Docs:     .pdf, .docx, .doc, .pptx, .xlsx, .xls
  ├── Web:      .html, .htm, .mhtml, .webloc, .url
  ├── Code:     .py, .js, .ts, .tsx, .jsx, .sh, .sql
  ├── Notes:    .enex (Evernote), .bear, .textbundle
  ├── Media:    .png, .jpg, .jpeg, .gif, .mp4, .mp3
  │             (create descriptor notes, not content copies)
  └── Archives: .zip (scan contents list, don't extract)

  Skip: node_modules/, .git/, .obsidian/, __pycache__/,
        .DS_Store, Thumbs.db, *.lock, *.log, files > 50MB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  STEP 2: IDENTIFY — Detect + Read

  ┌──────────────────┬───────────────────────────────────┐
  │  FILE TYPE       │  READ STRATEGY                    │
  ├──────────────────┼───────────────────────────────────┤
  │  .md, .txt       │  Full content directly            │
  │  .json           │  Parse structure + schema + keys  │
  │  .csv, .tsv      │  Headers, row count, sample rows  │
  │  .pdf            │  Extract text, section summaries  │
  │  .docx           │  Extract text + headings          │
  │  .pptx           │  Slide titles + text body         │
  │  .xlsx           │  Sheet names + headers + samples  │
  │  .html           │  Strip tags, extract article text │
  │  .webloc, .url   │  Extract target URL               │
  │  Code files      │  Docstrings, functions, comments  │
  │  Images          │  Descriptor note linking to file  │
  │  Audio/Video     │  Descriptor note with metadata    │
  │  .zip            │  Contents list without extracting │
  └──────────────────┴───────────────────────────────────┘

  DATE EXTRACTION (run on every file):

  Extract the EARLIEST RELIABLE date from these sources, in priority:

  ┌──────────────────┬───────────────────────────────────┐
  │  SOURCE          │  DETECTION METHOD                 │
  ├──────────────────┼───────────────────────────────────┤
  │  Filename        │  Regex: YYYY-MM-DD, YYYYMMDD,     │
  │                  │  _YYYY_, Month DD YYYY,            │
  │                  │  "October 21, 2022" in name        │
  │  Content header  │  First date found in first 30      │
  │                  │  lines (frontmatter `date:`,       │
  │                  │  "Date:", "Created:", timestamps)   │
  │  Version suffix  │  _v1, _v2, _FINAL, _UPDATED,      │
  │                  │  _EXPANDED, _REVISED, _DRAFT →     │
  │                  │  use file modified date + order     │
  │  File metadata   │  macOS birthtime (creation date)   │
  │                  │  via `stat -f %SB` or `mdls`       │
  │  File modified   │  Last resort — mtime from stat     │
  └──────────────────┴───────────────────────────────────┘

  RULES:
  1. Filename dates > content dates > metadata dates > modified dates
  2. If filename says "October 21, 2022" → date is 2022-10-21
  3. If no date found anywhere → use file birthtime, NOT today
  4. Store date_source: "filename" | "content" | "metadata" | "mtime"
  5. Store date_confidence: "exact" | "inferred" | "fallback"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  STEP 3: ANALYZE — Deep Content Analysis (7 dimensions)

  For each file, extract:

  ① ENTITIES — Named things
     People, companies, products, tools, places, dates, events

  ② THEMES — What this is about
     Primary topic, secondary topics, domain, emotional tone

  ③ INTENT — Why this was created
     Research | Decision | Creation | Planning |
     Reflection | Reference

  ④ KEY CONTENT — The actual value
     Core claims, key data points, decisions made,
     action items, open questions, quotes worth keeping

  ⑤ RELATIONSHIPS — How this connects
     Files it references, shared entities with other files,
     shared themes, shared projects, temporal clusters

  ⑥ QUALITY SIGNAL — How valuable is this (1-5 each)
     Depth | Originality | Actionability | Freshness
     Notes scoring 1 on all dimensions = inbox or skip.

  ⑦ VERSION DETECTION — Is this a version of something else?

     DOCUMENT FAMILY DETECTION:
     Compare each file against ALL other files in the batch:

     A. NAME SIMILARITY — Strip these suffixes and compare base names:
        _v1, _v2, _v3, _V1, _V2, _FINAL, _UPDATED, _EXPANDED,
        _REVISED, _DRAFT, _COMPLETE, _MASTER, _LOCKED, _EDIT,
        _CLEAN, _NEW, _OLD, _BACKUP, _COPY, (1), (2), copy

     B. CONTENT OVERLAP — If 2 files share >40% of sentences,
        they are likely versions of the same document.

     C. TITLE MATCH — If YAML title or H1 heading matches
        (ignoring version suffixes), they are the same document.

     OUTPUT per file:
     - version_family: "{base-name}" (null if unique)
     - version_order: 1, 2, 3... (chronological by extracted date)
     - version_label: "original" | "revision" | "expansion" | "final"
     - is_latest: true/false
     - supersedes: [list of earlier version filenames]

     VERSION CHAIN RULES:
     1. The LATEST version gets the primary vault note
     2. Earlier versions get lightweight notes linking to latest
     3. All versions appear in the TIMELINE (Step 8)
     4. Never discard earlier versions — they show evolution
     5. If content DIVERGES (not just updates), treat as siblings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  STEP 4: CLASSIFY — Route to Vault Category

  Use ANALYZE results. Route to the LIVE Obsidian vault structure.

  BUSINESS ROUTING (detect which business first):

  ┌────────────────────────────────┬──────────────────────────────────┐
  │  BUSINESS SIGNAL               │  VAULT DESTINATION               │
  ├────────────────────────────────┼──────────────────────────────────┤
  │  143 Leadership / Be The Light │                                  │
  │    Framework / Ray content     │  Businesses/143_Leadership/      │
  │    Assessment / scoring        │    Assessment/                   │
  │    Book manuscript / chapters  │    Book/                         │
  │    9 Rays master files         │    Framework/                    │
  │    Research / science refs     │    Research/                     │
  │    Marketing / campaigns       │    Marketing/                    │
  │    Coaching / debrief          │    Coaching/                     │
  │    App / product / tech        │    Product/                      │
  │    Brand / voice / positioning │    Brand/                        │
  │                                │                                  │
  │  JRW / Handmade Signs / JRWD  │  Businesses/JRW_Design/          │
  │    Product / signs / custom    │    Products/                     │
  │    Marketing / social / ads    │    Marketing/                    │
  │    Brand / voice / identity    │    Brand/                        │
  │    Operations / fulfillment    │    Operations/                   │
  │    Finance / pricing           │    Finance/                      │
  │                                │                                  │
  │  Ohio Made / We Are Ohio Made  │  Businesses/Ohio_Made/           │
  │    Events / markets            │    Events/                       │
  │    Partnerships / vendors      │    Partnerships/                 │
  │    Marketing / social          │    Marketing/                    │
  │    Brand / voice / identity    │    Brand/                        │
  │    Operations                  │    Operations/                   │
  └────────────────────────────────┴──────────────────────────────────┘

  CAREER + WORK ROUTING:

  ┌────────────────────────────────┬──────────────────────────────────┐
  │  SIGNAL                        │  VAULT DESTINATION               │
  ├────────────────────────────────┼──────────────────────────────────┤
  │  Resume / CV / cover letter    │  Career/Resumes/                 │
  │  Client work / deliverables    │  Career/Work_Product/            │
  │  PM training / certifications  │  Career/PM_Training/             │
  │  Performance reviews / goals   │  Career/Performance/             │
  │  LinkedIn strategy / profile   │  Career/LinkedIn/                │
  │  Career planning / transitions │  Career/Career_Planning/         │
  │  Evergreen / AES / IG work     │  Career/Work_Product/            │
  └────────────────────────────────┴──────────────────────────────────┘

  CONTENT + CREATIVE ROUTING:

  ┌────────────────────────────────┬──────────────────────────────────┐
  │  SIGNAL                        │  VAULT DESTINATION               │
  ├────────────────────────────────┼──────────────────────────────────┤
  │  Writing sample / portfolio    │  Writing_Samples/{category}/     │
  │    (Coaching, Sales, Business, │                                  │
  │     Personal, Technical)       │                                  │
  │  Social post / platform content│  Sample_Posts/{platform}/        │
  │    (Instagram, LinkedIn, etc.) │                                  │
  │  Blog / podcast / series       │  Content_Library/{format}/       │
  │  Copy (headlines, emails, LP)  │  Copy_Vault/{type}/              │
  └────────────────────────────────┴──────────────────────────────────┘

  KNOWLEDGE + REFERENCE ROUTING:

  ┌────────────────────────────────┬──────────────────────────────────┐
  │  SIGNAL                        │  VAULT DESTINATION               │
  ├────────────────────────────────┼──────────────────────────────────┤
  │  Research / science / academic │  Research/{domain}/              │
  │  Book notes / course notes     │  Learning/{format}/              │
  │  Competitor intelligence       │  Research/Business_Strategy/     │
  │  Tool / platform / guide       │  Reference/Tools/                │
  │  Framework / methodology       │  Reference/Frameworks/           │
  │  Meeting transcript / notes    │  Meetings/{type}/                │
  │  AI skills / prompts / config  │  Systems/{type}/                 │
  │  Financial / revenue / budget  │  Finance/{type}/                 │
  │  Sales / proposals / pricing   │  Sales/{type}/                   │
  │  Brand assets / logos / design │  Brand_Assets/{type}/            │
  │  Personal / family / health    │  Personal/{category}/            │
  │  Data files / imports / CSVs   │  Data/{type}/                    │
  └────────────────────────────────┴──────────────────────────────────┘

  FALLBACK ROUTING:

  ┌────────────────────────────────┬──────────────────────────────────┐
  │  Ideas / brainstorm / maybe    │  Ideas/                          │
  │  Active project / multi-file   │  Projects/Active/{slug}/         │
  │  Cannot determine              │  Inbox/                          │
  └────────────────────────────────┴──────────────────────────────────┘

  ROUTING RULES:
  1. BUSINESS FIRST — if content belongs to a specific business,
     route to that business folder, not a generic category.
  2. Cross-business content → route to primary business + tag others.
  3. Version chains → all versions go to same folder as the latest.
  4. If a file touches BOTH a business and career, business wins.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  STEP 5: DISTILL — Create the Vault Note

  YAML FRONTMATTER (required on every note):
  ---
  title: "[descriptive title from content]"
  date: [extracted date — see Step 2 DATE EXTRACTION]
  date_source: [filename|content|metadata|mtime]
  date_confidence: [exact|inferred|fallback]
  type: [search|scrape|synthesis|manual|decision|creation|idea]
  category: [learn|decide|create|observe|think]
  source: "[original description or URL]"
  source_path: "[absolute path to original file]"
  source_hash: "[first 8 chars of SHA-256 of source file]"
  source_skill: "brain-builder"
  brand: [detected brand or null]
  business: [143_leadership|jrw_design|ohio_made|null]
  project: [detected project or null]
  entities:
    people: [names mentioned]
    companies: [orgs mentioned]
    concepts: [frameworks mentioned]
    tools: [platforms mentioned]
  themes: [primary + secondary topics]
  quality:
    depth: [1-5]
    originality: [1-5]
    actionability: [1-5]
    freshness: [1-5]
  version:
    family: [base document name or null]
    order: [1, 2, 3... or null]
    label: [original|revision|expansion|final|null]
    is_latest: [true|false]
    supersedes: [list of earlier version note names or null]
    chain: ["[[v1-note]]", "[[v2-note]]", "[[v3-note]]"]
  tags: [hierarchical — see Step 6]
  related: [wiki-links — see Step 7]
  status: processed
  ---

  PROGRESSIVE SUMMARY LAYERS (every note starts with):

  > **One-line:** [Single sentence core value]
  > **Key insight:** [The one thing worth remembering]
  > **Date:** [YYYY-MM-DD] — *[date_source] ([date_confidence])*

  ## Core Content
  [Distilled note body — proportional to source size]

  ## Version History
  (Only if version.family is not null)
  | Version | Date | Label | Note |
  |---------|------|-------|------|
  | v1 | 2024-10-21 | original | [[link-to-v1]] |
  | v2 | 2025-01-16 | revision | [[link-to-v2]] |
  | v3 | 2025-06-04 | final | **this note** ← latest |

  ## Source
  - Original: [source_path]
  - Ingested: [date]
  - Hash: [source_hash]

  DISTILLATION RULES:
  - Files < 50 lines → preserve most content
  - Files 50-200 lines → distill to key findings + quotes + data
  - Files 200-500 lines → summarize sections + top insights
  - Files 500+ lines → executive summary + section takeaways
  - Structured data → schema + stats + sample + interpretation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  STEP 6: TAG — Hierarchical Tag Taxonomy

  Every note gets 5-15 tags across these hierarchies:

  ENTITY:    #person/{name}  #company/{name}  #tool/{name}
  THEME:     #topic/{theme}  #domain/{area}   #industry/{sector}
  CATEGORY:  #type/{type}    #category/{bucket}
  PROJECT:   #brand/{slug}   #campaign/{slug}  #project/{slug}
  STATUS:    #status/active  #status/reference  #status/stale
             #status/needs-action  #status/needs-research
  GRAPH:     #cluster/{group}  #hub  #bridge

  TAG RULES:
  1. Always hierarchical (#topic/leadership not #leadership)
  2. Slugify: lowercase, hyphens, no spaces
  3. Minimum 5 tags per note, maximum 15
  4. At least 1 entity, 1 theme, 1 category tag
  5. Reuse existing vault tags before creating new ones
  6. Run tag inventory from existing notes first

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  STEP 7: LINK — 5 Semantic Cross-Reference Algorithms

  ① ENTITY MATCH — same person/company/concept in 2+ notes
  ② THEME MATCH — 2+ shared theme tags = topically related
  ③ PROJECT MATCH — same project/campaign/brand
  ④ TEMPORAL MATCH — same day/week + shared theme
  ⑤ CITATION MATCH — one file mentions another by name/URL

  Links go in frontmatter `related:` AND inline [[wiki-links]].
  Density target: 2-8 outbound links per note.
  0 links = flag as orphan. 10+ links = hub/MOC candidate.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  STEP 8: MAP — Auto-MOCs + Brain Dashboard + Timeline

  A. AUTO-MOCs: When 5+ notes cluster around a shared entity,
  theme, or project → auto-generate MAP-{slug}.md.
  Don't duplicate existing MOCs — append new notes.
  MOCs go in the most relevant folder, not a central maps folder.
  Example: MAP-be-the-light-framework.md → Businesses/143_Leadership/

  B. BRAIN DASHBOARD: Create or update BRAIN-INDEX.md in vault root.
  The master entry point to the brain:
  - Total counts by business, category, and theme
  - Top MOCs with note counts
  - Hub notes (5+ connections)
  - Orphan notes (0 connections)
  - Recently added (last 10)
  - Open questions (from #status/needs-action)
  - Version families (documents with 2+ versions tracked)
  - Cross-business connections (notes linking across businesses)

  C. TIMELINE — Framework Evolution View

  Create TIMELINE.md in vault root. This is the chronological
  story of how everything evolved. Grouped by document family.

  FORMAT:
  ```
  # Timeline — Framework Evolution

  ## 2024

  ### October 2024
  - 2024-10-21 | **About Me** | Personal bio / origin story | [[about-me-oct-2022]]
  - 2024-10-xx | **Be The Light v1** | First framework draft | [[btl-framework-v1]]

  ### November 2024
  - 2024-11-xx | **Ray 1: Intention v1** | First Ray master | [[ray-1-intention-v1]]

  ## 2025
  ...

  ## 2026

  ### February 2026
  - 2026-02-24 | **Full Vault Ingest** | 59 notes created | [[2026-02-24]]
  - 2026-02-25 | **Obsidian Vault Built** | Live structure | [[HOME]]
  ```

  TIMELINE RULES:
  1. Every note with a date appears on the timeline
  2. Version families show as connected entries (→ arrows)
  3. Group by YEAR → MONTH for readability
  4. Flag entries with date_confidence: "fallback" with ≈ symbol
  5. Color-code by business (use emoji): 🔥 143, 🎨 JRW, 🌿 Ohio
  6. Include milestone markers for major events:
     ★ First version of a document family
     ⬆ Major revision (content changed >30%)
     🔒 Final/locked version
     📦 Batch ingest event
  7. Link every entry to its vault note with [[wiki-link]]
  8. Update TIMELINE.md on every future ingest (append, don't rewrite)

  D. INGEST REPORT — Post-Run Summary

  After every Brain Builder run, create a dated report:
  INGEST-REPORT-{YYYY-MM-DD}.md in vault root.

  Contains:
  - Files scanned / files ingested / files skipped (with reasons)
  - Notes created (by destination folder)
  - Version families detected (with chain details)
  - Duplicate flags (with merge/link decisions)
  - Date extraction stats (how many exact vs inferred vs fallback)
  - Cross-links created (count + top hubs)
  - MOCs generated or updated
  - Orphan notes (0 links — review needed)
  - Errors / warnings / files that couldn't be read

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DEDUPLICATION: Before creating any note, check for existing
  vault notes covering the same entity/topic:
  - Exact match → APPEND timestamped section to existing note
  - Partial match → create new note with "See also" link
  - Flag all duplicates in the ingest report
  - Version match → chain them, don't duplicate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  PARAMETERS:

  /vault ingest [path]         Ingest a folder (required)
  /vault brain [path]          Alias for ingest
  --dry-run                    Preview without creating notes
  --project [slug]             Tag all notes with project
  --brand [slug]               Tag all + load brand context
  --flatten                    Skip subfolder structure
  --preserve-structure         Mirror source folders in 04_Projects/
  --deep                       Maximum analysis depth (slower, richer)
  --watch                      Remember folder, only process new/changed
                               files on future runs

  INGEST RULES:

  1. NEVER modify or move source files. Read-only.
  2. DISTILL, don't duplicate. Summarize, don't copy.
  3. source_path + source_hash in frontmatter for two-way reference.
  4. Existing vault note for same entity? APPEND, don't duplicate.
  5. Respect .gitignore if present.
  6. 500+ files → batch in 50s with progress display.
  7. Data files → schema + stats + sample + interpretation.
  8. PDF files → text extract + section summaries.
  9. Media files → lightweight descriptor notes with metadata.
  10. Re-ingesting same folder → diff mode (new/modified only).
      Use source_hash to detect changed files since last ingest.
  11. After ingest → update daily note, BRAIN-INDEX, TIMELINE,
      stack.md, and generate INGEST-REPORT-{date}.md.
  12. Version families → chain all versions, primary note is latest.
  13. Extract dates on EVERY file (see Step 2 DATE EXTRACTION).
  14. Cross-business content → tag all relevant businesses, route
      to primary business folder.

  OBSIDIAN REST API PUSH:

  When Obsidian is running with the REST API plugin:
  - API: https://127.0.0.1:27124
  - Auth: Bearer token from Obsidian Local REST API plugin settings
  - PUT /vault/{path} — create or update a note (Content-Type: text/markdown)
  - GET /vault/{path}/ — list folder contents
  - GET /vault/{path} — read a note

  PUSH PROTOCOL:
  1. Test connection: curl -s -k -H "Authorization: Bearer {token}" https://127.0.0.1:27124/vault/
  2. If connected → push every created/updated note directly to Obsidian
  3. If not connected → write to local ./vault/ directory as fallback
  4. Report connection status in INGEST-REPORT
  5. Notes pushed to Obsidian appear INSTANTLY in the vault graph

  SESSION RESUME (for large ingests that span multiple sessions):

  After each batch of 50 files, write INGEST-PROGRESS.md to vault root:
  ---
  ingest_id: "{uuid}"
  started: "{datetime}"
  source_path: "{original folder path}"
  total_files: {N}
  processed: {N}
  remaining: {N}
  last_processed: "{filename}"
  notes_created: {N}
  version_families: {N}
  status: "in_progress" | "completed" | "interrupted"
  ---

  On session start, if INGEST-PROGRESS.md exists with status
  "in_progress" → offer to resume. Pick up from last_processed.

  CROSS-BUSINESS INTELLIGENCE:

  When a file references multiple businesses (e.g., brand architecture
  doc that covers 143 + JRW + Ohio Made):
  1. Route to the PRIMARY business folder
  2. Add cross-ref tags: #cross-biz/143-jrw, #cross-biz/all-three
  3. Add wiki-links to the other business _INDEX.md files
  4. Flag in BRAIN-INDEX under "Cross-Business Connections"
  5. These are high-value strategic notes — mark as #hub

  EXAMPLE USAGE:

  /vault brain ~/Desktop/research/
    Ingests desktop research — PDFs, bookmarks, notes, clippings.
    Builds fully linked brain with auto-generated MOCs.

  /vault ingest ~/Downloads/notion-export/ --deep
    Notion export with max analysis. Every page becomes a linked,
    tagged vault note. Rich entity extraction.

  /vault ingest ~/Documents/leadership-reading/ --project book-notes
    Folder of book notes and articles. Auto-creates
    MAP-book-notes.md from the cluster.

  /vault ingest ./campaigns/ --watch
    First run: full ingest. Future runs: only new/changed files.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## QUICK MODE

When a user makes a specific, single-action request, skip ceremony:

  "vault this" → Capture immediately. No status display, no scan.
  Confirm with one line: "Vaulted to Inbox/{slug}.md ✓"

  "vault this as [project]" → Same. One-line confirm.
  "save this research" → Same. Distill + save + confirm.
  "log this decision" → Capture to appropriate business or category. One-line confirm.
  "save this idea" → Capture to Ideas/. One-line confirm.

Quick Mode triggers: any single-capture request with clear parameters.
Full experience triggers: /vault scan, /vault process, /vault research.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SKILL INTEGRATION PROTOCOL

This is how ALL skills auto-feed the vault. When ./vault/ exists,
every skill silently creates vault notes from its work:

  Route using /brand-switch context (which business is active?):

  ┌──────────────────────────┬──────────────────────────────────────┐
  │  SKILL                   │  AUTO-VAULTS TO                      │
  ├──────────────────────────┼──────────────────────────────────────┤
  │  LEARN                   │                                      │
  │  /keyword-research       │  Businesses/{biz}/Marketing/         │
  │    SERP data, PAA, gaps  │    serp-{keyword-slug}.md            │
  │  /positioning-angles     │  Businesses/{biz}/Brand/             │
  │    Competitor messaging   │    competitor-{slug}.md              │
  │    Angle chosen           │    positioning-{slug}.md             │
  │  /research-engine        │  Research/{domain}/                  │
  │    Frameworks, people     │    {framework-slug}.md               │
  │                          │                                      │
  │  DECIDE                  │                                      │
  │  /brand-voice            │  Businesses/{biz}/Brand/             │
  │    Voice profile created  │    voice-{brand}-{date}.md           │
  │  /lead-magnet            │  Businesses/{biz}/Marketing/         │
  │    Concept selected       │    magnet-{slug}.md                  │
  │                          │                                      │
  │  CREATE                  │                                      │
  │  /direct-response-copy   │  Copy_Vault/{type}/                  │
  │    Headlines + scores     │    copy-{slug}-{date}.md             │
  │  /seo-content            │  Content_Library/Blog/               │
  │    Article + SERP data    │    article-{slug}.md                 │
  │  /email-sequences        │  Copy_Vault/Emails/                  │
  │    Sequence + subjects    │    emails-{slug}-{date}.md           │
  │  /newsletter             │  Content_Library/Blog/               │
  │    Edition published      │    newsletter-{date}.md              │
  │  /content-atomizer       │  Sample_Posts/{platform}/            │
  │    Platform breakdown     │    atomized-{slug}-{date}.md         │
  │  /creative               │  Brand_Assets/{type}/                │
  │    Style decisions        │    style-{slug}.md                   │
  │  /gamma                  │  Content_Library/{format}/           │
  │    Deck/doc created       │    gamma-{slug}-{date}.md            │
  │                          │                                      │
  │  OBSERVE                 │                                      │
  │  /bralph                 │  Businesses/{biz}/Product/           │
  │    Audit + drift reports  │    audit-{date}.md                   │
  │  /assessment-engine      │  Businesses/143_Leadership/Assessment│
  │    Scoring + intel        │    scored-{run}-{date}.md            │
  │  /coaching-engine        │  Businesses/143_Leadership/Coaching/ │
  │    Session + patterns     │    session-{date}.md                 │
  │  /app-developer          │  Businesses/143_Leadership/Product/  │
  │    Tech decisions + UX    │    arch-{slug}-{date}.md             │
  └──────────────────────────┴──────────────────────────────────────┘

  {biz} = active brand from /brand-switch:
  - 143_leadership → Businesses/143_Leadership/
  - jrw_design     → Businesses/JRW_Design/
  - ohio_made      → Businesses/Ohio_Made/
  - null/unknown   → route by content signal (see Step 4)

### Integration Rules

  1. Auto-vault is ALWAYS ON. Every significant activity vaults.
     See CLAUDE.md `/obsidian Auto-Vault Rule` for the full trigger list.
     If ./vault/ doesn't exist, create it (run /vault init).

  2. Auto-vaulted notes are DISTILLED, not raw.
     A full SERP analysis becomes a 100-word note with key data.
     A 2,000-word email sequence becomes subject lines + rationale.
     Max 500 words per auto-vault note. Insight, not dump.

  3. Auto-vaulted notes go to the correct subfolder,
     NOT to Inbox/. These are already categorized by the routing table above.

  4. Auto-vaulted notes MUST include frontmatter with:
     - source_skill: the skill that created the note
     - category: learn | decide | create | observe | think
     - project: the campaign/project context
     - brand: the active brand at time of creation
     - search_query: the original query/question that triggered this work
     - search_intent: what the user was really trying to learn or solve
     - tags: include "#auto-vault" on every auto-vaulted note

  5. Auto-vault does NOT interrupt skill flow. Notes are created
     silently. The session end summary reports what was vaulted.

  6. Each skill's auto-vault is additive. If a vault note for
     "BetterUp" already exists, the skill APPENDS a timestamped
     section — never overwrites.

  7. Decision notes capture the WHY, not just the what.
     "Chose Contrarian angle" is useless. "Chose Contrarian angle
     because 4/5 competitors use Direct Benefit" is knowledge.

  8. OBSIDIAN PUSH IS MANDATORY. After writing to local ./vault/,
     ALWAYS push to Obsidian via the REST API (use /obsidian MODE 11).
     If Obsidian is down → write locally, append to pending-sync.md.

  9. SEARCH QUERY LOGGING IS MANDATORY. Every web search, research
     query, or information-gathering question gets appended to
     Systems/Workflows/search-query-log.md via /obsidian MODE 12.
     This builds the pattern map even when the search itself isn't
     significant enough to create a full vault note.

  10. SESSION END REPORT must include:
      - Number of notes auto-vaulted this session
      - Number of search queries logged
      - Any notes that failed to push to Obsidian (pending sync)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## PATTERN ENGINE — "SO WHAT" LAYER

Pattern detection (MODE 4) doesn't just report patterns — it
recommends specific skill actions. Every pattern insight includes
a concrete next step.

### Recommendation Rules

  PATTERN                          → RECOMMENDED ACTION
  ─────────────────────────────────────────────────────────
  Competitor researched 3+         → /positioning-angles
  times, no positioning written       "You know them. Now position
                                       against them."

  Topic cluster growing,           → /vault research [topic]
  fewer than 5 sources                "Build this cluster out.
                                       You're onto something."

  Keyword/topic appears 5+        → /keyword-research
  times across sessions               "Validate search volume.
                                       Your audience may care too."

  Research on topic but no         → /seo-content
  content produced                    "You have the research.
                                       Turn it into content."

  Blind spot referenced 3+        → /vault research-next
  times, no vault note                "Fill this gap. It keeps
                                       coming up for a reason."

  Audit findings stale 30+        → /bralph
  days, app has changed               "Re-audit. Things may have
                                       drifted since last check."

  Research spans 2+ brands,       → Review cross-pollination
  same topic                          "This insight applies to
                                       multiple businesses."

  Pattern cluster has 10+         → /vault map [topic]
  notes but no MOC                    "Create a Map of Content.
                                       This topic is mature enough."

  Daily notes show oscillation    → Manual review
  (A→B→A→B pattern)                  "You keep circling between
                                       these. Decision needed?"

### Display Format

  Each insight in the Pattern Radar includes:

  → INSIGHT: [what the pattern shows]
    ACTION:  /[skill] — [what to do] (~[time estimate])
    WHY:     [one-sentence rationale]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## CONNECTING TO OBSIDIAN

The vault is plain markdown — Obsidian is optional but powerful.

### Setup (one-time, ~2 minutes)

  1. Install Obsidian (free): https://obsidian.md
  2. Open Obsidian → "Open folder as vault"
  3. Navigate to your ./vault/ directory
  4. Obsidian indexes all notes automatically

### Recommended Plugin Setup

  After opening the vault, install these community plugins:
  (Settings → Community plugins → Browse)

  ★ REQUIRED for full experience:

  Dataview (obsidian-dataview)
    → Enables the pre-built queries in this skill
    → Query vault notes like a database
    → Install → Enable → No config needed

  Templater (templater-obsidian)
    → Auto-applies note templates on creation
    → Settings → Template folder: _templates

  ★ RECOMMENDED:

  Obsidian Git (obsidian-git)
    → Auto-backup vault to git repository
    → Settings → Auto-commit interval: 10 minutes
    → Requires git repo initialized (/vault git-init)

  ○ OPTIONAL (enhances graph view):

  Smart Connections
    → AI-powered related note suggestions
    → Finds connections the pattern engine misses
    → Uses local embeddings (no API key needed)

  Graph Analysis
    → Advanced graph metrics (betweenness, closeness)
    → Quantifies hub/bridge/orphan detection

### iCloud Sync Warning

  IMPORTANT: This project lives in iCloud Drive. If you use
  Obsidian Sync (paid), it CONFLICTS with iCloud sync. You will
  get duplicate files and sync corruption.

  Safe options:
  ✓ iCloud only (no Obsidian Sync) — works automatically
  ✓ Git-based sync (via Obsidian Git plugin) — version controlled
  ✗ Obsidian Sync + iCloud — DO NOT combine these

  Since the vault is already in iCloud Drive, it syncs to all
  your Apple devices automatically. No additional sync needed.

### Using the Vault in Obsidian

  GRAPH VIEW (Cmd+G):
  - Visualizes all vault notes as a connected graph
  - Color-coded by folder (people=blue, companies=orange, etc.)
  - Hub notes appear larger (more connections)
  - Orphan notes appear isolated at the edges
  - Use this to visually spot clusters and gaps

  SEARCH (Cmd+Shift+F):
  - Full-text search across all vault notes
  - Filters by path, tag, or frontmatter property
  - Faster than /vault search for quick lookups

  DAILY NOTES:
  - Obsidian's Daily Notes core plugin auto-opens today's note
  - Settings → Daily notes → Folder: 05_Daily
  - Format: YYYY-MM-DD

  TAGS PANE:
  - Shows all tags with counts
  - Click to filter by tag
  - Hierarchical tags (#assessment/pricing) show as nested

  BACKLINKS:
  - Every note shows what links TO it
  - This is the manual version of the pattern engine's graph
  - Use backlinks panel to discover unexpected connections

### Obsidian URI Scheme

  Open specific vault notes from terminal or other apps:

  obsidian://open?vault=vault&file=01_Sources/companies/betterup

  This enables:
  - /vault open [note] → opens in Obsidian directly
  - Clickable links in terminal output (if terminal supports URIs)
  - Integration with other automation tools

### Mobile Access

  Obsidian mobile (iOS/Android) opens the same vault:
  - iOS: vault syncs via iCloud automatically
  - Android: use Obsidian Git plugin or Syncthing

  Read-only review of vault notes works on mobile.
  Capture is best done via Claude Code on desktop.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ANTI-PATTERNS

  ✗ DO NOT dump raw scraped content into vault notes.
    Always distill to key findings, data points, and quotes.
    Raw HTML and boilerplate destroy signal-to-noise ratio.

  ✗ DO NOT create notes without frontmatter.
    Frontmatter is what makes the pattern engine work.
    Every note needs: title, date, type, tags, status.

  ✗ DO NOT create flat tag taxonomies.
    Use hierarchical tags: #assessment/pricing not just #pricing.
    Nested tags enable drill-down pattern detection.

  ✗ DO NOT skip the daily note.
    Daily notes are the pattern engine's time-series data.
    Without dates, you can't detect trends or drift.

  ✗ DO NOT vault everything.
    Only vault findings worth returning to. A search that
    yields nothing useful doesn't need a note. Quality > quantity.

  ✗ DO NOT let the inbox grow past 20 items.
    Process the inbox regularly. Unsorted notes are invisible
    to the pattern engine and won't generate links.

  ✗ DO NOT create MOCs for fewer than 5 notes.
    A MOC with 2 links is noise. Wait until a cluster is real.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## WHAT'S NEXT

  After vault init:
  → /vault research [topic]    Deep-dive with auto-vault
  → /vault scan                Check for patterns in existing research

  After accumulating 20+ notes:
  → /vault scan                First meaningful pattern detection
  → /vault process             Sort the inbox

  When starting a new skill:
  → /vault export for /[skill] Pull relevant vault knowledge

  When research feels scattered:
  → /vault scan                See where your focus actually is
  → /vault map [topic]         Create a Map of Content

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## CONNECTIONS

  The vault connects to EVERY skill. Key flows:

  LEARN → DECIDE
  /vault → /positioning-angles
    Competitor intel in vault feeds positioning decisions.
    Gaps in research = positioning white space.

  /vault → /keyword-research
    Pattern clusters reveal keyword opportunities.
    Topics you keep researching = audience topics.

  LEARN → CREATE
  /vault → /seo-content
    Vault notes become source material for articles.
    Data points and quotes pre-loaded for content.

  /vault → /direct-response-copy
    Decision notes provide angle + rationale for copy.
    Competitor scrapes provide differentiation proof.

  /vault → /content-atomizer
    Synthesis notes are ideal source content for atomization.
    One vault synthesis → 16 platform-optimized pieces.

  CREATE → OBSERVE
  /vault → /bralph
    Creation notes track what was built and when.
    Audit notes track what drifted and why.

  OBSERVE → LEARN (the loop)
  /vault → /assessment-engine
    Assessment results feed back into research priorities.
    Client patterns reveal what to study next.

  /vault → /coaching-engine
    Coaching session notes reveal recurring client themes.
    Pattern detection surfaces what tools work best.

  /vault → /app-developer
    UX audit findings + user feedback compound.
    Decision notes track architectural evolution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## QUICK REFERENCE

  /vault init                    Create the vault
  /vault add                     Capture current context
  /vault research [topic]        Deep-dive + auto-vault
  /vault research-next           Auto-research top queue item
  /vault process                 Sort inbox → sources
  /vault scan                    Run pattern detection
  /vault search [query]          Search vault by content/tag
  /vault merge [note1] [note2]   Combine related notes
  /vault queue                   Show research queue from gaps
  /vault daily                   View/create today's log
  /vault map [topic]             Create Map of Content
  /vault export for /[skill]     Extract for another skill
  /vault brain [folder]          Build second brain from any folder
  /vault ingest [folder]         Alias for brain (same behavior)
  /vault brain [folder] --dry-run   Preview without creating
  /vault brain [folder] --deep   Maximum analysis + entity extraction
  /vault brain [folder] --watch  Incremental (new/changed only)
  /vault status                  Vault stats dashboard
  vault this                     Quick-capture shortcut
  vault this as [project]        Capture to specific project
