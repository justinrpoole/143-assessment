# /obsidian — Obsidian Vault Operations Skill

**Role:** Direct interface to the live Obsidian vault via the Local REST API plugin. Push notes, read notes, manage folders, search vault, and sync the Brain Builder output to your second brain in real-time.

---

## Connection

```
API:   https://127.0.0.1:27124
Auth:  Bearer 6ee773323b10ec2ca5c1c316930246f2d975f092e98ee18951914efb413502cb
TLS:   Self-signed (use -k / insecure flag)
```

**Test command:**
```bash
curl -s -k \
  -H "Authorization: Bearer 6ee773323b10ec2ca5c1c316930246f2d975f092e98ee18951914efb413502cb" \
  https://127.0.0.1:27124/vault/
```

If this returns a JSON `{ "files": [...] }` → connected.
If exit code 7 (connection refused) → Obsidian is not running or the REST API plugin is disabled.

---

## Triggers

```
/obsidian                     → Show vault status (connected? note count? folder tree?)
/obsidian push [note]         → Push a note to the vault (auto-detect folder from frontmatter)
/obsidian read [path]         → Read a note from the vault
/obsidian list [folder]       → List contents of a vault folder
/obsidian search [query]      → Search vault notes by content
/obsidian create-folder [path]→ Create a new folder in the vault
/obsidian sync                → Sync local ./vault/ to live Obsidian vault
/obsidian tree                → Show full vault folder tree
/obsidian status              → Connection check + vault stats
/obsidian dashboard           → Update HOME.md dashboard in vault
"push to obsidian"            → Push the current note/output to Obsidian
"sync vault"                  → Sync all local vault changes to Obsidian
"obsidian status"             → Connection check
"update my vault"             → Push latest changes
"show my vault"               → Tree view of vault contents
(auto-capture)                → MODE 11: Called by other skills after significant work
(query-log)                   → MODE 12: Called automatically on every web search/research query
"what am I searching for"     → Read + analyze search-query-log.md for patterns
"show my patterns"            → Analyze search-query-log.md for obsession/gap/threat signals
```

---

## Modes

### MODE 1: STATUS — Connection Check + Vault Stats

Trigger: `/obsidian`, `/obsidian status`

1. Test API connection
2. If connected → list root folders, count notes per folder
3. If not connected → report error, suggest checking Obsidian + REST API plugin
4. Show last ingest date (from INGEST-PROGRESS.md if it exists)

Output:
```
┌─────────────────────────────────────────────┐
│  OBSIDIAN VAULT STATUS                      │
├─────────────────────────────────────────────┤
│  Connection:  ✓ Live (127.0.0.1:27124)      │
│  Vault name:  Justin Ray Second Brain       │
│  Total notes: {count}                       │
│  Last ingest: 2026-02-25 (14 notes)         │
├─────────────────────────────────────────────┤
│  Businesses/143_Leadership/  (12 notes)     │
│  Businesses/JRW_Design/      (0 notes)      │
│  Businesses/Ohio_Made/       (0 notes)      │
│  Career/                     (0 notes)      │
│  Systems/                    (4 notes)      │
│  Reference/                  (1 note)       │
│  ...                                        │
└─────────────────────────────────────────────┘
```

---

### MODE 2: PUSH — Push Note to Vault

Trigger: `/obsidian push`, `push to obsidian`, `vault this to obsidian`

Takes a note (markdown string with YAML frontmatter) and pushes it to Obsidian.

**Auto-routing:** If the note has frontmatter with `business:` or category tags, auto-detect the destination folder using the routing table from /knowledge-vault STEP 4 CLASSIFY.

**Manual path:** User can specify: `/obsidian push Businesses/143_Leadership/Brand/my-note.md`

API call:
```bash
curl -s -k -X PUT \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: text/markdown" \
  --data-binary "{note_content}" \
  "https://127.0.0.1:27124/vault/{path}"
```

**PUSH RULES:**
1. Note MUST have YAML frontmatter (title, date, type, tags at minimum)
2. Filename = slugified title (lowercase, hyphens, no spaces)
3. If note already exists → confirm overwrite or append
4. After push → confirm with one-line: "Pushed to {path} ✓"
5. Update HOME.md "Recently Added" section if present

