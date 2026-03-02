---
name: agent-learnings
parent: consultant-lead-agent
version: 1.0
protocol: append-only
purpose: "Persistent memory of what the agent has learned across all runs"
---

# Agent Learnings — Master Memory File

## Purpose

This file is the agent's long-term memory. Every run appends to it. Nothing is deleted — only appended or annotated with corrections. When the agent starts a new session, it reads this file first to avoid repeating mistakes and to build on what worked.

The learning loop:
1. Agent runs a cycle (research, scoring, outreach, follow-up).
2. Agent observes outcomes (what happened vs. what was expected).
3. Agent writes a learning entry below.
4. Next session, agent reads this file and adjusts behavior accordingly.

Over time, this file becomes the most valuable asset in the system — a record of what actually works in this market, with this positioning, for this consulting practice.

---

## Learning Categories

| Code         | Category     | Description                                                    |
|--------------|--------------|----------------------------------------------------------------|
| TRIGGER      | Triggers     | Which triggers produce results and which are noise             |
| OUTREACH     | Outreach     | Messaging, channels, timing, and sequences that work           |
| COMPETITIVE  | Competitive  | Competitor positioning, pricing, and market behavior           |
| PRICING      | Pricing      | Pricing signals, deal structures, and rate sensitivity         |
| BUYER        | Buyer        | Buyer behavior, decision-making patterns, and objections       |
| MARKET       | Market       | Market dynamics, trends, and macro shifts                      |
| PROCESS      | Process      | Internal methodology, workflow, and system improvements        |
| FAILURE      | Failure      | What went wrong and what we would do differently               |

---

## Entry Format

```
### [YYYY-MM-DD] [CATEGORY] Short Title
**Context:** What was happening when this learning occurred
**Learning:** The insight — stated clearly and specifically
**Evidence:** The specific data, event, or observation that produced this learning
**Action:** What changed in our process because of this learning
**Confidence:** High / Medium / Low (and why)
```

---

## Learnings Log

### [2026-02-23] [TRIGGER] M&A triggers produce highest-scoring leads

**Context:** First pipeline build for Ohio energy market. 32 leads generated across 8 trigger types. Scored all leads using the 10-factor weighted model.

**Learning:** Acquisition announcements (M&A triggers) produced leads with an average score of 85+, significantly higher than capital expenditure triggers (average 72) or regulatory triggers (average 65). M&A creates immediate, concrete consulting demand — integration PMOs, systems consolidation, operational harmonization — with clear budgets and tight timelines.

**Evidence:** EOG Resources Utica expansion scored 92. Infinity Natural Resources/Antero asset acquisition scored 89. National Fuel Gas midstream expansion scored 86. All M&A-driven. Compare to PBF Energy Toledo turnaround (75, execution trigger) and Columbia Gas pipeline replacement (68, regulatory/capex trigger).

**Action:** Prioritize M&A monitoring queries. Run M&A queries daily instead of weekly for top targets. Weight M&A trigger type at 1.2x in scoring model.

**Confidence:** Medium — based on one market and one scoring run. Need to validate with meeting conversion data before increasing to High.

---

### [2026-02-24] [TRIGGER] Trigger verification catches critical errors at a 35% rate

**Context:** Live hardening pass on Run 1 data. Verified all 20 trigger claims against live web sources using WebSearch.

**Learning:** 7 of 20 triggers had factual errors when verified against live web data. The errors ranged from wrong dates to wrong locations to wrong deal status. Training data cannot be trusted for trigger details. Every trigger must be verified against a live source before it enters the pipeline.

**Evidence:** Specific errors found:
- EOG close date was Nov 2025, not Aug 2025
- MPLX Harmon Creek III is in Washington County PA, not Ohio
- Infinity/Antero deal closed Feb 23, 2026 — not "expected Q1 2026"
- Encino Energy ownership structure was mischaracterized
- Marathon Petroleum turnaround scope was overstated
- AEP queue size required correction (30GW to 13GW, not 30GW to 15GW)
- National Fuel deal stage was mislabeled

