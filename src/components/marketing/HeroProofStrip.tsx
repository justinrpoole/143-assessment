'use client';

const PROOF_LINES = [
  "Senior Director saw 3 rays improve in 90 days",
  "Engineering Lead's team noticed calmer meetings within 4 weeks",
  "VP of Operations named her eclipse pattern in one sentence",
  "Founder said: 'First tool that showed me I was growing'",
  "Healthcare Director's Presence score went from eclipsed to emerging",
  "COO retook at 90 days — 4 of 9 rays moved measurably",
  "Team Lead used Rise Path reps daily for 21 days straight",
  "Director of Product: 'The coaching questions changed my 1-on-1s'",
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
