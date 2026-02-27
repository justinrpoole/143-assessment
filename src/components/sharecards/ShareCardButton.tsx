"use client";

import { useMemo, useState } from "react";

type SharecardType = "results" | "growth" | "morning";

interface ShareCardButtonProps {
  type: SharecardType;
  runId?: string;
  rayPairId?: string;
  topRays?: string[];
  shortLine?: string;
  buttonLabel?: string;
}

interface SharecardResponse {
  signed_url?: string;
  error?: string;
  detail?: string;
}

export function ShareCardButton({
  type,
  runId,
  rayPairId,
  topRays,
  shortLine,
  buttonLabel = "Generate Share Card",
}: ShareCardButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const payload = useMemo(
    () => ({
      run_id: runId,
      ray_pair_id: rayPairId,
      top_rays: topRays,
      short_line: shortLine,
    }),
    [rayPairId, runId, shortLine, topRays],
  );

  async function onGenerate() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/sharecards/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as SharecardResponse;
      if (!response.ok || typeof data.signed_url !== "string") {
        setError(data.error ?? "sharecard_generate_failed");
        return;
      }
      setSignedUrl(data.signed_url);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "sharecard_generate_failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <button type="button" className="btn-watch" onClick={onGenerate} disabled={loading}>
        {loading ? "Generating..." : buttonLabel}
      </button>
      {error ? (
        <div className="rounded-lg px-4 py-3 flex items-center justify-between gap-3" role="alert"
          style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
        >
          <p className="text-sm" style={{ color: '#FCA5A5' }}>{error}</p>
          <button type="button" onClick={onGenerate} disabled={loading} className="btn-primary text-xs py-1.5 px-4 flex-shrink-0">
            {loading ? 'Retrying\u2026' : 'Try Again'}
          </button>
        </div>
      ) : null}
      {signedUrl ? (
        <p className="text-sm">
          <a href={signedUrl} target="_blank" rel="noreferrer" className="text-[var(--ray-purple)] underline">
            Open share card
          </a>
        </p>
      ) : null}
    </div>
  );
}