**Action:** MANDATORY: All triggers must pass live WebSearch verification before scoring. Added verification step to the research agent protocol. Triggers that cannot be verified are flagged as unconfirmed and scored at a 0.7x penalty.

**Confidence:** High — this is a structural limitation of language models and will persist. The 35% error rate may vary but the need for verification is permanent.

---

### [2026-02-24] [OUTREACH] Operator language outperforms consultant language

**Context:** Building the voice profile for consulting outreach. Analyzed competitive positioning of other energy consultants in Ohio market.

**Learning:** First-person operator framing ("When I ran turnarounds at Marathon...") resonates more than third-person consultant framing ("Our firm provides turnaround management services..."). Buyers in energy are operators themselves — they trust people who have done the work, not people who advise on the work. Specific deliverables ("a 90-day integration playbook") beat capability statements ("we offer integration management").

**Evidence:** Voice profile research across Justin Ray's background. Competitive analysis showed Burns & McDonnell, Black & Veatch, and regional firms all use generic capability language. The operator-first voice is a differentiator because most consultants cannot credibly claim operational experience.

**Action:** All outreach uses operator-first voice. No "our firm provides" language. Every message includes at least one specific deliverable tied to the recipient's trigger. Voice guide documented in templates.

**Confidence:** Medium — based on competitive analysis and positioning theory. No A/B test data yet. Will upgrade to High after 50+ sends with response rate comparison.

---

### [2026-02-24] [MARKET] AEP interconnection queue is the wedge opportunity

**Context:** Analyzing Ohio energy market structure for consulting entry points. AEP Ohio is the dominant utility in the state.

**Learning:** AEP's interconnection queue dropped from 30GW to 13GW after the data center tariff announcement. This is not a market collapse — it is a clearing event. Speculative applications withdrew. What remains are serious projects with committed capital. Utilities now need to process the remaining queue faster, which creates demand for interconnection process consulting, engineering support, and project management.

**Evidence:** AEP regulatory filings at PUCO. PJM queue data. WebSearch verification of tariff impact analysis. Multiple trade press articles confirmed the 30GW-to-13GW reduction.

**Action:** Position interconnection queue diagnostic as the immediate, low-commitment entry offer for utility targets. Build a 2-page diagnostic template that shows what the agent can find in public queue data. Use this as the "foot in the door" offer for AEP and other PJM utilities.

**Confidence:** High — the queue data is public and verifiable. The consulting need is structural (utilities are understaffed for queue processing). Multiple data points confirm the thesis.

---

### [2026-02-24] [COMPETITIVE] Regional consultants do not monitor triggers

**Context:** Competitive intelligence gathering on Ohio energy consulting firms during Run 1.

**Learning:** None of the identified regional competitors (Montrose Environmental, Stantec Ohio office, GHD Columbus) appear to use systematic trigger monitoring. Their business development is relationship-based and conference-based. This means trigger-based outreach — reaching a company within days of a relevant event — is a structural advantage. The first competent consultant to reference a specific trigger in outreach has a significant edge.

**Evidence:** Reviewed LinkedIn activity, website content, and public RFP responses for 6 regional competitors. No evidence of event-triggered outreach. Marketing content is generic ("we serve the energy sector") rather than event-specific.

**Action:** Speed is the competitive advantage. The agent must surface triggers and produce outreach within 48 hours of trigger detection. Emphasize timeliness in all messaging — reference the specific event, the date, and the implication.

**Confidence:** Medium — absence of evidence is not evidence of absence. Competitors may do trigger monitoring internally without public evidence. Will upgrade to High if early outreach consistently gets "how did you know about this?" responses.

---

### [2026-02-23] [PROCESS] Lead scoring model needs geographic verification layer

**Context:** First batch of 32 leads scored using the 10-factor model. Several leads turned out to have weaker Ohio connections than initially assessed.

