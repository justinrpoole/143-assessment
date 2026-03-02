---
name: orchestrator
version: 1.0
description: "Master navigation and routing skill for the Power Skills system. Maps all available skills, routes user intent to the right skill, prevents wrong-skill invocation, and tracks what's been used. Triggers on: what skill should I use, help me find, where do I go, route me, orchestrate, what's available, skill map, show me my skills. This skill does NOT produce content — it routes to the skill that does."
---

# Power Skills Orchestrator

The orchestrator knows every skill in the system, what it does, when to use it, and what it needs. It routes you to the right skill in one step. It also prevents you from using the wrong skill or running a skill without its dependencies.

Read `./brand/` per `_system/brand-memory.md`

---

## Skill Registry

### VIBE MARKETING PACKAGE (purchased workflow — runs as a connected system)

These skills were installed as a package. They work standalone but are designed to chain together. The package workflow is: `/start-here` → `/brand-switch` → `/preflight` → then any content/marketing skill.

| Skill | Folder | What It Does | Use When |
|---|---|---|---|
| `/start-here` | `start-here/` | Entry point. Scans project, builds brand foundation, routes to next skill. | First run, "what should I do", any vague marketing request |
| `/brand-switch` | `brand-switch/` | Selects which brand you're working on. Loads correct voice, positioning, audience. | Session start (runs automatically), switching between brands |
| `/preflight` | `preflight/` | Checks all API keys, MCP servers, tools. Reports what's connected and what's missing. | Session start (after brand-switch), diagnosing tool issues |
| `/brand-voice` | `brand-voice/` | Defines or extracts brand voice. Three modes: Extract, Build, Auto-Scrape. | Starting a project, copy sounds generic, need consistent voice |
| `/positioning-angles` | `positioning-angles/` | Finds differentiation angles. Researches competitor messaging, generates 3-5 angles. | Launching a product, writing a landing page, marketing isn't converting |
| `/keyword-research` | `keyword-research/` | Strategic keyword research. 6 Circles Method, live SERP validation, content pillars. | Content strategy, "what should I write about", SEO planning |
| `/seo-content` | `seo-content/` | SEO-optimized articles. Live SERP analysis, FAQ schema, publication-ready. | Turning keyword research into actual content |
| `/email-sequences` | `email-sequences/` | Email sequences: welcome, nurture, conversion, launch, re-engagement. | Have a lead magnet, need to convert subscribers |
| `/direct-response-copy` | `direct-response-copy/` | Landing pages, sales copy, headlines, CTAs. Persuasion-optimized. | Writing anything that needs to convert |
| `/content-atomizer` | `content-atomizer/` | Transforms 1 piece of content into platform-optimized assets across 8+ platforms. | Have existing content, want to maximize distribution |
| `/lead-magnet` | `lead-magnet/` | Lead magnet concepts AND builds the actual content. | Growing email list, top-of-funnel ideas |
| `/newsletter` | `newsletter/` | Newsletter editions in multiple formats (roundup, deep-dive, essay, curated). | Writing newsletter editions |
| `/creative` | `creative/` | AI creative production: product photos, videos, social graphics, ad creative. | Need visual assets for any campaign |
| `/critic` | `critic/` | Quality gate. Scores output against brand voice, positioning, audience fit. | After any content skill, before publishing |
| `/ralph-loop` | `ralph-loop/` | Feature-by-feature execution from a PRD. Implements, tests, logs progress. | Building from a spec, feature-by-feature |
| `/visual-integrator` | `visual-integrator/` | Integrates images/videos into Next.js components with optimization and animation. | Adding visual assets to the app |
| `/research-tools` | `research-tools/` | Unified research infrastructure (Perplexity, Firecrawl, Playwright). | Any skill needing live web data |

### 143 LEADERSHIP CUSTOM SKILLS (built by you — standalone)

These skills are purpose-built for the 143 Leadership business. They are standalone and do not depend on the Vibe Marketing package (though they can use Vibe Marketing skills like `/brand-voice` and `/email-sequences` when they need content).

| Skill | Folder | What It Does | Use When |
|---|---|---|---|
| `/consultant-lead-agent` | `consultant-lead-agent/` | Full business development engine. 22 deliverables, 12-step workflow, 4 sub-agents, persistent memory. Now IG Consulting-native with account growth, service expansion, elite delivery framework, and 143 integration outputs. | Building lead pipeline, account growth strategy, business development |
| `/assessment-brain` | `assessment-brain/` | Generates 143 assessment reports: participant reports, executive summaries, quick reads. | Interpreting scored assessment data into guidance |
| `/assessment-engine` | `assessment-engine/` | Scores the 9-Ray framework (Shine/Eclipse/Rise). Processes survey responses. | Running the actual assessment scoring pipeline |
| `/coaching-engine` | `coaching-engine/` | 3-tier coaching system with 1,600+ prompts linked to assessment results. | Post-assessment coaching, tool prescriptions |
| `/competitive-social-research` | `competitive-social-research/` | Competitor social content analysis (Facebook, IG, LinkedIn, YouTube, TikTok, X). | Analyzing competitor content, building prompt/tool library |
| `/app-developer` | `app-developer/` | Full-stack app development for the 143 app. Audits, researches, auto-implements. | Building and upgrading the Next.js app |
| `/knowledge-vault` | `knowledge-vault/` | Persistent knowledge OS. Captures everything into Obsidian-compatible vault. | Storing research, decisions, ideas, patterns across sessions |
| `/strategic-analytics` | `strategic-analytics/` | KPIs, OKRs, business intelligence for 143 Leadership. | Business metrics, performance tracking |
| `/obsidian` | `obsidian/` | Obsidian vault management and organization. | Vault operations, note organization |
| `/research-engine` | `research/` | Framework-grounded research from the 792-researcher library. | Finding evidence, literature reviews, backing up claims |
| `/bralph` | (no folder yet) | Master baseline and drift auditor for the app. | Auditing the app, detecting drift from baseline |

