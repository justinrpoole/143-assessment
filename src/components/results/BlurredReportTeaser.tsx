'use client';

/**
 * BlurredReportTeaser — shown to non-paid users on /reports.
 *
 * Renders a visual approximation of the Light Signature and Eclipse Snapshot
 * sections behind a blur + brightness filter, with an overlay CTA prompting
 * upgrade. Uses static placeholder data since the content is obscured.
 */

import Link from 'next/link';

/* ── static placeholder data (blurred — actual values don't matter) ── */

const PREVIEW_RAYS = [
  { label: 'R1 · Intention', pct: 78 },
  { label: 'R4 · Power', pct: 62 },
  { label: 'R7 · Connection', pct: 55 },
  { label: 'R9 · Be the Light', pct: 84 },
];

const ECLIPSE_BARS = [
  { label: 'Emotional Load', pct: 45, color: '#9B59B6' },
  { label: 'Cognitive Load', pct: 60, color: '#3498DB' },
  { label: 'Relational Load', pct: 35, color: '#E74C3C' },
];

export default function BlurredReportTeaser() {
  return (
    <div className="relative w-full" style={{ minHeight: 520 }}>

      {/* ── blurred preview content ─────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          filter: 'blur(8px) brightness(0.4)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {/* Section 1 — Light Signature mock */}
        <div
          className="rounded-2xl p-6 mb-6 space-y-4"
          style={{
            background: 'linear-gradient(135deg, var(--bg-deep-mid, #12052A) 0%, rgba(114,21,184,0.30) 50%, var(--bg-deep, #1A0A2E) 100%)',
            border: '1px solid var(--surface-border, rgba(255,255,255,0.08))',
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest text-center"
            style={{ color: 'var(--brand-gold, #F8D011)' }}
          >
            Your Light Signature
          </p>
          <h2
            className="text-2xl font-bold text-center"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark, #FFFEF5)' }}
          >
            The Illuminated Architect
          </h2>
          <p
            className="text-sm text-center max-w-md mx-auto"
            style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}
          >
            When you are resourced, you lead by making the invisible visible. You build structures that outlast your presence and light paths others cannot yet see.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {PREVIEW_RAYS.map((r) => (
              <div
                key={r.label}
                className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs mb-1" style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.45))' }}>
                  {r.label}
                </p>
                <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${r.pct}%`, background: 'var(--brand-gold, #F8D011)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 — Eclipse Snapshot mock */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'var(--bg-deep-mid, #12052A)',
            border: '1px solid var(--surface-border, rgba(255,255,255,0.08))',
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--brand-gold, #F8D011)' }}
          >
            Eclipse Snapshot
          </p>
          <p
            className="text-lg font-semibold"
            style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
          >
            Moderate Load &middot; System is stable
          </p>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
            Your capacity is not gone — it is covered. The snapshot below shows where stress is creating the most eclipse pressure.
          </p>
          <div className="space-y-3">
            {ECLIPSE_BARS.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--text-on-dark-secondary)' }}>{b.label}</span>
                  <span style={{ color: b.color }}>{b.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${b.pct}%`, background: b.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── overlay CTA ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,2,30,0.80)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '1rem',
        }}
      >
        <div className="text-center space-y-5 px-6 max-w-sm">
          <h2
            className="text-2xl font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--brand-gold, #F8D011)',
            }}
          >
            Your full map is ready.
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
          >
            9 Ray scores. Eclipse pattern. Rise Path. Daily tools.
          </p>
          <Link
            href="/upgrade"
            className="inline-block rounded-xl px-8 py-4 text-base font-bold transition-opacity hover:opacity-90"
            style={{
              background: 'var(--brand-gold, #F8D011)',
              color: '#020202',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.03em',
            }}
          >
            Unlock Full Report &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
