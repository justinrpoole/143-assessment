'use client';

import { useState } from 'react';

interface Props {
  runId: string;
}

export function PdfDownloadButton({ runId }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function handleDownload() {
    setStatus('loading');
    try {
      const res = await fetch(`/api/runs/${encodeURIComponent(runId)}/report/pdf`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const data = await res.json();
      const url = data.signed_url;
      if (!url) throw new Error('No download URL returned');
      window.open(url, '_blank', 'noopener');
      setStatus('idle');
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={status === 'loading'}
      className="text-xs font-medium px-4 py-2 rounded-full transition-all"
      style={{
        color:
          status === 'error'
            ? '#fb7185'
            : 'var(--text-on-dark-secondary)',
        background:
          status === 'loading'
            ? 'rgba(248, 208, 17, 0.08)'
            : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        opacity: status === 'loading' ? 0.7 : 1,
        cursor: status === 'loading' ? 'wait' : 'pointer',
      }}
    >
      {status === 'loading'
        ? 'Generating PDF\u2026'
        : status === 'error'
          ? 'PDF failed \u2014 try again'
          : 'Download PDF report'}
    </button>
  );
}
