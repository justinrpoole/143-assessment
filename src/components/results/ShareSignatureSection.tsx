'use client';

import { useEffect, useState } from 'react';
import ShareableSignatureCard from '@/components/marketing/ShareableSignatureCard';
import type { AssessmentOutputV1 } from '@/lib/types';
import { RAY_COLORS } from '@/lib/ui/ray-colors';

interface ShareSignatureSectionProps {
  runId: string;
}

interface RunResults {
  results_payload?: AssessmentOutputV1;
}

/**
 * ShareSignatureSection — fetches the run output and renders the
 * shareable Light Signature card. Renders nothing while loading or
 * if the data is unavailable.
 */
export default function ShareSignatureSection({ runId }: ShareSignatureSectionProps) {
  const [data, setData] = useState<AssessmentOutputV1 | null>(null);

  useEffect(() => {
    if (!runId) return;
    fetch(`/api/runs/${runId}/results`)
      .then(r => r.ok ? r.json() : null)
      .then((res: RunResults | null) => {
        if (res?.results_payload) setData(res.results_payload);
      })
      .catch(() => { /* silent — section is non-critical */ });
  }, [runId]);

  if (!data) return null;

  const sig      = data.light_signature;
  const topTwo   = sig?.top_two ?? [];
  const archetype = sig?.archetype;

  if (!archetype?.name || topTwo.length < 2) return null;

  const ray1      = topTwo[0]?.ray_name ?? '';
  const ray2      = topTwo[1]?.ray_name ?? '';
  const neonColor = RAY_COLORS[topTwo[0]?.ray_id ?? '']?.hex ?? '#F8D011';

  return (
    <section className="mx-auto max-w-2xl px-6 py-12 text-center">
      <p
        className="text-xs uppercase tracking-widest mb-3"
        style={{ color: 'var(--brand-gold, #F8D011)' }}
      >
        Share Your Light Signature
      </p>
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
      >
        Show the world what your system looks like right now.
      </h2>
      <ShareableSignatureCard
        name={archetype.name}
        tagline={archetype.essence ?? 'Your leadership capacity, mapped.'}
        rays={[ray1, ray2]}
        neonColor={neonColor}
      />
    </section>
  );
}
