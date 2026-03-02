# Vault Schema Reference

## Directory Structure

```
./vault/
│
├── .obsidian/                          Obsidian app configuration
│   ├── app.json                        Core settings
│   ├── appearance.json                 Theme settings
│   ├── community-plugins.json          Plugin list
│   └── graph.json                      Graph view settings
│
├── 00_Inbox/                           Raw captures, unsorted
│   └── {YYYY-MM-DD}-{slug}.md         Date-prefixed for sort order
│
├── 01_Sources/                         LEARN — External knowledge
│   ├── people/                         Researchers, thought leaders, clients
│   │   └── {person-name}.md            One note per person
│   ├── companies/                      Competitors, market players, vendors
│   │   └── {company-slug}.md           One note per company
│   ├── concepts/                       Frameworks, models, theories, methods
│   │   └── {concept-slug}.md           One note per concept
│   ├── tools/                          Software, platforms, APIs, services
│   │   └── {tool-slug}.md              One note per tool
│   └── data/                           Statistics, benchmarks, studies, numbers
│       └── {topic-slug}.md             One note per data cluster
│
├── 02_Decisions/                       DECIDE — Strategic choices made
│   ├── positioning/                    Angles chosen, market positions taken
│   │   └── {slug}-{YYYY-MM-DD}.md
│   ├── architecture/                   Technical decisions, stack choices
│   │   └── {slug}-{YYYY-MM-DD}.md
│   ├── strategy/                       Business strategy, pricing, go-to-market
│   │   └── {slug}-{YYYY-MM-DD}.md
│   └── brand/                          Voice decisions, naming, identity choices
│       └── {slug}-{YYYY-MM-DD}.md
│
├── 03_Creations/                       CREATE — Work product log
│   ├── copy/                           Headlines, landing pages, emails written
│   │   └── {slug}-{YYYY-MM-DD}.md
│   ├── content/                        Blog posts, newsletters, social content
│   │   └── {slug}-{YYYY-MM-DD}.md
│   ├── campaigns/                      Campaign briefs, launch plans, results
│   │   └── {slug}-{YYYY-MM-DD}.md
│   ├── assessments/                    Assessment designs, scoring decisions
│   │   └── {slug}-{YYYY-MM-DD}.md
│   └── coaching/                       Coaching session notes, client patterns
│       └── session-{YYYY-MM-DD}.md
│
├── 04_Projects/                        Active project folders
│   └── {project-slug}/                 One folder per project
│       ├── _project-brief.md           Project goals and context
│       └── {note-slug}.md              Project-specific notes
│
├── 05_Daily/                           Daily work logs (all activity)
│   └── {YYYY-MM-DD}.md                One per day, append-only
│
├── 06_Maps/                            Maps of Content (MOCs)
│   └── map-{topic-slug}.md            Topic index notes
│
├── 07_Patterns/                        Auto-detected recurring themes
│   └── pattern-{YYYY-MM-DD}-{slug}.md Pattern reports from scan
│
├── 08_Ideas/                           THINK — Hypotheses, brainstorms, sparks
│   └── idea-{YYYY-MM-DD}-{slug}.md
│
├── 09_Feedback/                        OBSERVE — Results, metrics, learnings
│   └── {type}-{YYYY-MM-DD}-{slug}.md  type = audit | results | feedback
│
├── 10_Archive/                         Completed project work
│   ├── {project-slug}/                 Moved from 04_Projects when done
│   └── merged/                         Originals after /vault merge
│
└── _templates/                         Note templates (13 total)
    ├── tpl-search.md                   Web search capture
    ├── tpl-scrape.md                   Firecrawl/page scrape
    ├── tpl-synthesis.md                Perplexity/AI synthesis
    ├── tpl-manual.md                   Manual vault-this capture
    ├── tpl-decision.md                 Strategic decision log
    ├── tpl-creation.md                 Work product log
    ├── tpl-idea.md                     Hypothesis / brainstorm
    ├── tpl-feedback.md                 Results / metrics / feedback
    ├── tpl-coaching.md                 Coaching session note
    ├── tpl-daily.md                    Daily work log
    ├── tpl-pattern.md                  Pattern report
    ├── tpl-moc.md                      Map of Content
    └── tpl-project-brief.md            Project brief
```