---

### MODE 3: READ — Read Note from Vault

Trigger: `/obsidian read {path}`

API call:
```bash
curl -s -k \
  -H "Authorization: Bearer {TOKEN}" \
  "https://127.0.0.1:27124/vault/{path}"
```

Returns the note content. Parse YAML frontmatter and display structured.

---

### MODE 4: LIST — List Vault Folder Contents

Trigger: `/obsidian list`, `/obsidian list {folder}`

API call:
```bash
curl -s -k \
  -H "Authorization: Bearer {TOKEN}" \
  "https://127.0.0.1:27124/vault/{folder}/"
```

Returns JSON `{ "files": [...] }`. Display as tree view.

---

### MODE 5: SEARCH — Search Vault Notes

Trigger: `/obsidian search {query}`

Strategy: Since the REST API has limited search, use LIST to get all files recursively, then READ each and search content. For large vaults, limit to specific folders.

Alternative: If Obsidian REST API supports `/search/`, use that endpoint.

API call:
```bash
curl -s -k -X POST \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"query": "{search_term}"}' \
  "https://127.0.0.1:27124/search/simple/"
```

---

### MODE 6: SYNC — Sync Local Vault to Obsidian

Trigger: `/obsidian sync`, `sync vault`

Walks the local `./vault/` directory, compares to Obsidian vault, and pushes any new or modified notes.

Steps:
1. List all local vault .md files
2. For each file, check if it exists in Obsidian (GET → 200 = exists, 404 = new)
3. If new → PUT to create
4. If exists → compare content hash, push if different
5. Report: {N} new notes pushed, {M} updated, {K} unchanged

---

### MODE 7: TREE — Full Vault Folder Tree

Trigger: `/obsidian tree`

Recursively list all folders and note counts. Display as visual tree:
```
📂 Vault Root
├── 📂 Businesses/ (3 businesses)
│   ├── 📂 143_Leadership/ (12 notes)
│   │   ├── 📂 Assessment/ (0)
│   │   ├── 📂 Book/ (1)
│   │   ├── 📂 Brand/ (4)
│   │   ├── 📂 Coaching/ (0)
│   │   ├── 📂 Framework/ (3)
│   │   ├── 📂 Marketing/ (2)
│   │   ├── 📂 Product/ (1)
│   │   └── 📂 Research/ (0)
│   ├── 📂 JRW_Design/ (0 notes)
│   └── 📂 Ohio_Made/ (0 notes)
├── 📂 Career/ (0 notes)
├── 📂 Systems/ (4 notes)
├── 📂 Reference/ (1 note)
...
```

---

### MODE 8: DASHBOARD — Update HOME.md

Trigger: `/obsidian dashboard`

