---
name: trigger-cascade-protocol
parent: consultant-lead-agent
version: 1.0
purpose: "Predict downstream buying events from observed triggers"
---

# Trigger Cascade Protocol

## 1. Purpose

Most business development is reactive. A company announces a project, you see the RFP, you compete with every other firm that also saw the RFP. You are one of seven bidders, and the incumbent has a 60% advantage.

This protocol makes business development predictive. When you observe Trigger A, you do not wait for Trigger B to appear in a press release. You predict it, monitor for it, and position your outreach to arrive before Trigger B becomes public knowledge. When the buyer starts thinking about hiring a consultant, you are already in the conversation because you reached out during the window between Trigger A and Trigger B.

The competitive advantage is timing. This protocol defines:
- What predicts what (the cascade chain library)
- How multiple triggers compound into higher scores
- How to validate predictions
- How to estimate where a lead sits in their buying window
- How to measure prediction accuracy and improve over time

---

## 2. Cascade Chain Library

Each chain follows this structure:

```
CHAIN [Number]: [Name]
Trigger A (Observed): [What you actually see]
Trigger B (Predicted): [What you expect to happen next]
Timing Window: [How long after A does B typically occur]
Confidence: [% likelihood B occurs given A]
Recommended Action: [What to do between A and B]
Package Mapping: [Which service package to lead with]
Validation Signals: [What to monitor to confirm B is materializing]
```

### Chain 1: Acquisition Integration

**Trigger A (Observed):** Acquisition or merger announced (public filing, press release)
**Trigger B (Predicted):** Integration PMO staffing need — buyer needs project management support to combine operations, systems, and organizations
**Timing Window:** 60-120 days from announcement to integration execution kickoff
**Confidence:** 85%
**Recommended Action:** Reach out within 14 days of announcement with integration diagnostic offer. Frame as "you will need integration PMO support in 60-90 days — let us scope it now so you are not scrambling."
**Package Mapping:** Package F (Integration Diagnostic), then Package B (PMO Deployment)
**Validation Signals:** Job postings for integration roles, consulting firm press releases about integration work, SEC filing disclosures of integration costs

### Chain 2: New CEO Strategy Reset

**Trigger A (Observed):** CEO or COO replaced
**Trigger B (Predicted):** Strategy review and capex re-prioritization within 90-180 days. New leaders always reassess capital allocation.
**Timing Window:** 90-180 days from appointment to new capital plan announcement
**Confidence:** 70%
**Recommended Action:** Do not reach out immediately (new CEO is overwhelmed with internal priorities). Monitor earnings calls for new strategic language. Reach out when new strategic direction becomes visible but before RFPs drop.
**Package Mapping:** Package A (Program Assessment), then Package B based on new priorities
**Validation Signals:** Earnings call transcript language changes, new board presentations, strategic plan announcements, leadership team restructuring

### Chain 3: OSHA Enforcement Response

**Trigger A (Observed):** OSHA Serious or Willful citation, especially with penalties above $100K
**Trigger B (Predicted):** Safety management system overhaul, compliance consulting engagement
**Timing Window:** 30-90 days from citation to consultant engagement
**Confidence:** 90%
**Recommended Action:** Immediate outreach. Do not wait. Compliance urgency makes this a high-receptivity window. Frame as "we help companies respond to enforcement actions and build systems that prevent recurrence."
**Package Mapping:** Package D (Compliance Execution)
**Validation Signals:** Company press releases about safety improvements, job postings for safety roles, follow-up OSHA inspections scheduled

### Chain 4: Capex Guidance Increase

**Trigger A (Observed):** Capex guidance raised on earnings call or in annual report
**Trigger B (Predicted):** Vendor procurement and RFP cycle for program management, controls, and construction services
**Timing Window:** 90-180 days from guidance increase to RFP issuance
**Confidence:** 75%
**Recommended Action:** Build relationship before the RFP drops. Warm intro to VP of Capital Projects or Director of Engineering within 60 days of capex announcement. Goal is to be on the invited bidder list, not responding cold.
**Package Mapping:** Package A (Program Management), Package C (Controls & Scheduling)
**Validation Signals:** Job postings for project controls and PM roles, construction permit filings, equipment procurement notices

### Chain 5: Earnings Miss Cost Reduction

