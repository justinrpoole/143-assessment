# KPI Taxonomy — Master Reference

This is the comprehensive KPI library organized by category and subcategory.
Use this when building KPI frameworks to ensure coverage and when the user
asks "what should I measure for X?"

Every KPI below includes all Airtable fields.

---

## Category: Financial

### Subcategory: Revenue

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Monthly Recurring Revenue (MRR) | Sum of all active subscription revenue | $ | Monthly | Number |
| Annual Recurring Revenue (ARR) | MRR × 12 | $ | Monthly | Number |
| New MRR | Revenue from new customers acquired this period | $ | Monthly | Number |
| Expansion MRR | Revenue increase from existing customers (upgrades, add-ons) | $ | Monthly | Number |
| Contraction MRR | Revenue decrease from existing customers (downgrades) | $ | Monthly | Number |
| Churned MRR | Revenue lost from cancelled customers | $ | Monthly | Number |
| Net New MRR | New + Expansion - Contraction - Churned | $ | Monthly | Number |
| Average Revenue Per User (ARPU) | Total revenue / Total active customers | $ | Monthly | Number |
| Average Revenue Per Account (ARPA) | Total revenue / Total active accounts | $ | Monthly | Number |
| Revenue Growth Rate | (Current period - Previous period) / Previous period | % | Monthly | Percentage |
| Revenue per Employee | Total revenue / Headcount | $ | Quarterly | Number |

### Subcategory: Profitability

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Gross Margin | (Revenue - COGS) / Revenue | % | Monthly | Percentage |
| Net Profit Margin | Net Income / Revenue | % | Monthly | Percentage |
| Operating Margin | Operating Income / Revenue | % | Monthly | Percentage |
| EBITDA Margin | EBITDA / Revenue | % | Quarterly | Percentage |
| Contribution Margin | (Revenue - Variable Costs) / Revenue | % | Monthly | Percentage |
| Rule of 40 | Revenue Growth Rate + Profit Margin | # | Quarterly | Number |

### Subcategory: Unit Economics

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Customer Acquisition Cost (CAC) | Total S&M spend / New customers | $ | Monthly | Number |
| Lifetime Value (LTV) | ARPU × Gross Margin × Avg Lifespan | $ | Quarterly | Number |
| LTV:CAC Ratio | LTV / CAC | ratio | Quarterly | Number |
| CAC Payback Period | CAC / (Monthly ARPU × Gross Margin) | months | Quarterly | Number |
| Burn Multiple | Net Burn / Net New ARR | ratio | Quarterly | Number |
| Magic Number | Net New ARR / Previous Quarter S&M Spend | ratio | Quarterly | Number |

### Subcategory: Cash Flow

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Monthly Burn Rate | Total monthly operating expenses | $ | Monthly | Number |
| Runway | Cash on hand / Monthly burn rate | months | Monthly | Number |
| Cash Conversion Score | Revenue / Cash Collected | % | Monthly | Percentage |
| Days Sales Outstanding (DSO) | (Accounts Receivable / Revenue) × Days | days | Monthly | Number |
| Free Cash Flow | Operating Cash Flow - Capital Expenditures | $ | Monthly | Number |

---

## Category: Customer

### Subcategory: Satisfaction

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Net Promoter Score (NPS) | % Promoters - % Detractors | NPS points | Quarterly | Number |
| Customer Satisfaction Score (CSAT) | Average satisfaction rating | score (1-5) | Monthly | Number |
| Customer Effort Score (CES) | Average effort rating (lower = better) | score (1-7) | Monthly | Number |
| Support Ticket Satisfaction | % of tickets rated positive | % | Weekly | Percentage |

