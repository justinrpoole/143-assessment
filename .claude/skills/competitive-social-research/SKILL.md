---
name: competitive-social-research
description: Competitor social content research for 413 Leadership. Use when asked to analyze competitor posts or social channels (Facebook, Instagram, LinkedIn, YouTube, TikTok, X), extract topics, hooks, offers, CTAs, tools, and research references, or build a prompt/tool library and Justin Ray coaching/teaching compositor. Uses Firecrawl or Playwright, maps findings to 06_Research_Library/Research_By_Person, and saves outputs under 06_Research_Library/Research_Dossiers/Competitor_Social.
---

# Competitive Social Research

## Overview
- Pull competitor social content with Firecrawl and or Playwright.
- Analyze for main topics, content pillars, hooks, offers, CTAs, tools, and research references.
- Map findings to the research library and produce a Justin Ray tone coaching and teaching compositor.
- Save outputs into the Competitor Social repository for reuse.

## Operating Rules
- Read ./_system/brand-memory.md for tool detection and RESEARCH MODE signal.
- Follow ./_system/output-format.md when the caller expects formatted skill output.
- Use ./brand/profiles/justin-ray/voice-profile.md when writing coaching or teaching copy.

## Inputs To Confirm
- Competitor list and social URLs or handles.
- Platforms to cover and timeframe.
- Geographic focus if any.
- Depth: quick scan or full teardown.

## Workflow
1) Detect tools and declare research mode.
- Prefer MCP Firecrawl or Playwright.
- If no MCP, use FIRECRAWL_API_KEY in .env.
- If no tools, ask before proceeding with estimated analysis per brand-memory.

2) Collect sources.
- Gather official pages plus high-signal posts, top pinned content, and recent 30-90 days.
- Include cross-posted blog, podcast, or YouTube if it drives social traffic.
- Log all source URLs for citation.

3) Scrape content.
- Use scripts/firecrawl_social.py for batch scraping.
- For pages blocked to Firecrawl, use Playwright screenshots and manual notes.

4) Extract and analyze.
- Summarize main topics and content pillars.
- Capture hooks, offers, CTAs, objection handling, proof types, and emotional frames.
- Identify tools or stack mentions (email platform, CRM, scheduling, community tools).
- Map topics to 2-5 relevant researchers in 06_Research_Library/Research_By_Person using rg for keyword matches.

5) Build prompt and tool library.
- Create prompts that reproduce each competitor pattern.
- List tools and platforms implied by the content.

6) Write coaching and teaching compositor in Justin Ray tone.
- Use references/teaching-compositor-template.md.
- Include 10 Steps Ahead and What Most People Get Wrong.

7) Save outputs.
- Use references/output-template.md for the main report.
- Store files in ./06_Research_Library/Research_Dossiers/Competitor_Social/{competitor_slug}/ with the date.
- Append prompts and tools to prompts.md and tools.md in that folder.
- Update index.md and 10-steps-ahead.md in the repository root.

## Output Locations
- ./06_Research_Library/Research_Dossiers/Competitor_Social/index.md
- ./06_Research_Library/Research_Dossiers/Competitor_Social/10-steps-ahead.md
- ./06_Research_Library/Research_Dossiers/Competitor_Social/{competitor_slug}/YYYY-MM-DD_social_research.md
- ./06_Research_Library/Research_Dossiers/Competitor_Social/{competitor_slug}/YYYY-MM-DD_teaching_compositor.md
- ./06_Research_Library/Research_Dossiers/Competitor_Social/{competitor_slug}/prompts.md
- ./06_Research_Library/Research_Dossiers/Competitor_Social/{competitor_slug}/tools.md
- ./06_Research_Library/Research_Dossiers/Competitor_Social/{competitor_slug}/raw/

## Scripts
- scripts/firecrawl_social.py: Batch scrape URLs with Firecrawl v2 Scrape and save raw JSON.

## References
- references/output-template.md
- references/teaching-compositor-template.md