**Trigger A (Observed):** Revenue miss and/or margin compression disclosed on earnings call, combined with management commentary about efficiency or cost reduction
**Trigger B (Predicted):** Formal cost reduction or turnaround program with external consulting support
**Timing Window:** 60-120 days from earnings disclosure to consulting engagement
**Confidence:** 80%
**Recommended Action:** Position cost-reduction and operational efficiency angle. Time outreach for 30-45 days after earnings (give them time to formalize the initiative internally, then arrive as they are scoping external support).
**Package Mapping:** Package B (Turnaround Optimization)
**Validation Signals:** Press releases about efficiency programs, workforce reduction announcements, new Chief Transformation Officer or similar role created

### Chain 6: New Facility Construction

**Trigger A (Observed):** Construction permit filed or zoning change approved for industrial facility
**Trigger B (Predicted):** Construction management and project controls staffing need
**Timing Window:** 90-180 days from permit to construction management procurement
**Confidence:** 70%
**Recommended Action:** Early relationship building with the owner's capital projects team. Position for the construction management oversight role, not the construction itself.
**Package Mapping:** Package A (Program Management), Package C (Controls & Scheduling)
**Validation Signals:** Design engineering contract award, foundation contractor selection, equipment procurement orders

### Chain 7: Consent Decree Emergency

**Trigger A (Observed):** Consent decree signed with EPA, state environmental agency, or other regulatory body
**Trigger B (Predicted):** Compliance execution sprint — company needs external support to meet consent decree milestones, often with federal oversight
**Timing Window:** 0-30 days. Consent decrees have immediate compliance deadlines.
**Confidence:** 95%
**Recommended Action:** Emergency outreach within 48 hours. This is the highest-urgency chain. The company is under a legal mandate to perform and is almost certainly under-resourced. Frame as "we specialize in helping companies execute consent decree compliance programs on deadline."
**Package Mapping:** Package D (Compliance Execution)
**Validation Signals:** Public consent decree document (filed in court), company press release about compliance program, job postings for compliance roles

### Chain 8: Activist Investor Board Pressure

**Trigger A (Observed):** Activist investor takes significant position, or multiple board members replaced within 6 months
**Trigger B (Predicted):** Strategic review followed by capital reallocation. Timing depends on activist playbook.
**Timing Window:** 120-240 days from activist disclosure to strategic action
**Confidence:** 55%
**Recommended Action:** Monitor only. Do not act on Trigger A alone. Board-level changes take 6-12 months to translate into operational changes. Wait for Trigger B confirmation (strategic review announced, new CEO appointed, or capex plan changed).
**Package Mapping:** Watch and wait. Package A or B depending on strategic direction once clear.
**Validation Signals:** SEC proxy filing for board nominees, 13D/13F filings for activist position, earnings call language about "strategic alternatives" or "portfolio review"

### Chain 9: Key Executive Departure

**Trigger A (Observed):** VP or Director of Operations, Engineering, Capital Projects, or Construction departs
**Trigger B (Predicted):** Capability gap creates execution slowdown. Interim management or consulting engagement needed within 30-90 days.
**Timing Window:** 30-90 days from departure to consulting engagement
**Confidence:** 65%
**Recommended Action:** Reach out within 14 days of departure announcement. Pitch interim PMO leadership or execution support to bridge the gap until permanent replacement is hired and onboarded.
**Package Mapping:** Package E (Interim Management), Package B (PMO Deployment)
**Validation Signals:** LinkedIn departure announcement, company not posting replacement role (indicates considering consulting bridge), remaining team members posting about workload on LinkedIn

### Chain 10: Credit Downgrade Efficiency Push

**Trigger A (Observed):** Credit rating downgrade or negative outlook from Moody's, S&P, or Fitch
**Trigger B (Predicted):** Capex budget cut followed by efficiency mandate. Company needs to do more with less.
**Timing Window:** 60-120 days from downgrade to efficiency initiative
**Confidence:** 75%
**Recommended Action:** Position cost-out and operational efficiency consulting. Acknowledge budget constraints upfront — the company knows money is tight. Frame as "we help companies optimize capital program execution to deliver the same outcomes with 15-20% less spend."
**Package Mapping:** Package B (Turnaround Optimization)
**Validation Signals:** Capex guidance reduction, efficiency program announcement, workforce reduction, "doing more with less" language on earnings calls

### Chain 11: Regulatory Mandate Capital Program

