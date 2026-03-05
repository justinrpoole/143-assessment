'use client';

const PROOF_LINES = [
  "Leader report: less self-criticism, more self-trust in hard conversations",
  "Ops VP: 'I stopped performing calm and actually felt calm by Monday'",
  "Founder: 'I caught the shutdown pattern before it took my day'",
  "Product Director: 'I can reset faster without spiraling'",
  "Manager: 'I started speaking to myself like someone I love'",
  "Healthcare lead: more emotional range after a week of reps",
  "Executive coach note: clearer decisions with less internal noise",
  "143 means I love you — the challenge teaches self-love under pressure",
];

export default function HeroProofStrip() {
  // Double the lines for seamless CSS loop
  const doubled = [...PROOF_LINES, ...PROOF_LINES];

  return (
    <div
      className="relative mx-auto max-w-[960px] overflow-hidden py-3"
      aria-label="What leaders discovered"
    >
      <div
        className="flex w-max gap-8 whitespace-nowrap"
        style={{
          animation: 'proofScroll 40s linear infinite',
        }}
      >
        {doubled.map((line, i) => (
          <span
            key={`${line}-${i}`}
            className="text-xs sm:text-sm font-medium tracking-wide"
            style={{ color: 'var(--text-on-dark-muted, color-mix(in srgb, var(--text-body) 50%, transparent))' }}
          >
            {line}
            <span className="mx-6 inline-block" style={{ color: 'var(--gold-primary)', opacity: 0.8, textShadow: '0 0 12px color-mix(in srgb, var(--gold-primary) 40%, transparent), 0 0 24px color-mix(in srgb, var(--gold-primary) 10%, transparent)' }} aria-hidden="true">
              &#x2726;
            </span>
          </span>
        ))}
      </div>

      {/* Edge fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-12"
        style={{ background: 'linear-gradient(to right, var(--bg-deep, var(--text-body)), transparent)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-12"
        style={{ background: 'linear-gradient(to left, var(--bg-deep, var(--text-body)), transparent)' }}
      />

      <style>{`
        @keyframes proofScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
