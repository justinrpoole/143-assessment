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
  { label: 'Emotional Load', pct: 45, color: 'var(--text-body)' },
  { label: 'Cognitive Load', pct: 60, color: 'var(--text-body)' },
  { label: 'Relational Load', pct: 35, color: 'var(--text-body)' },
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
            background: 'linear-gradient(135deg, var(--bg-deep-mid, var(--text-body)) 0%, var(--surface-border) 50%, var(--bg-deep, var(--text-body)) 100%)',
            border: '1px solid var(--surface-border, color-mix(in srgb, var(--text-body) 8%, transparent))',
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest text-center"
            style={{ color: 'var(--gold-primary)' }}
          >
            Your Light Signature
          </p>
          <h2
            className="text-2xl font-bold text-center"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-body)' }}
          >
            The Illuminated Architect
          </h2>
          <p
            className="text-sm text-center max-w-md mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            When you are resourced, you lead by making the invisible visible. You build structures that outlast your presence and light paths others cannot yet see.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {PREVIEW_RAYS.map((r) => (
              <div
                key={r.label}
                className="rounded-xl p-3"
                style={{ background: 'color-mix(in srgb, var(--text-body) 4%, transparent)', border: '1px solid color-mix(in srgb, var(--text-body) 7%, transparent)' }}
              >
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  {r.label}
                </p>
                <div className="h-1.5 w-full rounded-full" style={{ background: 'color-mix(in srgb, var(--text-body) 8%, transparent)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${r.pct}%`, background: 'var(--gold-primary)' }}
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
            background: 'var(--bg-deep-mid, var(--text-body))',
            border: '1px solid var(--surface-border, color-mix(in srgb, var(--text-body) 8%, transparent))',
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--gold-primary)' }}
          >
            Eclipse Snapshot
          </p>
          <p
            className="text-lg font-semibold"
            style={{ color: 'var(--text-body)' }}
          >
            Moderate Load &middot; System is stable
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your capacity is not gone — it is covered. The snapshot below shows where stress is creating the most eclipse pressure.
          </p>
          <div className="space-y-3">
            {ECLIPSE_BARS.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--text-on-dark-secondary)' }}>{b.label}</span>
                  <span style={{ color: b.color }}>{b.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full" style={{ background: 'color-mix(in srgb, var(--text-body) 6%, transparent)' }}>
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
          background: 'var(--surface-border)',
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
              color: 'var(--gold-primary)',
            }}
          >
            Your full map is ready.
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            9 Ray scores. Eclipse pattern. Rise Path. Daily tools.
          </p>
          <Link
            href="/upgrade"
            className="inline-block rounded-xl px-8 py-4 text-base font-bold transition-opacity hover:opacity-90"
            style={{
              background: 'var(--gold-primary)',
              color: 'var(--ink-950)',
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
