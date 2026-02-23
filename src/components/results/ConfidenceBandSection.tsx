'use client';

import type { DataQualityOutput, ConfidenceBand } from '@/lib/types';

interface Props {
  dataQuality: DataQualityOutput;
}

const FLAG_LABELS: Record<string, string> = {
  IMPRESSION_MANAGEMENT: 'Some responses may reflect how you want to be seen rather than how things are.',
  SOCIAL_DESIRABILITY: 'A pattern of idealized responses was detected.',
  INCONSISTENCY: 'Some answers pointed in different directions — this can reflect genuine context shifts or cognitive load.',
  SPEEDING: 'You moved through the assessment quickly. Some answers may have been reflexive rather than reflective.',
  STRAIGHTLINING: 'A pattern of identical responses was detected. This sometimes happens under fatigue.',
  ATTENTION: 'Some attention-check items were missed.',
  INFREQUENCY: 'Some responses were uncommon, which may reflect unique experience or random responding.',
  LOW_REFLECTION_DEPTH: 'Reflections were brief. Deeper responses would strengthen confidence in these results.',
  MISSINGNESS: 'Some sections were incomplete, limiting the precision of certain scores.',
};

const BAND_DISPLAY: Record<ConfidenceBand, { label: string; color: string; interpretation: string }> = {
  HIGH: {
    label: 'High Confidence',
    color: '#4ade80',
    interpretation: 'Your response patterns are consistent and complete. These results reliably reflect your current operating state. Use them to guide your practice with confidence.',
  },
  MODERATE: {
    label: 'Moderate Confidence',
    color: '#F8D011',
    interpretation: 'Your results capture real patterns, but some signals were mixed. The broad strokes — your top Rays, your Eclipse level, your Rise Path — are trustworthy. Individual subfacet scores may shift with a retake.',
  },
  LOW: {
    label: 'Low Confidence',
    color: '#fb923c',
    interpretation: 'Something in the response pattern limits how much weight to put on specific scores. This does not mean the results are wrong — it means they are directional, not precise. Treat them as a starting conversation, not a final map.',
  },
};

export default function ConfidenceBandSection({ dataQuality }: Props) {
  const band = (dataQuality.confidence_band ?? 'MODERATE') as ConfidenceBand;
  const display = BAND_DISPLAY[band] ?? BAND_DISPLAY.MODERATE;

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>How To Read These Results</h3>

      <div className="glass-card p-6 space-y-4">
        {/* Confidence band indicator */}
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: display.color }}
          />
          <p className="text-sm font-semibold" style={{ color: display.color }}>
            {display.label}
          </p>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          {display.interpretation}
        </p>

        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-dark-muted)' }}>
          Confidence is calculated from response consistency, completion rate, timing patterns, and reflection depth. It is not a judgment — it is a transparency signal so you know how to use what you see.
        </p>

        {/* Validity flags */}
        {dataQuality.validity_flags.length > 0 && (
          <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--surface-border)' }}>
            <p className="text-xs uppercase tracking-wide font-medium" style={{ color: 'var(--brand-gold, #F8D011)' }}>What We Noticed</p>
            {dataQuality.validity_flags.map((flag) => (
              <p key={flag} className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                &#8226; {FLAG_LABELS[flag] || flag}
              </p>
            ))}
          </div>
        )}

        {/* Validation plan */}
        {dataQuality.validation_plan && (
          <div className="border-t pt-4" style={{ borderColor: 'var(--surface-border)' }}>
            <p className="text-xs uppercase tracking-wide font-medium mb-2" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              Recommended Next Step
            </p>
            <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{dataQuality.validation_plan.why}</p>
            <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-on-dark)' }}>
              {dataQuality.validation_plan.recommended_next_step === 'RETAKE' && 'Consider retaking the assessment '}
              {dataQuality.validation_plan.recommended_next_step === 'MINI_INTERVIEW' && 'A brief follow-up conversation '}
              {dataQuality.validation_plan.recommended_next_step === 'COACH_DEBRIEF' && 'A 45-minute coach debrief '}
              {dataQuality.validation_plan.timing && `— ${dataQuality.validation_plan.timing}`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
