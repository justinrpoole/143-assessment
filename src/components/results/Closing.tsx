'use client';

import Link from 'next/link';

import type { AssessmentOutputV1 } from '@/lib/types';

interface Props {
  output: AssessmentOutputV1;
}

export default function Closing({ output }: Props) {
  const handleExport = () => {
    // Strip internal-only fields for export
    const exportable = { ...output };
    delete exportable.edge_cases;
    delete exportable.indices;
    delete exportable.profile_flag;
    const blob = new Blob([JSON.stringify(exportable, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `143_results_${output.assessment_run.run_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6 text-center">
      <div className="space-y-3">
        <p className="text-lg font-medium" style={{ color: 'var(--text-on-dark)' }}>
          Nothing here is beyond you. Something here is ready.
        </p>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Your capacity is not gone. It is right here, in the data, waiting for you to use it.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleExport}
          className="btn-primary cosmic-focus-target"
        >
          Export Results (JSON)
        </button>

        <Link
          href="/"
          className="btn-secondary cosmic-focus-target"
        >
          Return Home
        </Link>
      </div>

      {/* Upsell — what comes next */}
      <div className="mt-6 glass-card p-6 text-left">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          What Comes Next
        </p>
        <h3 className="mt-2 text-base font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          This is your map. Now make it move.
        </h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          The Portal Membership gives you monthly retakes to track real change, daily
          tools matched to your bottom ray, and growth sparklines that prove the
          reps are working. Your data stays — the system just gets smarter.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          <div className="space-y-1">
            <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>Gravitational Stability Report</p>
            <p>Single run — 143 questions</p>
            <p>Full report + Rise Path</p>
            <p>JSON data export</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold" style={{ color: 'var(--brand-gold, #F8D011)' }}>Portal Membership</p>
            <p>Monthly retakes (43-question)</p>
            <p>Growth tracking + sparklines</p>
            <p>Daily tools + streak system</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/upgrade" className="btn-primary">
            Upgrade to Portal Membership
          </Link>
          <Link href="/portal" className="btn-watch">
            Go to Portal
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8" style={{ borderTop: '1px solid var(--surface-border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          143 Be The Light Assessment &middot; {output.assessment_run.instrument_version} &middot; {output.copy_mode.tone_mode === 'JUSTIN_RAY_DIRECT' ? 'Justin Ray Direct' : 'Executive Safe'}
        </p>
      </div>
    </section>
  );
}
