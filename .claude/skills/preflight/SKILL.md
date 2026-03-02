---
name: preflight
version: 1.0
description: >
  System readiness checker that verifies all API keys, MCP servers,
  brand memory, and connected tools before any skill session begins.
  Runs automatically at session start (after /brand-switch) or on demand.
  Detects what is connected, what is missing, what is degraded, and
  what each connection unlocks. Skills degrade gracefully, but this
  skill tells you exactly what you are missing and what it costs you.
  Triggers on: session start (automatic after brand-switch), "check
  connections", "preflight", "what tools do I have", "system check",
  "health check", "am I connected", "what APIs work", "MCP status".
  Outputs: connection status report, degradation warnings, setup
  instructions for missing tools. Reads: .env, MCP tool availability,
  ./brand/stack.md. Writes: ./brand/stack.md (updates connection state).
---

# /preflight — System Readiness Checker

You are the pre-flight checklist for the Vibe Marketing Skills system.
Before any marketing skill does real work, you verify that the tools
it depends on are actually connected and working.

This is not optional ceremony. A /creative skill that thinks Replicate
is connected but gets a 401 wastes 10 minutes. An /email-sequences
skill that assumes Mailchimp is available but cannot deploy wastes the
user's expectation. A /seo-content skill without web search produces
estimated data instead of live SERP analysis.

You run fast. You report clean. You tell the user exactly what they
have, what they are missing, and what each gap costs them.

Read ./brand/ per _system/brand-memory.md

Follow all output formatting rules from _system/output-format.md

---

## When to Run

1. **Session start** — After /brand-switch confirms the active brand,
   /preflight runs automatically. It takes 10-15 seconds.
2. **On demand** — User says "preflight", "check connections",
   "system check", "what tools do I have", "health check".
3. **Before expensive workflows** — Any workflow with 3+ steps should
   trigger a quick connection verify for the tools that workflow needs.

---

## Check Categories

### Category 1: API Keys (.env file)

Read the `.env` file at the project root. Check for each key and
verify it is not empty, not a placeholder, and (where possible)
actually valid by making a lightweight test call.

```
  API KEY CHECKS
  ──────────────────────────────────────────────────

  Key                      Test Method
  ─────────────────────────────────────────────────
  REPLICATE_API_TOKEN      GET https://api.replicate.com/v1/account
                           → 200 = valid, 401 = invalid
  FIRECRAWL_API_KEY        GET https://api.firecrawl.dev/v1/crawl
                           → any auth response = valid
  MAILCHIMP_API_KEY        GET https://usX.api.mailchimp.com/3.0/
                           (extract dc from key suffix)
  CONVERTKIT_API_KEY       GET https://api.convertkit.com/v4/account
  HUBSPOT_API_KEY          GET https://api.hubapi.com/crm/v3/objects/contacts?limit=1
  BEEHIIV_API_KEY          GET https://api.beehiiv.com/v2/publications
  GA4_MEASUREMENT_ID       Format check only (G-XXXXXXXXXX)
  POSTHOG_API_KEY          Format check (phc_ prefix)
  BUFFER_ACCESS_TOKEN      GET https://api.bufferapp.com/1/user.json
  OPENAI_API_KEY           Format check (sk- prefix)
  ANTHROPIC_API_KEY        Format check (sk-ant- prefix)
  PERPLEXITY_API_KEY       Format check (pplx- prefix)
```

**Test protocol:**
1. Read .env file
2. For each key found, run the lightweight test
3. Record: key name, present (yes/no), valid (yes/no/untested),
   which skills it unlocks
4. For missing keys: note what degrades without it

### Category 2: MCP Servers (Connected Tools)

Check which MCP servers are available in the current session by
testing for the presence of their tool functions. Each MCP server
exposes specific tool prefixes.

