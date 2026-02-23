'use client';

/**
 * Copy Guardrails Visual Reference (#13) — Typography & Language Guide
 *
 * Shows the 143 voice in context: tooltip, CTA button, contextual hint,
 * section header, and banner bar. Demonstrates warm-grounded-poetic tone.
 * v3 branded: gold/white text on purple/black, frosted glass surfaces.
 */
export default function CopyGuardrails() {
  return (
    <div className="glass-card p-5">
      <p
        className="mb-4"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Voice &amp; Copy Reference
      </p>

      <div className="space-y-5">
        {/* Element 1: Tooltip */}
        <div className="relative">
          <p style={{ color: 'var(--text-on-dark-muted)', fontSize: 10, marginBottom: 6 }}>TOOLTIP</p>
          <div
            style={{
              background: 'rgba(17, 3, 32, 0.85)',
              border: '1.5px solid #F4C430',
              borderRadius: 'var(--radius-md)',
              backdropFilter: 'blur(20px)',
              padding: '10px 16px',
              display: 'inline-block',
              position: 'relative',
            }}
          >
            <p style={{ color: 'var(--text-on-dark)', fontSize: 13, fontWeight: 400 }}>
              Guard the air your light breathes.
            </p>
            {/* Triangle pointer */}
            <div
              style={{
                position: 'absolute',
                bottom: -6,
                left: 24,
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #F4C430',
              }}
            />
          </div>
        </div>

        {/* Element 2: CTA Button */}
        <div>
          <p style={{ color: 'var(--text-on-dark-muted)', fontSize: 10, marginBottom: 6 }}>CALL TO ACTION</p>
          <button
            className="btn-primary"
            style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.03em' }}
          >
            Step closer to the light
          </button>
        </div>

        {/* Element 3: Contextual Hint */}
        <div>
          <p style={{ color: 'var(--text-on-dark-muted)', fontSize: 10, marginBottom: 6 }}>CONTEXTUAL HINT</p>
          <p style={{ color: 'var(--text-on-dark-secondary)', fontSize: 12, fontStyle: 'italic' }}>
            The shadow is not the story.
          </p>
        </div>

        {/* Element 4: Section Header */}
        <div>
          <p style={{ color: 'var(--text-on-dark-muted)', fontSize: 10, marginBottom: 6 }}>SECTION HEADER</p>
          <h3 style={{ color: 'var(--text-on-dark)', fontSize: 18, fontWeight: 700, letterSpacing: '0.02em' }}>
            Your orbit today.
          </h3>
        </div>

        {/* Element 5: Banner Bar (echoes 143 "LEADERSHIP" bar) */}
        <div>
          <p style={{ color: 'var(--text-on-dark-muted)', fontSize: 10, marginBottom: 6 }}>BANNER BAR</p>
          <div
            style={{
              background: '#1A1A1A',
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <p style={{ color: '#F4C430', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              The light is still there
            </p>
          </div>
        </div>

        {/* Voice principles */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 16,
            marginTop: 8,
          }}
        >
          <p style={{ color: 'var(--text-on-dark-muted)', fontSize: 10, marginBottom: 8 }}>VOICE PRINCIPLES</p>
          <div className="flex flex-wrap gap-2">
            {['Warm', 'Grounded', 'Poetic', 'Never clinical', 'Never corporate'].map((p) => (
              <span
                key={p}
                style={{
                  background: 'var(--surface-glass)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontSize: 10,
                  fontWeight: 500,
                  color: 'var(--text-on-dark-secondary)',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
