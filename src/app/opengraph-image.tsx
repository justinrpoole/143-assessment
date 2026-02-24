import { ImageResponse } from 'next/og';

export const alt = '143 Leadership — Measure, Train, and Sustain Your Leadership Light';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0C0118',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#F8D011',
            display: 'flex',
          }}
        />
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#F8D011',
            marginTop: 28,
            fontFamily: 'Georgia, serif',
          }}
        >
          143 Leadership
        </div>
        <div
          style={{
            fontSize: 20,
            color: 'rgba(255,254,245,0.6)',
            marginTop: 16,
            letterSpacing: 6,
            textTransform: 'uppercase' as const,
          }}
        >
          Measure · Train · Sustain
        </div>
      </div>
    ),
    { ...size },
  );
}
