'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LightSignatureReveal from '@/components/results/LightSignatureReveal';
import type { AssessmentOutputV1 } from '@/lib/types';

/**
 * CinematicCompleteClient — fetches the run output and plays the
 * LightSignatureReveal cinematic (12-second spectacular sequence).
 * CelebrationBurst is fired from inside LightSignatureReveal at
 * the signature-reveal moment (~5 s in).
 *
 * The 13-second safety timeout is a fallback only; the reveal component
 * calls onComplete itself when the finale ends.
 */
export default function CinematicCompleteClient() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const runId         = searchParams.get('run_id') ?? '';

  const [output,  setOutput]  = useState<AssessmentOutputV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const redirected = useRef(false);

  const doRedirect = useCallback(() => {
    if (redirected.current) return;
    redirected.current = true;
    router.replace(runId ? `/results?run_id=${runId}` : '/results');
  }, [runId, router]);

  /* Fetch the completed run's output */
  useEffect(() => {
    if (!runId) { doRedirect(); return; }

    fetch(`/api/runs/${runId}/results`)
      .then(r => r.ok ? r.json() : null)
      .then((data: { results_payload?: AssessmentOutputV1 } | null) => {
        if (data?.results_payload) {
          setOutput(data.results_payload);
        } else {
          doRedirect();
        }
      })
      .catch(() => doRedirect())
      .finally(() => setLoading(false));
  }, [runId, doRedirect]);

  /* 13-second safety net — the reveal calls onComplete itself at ~12.5 s */
  useEffect(() => {
    const t = setTimeout(doRedirect, 13000);
    return () => clearTimeout(t);
  }, [doRedirect]);

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(96,5,141,0.35) 0%, transparent 60%), linear-gradient(180deg, #0a0420 0%, #1E0E35 50%, #0a0420 100%)',
        }}
      >
        <div
          style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid rgba(248,208,17,0.2)',
            borderTop: '3px solid #F8D011',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!output) return null;

  return (
    <LightSignatureReveal
      output={output}
      runId={runId}
      onComplete={doRedirect}
    />
  );
}