**Learning:** The initial scoring model weighted trigger strength and company size heavily but did not adequately verify geographic relevance. MPLX scored high on trigger strength but the specific triggered project (Harmon Creek III) was in Pennsylvania, not Ohio. Geographic verification must happen before scoring, not after.

**Evidence:** MPLX Harmon Creek III project is in Washington County, PA. While MPLX has Ohio operations, the triggered project was not in-state. Similarly, two leads had "Ohio presence" that was limited to a sales office, not operational facilities.

**Action:** Added geographic verification as a pre-scoring gate. Leads must have verified Ohio operational presence (not just sales/admin) before entering the scoring pipeline. Out-of-state projects from Ohio-headquartered companies are flagged but scored at 0.8x.

**Confidence:** High — geographic verification is a simple factual check that prevents wasted outreach.

---

### [2026-02-24] [PRICING] Energy consulting rates cluster around $200-350/hr in Ohio

**Context:** Competitive pricing research during market analysis.

**Learning:** The Ohio energy consulting market prices senior-level consulting at $200-350/hour depending on specialization. Project management and controls consulting falls in the $200-275 range. Specialized engineering consulting (process safety, interconnection) commands $275-350. Integration/turnaround management can reach $300-400 for senior operators with direct experience.

**Evidence:** GSA schedule rates for comparable firms. RFP pricing from PUCO dockets (some include consultant rate ranges). Conversations with industry contacts. LinkedIn job postings for consulting roles with salary ranges that imply bill rates.

**Action:** Price the initial diagnostic offer as a fixed-fee engagement ($5,000-$15,000 range) rather than hourly. Hourly rates for follow-on work at $275/hr for project controls, $325/hr for turnaround/integration management. Avoid discounting — operator credibility justifies premium pricing.

**Confidence:** Medium — based on indirect evidence (GSA schedules, RFP data). Need direct market feedback from proposals to calibrate. Will adjust after first 3 proposals are submitted.

---

### [2026-02-24] [BUYER] VP of Operations is the primary buyer, not Procurement

**Context:** Mapping decision-making structures at target companies during Run 1.

**Learning:** For operational consulting engagements (turnarounds, integration, project controls), the VP of Operations or SVP of Engineering is the economic buyer. Procurement is involved in contracting but rarely initiates the buying process. The VP of Ops feels the pain (project delays, integration chaos, compliance gaps) and has budget authority. Procurement just processes the PO.

**Evidence:** Organizational analysis of 5 target companies. LinkedIn mapping of reporting structures. Historical pattern from Justin's operational experience — consulting engagements are initiated by line operators, not procurement.

**Action:** All outreach targets VP of Operations, SVP of Engineering, or Director of Projects. Do not target procurement or HR contacts. If outreach is forwarded to procurement, that is a positive signal (means the operator wants to engage). Build contact lists with operational leadership only.

**Confidence:** Medium — based on organizational analysis and operational experience. Will upgrade to High after first 5 meetings confirm or deny buyer-level accuracy.

---

### [2026-02-25] [FAILURE] First pipeline over-indexed on company size

**Context:** Reviewing Run 1 pipeline quality after hardening pass.

**Learning:** The first pipeline included several large companies (Marathon Petroleum, BP) where the Ohio operation is a small fraction of the total enterprise. These companies have internal consulting resources and established vendor panels. The probability of a cold outreach producing a meeting is low. Meanwhile, mid-market companies (Infinity, Encino, Gulfport) are more likely to need external consulting and less likely to have entrenched vendor relationships.

**Evidence:** Marathon Petroleum has an internal project management office of 50+ people. BP has a global consulting panel with preferred vendors. Contrast with Infinity Natural Resources, which just closed an acquisition and has a lean corporate team of ~200 people — they almost certainly need external integration support.

**Action:** Adjust scoring model to include a "accessibility" factor. Mid-market companies ($500M-$5B revenue) get a 1.1x multiplier. Mega-corps (>$20B revenue) get a 0.8x multiplier unless there is a specific contact relationship or referral path.