### Subcategory: Retention

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Customer Retention Rate | Customers end of period / Customers start of period | % | Monthly | Percentage |
| Net Revenue Retention (NRR) | (Starting MRR + Expansion - Contraction - Churn) / Starting MRR | % | Monthly | Percentage |
| Gross Revenue Retention (GRR) | (Starting MRR - Contraction - Churn) / Starting MRR | % | Monthly | Percentage |
| Monthly Churn Rate | Customers lost / Customers at start of month | % | Monthly | Percentage |
| Annual Churn Rate | 1 - (1 - Monthly Churn)^12 | % | Annually | Percentage |
| Logo Churn | # of customers lost / # at start | % | Monthly | Percentage |
| Dollar Churn | MRR lost / MRR at start | % | Monthly | Percentage |

### Subcategory: Acquisition

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| New Customers | Count of customers acquired in period | # | Monthly | Number |
| Customer Acquisition Cost (CAC) | Total acquisition spend / New customers | $ | Monthly | Number |
| Lead-to-Customer Rate | Customers / Leads | % | Monthly | Percentage |
| Trial-to-Paid Rate | Paid conversions / Trial starts | % | Monthly | Percentage |
| Time to Close | Average days from first contact to signed deal | days | Monthly | Number |
| Win Rate | Deals won / Deals in pipeline | % | Monthly | Percentage |

### Subcategory: Engagement

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Daily Active Users (DAU) | Unique users active per day | # | Daily | Number |
| Monthly Active Users (MAU) | Unique users active per month | # | Monthly | Number |
| Stickiness (DAU/MAU) | DAU / MAU | % | Monthly | Percentage |
| Session Duration | Average time per session | minutes | Weekly | Number |
| Feature Adoption Rate | Users who used feature / Total users | % | Monthly | Percentage |
| Time to First Value | Days from signup to first meaningful action | days | Monthly | Number |
| Activation Rate | Users who hit activation milestone / Total signups | % | Monthly | Percentage |

---

## Category: Operational

### Subcategory: Efficiency

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Cycle Time | Average time from start to completion | days | Weekly | Number |
| Throughput | Units of work completed per period | # | Weekly | Number |
| Process Efficiency | Value-add time / Total time | % | Monthly | Percentage |
| Automation Rate | Automated tasks / Total tasks | % | Quarterly | Percentage |
| Error Rate | Errors / Total transactions | % | Weekly | Percentage |
| Rework Rate | Items requiring rework / Total items | % | Weekly | Percentage |

### Subcategory: Delivery

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| On-Time Delivery Rate | Delivered on time / Total deliveries | % | Monthly | Percentage |
| SLA Compliance | Obligations met / Total obligations | % | Monthly | Percentage |
| First-Time Resolution Rate | Issues resolved on first contact | % | Weekly | Percentage |
| Mean Time to Resolution (MTTR) | Average time to resolve issues | hours | Weekly | Number |
| Mean Time Between Failures (MTBF) | Average time between incidents | days | Monthly | Number |
| Uptime / Availability | (Total time - Downtime) / Total time | % | Monthly | Percentage |

### Subcategory: Quality

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Defect Rate | Defects found / Units produced or delivered | % | Weekly | Percentage |
| Escaped Defects | Defects found in production / Total defects | % | Monthly | Percentage |
| Test Coverage | Code covered by tests / Total code | % | Weekly | Percentage |
| Customer-Reported Issues | Issues reported by customers per period | # | Weekly | Number |
| Compliance Score | Requirements met / Total requirements | % | Quarterly | Percentage |

---

## Category: Growth

### Subcategory: Marketing

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Website Traffic | Unique visitors per period | # | Weekly | Number |
| Organic Traffic Growth | (Current - Previous) / Previous organic visits | % | Monthly | Percentage |
| Conversion Rate | Conversions / Total visitors | % | Weekly | Percentage |
| Cost per Lead (CPL) | Marketing spend / Leads generated | $ | Monthly | Number |
| Marketing Qualified Leads (MQLs) | Leads meeting qualification criteria | # | Weekly | Number |
| Sales Qualified Leads (SQLs) | MQLs accepted by sales | # | Weekly | Number |
| MQL to SQL Rate | SQLs / MQLs | % | Monthly | Percentage |
| Email Open Rate | Emails opened / Emails delivered | % | Per send | Percentage |
| Email Click-Through Rate | Emails clicked / Emails delivered | % | Per send | Percentage |
| Social Media Engagement Rate | Engagements / Impressions | % | Weekly | Percentage |
| Content ROI | Revenue attributed to content / Content investment | ratio | Quarterly | Number |

