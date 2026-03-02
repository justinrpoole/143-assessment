# Vault Note Templates

These templates are written to ./vault/_templates/ on vault init.
They define the structure for each note type.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 1: Search Note (tpl-search.md)

```markdown
---
title: "{{title}}"
date: {{date}}
type: search
query: "{{query}}"
engine: {{engine}}
tags:
  - {{tag1}}
  - {{tag2}}
related: []
status: inbox
---

# {{title}}

## Search Query
> {{query}}

## Key Findings

1. **Finding** — Description and significance
2. **Finding** — Description and significance
3. **Finding** — Description and significance

## Top Results

| # | Title | URL | Relevance |
|---|-------|-----|-----------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## Data Points

- Stat (source)
- Stat (source)

## Connections

- [[Related Note]] — how it connects

## Notes

{{any observations or next steps}}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 2: Scrape Note (tpl-scrape.md)

```markdown
---
title: "{{title}}"
date: {{date}}
type: scrape
source_url: "{{url}}"
method: {{firecrawl|webfetch|manual}}
content_type: {{article|landing-page|documentation|pricing|about}}
tags:
  - {{tag1}}
  - {{tag2}}
related: []
status: inbox
---

# {{title}}

## Source
- URL: {{url}}
- Retrieved: {{date}}
- Method: {{method}}
- Content type: {{content_type}}

## Key Findings

1. **Finding** — What matters and why
2. **Finding** — What matters and why
3. **Finding** — What matters and why

## Data Points

- Stat or metric (context)
- Stat or metric (context)

## Quotes Worth Saving

> "Quote" — Attribution

## Frameworks / Models Mentioned

- Framework name — brief description of relevance

## Connections

- [[Related Note]] — how it connects

## Assessment

**Signal strength:** high | medium | low
**Actionable?** yes/no — if yes, what action?
**Follow-up needed?** yes/no — if yes, what question?
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 3: Synthesis Note (tpl-synthesis.md)

```markdown
---
title: "{{title}}"
date: {{date}}
type: synthesis
query: "{{research question}}"
engine: {{perplexity|manual}}
sources_cited: {{count}}
source_urls:
  - {{url1}}
  - {{url2}}
confidence: {{high|medium|low}}
tags:
  - {{tag1}}
  - {{tag2}}
related: []
status: inbox
---

# {{title}}

## Research Question
> {{query}}

## Synthesis

{{2-4 paragraph distillation of findings across sources.
Not a copy of any single source — a NEW synthesis that
connects dots across multiple inputs.}}

## Key Takeaways

1. **Takeaway** — Implication for our work
2. **Takeaway** — Implication for our work
3. **Takeaway** — Implication for our work

## Data Points

- Stat (source)
- Stat (source)

## Sources Consulted

1. [Source title](url) — what it contributed
2. [Source title](url) — what it contributed

## Open Questions

- Question that emerged from this research?
- Gap that needs further investigation?

## Connections

- [[Related Note]] — how it connects

## Confidence Assessment

**Overall confidence:** {{high|medium|low}}
**Why:** {{brief rationale for confidence level}}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 4: Manual Capture (tpl-manual.md)

```markdown
---
title: "{{title}}"
date: {{date}}
type: manual
context: "{{what was being worked on}}"
project: {{project-slug}}
brand: {{brand-slug}}
tags:
  - {{tag1}}
  - {{tag2}}
related: []
status: inbox
---

# {{title}}

## Context
Captured while working on: {{context description}}

## Key Points

1. **Point** — Detail
2. **Point** — Detail
3. **Point** — Detail

## Insights

{{Any realizations, connections, or ideas that emerged}}

## Data / Evidence

- Fact or data point (source if available)

## Next Steps

- [ ] Action item
- [ ] Action item

## Connections

- [[Related Note]] — how it connects
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 5: Daily Research Log (tpl-daily.md)