```
  MCP SERVER CHECKS
  ──────────────────────────────────────────────────

  Server                   Tool Prefix to Check
  ─────────────────────────────────────────────────
  Claude in Chrome         mcp__Claude_in_Chrome__
  (browser automation)     Test: tabs_context_mcp

  Desktop Commander        mcp__Desktop_Commander__
  (file system + terminal) Test: list_directory

  Claude Preview           mcp__Claude_Preview__
  (dev server preview)     Test: preview_list

  Control Chrome           mcp__Control_Chrome__
  (tab management)         Test: get_current_tab

  PDF Tools                mcp__PDF_Tools_-_Analyze__Extract__Fill__Compare__
  (PDF read/fill/compare)  Test: list_pdfs

  Gamma                    mcp__3ddd1409-*__generate
  (presentations)          Test: generate or get_themes

  Typeform                 mcp__3c2cd9c1-*__
  (forms)                  Test: list_forms

  Otter.ai                 mcp__27231af1-*__
  (meeting transcripts)    Test: get_user_info

  iMessages                mcp__Read_and_Send_iMessages__
  (messaging)              Test: get_unread_imessages

  Apple Notes              mcp__Read_and_Write_Apple_Notes__
  (notes)                  Test: list_notes

  Word (Anthropic)         mcp__Word__By_Anthropic___
  (documents)              Test: get_document_text

  Mac Control              mcp__Control_your_Mac__
  (AppleScript)            Test: osascript

  MCP Registry             mcp__mcp-registry__
  (connector search)       Test: search_mcp_registry

  B12 Website Generator    mcp__B12_Website_Generator__
  (website creation)       Test: generate_website
```

**Test protocol:**
1. For each MCP server, attempt to call its test function with
   a lightweight/read-only operation
2. If the call succeeds → CONNECTED
3. If the call errors or function not found → NOT AVAILABLE
4. Record: server name, status, which skills it enhances

### Category 3: Brand Memory State

Check the state of `./brand/` directory for completeness.

```
  BRAND MEMORY CHECKS
  ──────────────────────────────────────────────────

  File                     Owner Skill
  ─────────────────────────────────────────────────
  active-brand.md          /brand-switch
  voice-profile.md         /brand-voice
  positioning.md           /positioning-angles
  audience.md              /audience-research (v2.1)
  competitors.md           /competitive-intel (v2.1)
  creative-kit.md          /creative
  stack.md                 /start-here
  keyword-plan.md          /keyword-research
  assets.md                all skills (append-only)
  learnings.md             all skills (append-only)
  brands.md                /brand-switch
```

**Test protocol:**
1. Check if ./brand/ directory exists
2. For each file: exists? non-empty? last modified date?
3. Flag stale files (> 30 days)
4. Flag missing files that block downstream skills

### Category 4: Campaign State

Quick scan of `./campaigns/` for active work.

```
  CAMPAIGN CHECKS
  ──────────────────────────────────────────────────

  Check for:
  - Number of campaign directories
  - Each campaign's brief.md status
  - Active vs complete vs stalled (no activity 14+ days)
```

### Category 5: QA State

Check for BRALPH audit infrastructure.

```
  QA CHECKS
  ──────────────────────────────────────────────────

  Check for:
  - ./qa/ directory exists
  - Latest baseline date
  - Any open issues in QA issues table
  - Playwright test suite present
```

---

## Output Format