**Confidence:** Medium — the hypothesis is sound but not yet validated with outreach data. Large companies sometimes do engage boutique consultants for specialized work. Track actual meeting rates by company size to validate.

---

### [2026-02-25] [PROCESS] The 5-agent architecture creates clear accountability

**Context:** Post-Run 1 system review. Evaluating whether the multi-agent architecture produces better results than a monolithic approach.

**Learning:** Splitting the work across 5 specialized agents (Research, Scoring, Outreach, CRM, Strategy) with a 6th orchestrator creates clear accountability for each function. When a trigger is wrong, the Research Agent is responsible. When a score is miscalibrated, the Scoring Agent is responsible. When a message falls flat, the Outreach Agent is responsible. This makes debugging and improvement straightforward.

**Evidence:** During Run 1 hardening, we could trace every error to a specific agent and a specific step. The 35% trigger error rate was clearly a Research Agent issue. The over-indexing on company size was clearly a Scoring Agent issue. The improvements were surgical, not systemic.

**Action:** Maintain the multi-agent architecture. Resist the temptation to merge agents for "efficiency." The specialization enables targeted improvement. Each agent reads its own section of the memory files on startup.

**Confidence:** High — architectural clarity is a fundamental design principle. The multi-agent approach may be slower per-run but produces better compounding improvement.

---

### [2026-02-25] [MARKET] Ohio energy market has 3 distinct consulting segments

**Context:** Market segmentation analysis after Run 1 pipeline build.

**Learning:** The Ohio energy market is not monolithic. There are three distinct segments with different consulting needs, buyer profiles, and competitive dynamics:

1. **Upstream E&P (Appalachian Basin):** M&A-driven, lean operations teams, need integration and project management support. Buyers are VP Ops / Chief Operating Officer. Budget cycles are quarterly. Key players: EOG, Encino, Gulfport, Infinity, CNX.

2. **Midstream Infrastructure:** Capex-driven, large capital projects, need project controls, construction management, and commissioning support. Buyers are VP Engineering / Director of Projects. Budget cycles are annual (aligned with FERC filings). Key players: MPLX, EQT Midstream, Crestwood, Antero Midstream.

3. **Utility/Power Generation:** Regulatory-driven, compliance and modernization mandates, need interconnection management, grid modernization consulting, and regulatory strategy. Buyers are VP of Grid Operations / Director of Resource Planning. Budget cycles are biennial (aligned with rate cases). Key players: AEP Ohio, Duke Energy Ohio, FirstEnergy (Ohio Edison).

**Evidence:** Pipeline analysis from Run 1. Distinct trigger types map to distinct segments. M&A triggers cluster in upstream. Capex triggers cluster in midstream. Regulatory triggers cluster in utility.

**Action:** Build segment-specific outreach templates. Customize the value proposition, deliverables, and case studies by segment. Do not send a midstream-focused message to a utility target.

**Confidence:** High — market segmentation is well-supported by the data and aligns with industry structure.

---

### [2026-02-25] [TRIGGER] Job postings for project controls roles are a reliable leading indicator

**Context:** Cross-referencing trigger types with hiring data during Run 1.

**Learning:** When a company posts job openings for project controls specialists, construction managers, or turnaround planners, it reliably indicates a capital project in the planning or early execution phase. These roles are not posted speculatively — they represent committed project budgets. The consulting opportunity exists in the gap between the posting date and the hire date (typically 60-120 days).

**Evidence:** 3 of 32 leads had concurrent job postings for project controls roles. All 3 also had corresponding capex triggers (budget approvals or project announcements). The job postings confirmed the capex triggers and added urgency — they need help now, not after they fill the role.

**Action:** Add job posting monitoring to the Research Agent's daily scan. Cross-reference job postings with existing pipeline leads to identify urgency upgrades. A lead with both a capex trigger and a project controls job posting gets a +5 score boost.

**Confidence:** Medium — small sample size (3 leads). Need to track over 30+ leads to confirm the pattern. Ghost postings (roles posted but not actually being filled) are a known false positive risk.