## File Naming Conventions

  INBOX:       {YYYY-MM-DD}-{descriptive-slug}.md
  SOURCES:     {descriptive-slug}.md (no date prefix — entity-based)
  DECISIONS:   {slug}-{YYYY-MM-DD}.md (date suffix — evolving)
  CREATIONS:   {slug}-{YYYY-MM-DD}.md (date suffix — point-in-time)
  IDEAS:       idea-{YYYY-MM-DD}-{slug}.md
  FEEDBACK:    {type}-{YYYY-MM-DD}-{slug}.md
  PROJECTS:    {descriptive-slug}.md (within project folder)
  PATTERNS:    pattern-{YYYY-MM-DD}-{slug}.md
  DAILY:       {YYYY-MM-DD}.md
  MAPS:        map-{topic-slug}.md

  Slugs: lowercase, hyphens, no special characters
  Examples:
    00_Inbox/2026-02-24-ai-adaptive-testing-pricing.md
    01_Sources/people/adam-grant.md
    01_Sources/companies/betterup.md
    01_Sources/concepts/item-response-theory.md
    02_Decisions/positioning/contrarian-angle-2026-02-24.md
    02_Decisions/architecture/supabase-rls-drop-2026-02-24.md
    03_Creations/copy/btl-landing-page-2026-02-24.md
    03_Creations/coaching/session-2026-02-24.md
    04_Projects/143-assessment/competitor-pricing-matrix.md
    05_Daily/2026-02-24.md
    06_Maps/map-ai-coaching.md
    08_Ideas/idea-2026-02-24-adaptive-eclipse-scoring.md
    09_Feedback/audit-2026-02-24-bralph-full.md

## Frontmatter Schema

### Required Fields (all note types)

```yaml
---
title: "Human-readable title"
date: YYYY-MM-DD
type: search | scrape | synthesis | manual | decision | creation | idea | feedback | coaching | pattern | daily | moc | project-brief
category: learn | decide | create | observe | think
tags:
  - topic/subtopic
  - category
status: inbox | processed | archived
---
```

### Common Extended Fields

```yaml
source_skill: skill that auto-created the note (e.g., "positioning-angles")
project: project-slug
brand: brand-slug
related: []  # auto-populated wiki-links
```

### Extended Fields (by note type)

#### Search Notes (type: search)
```yaml
query: "the exact search query used"
engine: google | perplexity | websearch
results_count: 10
top_results:
  - url: https://...
    title: "Result title"
```

#### Scrape Notes (type: scrape)
```yaml
source_url: https://...
method: firecrawl | webfetch | manual
scraped_date: YYYY-MM-DD
word_count: 1200
content_type: article | landing-page | documentation | pricing | about
```

#### Synthesis Notes (type: synthesis)
```yaml
query: "the research question"
engine: perplexity | manual
sources_cited: 8
source_urls:
  - https://...
confidence: high | medium | low
```

#### Manual Notes (type: manual)
```yaml
context: "what was being worked on when captured"
project: project-slug
brand: brand-slug
```

#### Pattern Notes (type: pattern)
```yaml
scan_date: YYYY-MM-DD
notes_analyzed: 147
time_window: 7d | 30d | 90d | all
patterns_detected: 5
```

#### Daily Notes (type: daily)
```yaml
session_count: 2
notes_created: 7
notes_linked: 4
new_tags: ["#ai-coaching", "#adaptive"]
```

#### Decision Notes (type: decision)
```yaml
decision: "what was decided"
rationale: "why — the actual reasoning"
alternatives: ["option A", "option B"]
context: "what prompted the decision"
reversible: true | false
source_skill: "positioning-angles"
```

#### Creation Notes (type: creation)
```yaml
asset_type: landing-page | email-sequence | blog-post | newsletter | deck | social
deliverable: "what was produced"
source_skill: "direct-response-copy"
campaign: campaign-slug
performance: {}  # filled in later with results
```

#### Idea Notes (type: idea)
```yaml
hypothesis: "the core idea"
confidence: high | medium | low | wild-guess
related_project: project-slug
actionable: true | false
next_step: "what would validate this"
```

#### Feedback Notes (type: feedback)
```yaml
feedback_type: audit | user-feedback | metrics | test-results
source: "who or what provided the feedback"
sentiment: positive | negative | mixed | neutral
actionable_items: []
```

#### Coaching Notes (type: coaching)
```yaml
client: "client name or anonymous"
tier: 1 | 2 | 3
tools_used: ["tool names from coaching engine"]
patterns_observed: []
breakthroughs: []
```