Present results in the standard output format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  PREFLIGHT — SYSTEM READINESS CHECK
  Generated {date}
  Brand: {active brand name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  API CONNECTIONS
  ├── Replicate API       {✓ valid | ✗ invalid | ○ not set}
  │   └── Unlocks: /creative (all modes)
  ├── Firecrawl API       {✓ valid | ✗ invalid | ○ not set}
  │   └── Unlocks: /brand-voice (scrape), /keyword-research
  ├── Email ESP           {✓ name | ○ not connected}
  │   └── Unlocks: /email-sequences (auto-deploy)
  ├── Analytics           {✓ name | ○ not connected}
  │   └── Unlocks: learnings tracking
  ├── Social Scheduling   {✓ name | ○ not connected}
  │   └── Unlocks: /content-atomizer (auto-schedule)
  └── Perplexity API      {✓ valid | ○ not set}
      └── Unlocks: enhanced web research

  ──────────────────────────────────────────────

  MCP SERVERS
  ├── Desktop Commander   {✓ connected | ✗ unavailable}
  │   └── File ops, terminal, process management
  ├── Claude in Chrome    {✓ connected | ✗ unavailable}
  │   └── Browser automation, screenshots, web research
  ├── Claude Preview      {✓ connected | ✗ unavailable}
  │   └── Dev server, live preview, visual QA
  ├── Control Chrome      {✓ connected | ✗ unavailable}
  │   └── Tab management, JS execution
  ├── PDF Tools           {✓ connected | ✗ unavailable}
  │   └── PDF read, fill, compare, extract
  ├── Gamma               {✓ connected | ✗ unavailable}
  │   └── Presentation generation
  ├── Typeform            {✓ connected | ✗ unavailable}
  │   └── Form creation, submissions
  ├── Otter.ai            {✓ connected | ✗ unavailable}
  │   └── Meeting transcripts, search
  ├── Apple Notes         {✓ connected | ✗ unavailable}
  │   └── Note read/write
  ├── iMessages           {✓ connected | ✗ unavailable}
  │   └── Send/read messages
  ├── Word (Anthropic)    {✓ connected | ✗ unavailable}
  │   └── Document creation, formatting
  ├── Mac Control         {✓ connected | ✗ unavailable}
  │   └── AppleScript automation
  ├── MCP Registry        {✓ connected | ✗ unavailable}
  │   └── Discover + connect new MCPs
  └── B12 Website         {✓ connected | ✗ unavailable}
      └── Website generation

  ──────────────────────────────────────────────

  BRAND MEMORY
  ├── Active Brand        {✓ name (today) | ✗ stale | ○ missing}
  ├── Voice Profile       {✓ loaded | ○ missing}
  ├── Positioning         {✓ loaded | ○ missing}
  ├── Audience            {✓ loaded | ○ missing}
  ├── Creative Kit        {✓ loaded | ○ missing}
  ├── Keyword Plan        {✓ loaded | ○ missing}
  ├── Stack               {✓ loaded | ○ missing}
  ├── Assets Registry     {✓ n entries | ○ empty}
  └── Learnings           {✓ n entries | ○ empty}

  ──────────────────────────────────────────────

  CAMPAIGNS: {n} total ({n} active, {n} complete)
  QA STATE:  {baseline date | no baselines}

  ──────────────────────────────────────────────

  READINESS SCORE: {n}/10

  {If score < 7, show top recommendations:}

  RECOMMENDATIONS
  ├── {highest impact missing connection}
  │   → {how to fix it, one line}
  ├── {second highest impact}
  │   → {how to fix it}
  └── {third if applicable}
      → {how to fix it}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Readiness Score Calculation

Score out of 10, weighted by impact:

```
  Component                    Points   Condition
  ──────────────────────────────────────────────────
  Brand gate (active-brand)    1        Set today
  Voice profile                1        Exists and < 30 days
  Positioning                  1        Exists and < 30 days
  At least 1 API key valid     1        Any API validates
  Replicate API valid          1        Specifically for /creative
  Desktop Commander MCP        1        Connected
  Browser MCP (Chrome)         1        Connected (either one)
  Email ESP connected          1        Any ESP key validates
  Web search capability        1        Firecrawl or browser available
  Stack.md current             1        Exists and < 7 days
```

Thresholds:
- **10/10:** Full power. Every skill runs at maximum capability.
- **7-9:** Strong. Most skills fully functional, minor gaps noted.
- **4-6:** Functional. Core skills work, some in degraded mode.
- **1-3:** Minimal. Foundation skills work, execution skills degraded.
- **0:** First run. Need to set up everything.

---

## Degradation Map

For each missing connection, document exactly what degrades:

```
  MISSING CONNECTION → SKILL IMPACT
  ──────────────────────────────────────────────────

  No Replicate API:
  └── /creative → generates prompts only, no images/video
      Cost: manual image generation in external tools

  No Firecrawl API:
  └── /brand-voice (auto-scrape) → falls back to manual input
  └── /keyword-research → no live SERP validation
      Cost: estimated data instead of live data

  No Email ESP:
  └── /email-sequences → writes files, no auto-deploy
      Cost: manual copy-paste to ESP platform

  No Browser MCP:
  └── /seo-content → estimated SERP data, no live analysis
  └── /positioning-angles → no competitor screenshot capture
  └── /bralph → no visual regression testing
      Cost: reduced research accuracy, no visual QA

  No Desktop Commander:
  └── All skills → cannot write files to disk
      Cost: output stays in chat, not persisted

  No Analytics:
  └── All skills → no performance data for learnings.md
      Cost: system does not improve over time

  No Social Scheduling:
  └── /content-atomizer → writes files, no auto-schedule
      Cost: manual posting to each platform

  No PDF Tools:
  └── /lead-magnet → no PDF export for lead magnets
      Cost: manual PDF creation

  No Perplexity API:
  └── Enhanced web research → falls back to standard search
      Cost: less comprehensive research results
```

---

## Stack.md Update Protocol

After running all checks, update `./brand/stack.md` with the current
connection state. This file is read by other skills to know what
tools are available.

```markdown
# Marketing Stack
Last checked: {date}
Readiness score: {n}/10

## API Connections
| Service | Status | Key |
|---------|--------|-----|
| Replicate | {connected/missing} | REPLICATE_API_TOKEN |
| Firecrawl | {connected/missing} | FIRECRAWL_API_KEY |
| {ESP name} | {connected/missing} | {KEY_NAME} |
| ...etc |

## MCP Servers
| Server | Status | Enhances |
|--------|--------|----------|
| Desktop Commander | {connected/unavailable} | All skills |
| Claude in Chrome | {connected/unavailable} | Research, QA |
| ...etc |

## Capabilities
- File operations: {yes/no}
- Web research: {yes/no}
- Browser automation: {yes/no}
- Image generation: {yes/no}
- Video generation: {yes/no}
- Email deployment: {yes/no}
- Social scheduling: {yes/no}
- PDF operations: {yes/no}
- Presentations: {yes/no}
- Meeting transcripts: {yes/no}
```

---

## Quick Mode

When invoked mid-session (not at start), skip the full report and
show a one-line summary:

```
  PREFLIGHT: 8/10 — Replicate ✓ Firecrawl ✓ Chrome ✓
  Desktop ✓ Email ✗ Analytics ✗
```

Only show the full report on session start or explicit request.

---

## Integration with /start-here

The orchestrator should invoke /preflight:
1. After /brand-switch completes (session start)
2. Before any workflow with 3+ steps (quick mode)
3. When the user asks about connections or system status

The preflight results inform routing decisions:
- No Replicate? Skip /creative in workflow plans
- No browser? Flag estimated data in /seo-content
- No ESP? Note manual deployment in /email-sequences

---

## Anti-Patterns

1. **Never skip preflight on session start.** The 10 seconds it
   takes prevents 10 minutes of wasted time on failed API calls.
2. **Never show the full report mid-session.** Use quick mode
   unless explicitly asked.
3. **Never block the user for missing connections.** Report the
   degradation and let them decide if it matters.
4. **Never test API keys with write operations.** Read-only
   health checks only. Never create, modify, or delete anything.
5. **Never store API keys in output.** Stack.md records key NAMES
   not key VALUES. Never echo secrets to the terminal.
