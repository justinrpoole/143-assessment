import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadCanonicalContent } from "../scoring/content-loader.mjs";

/*
Micro-Wins Source Contract:
1) Use ray_pairs.json micro_wins for the resolved ray pair.
2) If pair micro_wins is empty, use rays.json micro_wins for top rays.
3) If both are empty, use a static fallback.
Never use questions.json prompts for Micro-Wins.
*/

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultContentRoot = path.resolve(moduleDir, "../../content");

// 36 Light Signature Archetypes — pair_id → archetype name
// Sorted pairs use numeric ray order (e.g. R1-R2, not R2-R1)
const ARCHETYPE_MAP = new Map([
  ["R1-R2", "Strategic Optimist"],
  ["R1-R3", "Mindful Architect"],
  ["R1-R4", "Decisive Director"],
  ["R1-R5", "Mission Commander"],
  ["R1-R6", "True North Leader"],
  ["R1-R7", "Relational Strategist"],
  ["R1-R8", "Visionary Planner"],
  ["R1-R9", "Servant Architect"],
  ["R2-R3", "Present Celebrator"],
  ["R2-R4", "Confident Enthusiast"],
  ["R2-R5", "Joyful Missionary"],
  ["R2-R6", "Radiant Authentic"],
  ["R2-R7", "Relational Spark"],
  ["R2-R8", "Optimistic Explorer"],
  ["R2-R9", "Light Bringer"],
  ["R3-R4", "Grounded Commander"],
  ["R3-R5", "Mindful Mission"],
  ["R3-R6", "Present Truth"],
  ["R3-R7", "Deep Listener"],
  ["R3-R8", "Present Visionary"],
  ["R3-R9", "Calm Center"],
  ["R4-R5", "Driven Leader"],
  ["R4-R6", "Bold Authentic"],
  ["R4-R7", "Charismatic Connector"],
  ["R4-R8", "Risk-Taking Pioneer"],
  ["R4-R9", "Empowering Force"],
  ["R5-R6", "True Missionary"],
  ["R5-R7", "Community Builder"],
  ["R5-R8", "Visionary Missionary"],
  ["R5-R9", "Servant Leader"],
  ["R6-R7", "Trusted Confidant"],
  ["R6-R8", "Authentic Innovator"],
  ["R6-R9", "Truth Beacon"],
  ["R7-R8", "Network Cultivator"],
  ["R7-R9", "Relational Light"],
  ["R8-R9", "Visionary Servant"],
]);

function reportTemplatePathFor(contentRoot) {
  return path.join(contentRoot, "results_overview.json");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function interpolateTemplate(text, variables) {
  return String(text).replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (full, key) => {
    if (!(key in variables)) {
      return full;
    }
    return String(variables[key]);
  });
}

function normalizeStringList(input) {
  if (!Array.isArray(input)) {
    return [];
  }
  return input
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
}

function resolveMicroWins({ pair, raysById, topRays }) {
  const fromPair = normalizeStringList(pair?.micro_wins);
  if (fromPair.length > 0) {
    return fromPair;
  }

  const fromRays = topRays
    .flatMap((rayId) => normalizeStringList(raysById.get(rayId)?.micro_wins))
    .filter(Boolean);
  if (fromRays.length > 0) {
    return fromRays;
  }

  return ["Run one repeatable rep today."];
}

function resolveCoachingQuestions({ pair, raysById, topRays }) {
  const fromPair = normalizeStringList(pair?.coaching_questions);
  if (fromPair.length > 0) {
    return fromPair;
  }

  const fromRays = topRays
    .flatMap((rayId) => normalizeStringList(raysById.get(rayId)?.coaching_questions))
    .filter(Boolean);
  if (fromRays.length > 0) {
    return fromRays;
  }

  return [
    "What is the smallest rep that would make tomorrow easier?",
    "Where did I choose (or avoid) the honest boundary today?",
    "What did I reinforce that I want repeated: behavior, not vibe?",
  ];
}

function getTemplateMap(contentRoot) {
  const reportTemplate = JSON.parse(
    fs.readFileSync(reportTemplatePathFor(contentRoot), "utf8"),
  );

  const templates = new Map();
  for (const entry of reportTemplate.templates || []) {
    if (entry?.id && entry?.text) {
      templates.set(entry.id, entry.text);
    }
  }

  return templates;
}

