interface TrustBadgeStripProps {
  badges: string[];
}

/**
 * TrustBadgeStrip — Horizontal row of gold-bordered trust signal badges.
 * "9 Rays Measured", "143+ Data Points", "Evidence-Based", etc.
 */
export default function TrustBadgeStrip({ badges }: TrustBadgeStripProps) {
  return (
    <div className="trust-badge-strip" aria-label="Trust signals">
      {badges.map((badge) => (
        <span key={badge} className="trust-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M7 1L8.5 4.5L12.5 5L9.75 7.5L10.5 11.5L7 9.5L3.5 11.5L4.25 7.5L1.5 5L5.5 4.5L7 1Z" stroke="currentColor" strokeWidth="1" fill="rgba(248,208,17,0.15)" />
          </svg>
          {badge}
        </span>
      ))}
    </div>
  );
}