```markdown
---
title: "Research Log — {{YYYY-MM-DD}}"
date: {{YYYY-MM-DD}}
type: daily
session_count: 0
notes_created: 0
notes_linked: 0
new_tags: []
tags:
  - meta/daily
status: processed
---

# Research Log — {{YYYY-MM-DD}}

## Sessions

### Session 1 — {{time or context}}

**Focus:** {{what was being researched}}

**Notes created:**
- [[Note 1]] — brief description
- [[Note 2]] — brief description

**Key findings:**
- Finding 1
- Finding 2

**Tags used:** #tag1, #tag2

---

## Daily Summary

**Total notes:** {{count}}
**New connections:** {{count}}
**Emerging themes:** {{brief list}}

## Tomorrow's Research Queue

- [ ] Topic or question to investigate
- [ ] Follow-up from today's findings
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 6: Pattern Report (tpl-pattern.md)

```markdown
---
title: "Pattern Report — {{YYYY-MM-DD}}"
date: {{YYYY-MM-DD}}
type: pattern
scan_date: {{YYYY-MM-DD}}
notes_analyzed: {{count}}
time_window: {{7d|30d|90d|all}}
patterns_detected: {{count}}
tags:
  - meta/pattern-report
status: processed
---

# Pattern Report — {{YYYY-MM-DD}}

## Vault Stats

| Metric | Count |
|--------|-------|
| Total notes | |
| Notes this week | |
| Inbox pending | |
| Active projects | |
| Total tags | |
| Hub notes | |
| Orphan notes | |

## Hot Topics (7-day weighted)

| Tag | Weighted | Raw | Trend |
|-----|----------|-----|-------|
| | | | |

## Research Clusters

### Cluster: "{{name}}"
- **Tags:** {{tag list}}
- **Sessions:** {{count}}
- **Trend:** {{GROWING|STABLE|SPLITTING|NEW}}
- **Notes:** {{linked note list}}

## Knowledge Graph Summary

### Hubs (5+ connections)
- [[Note]] — {{degree}} connections

### Bridges
- [[Note]] — connects {{cluster A}} ←→ {{cluster B}}

### Orphans
- [[Note]] — created {{date}}, 0 connections

## Blind Spots

| Entity | Mentions | Notes | Priority |
|--------|----------|-------|----------|
| | | | |

## Staleness Report

| Note | Last Touched | Degree | Action |
|------|-------------|--------|--------|
| | | | |

## Focus Drift (4-week view)

```
Week 1  ██████████  Topic
Week 2  ██████████  Topic
Week 3  ██████████  Topic
Week 4  ██████████  Topic
```

## Insights & Recommendations

1. **Insight** — Recommended action
2. **Insight** — Recommended action
3. **Insight** — Recommended action
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 7: Map of Content (tpl-moc.md)

```markdown
---
title: "MAP: {{Topic}}"
date: {{YYYY-MM-DD}}
type: moc
auto_generated: {{true|false}}
note_count: {{count}}
last_updated: {{YYYY-MM-DD}}
topic: "{{topic}}"
tags:
  - meta/moc
  - {{topic-tag}}
status: processed
---

# {{Topic}}

> {{One-sentence description of this topic cluster}}

## Core Concepts
- [[Concept Note]] — brief description
- [[Concept Note]] — brief description

## Key People
- [[Person Note]] — relevance to this topic
- [[Person Note]] — relevance to this topic

## Companies & Tools
- [[Company Note]] — how they relate
- [[Tool Note]] — how it's used

## Data & Evidence
- [[Data Note]] — key stat or finding
- [[Data Note]] — key stat or finding

## Our Work
- [[Project Note]] — how we're applying this
- [[Asset created]] — what we've produced

## Open Questions
- Unanswered question about this topic?
- Gap in our understanding?

## Related Maps
- [[MAP: Related Topic]] — how these connect
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 8: Project Brief (tpl-project-brief.md)

```markdown
---
title: "Project: {{Project Name}}"
date: {{YYYY-MM-DD}}
type: project-brief
project: {{project-slug}}
brand: {{brand-slug}}
status: active
tags:
  - project/{{project-slug}}