**Trigger A (Observed):** New regulation published (EPA rule, FERC order, state commission ruling) requiring capital investment
**Trigger B (Predicted):** Affected companies assess compliance requirements and adjust capital budgets
**Trigger C (Predicted):** Compliance project execution begins
**Timing Window:** B at 30-90 days, C at 120-360 days
**Confidence:** 80% for B, 55% for C
**Recommended Action:** Thought leadership positioning during B-phase (publish analysis of what the regulation means for companies). Direct outreach during transition from B to C when budgets are being allocated.
**Package Mapping:** Package A (Program Management), Package D (Compliance Execution)
**Validation Signals:** Industry association comment letters, company earnings call mentions of new regulatory requirements, rate case filings to recover compliance costs

### Chain 12: Technology Platform Migration

**Trigger A (Observed):** ERP, work management, or asset management system migration announced
**Trigger B (Predicted):** Change management and implementation PMO consulting need
**Timing Window:** 30-120 days from announcement to consulting engagement
**Confidence:** 70%
**Recommended Action:** Position change management or implementation PMO support. Technology platform migrations always underestimate the organizational change management component.
**Package Mapping:** Package A (Program Management), Package D (Change Management)
**Validation Signals:** Vendor selection announcement (SAP, Oracle, Maximo), job postings for implementation roles, consulting firm engagement announcements

### Chain 13: Joint Venture Coordination

**Trigger A (Observed):** Joint venture or strategic partnership formed
**Trigger B (Predicted):** Governance and coordination PMO need. JVs always underestimate the complexity of managing shared decision-making, cost allocation, and joint execution.
**Timing Window:** 30-90 days from JV formation to coordination consulting need
**Confidence:** 60%
**Recommended Action:** Reach out to both JV partners. Position as neutral coordination PMO that serves the JV entity, not either parent company.
**Package Mapping:** Package F (Integration/Coordination), Package A (Program Management)
**Validation Signals:** JV entity incorporation filings, joint press releases about project scope, job postings under the JV entity name

### Chain 14: Rate Case Approval (Utility-Specific)

**Trigger A (Observed):** Rate case approved by PUCO, state PUC, or FERC
**Trigger B (Predicted):** Capital program funding is secured and vendor procurement cycle begins immediately
**Timing Window:** 0-120 days from approval to RFP issuance
**Confidence:** 85%
**Recommended Action:** Pre-position before the rate case decision. If tracking a pending rate case, build the relationship now. On approval day, be ready to reach out immediately with program management support for the newly funded capital program.
**Package Mapping:** Package A (Program Management), Package C (Controls & Scheduling)
**Validation Signals:** PUCO docket entry for final order, company press release about approved capital plan, investor presentations showing updated capital program

### Chain 15: Contract Dispute Vendor Displacement

**Trigger A (Observed):** Lawsuit or arbitration filing against current consulting/engineering vendor for breach of contract, schedule delays, or cost overruns
**Trigger B (Predicted):** Vendor replacement cycle. The company will seek a new provider for the disputed scope, often with urgency.
**Timing Window:** 30-90 days from filing to vendor replacement RFP
**Confidence:** 65%
**Recommended Action:** Reach out as soon as the dispute becomes public. Frame as "we understand you are managing a challenging vendor situation. If you need independent oversight or a fresh team to take over scope, we can mobilize quickly."
**Package Mapping:** Package B (PMO Deployment), Package A (Program Management)
**Validation Signals:** Court filings (PACER, state court), industry press about the dispute, job postings for roles that the displaced vendor was filling

### Chain 16: Environmental Incident Response

**Trigger A (Observed):** Environmental incident (spill, release, contamination) reported to EPA or state agency
**Trigger B (Predicted):** Environmental remediation and compliance management need
**Timing Window:** 0-60 days from incident to consulting engagement
**Confidence:** 80%
**Recommended Action:** Immediate outreach if the incident creates project management needs beyond environmental remediation itself (e.g., facility shutdown management, stakeholder communication, regulatory response coordination).
**Package Mapping:** Package D (Compliance Execution), Package A (Program Management)
**Validation Signals:** EPA enforcement action, state environmental agency notice, company press release about remediation plan

### Chain 17: Grid Reliability Event (Utility-Specific)

