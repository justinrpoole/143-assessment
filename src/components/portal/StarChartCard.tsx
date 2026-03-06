import Link from 'next/link';

export default function StarChartCard({ bottomRayId }: { bottomRayId: string | null }) {
  void bottomRayId;
  return (
    <Link
      href="/energy-star-chart"
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '20px 16px',
        textDecoration: 'none',
        borderColor: 'rgba(242,210,73,0.2)',
      }}
    >
      <span
        style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#F2D249',
        }}
      >
        Energy Star Chart
      </span>
      <span
        style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center',
        }}
      >
        View your full leadership capacity instrument
      </span>
    </Link>
  );
}