related: []
---

# Project: {{Project Name}}

## Research Goals

1. **Goal** — What we need to learn
2. **Goal** — What we need to learn
3. **Goal** — What we need to learn

## Key Questions

- Research question 1?
- Research question 2?
- Research question 3?

## Research Log

| Date | Action | Note | Status |
|------|--------|------|--------|
| | | [[Note]] | |

## Findings Summary

{{Updated as research progresses — running synthesis of
what we've learned so far for this project.}}

## Decisions Made

- **Decision** (date) — rationale
- **Decision** (date) — rationale

## Next Steps

- [ ] Research action
- [ ] Research action
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 9: Decision Note (tpl-decision.md)

```markdown
---
title: "DECISION: {{title}}"
date: {{date}}
type: decision
category: decide
decision: "{{what was decided}}"
rationale: "{{why — the actual reasoning}}"
alternatives:
  - "{{option A}}"
  - "{{option B}}"
context: "{{what prompted this decision}}"
reversible: {{true|false}}
source_skill: "{{skill that prompted it}}"
project: {{project-slug}}
brand: {{brand-slug}}
tags:
  - decision/{{domain}}
  - {{topic-tag}}
related: []
status: processed
---

# DECISION: {{title}}

## What Was Decided
{{One clear sentence stating the decision.}}

## Why (Rationale)
{{The actual reasoning — not just "because it seemed right."
What evidence, pattern, or insight drove this choice?}}

## Alternatives Considered
1. **{{Option A}}** — why rejected
2. **{{Option B}}** — why rejected

## Context
- Prompted by: {{what triggered this decision}}
- Skill session: /{{skill name}}
- Date: {{date}}

## Expected Outcome
{{What you expect to happen as a result of this decision.}}

## Connections
- [[Related Note]] — how it connects
- [[Related Decision]] — how it relates

## Review Date
{{When to revisit this decision — 30/60/90 days}}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 10: Creation Note (tpl-creation.md)

```markdown
---
title: "CREATED: {{title}}"
date: {{date}}
type: creation
category: create
asset_type: {{landing-page|email-sequence|blog-post|newsletter|deck|social|assessment|other}}
deliverable: "{{what was produced}}"
source_skill: "{{skill that created it}}"
campaign: {{campaign-slug}}
project: {{project-slug}}
brand: {{brand-slug}}
tags:
  - creation/{{type}}
  - {{topic-tag}}
related: []
status: processed
performance: {}
---

# CREATED: {{title}}

## What Was Produced
{{Brief description of the deliverable.}}

## Key Elements
- **Hook/Angle:** {{the core positioning or hook used}}
- **Target:** {{who this is for}}
- **Format:** {{format details}}

## Strategic Rationale
{{Why this was created now. What decision or research
led to this creation. Link to the decision note if one exists.}}

## Files / Locations
- Source file: {{path to the actual asset}}
- Published: {{URL or status}}

## Performance (fill in later)
- Metric 1: {{pending}}
- Metric 2: {{pending}}

## Connections
- [[Decision Note]] — the decision that led to this
- [[Source Research]] — research that informed this
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 11: Idea Note (tpl-idea.md)

```markdown
---
title: "IDEA: {{title}}"
date: {{date}}
type: idea
category: think
hypothesis: "{{the core idea in one sentence}}"
confidence: {{high|medium|low|wild-guess}}
related_project: {{project-slug}}
actionable: {{true|false}}
next_step: "{{what would validate this}}"
brand: {{brand-slug}}
tags:
  - idea/{{domain}}
  - {{topic-tag}}
related: []
status: inbox
---

# IDEA: {{title}}

## The Idea
{{2-3 sentences describing the idea. What if...?}}

## Why It Might Work
- Reason 1
- Reason 2

## Why It Might Not
- Risk 1
- Risk 2

## What Triggered This
{{What were you working on when this came up?
What pattern or connection sparked it?}}

## To Validate
- [ ] {{First step to test this idea}}
- [ ] {{Second step}}

## Connections
- [[Related Note]] — where this connects
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 12: Feedback Note (tpl-feedback.md)

```markdown
---
title: "FEEDBACK: {{title}}"
date: {{date}}
type: feedback
category: observe
feedback_type: {{audit|user-feedback|metrics|test-results}}
source: "{{who or what provided the feedback}}"
sentiment: {{positive|negative|mixed|neutral}}
actionable_items: []
source_skill: "{{skill that captured it}}"
project: {{project-slug}}
brand: {{brand-slug}}
tags:
  - feedback/{{type}}
  - {{topic-tag}}
related: []
status: processed
---

# FEEDBACK: {{title}}

## Source
- From: {{who or what — user, audit tool, analytics, client}}
- Type: {{feedback_type}}
- Date: {{date}}

## Key Findings
1. **Finding** — Significance
2. **Finding** — Significance
3. **Finding** — Significance

## Sentiment
{{Overall: positive/negative/mixed. Brief summary of tone.}}

## Actionable Items
- [ ] {{Action to take based on this feedback}}
- [ ] {{Action to take}}

## Data Points
- Metric: {{value}} (context)
- Metric: {{value}} (context)

## Connections
- [[Related Creation]] — what this feedback is about
- [[Related Decision]] — decision this may affect
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template 13: Coaching Session Note (tpl-coaching.md)

```markdown
---
title: "SESSION: {{client or context}} — {{date}}"
date: {{date}}
type: coaching
category: create
client: "{{client name or anonymous}}"
tier: {{1|2|3}}
tools_used:
  - "{{tool name}}"
patterns_observed: []
breakthroughs: []
source_skill: "coaching-engine"
brand: {{brand-slug}}
tags:
  - coaching/session
  - coaching/tier-{{tier}}
  - {{topic-tag}}
related: []
status: processed
---

# SESSION: {{client or context}} — {{date}}

## Session Context
- Client: {{name or anonymous}}
- Tier: {{1: Life Coaching | 2: Leadership | 3: Be The Light}}
- Focus: {{what they came in with}}

## Tools Used
- **{{Tool name}}** — how it was applied, what it revealed

## Key Moments
1. {{Moment or insight that shifted something}}
2. {{Moment or breakthrough}}

## Patterns Observed
- {{Recurring pattern across sessions with this client}}
- {{Pattern that connects to other clients}}

## Breakthroughs
- {{Any significant shift, realization, or commitment}}

## Assignments / Next Steps
- [ ] {{What client committed to doing}}
- [ ] {{What to follow up on next session}}

## Connections
- [[Previous Session]] — continuity
- [[Related Concept]] — framework that applies
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Template Usage

On vault init, all 13 templates are written to ./vault/_templates/.

When creating a new vault note:
1. Select the appropriate template based on the capture type
2. Fill in all {{placeholder}} fields
3. Set the `category` field (learn/decide/create/observe/think)
4. Auto-generate tags from content analysis
5. Scan for wiki-link opportunities against existing notes
6. Set status to "inbox" (except daily, decision, creation, feedback → "processed")
7. Append to today's daily note

### Template Selection Guide

  CATEGORY    TEMPLATE         WHEN TO USE
  ──────────────────────────────────────────────────────
  LEARN       tpl-search       Web search results
  LEARN       tpl-scrape       Firecrawl/web page capture
  LEARN       tpl-synthesis    Perplexity/AI research synthesis
  DECIDE      tpl-decision     Strategic choice made
  CREATE      tpl-creation     Deliverable produced
  CREATE      tpl-coaching     Coaching session completed
  THINK       tpl-idea         Hypothesis or brainstorm
  OBSERVE     tpl-feedback     Results, audit, user feedback
  ANY         tpl-manual       Manual "vault this" capture
  META        tpl-daily        Daily work log
  META        tpl-pattern      Pattern detection report
  META        tpl-moc          Map of Content index
  META        tpl-project-brief Project goals and context