**Trigger A (Observed):** Major grid reliability event (large-scale outage, NERC reliability standard violation, grid emergency declaration)
**Trigger B (Predicted):** Grid hardening and reliability investment program with external program management support
**Timing Window:** 60-180 days from event to program initiation
**Confidence:** 75%
**Recommended Action:** Position grid reliability program management expertise. After a reliability event, utilities face regulatory scrutiny and public pressure that accelerates capital investment.
**Package Mapping:** Package A (Program Management), Package C (Controls & Scheduling)
**Validation Signals:** NERC violation notices, utility commission investigation dockets, company investor presentations about reliability investment, rate case filings for reliability spending

### Chain 18: Workforce Retirement Wave

**Trigger A (Observed):** Company discloses that 20%+ of workforce is retirement-eligible within 3 years, or multiple senior technical leaders retire within 6 months
**Trigger B (Predicted):** Knowledge transfer consulting and interim technical leadership need
**Timing Window:** 60-180 days from disclosure or observed retirements to consulting engagement
**Confidence:** 55%
**Recommended Action:** Position knowledge transfer and interim leadership services. Frame as "your institutional knowledge is walking out the door. We can capture it, document it, and bridge the gap while you hire the next generation."
**Package Mapping:** Package E (Interim Management), Package D (Change Management)
**Validation Signals:** Multiple LinkedIn retirement announcements from same company, company presentations about workforce demographics, job postings for roles with historically low turnover

### Chain 19: Supply Chain Disruption

**Trigger A (Observed):** Major supply chain disruption affecting project execution (equipment delivery delays, material shortages, vendor insolvency)
**Trigger B (Predicted):** Schedule recovery and project controls consulting need as projects fall behind plan
**Timing Window:** 30-90 days from disruption disclosure to consulting engagement
**Confidence:** 70%
**Recommended Action:** Position schedule recovery and turnaround management expertise. Companies experiencing supply chain disruptions need help re-baselining schedules, identifying recovery options, and managing stakeholder expectations.
**Package Mapping:** Package C (Controls & Scheduling), Package B (Turnaround Optimization)
**Validation Signals:** Project delay announcements, force majeure disclosures, equipment supplier financial distress reports, contractor schedule claims

### Chain 20: Decarbonization Commitment

**Trigger A (Observed):** Company announces net-zero target, carbon reduction commitment, or sustainability program with specific capital investment
**Trigger B (Predicted):** Decarbonization capital program requiring program management and project controls support
**Timing Window:** 120-360 days from commitment to capital program execution
**Confidence:** 60%
**Recommended Action:** Long-term relationship building. Decarbonization programs have extended planning horizons but will eventually require execution support. Position during the planning phase so you are established when execution begins.
**Package Mapping:** Package A (Program Management), Package C (Controls & Scheduling)
**Validation Signals:** Sustainability report publication, SEC climate disclosure filings, green bond issuance, renewable energy RFPs, facility retrofit permit applications

---

## 3. Compound Trigger Scoring

When multiple triggers fire on the same company within a defined window, the combined signal is stronger than any individual trigger. The compound scoring system quantifies this.

### Base Scoring

Each individual trigger receives a base score calculated as:

```
Base Score = Trigger Reliability (1-5) x Source Tier Weight x Cascade Confidence x Timing Relevance
```

Where:
- **Trigger Reliability:** 1-5 from the trigger taxonomy
- **Source Tier Weight:** Tier 1 = 1.0, Tier 2 = 0.9, Tier 3 = 0.7, Tier 4 = 0.5
- **Cascade Confidence:** The % confidence of the applicable cascade chain, expressed as decimal
- **Timing Relevance:** 1.0 if within predicted buying window, 0.7 if before window, 0.4 if window has passed

### Compound Multipliers

When multiple triggers fire on the same company within a rolling 90-day window:

| Trigger Count (within 90 days) | Score Modifier | Alert Level |
|-------------------------------|---------------|-------------|
| 1 trigger | Base score only | Standard (weekly report) |
| 2 triggers | Base score + 15 points | Urgent (24-hour alert) |
| 3 triggers | Base score + 25 points | Immediate (1-hour alert) |
| 4+ triggers | Base score + 35 points | Immediate + human escalation |

### Contradictory Trigger Rules

When triggers point in opposite directions, do not average them. Escalate.

