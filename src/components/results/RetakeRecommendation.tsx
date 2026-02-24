'use client';

import Link from 'next/link';
import type { ConfidenceBand, DataQualityOutput, EdgeCaseResult } from '@/lib/types';

interface Props {
  confidenceBand: ConfidenceBand;
  dataQuality?: DataQualityOutput | null;
  edgeCases?: EdgeCaseResult[];
  runNumber?: number | null;
}

const RETAKE_TRIGGERS: Record<string, string> = {
  SPEEDING: 'Take more time with each question. Read the full stem before answering.',
  STRAIGHTLINING: 'Vary your responses. If you notice yourself selecting the same option repeatedly, pause and re-read.',
  ATTENTION: 'Answer each item individually — even the ones that seem repetitive. They measure different things.',
  MISSINGNESS: 'Complete every section. Skipped items widen the confidence interval on specific rays.',
  LOW_REFLECTION_DEPTH: 'Write at least 2-3 sentences per reflection. The scoring engine uses these to calibrate your results.',
  HIGH_LOAD_INTERFERENCE: 'Wait until you have had at least one day without acute pressure, then retake.',
  PERFECT_SELF_REPORT: 'Answer from your actual last week — not your best week. Think of a specific situation for each item.',
};

/**
 * Retake Recommendation — shown when confidence_band = LOW or
 * when specific edge cases suggest a retake would improve accuracy.
 * Provides specific guidance on what to do differently.
 */
export default function RetakeRecommendation({ confidenceBand, dataQuality, edgeCases, runNumber }: Props) {
  const detectedEdgeCases = (edgeCases ?? []).filter((ec) => ec.detected);
  const retakeEdgeCases = detectedEdgeCases.filter((ec) =>
    ec.code === 'PERFECT_SELF_REPORT' || ec.code === 'HIGH_LOAD_INTERFERENCE'
  );

  // Only show if LOW confidence or actionable edge cases detected
  const showRetake = confidenceBand === 'LOW' || retakeEdgeCases.length > 0;
  if (!showRetake) return null;

  // Collect specific guidance based on triggered flags
  const guidance: string[] = [];
  const flagStrings = new Set(dataQuality?.validity_flags?.map(String) ?? []);
  for (const [flag, tip] of Object.entries(RETAKE_TRIGGERS)) {
    if (flagStrings.has(flag) || retakeEdgeCases.some((ec) => ec.code === flag)) {
      guidance.push(tip);
    }
  }

  const isRetake = (runNumber ?? 1) > 1;

  return (
    <div
      className="glass-card p-6 space-y-4"
      style={{ borderColor: 'rgba(251, 146, 60, 0.3)' }}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgb(251, 146, 60)' }}>
          {isRetake ? 'Retake Recommended' : 'Consider Retaking'}
        </p>
        <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          Your results have a wider confidence interval than ideal.
        </p>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          This does not mean your results are wrong — it means the scoring engine cannot be as precise as it
          would like. A retake with the adjustments below would sharpen the picture significantly.
        </p>
      </div>

      {guidance.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
            What to do differently
          </p>
          {guidance.map((tip, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: 'var(--brand-gold)' }}>{i + 1}.</span>
              <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{tip}</p>
            </div>
          ))}
        </div>
      )}

      {dataQuality?.validation_plan && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(251, 146, 60, 0.06)', border: '1px solid rgba(251, 146, 60, 0.12)' }}>
          <p className="text-xs font-medium" style={{ color: 'rgb(251, 146, 60)' }}>
            {dataQuality.validation_plan.recommended_next_step === 'RETAKE' && 'Recommended: Retake assessment'}
            {dataQuality.validation_plan.recommended_next_step === 'MINI_INTERVIEW' && 'Recommended: Brief follow-up conversation'}
            {dataQuality.validation_plan.recommended_next_step === 'COACH_DEBRIEF' && 'Recommended: 45-minute coach debrief'}
          </p>
          {dataQuality.validation_plan.timing && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>
              {dataQuality.validation_plan.timing}
            </p>
          )}
        </div>
      )}

      <Link
        href="/assessment/setup"
        className="btn-primary inline-block text-sm px-6 py-2.5"
      >
        {isRetake ? 'Start retake' : 'Retake assessment'} (~8 min)
      </Link>
    </div>
  );
}