---

### [2026-02-26] [PROCESS] Memory files must be read at session start, not just written at session end

**Context:** Designing the agent memory system architecture.

**Learning:** The value of persistent memory is not in recording — it is in retrieval. If the agent writes learnings but does not read them at the start of each session, the learnings are wasted. The startup protocol must include a mandatory read-and-summarize step for all memory files before any action is taken.

**Evidence:** Standard practice in agentic systems. Without explicit read-on-startup, agents repeat mistakes from previous runs. The Orchestrator Agent must enforce the read step before dispatching tasks to sub-agents.

**Action:** Startup protocol: (1) Read all memory files, (2) Summarize top 5 learnings relevant to current task, (3) Check for any corrections or annotations from previous sessions, (4) Then begin the current run. This is non-negotiable and cannot be skipped for speed.

**Confidence:** High — this is a design principle, not a hypothesis.

---

### [2026-02-26] [MARKET] IG Consulting transformation creates the highest-value internal opportunity

**Context:** Trevor Silva's All-Hands call (Feb 25) laid out IG's transformation from staffing ($4.1B, #4 US) to technical consulting. The company is rebranding Evergreen to IG Consulting in April 2026. Goal: compete with Deloitte ($70.5B) and Accenture ($64B).

**Learning:** The internal opportunity at Insight Global is orders of magnitude larger than the external Ohio energy pipeline. IG has 5,000+ consultants in Evergreen, $700M in professional services revenue, and zero proprietary development methodology. Their culture of development is "broken" (Trevor's word). Their performance management is "haphazard" (Trevor's word). The 143 Leadership assessment directly addresses every gap Trevor named: elite delivery, culture of development, quarterly performance management, and proprietary IP differentiation. The company's purpose statement ("develop people so they can be the light") literally uses the same language as the product name.

**Evidence:** Full transcript analysis of 72-minute All-Hands. Cross-referenced with: Insight Global #4 ranking (SIA), Cillian Maher appointment (Google Cloud/Ericsson), Matt Gonsalves background (co-created shared values, now VP Tech Delivery), Dr. Kaveh Aflaki hire (Industry Principal, Utilities), Glassdoor reviews (3.6/5, contractor benefits gap), staffing-to-consulting transformation case studies (TEKsystems, Cognizant, Wipro — all took 10-15+ years and needed proprietary IP).

**Action:** Execute the 7-phase internal transformation play (see protocols/internal-transformation-play.md). Phase 1: quiet demonstration. Phase 2: informal intro to Trevor. Phase 3: pilot 10-15 people. Phase 4: present results. Phase 5: Matt Gonsalves alignment (shared values bridge). Phase 6: Cillian Maher executive pitch. Phase 7: client-facing integration.

**Confidence:** High — the strategic alignment between 143 Leadership and IG Consulting's stated needs is structural, not coincidental. The company purpose, shared values, and transformation priorities all converge on the assessment framework.

---

### [2026-02-26] [COMPETITIVE] Deloitte and Accenture's consulting moats are tools and scale, not people quality

**Context:** Competitive research on aspirational competitors named by Trevor Silva.

**Learning:** Deloitte's dominance in utilities comes from proprietary technology accelerators (DLeaPS-U for SAP, PU&Rpose for Oracle, INTEGRATE for cloud, ATADATA for migration) and 2,000+ utility projects. Accenture's comes from $900M/year L&D investment and acquisition strategy (IQT Group, Orlade Group). Neither firm's moat is based on superior consultant quality — it's based on proprietary IP and scale. The weakness Trevor identified ("pretentious, conceited") is confirmed by market perception and Glassdoor reviews. Mid-tier firms (Burns & McDonnell $7B, Black & Veatch $4.3B, West Monroe $600M, Guidehouse $2.7B) compete on senior-heavy staffing models and domain expertise, not proprietary platforms.

**Evidence:** Web research across Deloitte utilities practice pages, Accenture Energy IDC MarketScape, Burns & McDonnell 1898 & Co., Black & Veatch Management Consulting, West Monroe 2050 Partners acquisition, Guidehouse/Navigant integration history.

**Action:** Position 143 Leadership as IG's proprietary IP equivalent. The competitive frame is: "Deloitte has DLeaPS-U. Accenture spends $900M on L&D. We have a capacity measurement platform that costs $43/person and produces data none of them can." This is the positioning for the Cillian Maher conversation.

**Confidence:** High — competitive intelligence is well-sourced from public company filings, analyst reports, and practice area pages.

---

### [2026-02-26] [BUYER] Matt Gonsalves is the critical internal champion

**Context:** Stakeholder mapping for the internal transformation play.

**Learning:** Matt Gonsalves (VP, Tech Services Delivery) is the single most important internal champion. He co-created IG's shared values AND now runs all technical delivery. He has been at IG for 19 years. He is the bridge between IG's cultural identity and its operational transformation. The shared values he created map one-to-one to the 9 Rays: Everyone Matters = Ray 7 (Connection), We Take Care of Each Other = Ray 2 (Joy), Leadership is Here to Serve = Ray 9 (Be The Light), High Character and Hard Work = Ray 4 (Power) + Ray 5 (Purpose), Always Know Where You Stand = Ray 6 (Authenticity). His endorsement converts 143 from "Justin's side project" to "an expression of IG's deepest cultural values, now measurable."

**Evidence:** LinkedIn profile, Evergreen expert page, Trevor's All-Hands org chart, IG shared values documentation, Comparably/Glassdoor culture reports.

**Action:** Do not pitch Matt until Phase 5 (after Trevor validates with pilot data). When the conversation happens, lead with the values-to-Rays mapping table. Let him see his own creation reflected in the framework. The emotional connection to values he helped create is more powerful than any business case.

**Confidence:** High — stakeholder analysis is well-supported. The values-to-Rays mapping is factual and verifiable.

---

### [2026-02-26] [PROCESS] Name corrections: Cillian Maher and Matt Gonsalves

**Context:** Cross-referencing names from Trevor's All-Hands with LinkedIn and IG public profiles.

**Learning:** Trevor used informal pronunciations that differ from official spellings. "Killian Mayor" is **Cillian Maher** (President, Evergreen). "Matt Gonzalez" is **Matt Gonsalves** (VP, Tech Services Delivery). Getting these names right in any written communication or presentation is essential for credibility.

**Evidence:** LinkedIn profiles, Evergreen expert pages, PR Newswire press releases.

**Action:** Use correct spellings in all documents, presentations, and outreach. Updated in competitive-advantage-map.md and protocols/internal-transformation-play.md.

**Confidence:** High — verified against multiple public sources.

---

## Querying Protocol

### On Session Start
1. Read this entire file.
2. Summarize the top 5 most impactful learnings (highest confidence + most relevant to current task).
3. Flag any learnings with pending validation (Medium confidence items awaiting data).
4. Check for any entries that contradict each other (learning evolution).

### Before Outreach
- Filter for OUTREACH and BUYER learnings.
- Check for relevant COMPETITIVE learnings about the target's competitive landscape.
- Apply any PRICING learnings to the current proposal context.

### Before Scoring
- Filter for TRIGGER learnings — any scoring adjustments based on trigger performance data.
- Check MARKET learnings for macro factors that might affect scoring weights.
- Review FAILURE learnings for biases to avoid.

### After Every Engagement
- Add a new learning entry capturing what happened vs. what was expected.
- If the engagement contradicts an existing learning, annotate the original entry (do not delete).
- If the engagement confirms a Medium-confidence learning, upgrade to High with the new evidence.

### Monthly Review
- Review all Medium and Low confidence learnings.
- Upgrade, downgrade, or retire based on accumulated evidence.
- Identify gaps — categories with few learnings that need more attention.
- Write a summary entry: "[YYYY-MM-DD] [PROCESS] Monthly Learning Review — [Month Year]"
