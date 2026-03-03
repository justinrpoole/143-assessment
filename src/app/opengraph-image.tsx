import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = '143 Leadership — Measure, Train, and Sustain Your Leadership Light';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), 'public', 'images', 'master-logo.png'),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, var(--text-body) 0%, var(--text-body) 50%, var(--text-body) 100%)',
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
          width={420}
          height={420}
        />
        <div
          style={{
            fontSize: 20,
            color: 'var(--surface-border)',
            marginTop: 24,
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