#### MOC Notes (type: moc)
```yaml
auto_generated: true | false
note_count: 12
last_updated: YYYY-MM-DD
topic: "topic name"
```

## Tag Taxonomy

Use hierarchical tags for drill-down pattern detection.

### Top-Level Categories

```
#assessment/        Assessment and testing
#leadership/        Leadership development
#coaching/          Coaching and behavior change
#competitor/        Competitive intelligence
#market/            Market research and sizing
#tech/              Technology and tools
#science/           Research and neuroscience
#business/          Business models and strategy
#content/           Content and marketing
#product/           Product development
#decision/          Strategic decisions made
#creation/          Work products created
#idea/              Hypotheses and brainstorms
#feedback/          Results, audits, metrics
```

### Example Nested Tags

```
#assessment/pricing
#assessment/adaptive
#assessment/validity
#assessment/competitor
#competitor/betterup
#competitor/gallup
#competitor/hogan
#science/neuroscience
#science/behavioral
#science/measurement
#market/sizing
#market/trends
#market/enterprise
#tech/ai
#tech/platforms
#tech/integrations
#decision/positioning
#decision/architecture
#decision/brand
#decision/strategy
#creation/copy
#creation/content
#creation/campaign
#creation/assessment
#idea/product
#idea/content
#idea/positioning
#feedback/audit
#feedback/user
#feedback/metrics
#coaching/session
#coaching/pattern
#coaching/breakthrough
```

### Special Tags

```
#hot                 Currently active topic
#stale               Not touched in 30+ days
#blind-spot          Referenced but never researched
#actionable          Has clear next step
#high-signal         Exceptionally valuable finding
#revisit             Flagged for re-evaluation
#cross-brand         Applies to multiple businesses
```

## Wiki-Link Conventions

Use [[double brackets]] for internal vault links.

  LINK TO NOTE:     [[note-title]]
  LINK TO HEADING:  [[note-title#heading]]
  ALIASED LINK:     [[note-title|display text]]

### Auto-Linking Rules

When creating a new note, scan for links to create:

  1. ENTITY MATCH — If note mentions a person/company/tool that
     has its own note in 01_Sources/, create a wiki-link.

  2. TAG MATCH — If note shares 2+ tags with another note,
     add to the "related" frontmatter field.

  3. PROJECT MATCH — If note is project-tagged, link to the
     project brief note.

  4. TEMPORAL MATCH — If note was created same day as related
     notes, add to daily note's research log.

## Obsidian Graph Settings

### graph.json
```json
{
  "collapse-filter": false,
  "search": "",
  "showTags": true,
  "showAttachments": false,
  "hideUnresolved": false,
  "showOrphans": true,
  "collapse-color-groups": false,
  "colorGroups": [
    { "query": "path:01_Sources/people", "color": { "a": 1, "rgb": 3447003 } },
    { "query": "path:01_Sources/companies", "color": { "a": 1, "rgb": 16729344 } },
    { "query": "path:01_Sources/concepts", "color": { "a": 1, "rgb": 6591981 } },
    { "query": "path:02_Decisions", "color": { "a": 1, "rgb": 16753920 } },
    { "query": "path:03_Creations", "color": { "a": 1, "rgb": 3381759 } },
    { "query": "path:06_Maps", "color": { "a": 1, "rgb": 16776960 } },
    { "query": "path:07_Patterns", "color": { "a": 1, "rgb": 16711935 } },
    { "query": "path:08_Ideas", "color": { "a": 1, "rgb": 10025880 } },
    { "query": "path:09_Feedback", "color": { "a": 1, "rgb": 16744448 } }
  ],
  "collapse-display": false,
  "showArrow": true,
  "textFadeMultiplier": 0,
  "nodeSizeMultiplier": 1,
  "lineSizeMultiplier": 1,
  "collapse-forces": true,
  "centerStrength": 0.5,
  "repelStrength": 10,
  "linkStrength": 1,
  "linkDistance": 250
}
```

Graph colors:
  People      = Blue (#3478CB)
  Companies   = Orange (#FF6600)
  Concepts    = Green (#649B6D)
  Decisions   = Amber (#FFB000)
  Creations   = Cyan (#33A0FF)
  Maps        = Yellow (#FFFF00)
  Patterns    = Magenta (#FF00FF)
  Ideas       = Sage (#990F98)
  Feedback    = Red-Orange (#FFB200)
