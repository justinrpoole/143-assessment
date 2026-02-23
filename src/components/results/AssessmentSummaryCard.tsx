'use client';

import type { AssessmentOutputV1, ProfileFlag } from '@/lib/types';

interface Props {
  output: AssessmentOutputV1;
}

const PROFILE_FLAG_CONFIG: Record<ProfileFlag, { label: string; color: string; note: string }> = {
  STANDARD: {
    label: 'Standard',
    color: '#34D399',
    note: 'Clear differentiation across rays. Full coaching recommendations available.',
  },
  UNDIFFERENTIATED: {
    label: 'Undifferentiated',
    color: '#FB923C',
    note: 'Scores cluster tightly. Bottom ray selection has lower confidence. Consider retaking with a specific context in mind.',
  },
  PARTIAL: {
    label: 'Partial',
    color: '#F8D011',
    note: 'Some rays have incomplete data. Report accuracy improves with a full completion.',
  },
};

/**
 * Summary card showing assessment metadata:
 * tier, context, date, profile flag, confidence band, validity flag count.
 */
export default function AssessmentSummaryCard({ output }: Props) {
  const run = output.assessment_run;
  const dq = output.data_quality;
  const profileFlag = output.profile_flag ?? 'STANDARD';
  const pfConfig = PROFILE_FLAG_CONFIG[profileFlag];

  const tierLabel = run.tier === 'FULL_143' ? 'Full 143' : 'Quick 43';
  const contextLabel = run.context_mix === 'WORK' ? 'Work Context'
    : run.context_mix === 'LIFE' ? 'Life Context'
    : run.context_mix === 'GENERAL' ? 'General'
    : 'Mixed Context';

  const dateStr = run.created_at
    ? new Date(run.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Unknown date';

  const flagCount = dq.validity_flags?.length ?? 0;

  return (
    <section className="glass-card p-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Tier */}
        <StatCell
          label="Assessment"
          value={tierLabel}
          sublabel={contextLabel}
        />

        {/* Date */}
        <StatCell
          label="Completed"
          value={dateStr}
        />

        {/* Confidence */}
        <StatCell
          label="Confidence"
          value={dq.confidence_band}
          valueColor={
            dq.confidence_band === 'HIGH' ? '#34D399'
            : dq.confidence_band === 'LOW' ? '#FB923C'
            : 'var(--brand-gold)'
          }
          sublabel={flagCount > 0 ? `${flagCount} validity flag${flagCount > 1 ? 's' : ''}` : 'No flags'}
        />

        {/* Profile */}
        <StatCell
          label="Assessment Profile"
          value={pfConfig.label}
          valueColor={pfConfig.color}
          sublabel={pfConfig.note}
        />
      </div>
    </section>
  );
}

function StatCell({ label, value, sublabel, valueColor }: {
  label: string;
  value: string;
  sublabel?: string;
  valueColor?: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--brand-gold)' }}>
        {label}
      </p>
      <p className="text-sm font-semibold" style={{ color: valueColor ?? 'var(--text-on-dark)' }}>
        {value}
      </p>
      {sublabel && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}
