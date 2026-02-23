'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { AssessmentOutputV1 } from '@/lib/types';
import {
  findDataArchitectureRowsByPage,
  findRoadmapByPhase,
  integratedPolicies,
} from '@/lib/spec-integration';

function readResult(): AssessmentOutputV1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('assessment_result');
    if (!raw) return null;
    return JSON.parse(raw) as AssessmentOutputV1;
  } catch {
    return null;
  }
}

export function EnterprisePortalClient() {
  const [result] = useState<AssessmentOutputV1 | null>(() => readResult());
  const enterpriseRoadmap = findRoadmapByPhase('Phase 4 Enterprise').slice(0, 4);
  const execRows = [
    ...findDataArchitectureRowsByPage('Executive Dashboard'),
    ...findDataArchitectureRowsByPage('Burnout Heatmap'),
    ...findDataArchitectureRowsByPage('Leadership Readiness'),
  ];

  const mockCohort = useMemo(() => {
    if (!result) return null;
    const loadPressure = result.eclipse.derived_metrics.load_pressure;
    const recoveryAccess = result.eclipse.derived_metrics.recovery_access;
    const readiness = Math.max(20, Math.min(92, Math.round((recoveryAccess + 100 - loadPressure) / 2)));
    return {
      cohortSize: 48,
      loadPressure,
      recoveryAccess,
      readiness,
      confidence: result.data_quality.confidence_band,
    };
  }, [result]);

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Enterprise Portal</p>
          <h1 className="text-3xl font-semibold mt-2 sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>Aggregate Development Intelligence</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Development-only dashboard pattern with confidence bands and governance boundaries.
          </p>
        </header>

        <section className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Cohort Snapshot</p>
          {mockCohort ? (
            <div className="grid gap-3 md:grid-cols-5">
              <article className="glass-card p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Cohort Size</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{mockCohort.cohortSize}</p>
              </article>
              <article className="glass-card p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Load Pressure</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{mockCohort.loadPressure}</p>
              </article>
              <article className="glass-card p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Recovery Access</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{mockCohort.recoveryAccess}</p>
              </article>
              <article className="glass-card p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Readiness Index</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{mockCohort.readiness}</p>
              </article>
              <article className="glass-card p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Confidence</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{mockCohort.confidence}</p>
              </article>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
              Run an assessment first to seed this preview with reference values.
            </p>
          )}
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <article className="glass-card p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Burnout Heatmap</p>
            <h2 className="mb-2 text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Load signals are directional, not determinative</h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li>- Show aggregate load clusters by team and week.</li>
              <li>- Require confidence label on every visual tile.</li>
              <li>- Suppress small-N groups to prevent re-identification.</li>
            </ul>
          </article>

          <article className="glass-card p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Readiness Indicators</p>
            <h2 className="mb-2 text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Leadership readiness trendline</h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              <li>- Aggregate readiness by cohort, not by individual ranking.</li>
              <li>- Combine capacity movement and tool adoption trend.</li>
              <li>- Use confidence intervals in all executive exports.</li>
            </ul>
          </article>
        </section>

        <section className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Governance</p>
          <h2 className="mb-2 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Non-negotiable privacy boundaries</h2>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            <li>- No individual ranking views.</li>
            <li>- No hiring/firing use as sole decision input.</li>
            <li>- Aggregate-only default with role-based access.</li>
            <li>- Confidence and validity constraints attached to every interpretation.</li>
            <li>- Immutable audit logs for admin policy changes.</li>
          </ul>
          <p className="mt-3 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            Non-medical clause: {integratedPolicies.governance.nonDiagnosticClause}
          </p>
        </section>

        <section className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Data Architecture Integration</p>
          <div className="grid gap-3 md:grid-cols-3">
            {execRows.map((row) => (
              <article key={row['Page Name']} className="glass-card p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>{row['Page Name']}</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>Dependencies: {row.Dependencies}</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>Confidence: {row['Confidence band logic']}</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>QA: {row['QA flags']}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Roadmap Integration</p>
          <div className="grid gap-3 md:grid-cols-2">
            {enterpriseRoadmap.map((row) => (
              <article key={`${row.Phase}-${row.Feature}`} className="glass-card p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>{row.Phase}</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{row.Feature}</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>Validation: {row['Validation required']}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="flex flex-wrap gap-3">
          <Link href="/portal" className="btn-primary">Open Dashboard</Link>
          <Link href="/" className="btn-watch">Back Home</Link>
        </footer>
      </div>
    </main>
  );
}