### SHARED INFRASTRUCTURE (not skills — used by all skills)

| Folder | Purpose | Owned By |
|---|---|---|
| `_system/` | Brand memory protocol, output format rules, schemas, scripts | All skills |
| `brand/` | Active brand context: voice, positioning, audience, competitors, assets | All skills (via brand-memory.md protocol) |
| `campaigns/` | Output directory for campaign-producing skills | `/consultant-lead-agent`, `/lead-magnet`, `/email-sequences` |
| `app/` | The 143 Leadership Next.js application | `/app-developer`, `/bralph`, `/visual-integrator` |
| `assessments/` | Test assessment outputs | `/assessment-brain`, `/assessment-engine` |
| `vault/` | Obsidian-compatible knowledge vault | `/knowledge-vault`, `/obsidian` |
| `tests/` | Test scripts for assessment engine | `/assessment-engine` |

### STALE / CLEANUP CANDIDATES

| Folder | Status | Recommendation |
|---|---|---|
| `installed-skills/` | Duplicate copies of Vibe Marketing skills (identical to active folders) | Safe to delete — originals already at root level |
| `_consolidation_conflicts/` | Historical merge artifacts from a previous reorganization | Safe to archive or delete |
| `analytics/` | Empty directory | Safe to delete |
| `research/` | Contains 1 file (`assessment-competitive-intelligence.md`) | Move file to `competitive-social-research/` or `vault/`, delete folder |

---

## Routing Engine

When the user says something, the orchestrator matches intent to skill:

### "I want to build / grow / sell"
```
  "Build my lead pipeline"         → /consultant-lead-agent
  "Find consulting opportunities"  → /consultant-lead-agent
  "Grow my accounts"               → /consultant-lead-agent (Deliverable K)
  "Cross-sell services"            → /consultant-lead-agent (Deliverable L)
  "Write outreach emails"          → /email-sequences (or /consultant-lead-agent Step 5a)
  "Build a landing page"           → /direct-response-copy
  "Create a lead magnet"           → /lead-magnet
  "Write a newsletter"             → /newsletter
  "Position my product"            → /positioning-angles
  "What should I write about"      → /keyword-research
  "Write an article"               → /seo-content
  "Make this convert"              → /direct-response-copy
  "Score this copy"                → /critic
```

### "I want to assess / coach / develop"
```
  "Score an assessment"            → /assessment-engine
  "Generate a report"             → /assessment-brain
  "Build a coaching plan"         → /coaching-engine
  "Research a framework topic"    → /research-engine
  "Find evidence for this"        → /research-engine
  "What do competitors post"      → /competitive-social-research
```

### "I want to build the app"
```
  "Add a feature"                 → /app-developer
  "Audit the app"                 → /bralph
  "Add images/video to the app"   → /visual-integrator
  "Build from a PRD"              → /ralph-loop
```

### "I want to organize / manage"
```
  "What skills do I have"         → /orchestrator (this skill)
  "Switch brands"                 → /brand-switch
  "Check my tools"                → /preflight
  "Save this to the vault"        → /knowledge-vault
  "Organize my notes"             → /obsidian
  "Define my voice"               → /brand-voice
  "What should I do first"        → /start-here
  "Track my KPIs"                 → /strategic-analytics
```

---

## Dependency Map

Some skills need other skills to have run first. The orchestrator enforces this.

```
  DEPENDENCY CHAINS

  /consultant-lead-agent
  └── REQUIRES: positioning.md (from /positioning-angles)
      OPTIONAL: voice-profile.md (from /brand-voice)
      OPTIONAL: competitors.md (from /competitive-social-research)

  /email-sequences
  └── BEST WITH: voice-profile.md, positioning.md, audience.md

  /seo-content
  └── BEST WITH: keyword research output (from /keyword-research)

  /assessment-brain
  └── REQUIRES: scored assessment data (from /assessment-engine)

  /coaching-engine
  └── REQUIRES: assessment report (from /assessment-brain)

  /critic
  └── REQUIRES: content from another skill to critique

  /content-atomizer
  └── REQUIRES: source content to atomize

  /visual-integrator
  └── REQUIRES: app running (from /app-developer)

  /bralph
  └── REQUIRES: app running (from /app-developer)
```

---

## How to Use This Skill

Invoke with `/orchestrator` or ask any question about which skill to use, what's available, or where to go next. The orchestrator will:

1. Match your intent to the right skill
2. Check if dependencies are met
3. Route you with a single command
4. If multiple skills could apply, show the options ranked by fit

The orchestrator never produces content. It only routes.
