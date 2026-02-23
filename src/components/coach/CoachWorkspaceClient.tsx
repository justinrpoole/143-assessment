'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { AssessmentOutputV1 } from '@/lib/types';
import { RAY_VERBS } from '@/lib/types';
import { findRoadmapByPhase, integratedPolicies } from '@/lib/spec-integration';

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

export function CoachWorkspaceClient() {
  const [result] = useState<AssessmentOutputV1 | null>(() => readResult());

  if (!result) {
    return (
      <main className="cosmic-page-bg">
        <div className="mx-auto max-w-3xl px-5 py-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Coach Workspace</p>
          <h1 className="text-3xl font-semibold mt-2" style={{ color: 'var(--text-on-dark)' }}>No client run available</h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Complete one assessment run first, then open coach workspace for data-grounded prompts.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/assessment/setup" className="btn-primary">Start Setup</Link>
            <Link href="/" className="btn-watch">Back Home</Link>
          </div>
        </div>
      </main>
    );
  }

  const topTwo = result.light_signature.top_two;
  const bottom = result.light_signature.just_in_ray;
  const questions = result.recommendations.coaching_questions ?? [];
  const coachingRoadmap = findRoadmapByPhase('Phase 3 Coaching').slice(0, 3);

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <header className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Coach Workspace</p>
          <h1 className="text-3xl font-semibold mt-2 sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>Tools-First Coaching Plan</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Built from current run output. No typing language. No shame framing.
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            Tone lock active: warm authority={String(integratedPolicies.tone.warmAuthority)}, no-shame={String(integratedPolicies.tone.noShame)}
          </p>
        </header>

        <section className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Session Snapshot</p>
          <div className="grid gap-3 md:grid-cols-4">
            <article className="glass-card p-4">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Eclipse Level</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{result.eclipse.level}</p>
            </article>
            <article className="glass-card p-4">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Gate Mode</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{result.eclipse.gating.mode}</p>
            </article>
            <article className="glass-card p-4">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Confidence</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{result.data_quality.confidence_band}</p>
            </article>
            <article className="glass-card p-4">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Acting Status</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{result.acting_vs_capacity.status}</p>
            </article>
          </div>
        </section>

        <section className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Roadmap Integration</p>
          <h2 className="mb-2 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Phase 3 Coaching Features</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {coachingRoadmap.map((row) => (
              <article key={`${row.Phase}-${row.Feature}`} className="glass-card p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>{row.Phase}</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{row.Feature}</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>QA: {row['QA requirements']}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Power and Training</p>
          <div className="grid gap-3 md:grid-cols-2">
            {topTwo.map((ray) => (
              <article key={ray.ray_id} className="glass-card p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Power Source</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                  {ray.ray_name} ({RAY_VERBS[ray.ray_id]})
                </p>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{ray.why_resourced}</p>
              </article>
            ))}
            <article className="glass-card p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-muted)' }}>Bottom Ray Training Focus</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {bottom.ray_name} ({RAY_VERBS[bottom.ray_id]})
              </p>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{bottom.why_this_is_next}</p>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark)' }}>Work REP: {bottom.work_rep}</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark)' }}>Life REP: {bottom.life_rep}</p>
            </article>
          </div>
        </section>

        <section className="glass-card mb-6 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3">Coach Questions</p>
          <h2 className="mb-2 text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Suggested prompts for next session</h2>
          {questions.length > 0 ? (
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {questions.map((question) => (
                <li key={question}>- {question}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>No explicit prompts in this run. Use Bottom Ray REP as the session anchor.</p>
          )}
        </section>

        <footer className="flex flex-wrap gap-3">
          <Link href="/portal" className="btn-primary">Open Dashboard</Link>
          <Link href="/results" className="btn-watch">Back to Results</Link>
        </footer>
      </div>
    </main>
  );
}
