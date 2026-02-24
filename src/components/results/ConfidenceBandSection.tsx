'use client';

import type { DataQualityOutput } from '@/lib/types';

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

const BAND_CONFIG = {
  HIGH: {
    color: '#34D399',
    label: 'High Confidence',
    description: 'Strong data quality. Trust the patterns — they reflect your actual capacities with high precision.',
    pct: 90,
  },
  MODERATE: {
    color: 'var(--brand-gold, #F8D011)',
    label: 'Moderate Confidence',
    description: 'Good data quality with some caveats. Broad patterns are reliable — specific scores may shift slightly on retake.',
    pct: 60,
  },
  LOW: {
    color: '#FB923C',
    label: 'Lower Confidence',
    description: 'Some data quality concerns detected. Use directional patterns rather than exact scores. A retake would sharpen precision.',
    pct: 30,
  },
} as const;

export default function ConfidenceBandSection({ dataQuality }: Props) {
  const band = (dataQuality.confidence_band ?? 'MODERATE').toUpperCase() as keyof typeof BAND_CONFIG;
  const config = BAND_CONFIG[band] ?? BAND_CONFIG.MODERATE;

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>How To Read These Results</h3>

      <div className="glass-card p-6 space-y-4">
        {/* Confidence gauge */}
        <div className="flex items-center gap-4">
          <div className="relative" style={{ width: 56, height: 56 }}>
            <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
              <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(148, 80, 200, 0.15)" strokeWidth="4" />
              <circle
                cx="28" cy="28" r="24" fill="none"
                stroke={config.color}
                strokeWidth="4"
                strokeDasharray={`${config.pct * 1.508} 150.8`}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-xs font-bold"
              style={{ color: config.color }}
            >
              {band[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: config.color }}>{config.label}</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {config.description}
            </p>
          </div>
        </div>

        <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Every assessment carries a confidence level. This tells you how much weight to put on the patterns you see.
        </p>

        {/* Validity flags */}
        {dataQuality.validity_flags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-brand-gold uppercase tracking-wide font-medium">What We Noticed</p>
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
            <p className="text-xs text-brand-gold uppercase tracking-wide font-medium mb-2">
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