| Trigger Combination | Classification | Action |
|---------------------|---------------|--------|
| Capex increase + Credit downgrade | Contradictory | Escalate to human. Possible scenario: company is borrowing to invest despite financial stress. Could be bullish (growth investment) or bearish (desperate spending). |
| Hiring surge + Layoffs (different departments) | Ambiguous | Investigate. May indicate strategic pivot — cutting one area to invest in another. |
| Acquisition + Divestiture (same quarter) | Portfolio rebalancing | Both signals are valid. Company is reshaping. Both integration and transition consulting may apply. |
| CEO departure + Capex increase | Sequential | Likely: outgoing CEO approved capex; new CEO may or may not continue. Monitor for 60 days before acting on capex signal. |
| OSHA citation + Safety hiring surge | Confirming | Combine scores with full compound multiplier. Both signals point to same need. |

### Compound Score Calculation Example

```
Company: Midwest Energy Corp
Trigger 1: Capex guidance increased 30% (Reliability 4, Tier 1 source, Chain 4 confidence 75%, within window)
  Base Score = 4 x 1.0 x 0.75 x 1.0 = 3.0 → normalized to 60 points

Trigger 2: 7 PM roles posted on LinkedIn (Reliability 3, Tier 4 source, no chain, within window)
  Base Score = 3 x 0.5 x 0.5 x 1.0 = 0.75 → normalized to 15 points

Compound: 2 triggers within 90 days → +15 points

Total Compound Score: 60 + 15 + 15 = 90 points → IMMEDIATE alert
```

---

## 4. Cascade Validation

A predicted trigger moves through four states:

### State 1: Predicted

**Definition:** Trigger A has fired and cascade chain logic predicts Trigger B will occur within the timing window.
**Status:** Active monitoring. The Research Agent adds specific validation queries to the daily or weekly monitoring cycle.
**Evidence Required to Stay Active:** None beyond the initial Trigger A observation.
**Duration:** Remains in "Predicted" state until either validated, expired, or contradicted.

### State 2: Partially Confirmed

**Definition:** Indirect evidence suggests Trigger B is materializing, but no definitive confirmation yet.
**Examples of Partial Confirmation:**
- Job postings appear for roles that would support Trigger B activity
- Supplier orders are detected that align with Trigger B requirements
- LinkedIn activity from company executives aligns with Trigger B themes
- Conference presentations mention plans that would require Trigger B
**Action:** Upgrade monitoring frequency to daily. Begin pre-positioning outreach if compound score warrants it.

### State 3: Confirmed

**Definition:** Trigger B has occurred and is observable through Tier 1 or Tier 2 sources.
**Examples of Confirmation:**
- Press release announces the predicted project, RFP, or initiative
- SEC filing discloses the predicted capital allocation
- Regulatory filing confirms the predicted compliance action
- Company website updates reflect the predicted organizational change
**Action:** Trigger outreach immediately. Mark cascade chain as confirmed for performance tracking. Begin monitoring for Trigger C if the chain extends further.

### State 4: Expired

**Definition:** The timing window has passed without Trigger B materializing, and no partial confirmation evidence exists.
**Action:** Archive the prediction. Log the miss for cascade chain performance tracking. Do not continue monitoring for this specific prediction. Assess whether Trigger A was misinterpreted or whether the chain needs timing adjustment.

### State Transition Rules

```
Predicted → Partially Confirmed: Any Tier 3+ evidence within timing window
Predicted → Confirmed: Tier 1 or Tier 2 evidence within timing window
Predicted → Expired: Timing window passes with no evidence
Partially Confirmed → Confirmed: Tier 1 or Tier 2 evidence
Partially Confirmed → Expired: Timing window passes + 30-day grace period
Confirmed → (chain complete): Log and close
Expired → Reactivated: New Trigger A fires that resets the chain (rare)
```

---

## 5. Timing Window Management

The buying window is the period during which a company is actively seeking and evaluating external consulting support. Outreach timing relative to the buying window is the single most important factor in conversion rate.

### Window Phases

**Phase 1: Pre-Window (Awareness)**
**Definition:** The company knows they have a problem or opportunity but has not allocated budget or started searching for providers.
**Duration:** Typically 30-120 days after the initial trigger
**Buyer Behavior:** Internal discussions, preliminary scoping, budget requests, informal conversations with trusted advisors
**Your Action:** Educate. Share relevant thought leadership, case studies, or insights that help them frame the problem. Do not sell. Position as a knowledgeable resource.
**Outreach Tone:** "I noticed [trigger]. Companies in similar situations often face [challenge]. Here is how we have seen others handle it."
**Conversion Rate if Contacted:** 5-10% (too early for most buyers)