Regenerate the HOME.md dashboard in vault root with:
- Note counts per folder
- Recently added notes (last 10)
- Version families tracked
- Open questions (from #status/needs-action tags)
- Cross-links to TIMELINE.md, BRAIN-INDEX.md, INGEST-PROGRESS.md

---

### MODE 9: CREATE-FOLDER — Create Vault Folder

Trigger: `/obsidian create-folder {path}`

Creates a folder in Obsidian by pushing an _INDEX.md placeholder:
```bash
curl -s -k -X PUT \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: text/markdown" \
  --data-binary "# {Folder Name}\n\n> Index for {path}" \
  "https://127.0.0.1:27124/vault/{path}/_INDEX.md"
```

---

### MODE 10: BULK-PUSH — Push Multiple Notes

Trigger: `/obsidian bulk-push [folder]`

Reads all .md files from a local folder and pushes them to Obsidian in batch.
Progress display every 10 notes. Report at end.

---

### MODE 11: AUTO-CAPTURE — Receive Auto-Vaulted Notes from Any Skill

Trigger: Called programmatically by other skills (not user-invoked). This is the protocol ANY skill follows when it has new information to push.

**This is the universal intake port.** When CLAUDE.md's Auto-Vault Rule fires, the calling skill formats the note and calls this mode.

**Intake Protocol:**

1. Calling skill provides:
   - `content`: Markdown string with YAML frontmatter (see Auto-Vault Note Format in CLAUDE.md)
   - `path`: Target vault path (from routing table) — or empty for auto-route
   - `push_to_obsidian`: boolean (default: true)

2. Auto-Capture validates:
   - Frontmatter has required fields: `title`, `date`, `type`, `source_skill`, `search_query`
   - Content is distilled (< 500 words — reject raw dumps)
   - Path exists or will be auto-created

3. Auto-Capture executes:
   ```
   A) Write to local ./vault/{path}/{slug}.md
   B) If Obsidian REST API connected → PUT to vault
   C) Append one-line to search-query-log.md (if search_query present)
   D) Return confirmation: "Auto-vaulted: {title} → {path} ✓"
   ```

4. If Obsidian is down:
   ```
   A) Write locally only
   B) Append to ./vault/Systems/Workflows/pending-sync.md:
      | {date} | {path} | {title} | pending |
   C) Next /obsidian sync picks these up automatically
   ```

**API call (when pushing to Obsidian):**
```bash
curl -s -k -X PUT \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: text/markdown" \
  --data-binary "{note_content}" \
  "https://127.0.0.1:27124/vault/{path}/{slug}.md"
```

---

### MODE 12: QUERY-LOG — Append to Search Query Log

Trigger: Called automatically whenever a web search, research query, or user question triggers information gathering.

**Log location:** `Systems/Workflows/search-query-log.md`

**Append format:**
```markdown
| {YYYY-MM-DD HH:MM} | {query} | {skill} | {intent} | {result} |
```

**Fields:**
- `query`: The exact search query or user question
- `skill`: Which skill ran the search (/knowledge-vault, /keyword-research, /seo-content, web search, etc.)
- `intent`: One of: `product`, `marketing`, `research`, `competitor`, `technical`, `personal`, `coaching`, `content`, `business-strategy`, `career`
- `result`: `found` (useful results), `partial` (some useful), `dead-end` (nothing useful)

**Pattern Detection Hooks:**
When the log exceeds 20 entries, /knowledge-vault scan mode can detect:
- **Obsession signals**: Topics searched 3+ times in 7 days
- **Gap signals**: Questions with `dead-end` results (unresolved needs)
- **Threat signals**: Competitor names appearing frequently
- **Workflow signals**: Which skills generate the most searches
- **Seasonal patterns**: Topics that spike at certain times

**API call:**
```bash
# Read existing log
existing=$(curl -s -k \
  -H "Authorization: Bearer {TOKEN}" \
  "https://127.0.0.1:27124/vault/Systems/Workflows/search-query-log.md")

# Append new entry
curl -s -k -X PUT \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: text/markdown" \
  --data-binary "${existing}\n| {entry} |" \
  "https://127.0.0.1:27124/vault/Systems/Workflows/search-query-log.md"
```

---

## Vault Folder Structure (Live)

```
Businesses/
├── 143_Leadership/ (Assessment, Book, Brand, Coaching, Framework, Marketing, Product, Research)
├── JRW_Design/ (Products, Marketing, Brand, Operations, Finance)
└── Ohio_Made/ (Events, Partnerships, Marketing, Brand, Operations)

Career/ (Resumes, Work_Product, PM_Training, Performance, LinkedIn, Career_Planning)
Writing_Samples/ (Coaching_Content, Sales_Copy, Business_Writing, Personal_Essays, Technical_Writing)
Sample_Posts/ (Instagram, LinkedIn, Facebook, X_Twitter, TikTok)
Content_Library/ (Blog, Podcast, Stories, Leadership_Series, Editorial)
Copy_Vault/ (Headlines, Emails, Landing_Pages, Social, Voice_Catalog)

Learning/ (Books, Courses, Podcasts, Videos, Articles, Conferences, Mentors)
Research/ (Behavioral_Science, Neuroscience, Leadership, Assessment_Science, AI_and_Technology, Marketing_Research, Business_Strategy, Health_and_Performance)
Reference/ (Frameworks, Tools, Resources, Checklists)

Brand_Assets/ (Logos, Colors, Headshots, Design_Elements, AI_Generated, Templates)
Meetings/ (Transcripts, Meeting_Notes, Conversations)
Systems/ (AI_Skills, Automation, Prompts, Workflows, Tools_Config)
Finance/ (Revenue, Expenses, Budgets)
Sales/ (Collateral, Proposals, Pricing, Testimonials)
Data/ (Imports, Analytics, Customer_Data)
Training/ (PM_Training, Coaching_Training, Team_Training, Templates)
Personal/ (Family, Health, Important_Documents, Music, Photos_and_Memories, Reading)

Ideas/
Projects/ (Active, Completed, Someday)
People/ (Mentors, Collaborators, Network)
Inbox/
Daily/
Templates/
Archive/
```

---

## Integration with Other Skills — UNIVERSAL AUTO-VAULT

**EVERY skill auto-pushes to Obsidian when significant work is done.**

This is not optional. See CLAUDE.md `/obsidian Auto-Vault Rule` for the full trigger list. In short: if it generated NEW INFORMATION or a NEW DECISION → it gets vaulted via MODE 11 (AUTO-CAPTURE).

**Skill → Obsidian routing (all automatic):**

```
/keyword-research       → Businesses/{biz}/Marketing/serp-{slug}.md
/positioning-angles     → Businesses/{biz}/Brand/positioning-{slug}.md
/brand-voice            → Businesses/{biz}/Brand/voice-{brand}-{date}.md
/lead-magnet            → Businesses/{biz}/Marketing/magnet-{slug}.md
/direct-response-copy   → Copy_Vault/{type}/copy-{slug}-{date}.md
/seo-content            → Content_Library/Blog/article-{slug}.md
/email-sequences        → Copy_Vault/Emails/emails-{slug}-{date}.md
/newsletter             → Content_Library/Blog/newsletter-{date}.md
/content-atomizer       → Sample_Posts/{platform}/atomized-{slug}-{date}.md
/creative               → Brand_Assets/{type}/style-{slug}.md
/gamma                  → Content_Library/{format}/gamma-{slug}-{date}.md
/assessment-engine      → Businesses/143_Leadership/Assessment/scored-{run}-{date}.md
/assessment-brain       → Businesses/143_Leadership/Assessment/report-{slug}-{date}.md
/coaching-engine        → Businesses/143_Leadership/Coaching/session-{date}.md
/bralph                 → Businesses/{biz}/Product/audit-{date}.md
/app-developer          → Businesses/143_Leadership/Product/arch-{slug}-{date}.md
/knowledge-vault        → (uses its own routing — see SKILL INTEGRATION PROTOCOL)
/research-engine        → Research/{domain}/{slug}.md
/competitive-social-research → Research/Marketing_Research/competitor-{slug}.md
Web search (any skill)  → Systems/Workflows/search-query-log.md (query log only)
Planning session        → Businesses/{biz}/{area}/plan-{slug}-{date}.md
```

**Auto-push rules:**
1. When Obsidian REST API is connected → push in real-time via MODE 11
2. When Obsidian is down → write to local `./vault/`, queue in `pending-sync.md`
3. Every search query → append to `search-query-log.md` via MODE 12 (even if the search itself wasn't vault-worthy)
4. Notes are DISTILLED (50-200 words) — not raw output dumps
5. The user sees a one-line confirmation: `Auto-vaulted: {title} → {path} ✓`

---

## Error Handling

| Error | Meaning | Action |
|-------|---------|--------|
| Exit code 7 | Connection refused | Obsidian not running or REST API plugin disabled |
| 401 Unauthorized | Bad token | Check bearer token in skill config |
| 404 Not Found | Note/folder doesn't exist | Create it (PUT auto-creates parent folders) |
| 405 Method Not Allowed | Wrong HTTP method | Check API docs |
| 500 Internal Server Error | Obsidian plugin error | Retry once, then report |

**Graceful degradation:** If Obsidian is not connected, fall back to writing notes to local `./vault/` directory. Report that notes are local-only and suggest running `/obsidian sync` when Obsidian is available.

---

## Security

- The bearer token is stored in this SKILL.md file. It is a LOCAL-ONLY token for the Obsidian REST API plugin running on localhost.
- The API only accepts connections from 127.0.0.1 (localhost).
- TLS is self-signed — use `-k` flag with curl.
- NEVER expose this token in any public output, git commit, or shared document.
