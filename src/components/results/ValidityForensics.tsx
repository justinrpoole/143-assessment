'use client';

import { useState } from 'react';
import type { DataQualityOutput, ValidityFlagEnum } from '@/lib/types';

interface Props {
  dataQuality: DataQualityOutput;
}

interface ValidityCheck {
  id: ValidityFlagEnum;
  label: string;
  description: string;
  status: 'pass' | 'watch' | 'flag';
  detail: string;
  /** Explains what part of results this flag affects when triggered */
  impact: string;
}

/**
 * Deep validity forensics view showing all data quality checks
 * with visual indicators and detailed explanations.
 */
export default function ValidityForensics({ dataQuality }: Props) {
  const [expanded, setExpanded] = useState(false);
  const flags = new Set(dataQuality.validity_flags ?? []);
  const flagCount = flags.size;

  const checks: ValidityCheck[] = [
    {
      id: 'SOCIAL_DESIRABILITY',
      label: 'Social Desirability',
      description: 'Whether responses lean toward socially desirable answers rather than accurate self-assessment.',
      status: flags.has('SOCIAL_DESIRABILITY') ? 'flag' : flags.has('IMPRESSION_MANAGEMENT') ? 'watch' : 'pass',
      detail: flags.has('SOCIAL_DESIRABILITY')
        ? 'Elevated social desirability detected. Some scores may be inflated.'
        : 'Responses show natural variation — no social desirability concern.',
      impact: 'Affects all ray shine scores. Your highest rays may be overstated — focus on relative patterns rather than absolute numbers.',
    },
    {
      id: 'IMPRESSION_MANAGEMENT',
      label: 'Impression Management',
      description: 'Active curation of responses to present a particular image.',
      status: flags.has('IMPRESSION_MANAGEMENT') ? 'flag' : 'pass',
      detail: flags.has('IMPRESSION_MANAGEMENT')
        ? 'Pattern suggests responses may reflect desired self over actual self.'
        : 'No impression management pattern detected.',
      impact: 'Affects confidence band and eclipse accuracy. Your eclipse level may be underreported.',
    },
    {
      id: 'INCONSISTENCY',
      label: 'Response Consistency',
      description: 'Whether similar questions received similar answers.',
      status: flags.has('INCONSISTENCY') ? 'flag' : 'pass',
      detail: flags.has('INCONSISTENCY')
        ? 'Some paired items showed inconsistent responses. Can reflect genuine complexity or cognitive fatigue.'
        : 'Responses are internally consistent across paired items.',
      impact: 'Widens confidence intervals on specific rays. Your top-two and bottom ray selections are still reliable.',
    },
    {
      id: 'SPEEDING',
      label: 'Response Pace',
      description: 'Whether enough time was spent on each question for thoughtful answers.',
      status: flags.has('SPEEDING') ? 'flag' : 'pass',
      detail: flags.has('SPEEDING')
        ? 'Rapid response pattern detected. Some answers may have been reflexive.'
        : 'Response pacing indicates thoughtful consideration.',
      impact: 'Affects all scores in the fast-response window. Later sections (if slower) are more reliable than earlier ones.',
    },
    {
      id: 'STRAIGHTLINING',
      label: 'Response Variation',
      description: 'Whether the same answer was selected repeatedly in sequence.',
      status: flags.has('STRAIGHTLINING') ? 'flag' : 'pass',
      detail: flags.has('STRAIGHTLINING')
        ? 'Extended runs of identical responses detected. May indicate fatigue or disengagement.'
        : 'Healthy response variation throughout.',
      impact: 'Affects rays measured in the straightlined section. Scores in that block may not differentiate your actual capacities.',
    },
    {
      id: 'ATTENTION',
      label: 'Attention Checks',
      description: 'Whether embedded attention-check items were answered correctly.',
      status: flags.has('ATTENTION') ? 'flag' : 'pass',
      detail: flags.has('ATTENTION')
        ? 'One or more attention checks were missed.'
        : 'All attention checks passed.',
      impact: 'Reduces overall confidence. Surrounding items near missed checks carry less scoring weight.',
    },
    {
      id: 'INFREQUENCY',
      label: 'Response Plausibility',
      description: 'Whether any responses were statistically unusual.',
      status: flags.has('INFREQUENCY') ? 'flag' : 'pass',
      detail: flags.has('INFREQUENCY')
        ? 'Some responses were uncommon. May reflect unique circumstances or random responding.'
        : 'All responses within expected ranges.',
      impact: 'Affects scoring precision for specific items. Most of your profile remains unaffected.',
    },
    {
      id: 'LOW_REFLECTION_DEPTH',
      label: 'Reflection Depth',
      description: 'Quality and depth of written reflection responses.',
      status: flags.has('LOW_REFLECTION_DEPTH') ? 'flag' : 'pass',
      detail: flags.has('LOW_REFLECTION_DEPTH')
        ? 'Reflections were brief or missing. Deeper reflections improve coaching precision.'
        : 'Reflections provided meaningful context for scoring.',
      impact: 'Affects coaching recommendations and 30-day plan specificity. Quantitative scores are not affected.',
    },
    {
      id: 'MISSINGNESS',
      label: 'Completion Rate',
      description: 'How many assessment items were answered.',
      status: flags.has('MISSINGNESS') ? 'flag' : 'pass',
      detail: flags.has('MISSINGNESS')
        ? 'Some items were skipped. Affected ray scores have wider confidence intervals.'
        : 'Full or near-full completion. All scores have strong data support.',
      impact: 'Directly affects rays with missing subfacet data. Rays with full coverage remain precise.',
    },
  ];

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const passPercent = Math.round((passCount / checks.length) * 100);

  const STATUS_CONFIG = {
    pass: { color: '#34D399', bg: 'rgba(52, 211, 153, 0.12)', icon: '\u2713', label: 'Pass' },
    watch: { color: '#F8D011', bg: 'rgba(248, 208, 17, 0.10)', icon: '\u25CB', label: 'Watch' },
    flag: { color: '#FB923C', bg: 'rgba(251, 146, 60, 0.10)', icon: '\u2717', label: 'Flag' },
  };

  return (
    <section className="space-y-4">
      {/* Summary bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full glass-card p-5 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              Data Quality Forensics
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
              {passCount}/{checks.length} checks passed &middot; {flagCount} flag{flagCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mini progress ring */}
            <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(148, 80, 200, 0.2)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={passPercent >= 80 ? '#34D399' : passPercent >= 50 ? '#F8D011' : '#FB923C'}
                strokeWidth="3"
                strokeDasharray={`${passPercent * 0.942} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
              <text x="18" y="18" textAnchor="middle" dominantBaseline="central" fill="var(--text-on-dark)" fontSize="9" fontWeight="700">
                {passPercent}%
              </text>
            </svg>

            <span
              className="text-xs transition-transform"
              style={{
                color: 'var(--text-on-dark-muted)',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              aria-hidden="true"
            >
              &#9660;
            </span>
          </div>
        </div>
      </button>

      {/* Expanded checklist */}
      {expanded && (
        <div className="space-y-2">
          {checks.map((check) => {
            const cfg = STATUS_CONFIG[check.status];
            return (
              <div
                key={check.id}
                className="rounded-lg px-4 py-3 border"
                style={{ background: cfg.bg, borderColor: `${cfg.color}25` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.icon}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>{check.label}</span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ml-auto"
                    style={{ background: `${cfg.color}20`, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>{check.detail}</p>
                {check.status !== 'pass' && (
                  <p className="text-xs mt-1 italic" style={{ color: 'var(--text-on-dark-muted)' }}>
                    Impact: {check.impact}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