### Subcategory: Product

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Feature Usage Rate | Users using feature / Total active users | % | Monthly | Percentage |
| Adoption Velocity | Time from release to target adoption % | days | Per release | Number |
| User Activation Rate | Users hitting activation criteria / New signups | % | Weekly | Percentage |
| Product Qualified Leads (PQLs) | Free users hitting paid-readiness signals | # | Weekly | Number |
| Net Feature Requests | New requests - Resolved requests | # | Monthly | Number |

---

## Category: People

### Subcategory: Workforce

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Employee NPS (eNPS) | % Promoters - % Detractors (employees) | NPS points | Quarterly | Number |
| Voluntary Turnover Rate | Voluntary departures / Avg headcount | % | Quarterly | Percentage |
| Time to Fill | Average days to fill open position | days | Quarterly | Number |
| Offer Acceptance Rate | Offers accepted / Offers extended | % | Quarterly | Percentage |
| Revenue per Employee | Total revenue / Total employees | $ | Quarterly | Number |
| Training Hours per Employee | Total training hours / Headcount | hours | Quarterly | Number |
| Manager Effectiveness Score | Average rating from direct reports | score (1-5) | Quarterly | Number |

---

## Category: Compliance

### Subcategory: Risk

| KPI Description | Measure | Unit | Cadence | Target Type |
|---|---|---|---|---|
| Open Risk Items | Count of unresolved risks above threshold | # | Weekly | Number |
| Risk Mitigation Rate | Risks mitigated on time / Total risks | % | Monthly | Percentage |
| Incident Count | Security or compliance incidents per period | # | Monthly | Number |
| Audit Findings | Open findings from most recent audit | # | Quarterly | Number |
| Policy Compliance Rate | Employees compliant / Total employees | % | Quarterly | Percentage |
| Data Breach Response Time | Time from detection to containment | hours | Per incident | Number |

---

## Coaching & Assessment Business KPIs

Specific to Justin's 143 Leadership business:

| KPI Description | Category | Subcategory | Measure | Unit | Cadence |
|---|---|---|---|---|---|
| Assessment Completion Rate | Product | Engagement | Completed assessments / Started assessments | % | Monthly |
| Average Assessment Score | Product | Quality | Mean score across all completions | score | Monthly |
| Score Distribution Health | Product | Quality | Standard deviation of scores (too narrow = ceiling effect) | # | Quarterly |
| Coaching Session Attendance | Customer | Engagement | Sessions attended / Sessions scheduled | % | Weekly |
| Coaching Outcome Score | Customer | Satisfaction | Self-reported progress rating | score (1-10) | Monthly |
| Time to Assessment Delivery | Operational | Delivery | Days from completion to report delivery | days | Weekly |
| Report Satisfaction | Customer | Satisfaction | Client rating of assessment report | score (1-5) | Per delivery |
| Coach Utilization Rate | People | Workforce | Booked hours / Available hours | % | Weekly |
| Client Renewal Rate | Customer | Retention | Clients renewing / Clients eligible | % | Quarterly |
| Revenue per Assessment | Financial | Revenue | Total assessment revenue / Assessments delivered | $ | Monthly |
| Referral Rate | Growth | Marketing | New clients from referrals / Total new clients | % | Quarterly |
| Framework Validity Score | Product | Quality | Cronbach's alpha or test-retest reliability | # | Annually |
