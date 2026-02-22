// 07A: Reflection Scoring (text → 0-3 rubric)
// V1 uses a deterministic word-count + keyword proxy for the rubric.
// Full semantic rubric scoring is deferred to V2.

import type { ReflectionPrompt } from '../types';

/**
 * Score a reflection response on the 0-3 rubric.
 *
 * V1 heuristic (proxy until human/AI rubric is available):
 * - 0: Empty, very short (< 15 words), or purely performative
 * - 1: Some content (15-39 words), mostly general/vague
 * - 2: Specific moment described (40-79 words) with some learning indicators
 * - 3: Detailed response (80+ words) with body/state cues, tools, and a rep plan
 *
 * Keyword boosters: words indicating specificity, ownership, body awareness,
 * tool usage, and future reps increase the score.
 */
export function scoreReflection(
  _prompt: ReflectionPrompt,
  text: string | null | undefined,
): number | null {
  if (!text || typeof text !== 'string') return null;

  const trimmed = text.trim();
  if (trimmed.length === 0) return null;

  const words = trimmed.split(/\s+/);
  const wordCount = words.length;
  const lower = trimmed.toLowerCase();

  // Very short or obviously performative
  if (wordCount < 15) return 0;

  // Count keyword indicators across rubric dimensions
  let indicators = 0;

  // Specificity markers (named a real situation)
  const specificityWords = ['meeting', 'conversation', 'moment', 'yesterday', 'last week',
    'morning', 'when i', 'i noticed', 'i felt', 'i realized', 'specific', 'example',
    'happened', 'situation', 'colleague', 'partner', 'boss', 'team', 'client'];
  for (const w of specificityWords) {
    if (lower.includes(w)) { indicators++; break; }
  }

  // Ownership / agency markers
  const ownershipWords = ['i chose', 'i decided', 'my choice', 'i could have',
    'next time', 'i will', 'i want to', 'instead of', 'i took', 'i paused',
    'my responsibility', 'i own'];
  for (const w of ownershipWords) {
    if (lower.includes(w)) { indicators++; break; }
  }

  // Body / state awareness
  const bodyWords = ['body', 'tension', 'breath', 'stomach', 'chest', 'heart rate',
    'jaw', 'shoulders', 'racing', 'calm', 'grounded', 'activated', 'numb',
    'anxious', 'overwhelmed', 'tight'];
  for (const w of bodyWords) {
    if (lower.includes(w)) { indicators++; break; }
  }

  // Tool / practice reference
  const toolWords = ['watch me', 'i rise', 'go first', 'reps', '143', '90-second',
    'ras reset', 'presence pause', 'boundary', 'if/then', 'question loop',
    'witness', 'practice', 'tool', 'micro-rep', 'cue'];
  for (const w of toolWords) {
    if (lower.includes(w)) { indicators++; break; }
  }

  // Future rep / plan
  const repWords = ['next 7 days', 'this week', 'my plan', 'i commit', 'one rep',
    'going to', 'will try', 'start with', 'small step', 'daily', 'each day',
    'every morning', 'before i'];
  for (const w of repWords) {
    if (lower.includes(w)) { indicators++; break; }
  }

  // Score based on word count + indicators
  if (wordCount >= 80 && indicators >= 3) return 3;
  if (wordCount >= 40 && indicators >= 2) return 2;
  if (wordCount >= 15 && indicators >= 1) return 1;
  if (wordCount >= 40) return 1; // Long but vague
  return 0;
}

/**
 * Compute reflection indices across all prompts.
 * Returns average depth, scaled score, and per-prompt breakdown.
 */
export interface ReflectionIndices {
  reflectionDepthAvg03: number | null;   // mean of 0-3 scores
  reflectionScaled04: number | null;     // avg * (4/3) to put on 0-4 scale
  reflectionAnsweredCount: number;
  reflectionScoresByPrompt: Record<string, number | null>;
}

export function computeReflectionIndices(
  prompts: ReflectionPrompt[],
  reflectionResponses: Record<string, string> | undefined,
): ReflectionIndices {
  const scores: number[] = [];
  const perPrompt: Record<string, number | null> = {};

  for (const prompt of prompts) {
    const text = reflectionResponses?.[prompt.Prompt_ID];
    const score = scoreReflection(prompt, text);
    perPrompt[prompt.Prompt_ID] = score;
    if (score !== null) scores.push(score);
  }

  const avg = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : null;

  return {
    reflectionDepthAvg03: avg,
    reflectionScaled04: avg !== null ? avg * (4 / 3) : null,
    reflectionAnsweredCount: scores.length,
    reflectionScoresByPrompt: perPrompt,
  };
}
