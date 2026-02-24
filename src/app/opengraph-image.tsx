import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = '143 Leadership — Measure, Train, and Sustain Your Leadership Light';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), 'public', 'images', 'logo-143.png'),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #0C0118 50%, #0a0a1f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={200}
          height={200}
          style={{ borderRadius: 24 }}
        />
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: '#F8D011',
            marginTop: 32,
            fontFamily: 'Georgia, serif',
          }}
        >
          143 Leadership
        </div>
        <div
          style={{
            fontSize: 22,
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