**Phase 2: Open Window (Evaluation)**
**Definition:** Budget is allocated or being finalized. The company is actively looking for providers, comparing options, and evaluating capabilities.
**Duration:** Typically 30-90 days
**Buyer Behavior:** RFP issuance, capability presentations, reference checks, proposal evaluations, site visits
**Your Action:** Sell. Present your capabilities, team, approach, and pricing. Be responsive and available. This is the competitive phase.
**Outreach Tone:** "Based on your [specific need], here is how we would approach this engagement. Our team has delivered [specific outcome] for [similar client]."
**Conversion Rate if Contacted:** 25-40% (buyer is receptive and actively evaluating)

**Phase 3: Closing Window (Decision)**
**Definition:** The company is down to finalists and making a decision. New entrants are rarely considered at this stage.
**Duration:** Typically 14-30 days
**Buyer Behavior:** Final negotiations, contract review, reference calls, internal approval process
**Your Action:** Compete. If you are a finalist, be available for negotiations, reference calls, and any final questions. If you are not already in the process, it is generally too late.
**Outreach Tone:** Only if already engaged: "We are prepared to finalize terms and mobilize within [X] days of signing."
**Conversion Rate if New Contact:** 2-5% (extremely difficult to enter at this stage)

**Phase 4: Closed Window (Post-Decision)**
**Definition:** Vendor has been selected. Contract is signed or imminent. The buying cycle for this specific need is over.
**Duration:** N/A (window is closed)
**Buyer Behavior:** Onboarding selected vendor, kicking off engagement
**Your Action:** Monitor for the next cycle. Stay on the buyer's radar for future needs. Document the outcome for win/loss tracking.
**Outreach Tone:** "Congratulations on your [project/program]. If your needs evolve or you need additional support, we would welcome the conversation."
**Conversion Rate:** 0% for this cycle. 15-20% for future cycles if relationship is maintained.

### Window Estimation Algorithm

Based on observed triggers, estimate the current window phase:

```
Days Since Trigger A: [D]
Chain Timing Window: [W_min to W_max days]
Window Phase Estimation:

If D < W_min - 30: Pre-Window (too early)
If W_min - 30 <= D < W_min: Late Pre-Window (education outreach appropriate)
If W_min <= D <= W_max: Open Window (selling outreach appropriate)
If W_max < D <= W_max + 30: Closing Window (only if already engaged)
If D > W_max + 30: Closed Window (monitor for next cycle)
```

**Adjustments to the base algorithm:**
- If a confirming dark signal is detected, shift the window estimate 30 days earlier
- If a contradictory signal is detected, extend the window estimate 30 days later
- If a compound trigger event occurs (2+ triggers), assume window opens 15 days earlier than the single-trigger estimate
- If a consent decree or regulatory enforcement chain, compress the entire window by 50% (urgency accelerates buying)

---

## 6. Cascade Performance Tracking

Every cascade chain prediction is tracked for accuracy. The system improves over time by adjusting timing windows, confidence levels, and chain definitions based on observed outcomes.

### Prediction Tracking Record

For every cascade chain activation:

```
PREDICTION RECORD
Chain: [Chain number and name]
Company: [Name]
Trigger A: [Description]
Trigger A Date: [YYYY-MM-DD]
Trigger B Predicted: [Description]
Predicted Window: [Start date to End date]
Predicted Confidence: [%]

--- Updated when outcome is known ---
Trigger B Actual: [What actually happened, or "Did not materialize"]
Trigger B Date: [YYYY-MM-DD, or "N/A"]
Outcome: [Confirmed / Expired / Partially Confirmed / Contradicted]
Timing Error: [Days early/late vs. predicted window midpoint]
Outreach Sent: [Yes/No]
Meeting Resulted: [Yes/No]
Revenue Generated: [$, or "None"]
```

### Quarterly Chain Performance Report

Aggregate prediction records by chain:

```
CHAIN PERFORMANCE REPORT - Q[X] [YYYY]
Chain: [Number] - [Name]
Predictions Made This Quarter: [count]
Predictions Confirmed: [count] ([%])
Predictions Expired: [count] ([%])
Predictions Still Active: [count]
Average Timing Error: [+/- days from window midpoint]
Outreach Conversion Rate: [meetings / outreach attempts]
Revenue Attribution: [$, if trackable]

Performance Classification:
- HIGH CONFIDENCE (>80% confirmed): Increase monitoring frequency, prioritize outreach on this chain
- STANDARD (50-80% confirmed): Maintain current parameters
- LOW CONFIDENCE (30-50% confirmed): Adjust timing windows, review trigger interpretation
- RETIRE (<30% confirmed for 2+ consecutive quarters): Remove from active chain library

Recommended Adjustments:
- Timing Window: [Current] → [Recommended] (based on observed timing distribution)
- Confidence Level: [Current] → [Recommended] (based on confirmation rate)
- Validation Signals: [Add/Remove specific signals based on what actually indicated confirmation]
```