function resolveBottomRay(rayScoresById, raysById) {
  const sorted = Object.entries(rayScoresById || {})
    .map(([id, score]) => [id, Number(score)])
    .filter(([, score]) => Number.isFinite(score))
    .sort((a, b) => a[1] - b[1]);

  const bottomRayId = sorted[0]?.[0];
  if (!bottomRayId) return null;
  const ray = raysById.get(bottomRayId);
  return ray ? { id: bottomRayId, name: ray.name } : { id: bottomRayId, name: bottomRayId };
}

export function renderReportHtml({
  resultsPayload,
  firstName = "Leader",
  contentRoot = defaultContentRoot,
}) {
  const { rays, rayPairs } = loadCanonicalContent(contentRoot);
  const templates = getTemplateMap(contentRoot);
  const raysById = new Map((rays || []).map((ray) => [ray.ray_id, ray]));

  const topRays = Array.isArray(resultsPayload?.top_rays)
    ? resultsPayload.top_rays.map((rayId) => String(rayId))
    : [];
  if (topRays.length < 2) {
    throw new Error("Report rendering requires top_rays with at least two items.");
  }

  const topRay1 = topRays[0];
  const topRay2 = topRays[1];
  const rayPairId = String(
    resultsPayload?.ray_pair_id ?? resultsPayload?.ray_pair ?? "",
  );
  if (!rayPairId) {
    throw new Error("Report rendering requires ray_pair_id.");
  }

  const pair = rayPairs.find((entry) => entry.pair_id === rayPairId);
  if (!pair) {
    throw new Error(`No ray pair content found for ${rayPairId}.`);
  }

  const confidenceBand = String(resultsPayload?.confidence_band ?? "STANDARD");
  const microWins = resolveMicroWins({ pair, raysById, topRays: [topRay1, topRay2] });
  const coachingQuestions = resolveCoachingQuestions({ pair, raysById, topRays: [topRay1, topRay2] });

  const ray1Name = raysById.get(topRay1)?.name ?? topRay1;
  const ray2Name = raysById.get(topRay2)?.name ?? topRay2;
  const pipelineOut = resultsPayload?.pipeline_output;
  const archetypeName = pipelineOut?.light_signature?.archetype?.name
    ?? ARCHETYPE_MAP.get(rayPairId)
    ?? "Light Leader";
  const pipelineBottomRayId = pipelineOut?.light_signature?.just_in_ray?.ray_id;
  const bottomRay = pipelineBottomRayId
    ? { id: pipelineBottomRayId, name: raysById.get(pipelineBottomRayId)?.name ?? pipelineBottomRayId }
    : resolveBottomRay(resultsPayload?.ray_scores_by_id ?? {}, raysById);

  // Ray definitions for Top Two display
  const ray1Def = raysById.get(topRay1)?.definition ?? "";
  const ray2Def = raysById.get(topRay2)?.definition ?? "";

  // Ray score visualization
  const rayScoreEntries = Object.entries(resultsPayload?.ray_scores_by_id ?? {})
    .map(([id, score]) => ({
      id,
      name: raysById.get(id)?.name ?? id,
      score: Number(score),
      isTop: topRays.includes(id),
      isBottom: bottomRay?.id === id,
    }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((a, b) => b.score - a.score);

  const maxScore = rayScoreEntries[0]?.score || 1;
  const rayBarsHtml = rayScoreEntries
    .map((entry) => {
      const pct = Math.round((entry.score / maxScore) * 100);
      const cls = entry.isTop ? "ray-bar-top" : entry.isBottom ? "ray-bar-bottom" : "ray-bar-mid";
      return `<div class="ray-bar-row">
        <div class="ray-bar-label">${escapeHtml(entry.name)}</div>
        <div class="ray-bar-track">
          <div class="ray-bar-fill ${cls}" style="width:${pct}%"></div>
        </div>
      </div>`;
    })
    .join("\n");

  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const templateVars = {
    first_name: firstName,
    ray_pair: rayPairId,
    top_ray_1: topRay1,
    top_ray_2: topRay2,
    ray_1_name: ray1Name,
    ray_2_name: ray2Name,
    confidence_band: confidenceBand,
    next_rep: microWins[0] ?? "Run one repeatable rep today.",
  };

  const identityOpener = interpolateTemplate(
    templates.get("identity_opener") || pair.identity_opener,
    templateVars,
  );

  const microWinsLead = interpolateTemplate(
    templates.get("micro_wins_block") || "Your first rep: {{next_rep}}",
    templateVars,
  );

  const microWinsItems = microWins
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("\n");
  const coachingItems = coachingQuestions
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("\n");

  const bottomRayBlock = bottomRay
    ? `<div class="skill-card">
        <div class="skill-label">Your next skill to train</div>
        <div class="skill-name">${escapeHtml(bottomRay.name)}</div>
        <p class="skill-note">This is your next skill to train. Your Top Two already fuel it. We train it with reps. One small, specific, repeatable action.</p>
      </div>`
    : "";

  const eclipseLevel = pipelineOut?.eclipse?.level;
  const isHighLoad = eclipseLevel
    ? eclipseLevel === "HIGH" || eclipseLevel === "SEVERE"
    : (confidenceBand === "HIGH" || confidenceBand === "HIGH_ECLIPSE");
  const eclipseNote = isHighLoad
    ? `<div class="eclipse-note">
        <div class="eclipse-icon">&#9728;</div>
        <p>Your light is still here. Your system is carrying load right now — borrowing energy to get through. That is what Eclipse means: your range narrows, and when load drops, it opens back up. We stabilize first. Then we build. One tool. One rep.</p>
      </div>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>143 Leadership Report — ${escapeHtml(firstName)}</title>
    <style>
      /* ─── Brand tokens ─── */
      :root {
        --purple: #60058D;
        --purple-deep: #0B0212;
        --purple-mid: #3E1D63;
        --purple-glow: rgba(96, 5, 141, 0.35);
        --gold: #F8D011;
        --gold-dim: rgba(248, 208, 17, 0.15);
        --gold-border: rgba(248, 208, 17, 0.3);
        --black: #020202;
        --white: #FDFCFD;
        --text-primary: #FFFEF5;
        --text-secondary: rgba(255, 254, 245, 0.75);
        --text-muted: rgba(255, 254, 245, 0.45);
        --card-bg: rgba(96, 5, 141, 0.12);
        --card-border: rgba(148, 80, 200, 0.2);
        --radius: 12px;
        --gradient: linear-gradient(135deg, #60058D 0%, #F8D011 100%);
      }

      /* ─── Reset ─── */
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { font-size: 16px; }

      body {
        font-family: "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        background: var(--purple-deep);
        color: var(--text-primary);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
      }

      /* ─── Layout ─── */
      .page-wrap {
        max-width: 740px;
        margin: 0 auto;
        padding: 0 32px 80px;
      }

      /* ─── Cover Page ─── */
      .cover-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 80px 40px;
        background: radial-gradient(ellipse at 50% 30%, rgba(96, 5, 141, 0.4) 0%, var(--purple-deep) 70%);
        position: relative;
        overflow: hidden;
        page-break-after: always;
      }
      .cover-page::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 400px;
        height: 400px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: radial-gradient(circle, rgba(248, 208, 17, 0.08) 0%, transparent 70%);
        pointer-events: none;
      }
      .cover-sun {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: radial-gradient(circle at 40% 40%, #F8D011, #D4A800);
        box-shadow: 0 0 60px rgba(248, 208, 17, 0.3), 0 0 120px rgba(248, 208, 17, 0.1);
        margin-bottom: 40px;
      }
      .cover-brand {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 24px;
      }
      .cover-title {
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 18px;
        font-weight: 400;
        color: var(--text-secondary);
        margin-bottom: 48px;
        letter-spacing: 0.04em;
      }
      .cover-archetype {
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 52px;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1.1;
        margin-bottom: 16px;
      }
      .cover-rays {
        font-size: 15px;
        color: var(--gold);
        letter-spacing: 0.1em;
        font-weight: 500;
        margin-bottom: 48px;
      }
      .cover-name {
        font-size: 14px;
        color: var(--text-muted);
        letter-spacing: 0.06em;
      }
      .cover-date {
        font-size: 12px;
        color: var(--text-muted);
        margin-top: 8px;
      }
      .cover-divider {
        width: 60px;
        height: 1px;
        background: var(--gold-border);
        margin: 32px auto;
      }

      /* ─── Retro Frame Borders ─── */
      .retro-frame {
        border: 1px solid var(--card-border);
        border-radius: var(--radius);
        background: var(--card-bg);
        position: relative;
      }
      .retro-frame::before {
        content: "";
        position: absolute;
        inset: -1px;
        border-radius: var(--radius);
        padding: 1px;
        background: linear-gradient(135deg, rgba(248, 208, 17, 0.2), rgba(96, 5, 141, 0.3), rgba(248, 208, 17, 0.1));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }

      /* ─── Header ─── */
      .report-header {
        background: linear-gradient(180deg, rgba(96, 5, 141, 0.3) 0%, var(--purple-deep) 100%);
        color: var(--text-primary);
        padding: 56px 40px 48px;
        text-align: center;
        margin-bottom: 0;
        border-bottom: 1px solid var(--gold-border);
      }
      .report-header .brand-mark {
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 16px;
      }
      .report-header h1 {
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 36px;
        font-weight: 700;
        line-height: 1.15;
        margin-bottom: 12px;
        color: var(--text-primary);
      }
      .report-header .greeting {
        font-size: 16px;
        color: var(--text-secondary);
        margin-bottom: 0;
        max-width: 540px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.55;
      }

      /* ─── Light Signature hero ─── */
      .light-signature {
        background: var(--black);
        color: var(--white);
        padding: 56px 40px;
        text-align: center;
        border-bottom: 1px solid var(--gold-border);
      }
      .light-signature .section-eyebrow {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 12px;
      }
      .light-signature .archetype-name {
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 44px;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1.1;
        margin-bottom: 16px;
      }
      .light-signature .ray-pair-line {
        font-size: 14px;
        color: var(--gold);
        letter-spacing: 0.08em;
        font-weight: 500;
        margin-bottom: 20px;
      }
      .light-signature .archetype-tagline {
        font-size: 16px;
        color: var(--text-secondary);
        max-width: 520px;
        margin: 0 auto;
        line-height: 1.55;
      }

      /* ─── Sections ─── */
      .section {
        padding: 48px 0 0;
      }
      .section + .section {
        border-top: 1px solid rgba(148, 80, 200, 0.15);
        margin-top: 48px;
      }
      .section-eyebrow {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 8px;
      }
      .section h2 {
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 26px;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1.2;
        margin-bottom: 20px;
      }
      .section p {
        font-size: 15px;
        color: var(--text-secondary);
        line-height: 1.65;
        margin-bottom: 16px;
      }

      /* ─── Identity opener ─── */
      .identity-opener-text {
        font-size: 18px;
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        color: var(--text-primary);
        line-height: 1.6;
        border-left: 3px solid var(--gold);
        padding-left: 20px;
        margin: 0;
      }

      /* ─── Top Two ray cards ─── */
      .top-two-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 16px;
      }
      .ray-card {
        border-radius: var(--radius);
        padding: 24px 24px 20px;
      }
      .ray-card-top {
        background: var(--card-bg);
        border: 1px solid var(--card-border);
      }
      .ray-card-number {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 4px;
      }
      .ray-card-name {
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 20px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 8px;
      }
      .ray-card-def {
        font-size: 14px;
        color: var(--text-secondary);
        line-height: 1.5;
        margin: 0;
      }

      /* ─── Ray score bars ─── */
      .ray-bars {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 16px;
      }
      .ray-bar-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ray-bar-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-secondary);
        width: 100px;
        flex-shrink: 0;
        text-align: right;
      }
      .ray-bar-track {
        flex: 1;
        background: rgba(148, 80, 200, 0.15);
        border-radius: 6px;
        height: 14px;
        overflow: hidden;
      }
      .ray-bar-fill {
        height: 100%;
        border-radius: 6px;
      }
      .ray-bar-top {
        background: linear-gradient(90deg, var(--purple), #9450C8);
      }
      .ray-bar-mid {
        background: rgba(148, 80, 200, 0.5);
      }
      .ray-bar-bottom {
        background: var(--gold);
      }

      /* ─── Skill card (bottom ray) ─── */
      .skill-card {
        background: var(--card-bg);
        border: 1px solid var(--gold-border);
        border-radius: var(--radius);
        padding: 24px 28px;
        margin-top: 8px;
      }
      .skill-label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 6px;
      }
      .skill-name {
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 22px;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 10px;
      }
      .skill-note {
        font-size: 14px;
        color: var(--text-secondary);
        line-height: 1.55;
        margin: 0;
      }

      /* ─── Eclipse note ─── */
      .eclipse-note {
        background: rgba(248, 208, 17, 0.06);
        border: 1px solid var(--gold-border);
        color: var(--text-primary);
        border-radius: var(--radius);
        padding: 24px 28px;
        margin-bottom: 32px;
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }
      .eclipse-icon {
        font-size: 24px;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .eclipse-note p {
        font-size: 15px;
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
      }

      /* ─── Lists ─── */
      .rep-list, .coaching-list {
        padding-left: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 4px;
      }
      .rep-list li {
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--radius);
        padding: 14px 18px;
        font-size: 15px;
        color: var(--text-secondary);
        line-height: 1.5;
        position: relative;
        padding-left: 38px;
      }
      .rep-list li::before {
        content: "☀";
        position: absolute;
        left: 14px;
        top: 14px;
        color: var(--gold);
        font-size: 14px;
      }
      .coaching-list li {
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--radius);
        padding: 16px 20px;
        font-size: 15px;
        color: var(--text-secondary);
        line-height: 1.55;
        counter-increment: coaching;
        position: relative;
        padding-left: 52px;
      }
      .coaching-list {
        counter-reset: coaching;
      }
      .coaching-list li::before {
        content: counter(coaching);
        position: absolute;
        left: 16px;
        top: 14px;
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 18px;
        font-weight: 700;
        color: var(--gold);
      }

      /* ─── Path list ─── */
      .path-list {
        padding-left: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 4px;
        counter-reset: path;
      }
      .path-list li {
        font-size: 15px;
        color: var(--text-secondary);
        line-height: 1.55;
        counter-increment: path;
        position: relative;
        padding-left: 36px;
      }
      .path-list li::before {
        content: counter(path) ".";
        position: absolute;
        left: 0;
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 16px;
        font-weight: 700;
        color: var(--gold);
      }

      /* ─── Rise declaration ─── */
      .rise-block {
        background: var(--gradient);
        border-radius: var(--radius);
        padding: 36px 32px;
        text-align: center;
        margin-top: 16px;
      }
      .rise-block .rise-label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(2,2,2,0.6);
        margin-bottom: 10px;
      }
      .rise-block .rise-declaration {
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 22px;
        font-weight: 700;
        color: var(--black);
        line-height: 1.3;
      }

      /* ─── REPs science block ─── */
      .science-block {
        background: var(--card-bg);
        border-left: 3px solid var(--gold);
        border-radius: 0 var(--radius) var(--radius) 0;
        padding: 20px 24px;
        margin-top: 16px;
      }
      .science-block p {
        font-size: 14px;
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
      }
      .science-block strong {
        color: var(--gold);
      }

      /* ─── Back Page — Founder Note ─── */
      .back-page {
        page-break-before: always;
        min-height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 80px 48px;
        background: radial-gradient(ellipse at 50% 60%, rgba(96, 5, 141, 0.25) 0%, var(--purple-deep) 70%);
      }
      .back-page .founder-note {
        max-width: 480px;
        font-size: 15px;
        color: var(--text-secondary);
        line-height: 1.7;
        font-style: italic;
        margin-bottom: 32px;
      }
      .back-page .founder-name {
        font-size: 13px;
        color: var(--gold);
        font-weight: 600;
        letter-spacing: 0.08em;
        margin-bottom: 4px;
      }
      .back-page .founder-title {
        font-size: 11px;
        color: var(--text-muted);
        letter-spacing: 0.06em;
      }
      .back-page .back-brand {
        margin-top: 48px;
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 13px;
        color: var(--text-muted);
        letter-spacing: 0.12em;
      }

      /* ─── Disclaimer ─── */
      .disclaimer {
        border-top: 1px solid rgba(148, 80, 200, 0.15);
        margin-top: 64px;
        padding-top: 24px;
      }
      .disclaimer p {
        font-size: 11px;
        color: var(--text-muted);
        line-height: 1.6;
        margin: 0;
      }

      /* ─── Footer ─── */
      .report-footer {
        margin-top: 48px;
        text-align: center;
        padding-bottom: 0;
      }
      .report-footer .footer-mark {
        font-family: "Iowan Old Style", Palatino, Georgia, serif;
        font-size: 13px;
        color: var(--text-muted);
        letter-spacing: 0.1em;
      }
      .report-footer .footer-date {
        font-size: 11px;
        color: var(--text-muted);
        margin-top: 6px;
      }

      /* ─── Print ─── */
      @media print {
        body { background: var(--purple-deep); }
        .page-wrap { padding: 0 24px 40px; }
        .cover-page, .report-header, .light-signature, .rise-block, .back-page {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .rep-list li::before { color: #c8a000; }
        .ray-bar-fill, .cover-sun, .eclipse-note {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }

      @media (max-width: 600px) {
        .top-two-grid { grid-template-columns: 1fr; }
        .ray-bar-label { width: 80px; font-size: 12px; }
      }
    </style>
  </head>
  <body>

    <!-- Cover Page -->
    <div class="cover-page">
      <div class="cover-sun"></div>
      <div class="cover-brand">143 Leadership OS</div>
      <div class="cover-title">Gravitational Stability Report</div>
      <div class="cover-archetype">${escapeHtml(archetypeName)}</div>
      <div class="cover-rays">${escapeHtml(ray1Name)} &middot; ${escapeHtml(ray2Name)}</div>
      <div class="cover-divider"></div>
      <div class="cover-name">Prepared for ${escapeHtml(firstName)}</div>
      <div class="cover-date">${escapeHtml(generatedDate)}</div>
    </div>

    <!-- Header -->
    <header class="report-header">
      <div class="brand-mark">143 Leadership OS</div>
      <h1>Gravitational Stability Report</h1>
      <p class="greeting">${escapeHtml(firstName)}, this is your behavioral capacity snapshot. A map of who you already are — and the one rep that extends your range.</p>
    </header>

    <!-- Light Signature -->
    <div class="light-signature" data-section="overview">
      <div class="section-eyebrow">Your Light Signature</div>
      <div class="archetype-name">${escapeHtml(archetypeName)}</div>
      <div class="ray-pair-line">${escapeHtml(ray1Name)} &middot; ${escapeHtml(ray2Name)}</div>
      <p class="archetype-tagline">This is your capacity pattern — your two strongest rays working together. Under pressure, this pattern can compress. That is normal. That is physiology. And that is what makes it trainable.</p>
    </div>

    <div class="page-wrap">

      ${eclipseNote}

      <!-- Identity Opener -->
      <section class="section" data-section="identity-opener">
        <div class="section-eyebrow">Who You Are When Your System Is Online</div>
        <h2>Your Regulated Range</h2>
        <p class="identity-opener-text">${escapeHtml(identityOpener)}</p>
      </section>

      <!-- Top Two Power Sources -->
      <section class="section" data-section="top-two">
        <div class="section-eyebrow">Your Power Sources</div>
        <h2>Power Sources</h2>
        <p>These are the capacities your system runs strongest. They are not gifts you were lucky to get. They are behaviors you have practiced — and they power everything else in this report.</p>
        <div class="top-two-grid">
          <div class="ray-card ray-card-top">
            <div class="ray-card-number">${escapeHtml(topRay1)}</div>
            <div class="ray-card-name">${escapeHtml(ray1Name)}</div>
            <p class="ray-card-def">${escapeHtml(ray1Def)}</p>
          </div>
          <div class="ray-card ray-card-top">
            <div class="ray-card-number">${escapeHtml(topRay2)}</div>
            <div class="ray-card-name">${escapeHtml(ray2Name)}</div>
            <p class="ray-card-def">${escapeHtml(ray2Def)}</p>
          </div>
        </div>
      </section>

      <!-- Capacity Map -->
      <section class="section" data-section="capacity-map">
        <div class="section-eyebrow">Your Full Capacity Map</div>
        <h2>All Nine Rays</h2>
        <p>Sorted by current access. Your top rays are highlighted in purple. Your training focus is marked in gold.</p>
        <div class="ray-bars">
${rayBarsHtml}
        </div>
      </section>

      <!-- Next Skill -->
      ${bottomRay ? `<section class="section" data-section="bottom-ray">
        <div class="section-eyebrow">Where Your Range Expands Next</div>
        <h2>Your Training Focus</h2>
        <p>Your Top Two are online. The capacity below is where one small rep will extend your range the most. A skill to train — powered by what you already do well.</p>
        ${bottomRayBlock}
      </section>` : ""}

      <!-- Micro-Wins -->
      <section class="section" data-section="micro-wins">
        <div class="section-eyebrow">Repeatable Reps</div>
        <h2>Next Reps</h2>
        <p>${escapeHtml(microWinsLead)}</p>
        <p>These are reps — the smallest unit of behavior change. Do one today. Then log it as a receipt.</p>
        <ul class="rep-list">
${microWinsItems}
        </ul>
      </section>

      <!-- Shooting Star Cues -->
      <section class="section" data-section="coaching-questions">
        <div class="section-eyebrow">Shooting Star Cues</div>
        <h2>Shooting Star Cues</h2>
        <p>Run these at the end of your day. As a rep. What you notice is the data. Receipts, then reflection.</p>
        <ol class="coaching-list">
${coachingItems}
        </ol>
      </section>

      <!-- REPs -->
      <section class="section" data-section="reps">
        <div class="section-eyebrow">The REPs System</div>
        <h2>Recognition + Encouragement → Performance Sustained</h2>
        <p>A REP is not about how well you did it. It is about the fact that you did it. Name the rep. Encourage the rep. That is how performance becomes sustainable. Log the behavior, not the outcome.</p>
        <div class="science-block" data-section="ras">
          <p>Every rep you log retrains your <strong>Reticular Activating System</strong> — the filter that decides what your brain notices. When you log a rep, your brain starts scanning for the behavior you are training, not just the threats it is tracking. One rep. One receipt. That is enough today.</p>
        </div>
      </section>

      <!-- I Rise Declaration -->
      <section class="section" data-section="i-rise">
        <div class="section-eyebrow">Your Pattern Interrupt</div>
        <h2>I Rise</h2>
        <p>When the spiral starts — when Eclipse covers your range — this is your pattern interrupt. Name it. Say it out loud. Move. The behavior changes the feeling.</p>
        <div class="rise-block">
          <div class="rise-label">Say this when you need it</div>
          <div class="rise-declaration">I rise like the sun — consistent, warm, and radiant.</div>
        </div>
      </section>

      <!-- Path Forward -->
      <section class="section" data-section="path-forward">
        <div class="section-eyebrow">What Happens Next</div>
        <h2>Your Path Forward</h2>
        <p>This report is a starting point. A map for who you are becoming. Your rays are trainable capacities. Your Eclipse is a temporary range-narrowing state. Everything here can be practiced, strengthened, and expanded.</p>
        <p>Here is the protocol:</p>
        <ol class="path-list">
          <li>Choose one rep from this report.</li>
          <li>Do it today. Not perfectly. Just do it.</li>
          <li>Log it as a receipt — what you did, not how you felt.</li>
          <li>Reflect for two minutes. What happened? What will you try next?</li>
          <li>Repeat tomorrow.</li>
        </ol>
        <p>That is the system. That is how you upgrade your operating system.</p>
      </section>

      <!-- Disclaimer -->
      <div class="disclaimer">
        <p>This report reflects a behavioral capacity snapshot taken at the time of your assessment. It is for development and coaching, and it is not intended for hiring or personnel decisions. Rays are trainable capacities. Eclipse is a temporary range-narrowing state tied to energy borrowing. Your light is always present; under load it can be temporarily covered. That coverage is reversible with practice. Everything in this report is trainable.</p>
      </div>

      <!-- Footer -->
      <footer class="report-footer">
        <div class="footer-mark">143 Leadership OS &mdash; Be The Light</div>
        <div class="footer-date">Generated ${escapeHtml(generatedDate)}</div>
      </footer>

    </div>

    <!-- Back Page — Founder Note -->
    <div class="back-page">
      <div class="founder-note">
        &ldquo;143 means I love you. This assessment exists because I believe every leader carries light — and sometimes that light gets covered by load, by fear, by the weight of showing up for everyone else. Your report is proof that your light is still here. It just needed to be mapped. Now train it.&rdquo;
      </div>
      <div class="founder-name">Justin Ray</div>
      <div class="founder-title">Founder, 143 Leadership</div>
      <div class="cover-divider"></div>
      <div class="back-brand">143 Leadership OS &mdash; Be The Light</div>
    </div>

  </body>
</html>
`;
}