### Annual Chain Library Review

Once per year, conduct a full review of the cascade chain library:

1. **Retire** chains with <30% accuracy over the trailing 4 quarters (minimum 8 predictions)
2. **Promote** chains with >80% accuracy to "High Confidence" status (increased monitoring frequency, prioritized outreach)
3. **Adjust** timing windows for all chains based on observed timing distributions (use interquartile range of confirmed predictions)
4. **Add** new chains based on patterns observed in trigger data that are not yet formalized into chains
5. **Merge** chains that are effectively the same trigger-response pattern with different labels
6. **Split** chains that have different performance characteristics in different industries or company sizes

### Performance Metrics Dashboard

The following metrics are tracked continuously and reported quarterly:

```
SYSTEM PERFORMANCE METRICS
Total Active Chains: [count]
Total Predictions Made (trailing 12 months): [count]
Overall Confirmation Rate: [%]
Average Timing Accuracy: [+/- days]
Outreach Conversion Rate (chain-triggered outreach → meeting): [%]
Revenue Attributable to Chain-Triggered Outreach: [$]
False Positive Rate (outreach sent, no response/no relevance): [%]
Chain with Highest Confirmation Rate: [chain name, %]
Chain with Lowest Confirmation Rate: [chain name, %]
New Chains Added This Period: [count]
Chains Retired This Period: [count]
```

---

## Appendix: Quick Reference — Chain-to-Package Mapping

| Chain | Trigger A | Primary Package | Secondary Package |
|-------|-----------|----------------|-------------------|
| 1 | Acquisition announced | F (Integration Diagnostic) | B (PMO Deployment) |
| 2 | CEO replaced | A (Program Assessment) | B (based on new priorities) |
| 3 | OSHA citation | D (Compliance Execution) | -- |
| 4 | Capex guidance increase | A (Program Management) | C (Controls & Scheduling) |
| 5 | Earnings miss | B (Turnaround Optimization) | -- |
| 6 | Facility permit filed | A (Program Management) | C (Controls & Scheduling) |
| 7 | Consent decree signed | D (Compliance Execution) | -- |
| 8 | Board/activist pressure | Watch and wait | A or B when direction clear |
| 9 | Executive departure | E (Interim Management) | B (PMO Deployment) |
| 10 | Credit downgrade | B (Turnaround Optimization) | -- |
| 11 | New regulation published | A (Program Management) | D (Compliance Execution) |
| 12 | Technology migration | A (Program Management) | D (Change Management) |
| 13 | JV formed | F (Integration/Coordination) | A (Program Management) |
| 14 | Rate case approved | A (Program Management) | C (Controls & Scheduling) |
| 15 | Vendor contract dispute | B (PMO Deployment) | A (Program Management) |
| 16 | Environmental incident | D (Compliance Execution) | A (Program Management) |
| 17 | Grid reliability event | A (Program Management) | C (Controls & Scheduling) |
| 18 | Workforce retirement wave | E (Interim Management) | D (Change Management) |
| 19 | Supply chain disruption | C (Controls & Scheduling) | B (Turnaround Optimization) |
| 20 | Decarbonization commitment | A (Program Management) | C (Controls & Scheduling) |

## Appendix: Integration Points

### Data Received BY Trigger Cascade Protocol
- From Research Agent: All observed Trigger A events with source, date, and reliability tier
- From Revenue Agent: Outcome data (did chain-triggered outreach result in revenue?) for performance tracking
- From Competitive Agent: Competitor activity that may affect timing windows (competitor already engaged = window closing faster)

### Data Sent FROM Trigger Cascade Protocol
- To Research Agent: Validation monitoring queries (what to watch for to confirm Trigger B)
- To Outreach Agent: Window phase estimates and recommended outreach timing
- To Revenue Agent: Pipeline predictions based on cascade chain confidence and timing
- To Parent Orchestrator: Compound trigger alerts, escalation events, system performance metrics
