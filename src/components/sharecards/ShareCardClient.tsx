'use client';

/**
 * ShareCardClient — wraps the visual ShareCard with download + share actions.
 *
 * Actions:
 *   - Download as PNG (html2canvas)
 *   - Copy link to clipboard
 *   - Open Twitter/X with pre-filled tweet
 *   - Instagram: prompt user to download first (platform limitation)
 */

import { useRef, useState } from 'react';
import { ShareCard, ShareCardWrapper } from '@/components/ui/ShareCard';

interface ShareCardClientProps {
  signatureName: string;
  topRays: [string, string] | string[];
  essence?: string;
  runId: string;
  tweetText: string;
}

export function ShareCardClient({
  signatureName,
  topRays,
  essence,
  tweetText,
}: ShareCardClientProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      // Dynamically import html2canvas so it only loads when needed
      const { default: html2canvas } = await import('html2canvas');

      // Find the actual card element inside the ref wrapper
      const cardEl =
        cardRef.current.querySelector<HTMLElement>('[data-share-card]') ??
        cardRef.current;

      const canvas = await html2canvas(cardEl, {
        // Capture at 2× for retina-quality PNGs
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        // Remove the CSS transform before capture, restore after
        onclone: (doc) => {
          const el = doc.querySelector<HTMLElement>('[data-share-card]');
          if (el) {
            el.style.transform = 'none';
            el.style.transformOrigin = 'unset';
          }
        },
      });

      const link = document.createElement('a');
      link.download = 'my-light-signature.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('[ShareCard] download failed', err);
      setDownloadError('Download failed. Try right-clicking the card and saving the image.');
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText('https://143leadership.com/results');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = 'https://143leadership.com/results';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-10">
      {/* Page heading */}
      <div className="text-center space-y-2">
        <p
          className="text-sm uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          Share Your Light
        </p>
        <h1
          className="text-2xl sm:text-3xl font-bold"
          style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
        >
          Your Light Signature card is ready.
        </h1>
        <p
          className="text-sm"
          style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.7))' }}
        >
          Download it. Post it. Let people ask what it means.
        </p>
      </div>

      {/* Card preview */}
      <div ref={cardRef}>
        <ShareCardWrapper>
          <ShareCard
            signatureName={signatureName}
            topRays={topRays}
            essence={essence}
          />
        </ShareCardWrapper>
      </div>

      {/* Error state */}
      {downloadError && (
        <p
          className="text-sm text-center rounded-lg px-4 py-3"
          style={{
            color: '#FCA5A5',
            background: 'rgba(220,38,38,0.12)',
            border: '1px solid rgba(220,38,38,0.25)',
          }}
        >
          {downloadError}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {/* Primary: Download */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold transition-all duration-200"
          style={{
            background: 'var(--brand-gold, #F8D011)',
            color: '#020202',
            boxShadow: '0 0 24px rgba(248,208,17,0.25), 0 0 60px rgba(248,208,17,0.10)',
            opacity: downloading ? 0.7 : 1,
          }}
        >
          {downloading ? (
            <>
              <svg
                className="animate-spin"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4v12m0 0-4-4m4 4 4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download Card
            </>
          )}
        </button>

        {/* Copy link */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-sm font-semibold transition-all duration-200"
          style={{
            color: 'var(--text-on-dark, #FFFEF5)',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="#F8D011" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: 'var(--brand-gold, #F8D011)' }}>Copied!</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>

      {/* Social share buttons */}
      <div className="space-y-3">
        <p
          className="text-xs uppercase tracking-widest text-center"
          style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.4))' }}
        >
          Share on
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {/* Twitter/X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-150"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-on-dark, #FFFEF5)',
            }}
          >
            {/* X logo */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Post on X
          </a>

          {/* Instagram (download prompt) */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-150"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-on-dark, #FFFEF5)',
            }}
          >
            {/* Instagram gradient icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" stroke="url(#ig-grad)" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1" fill="#E1306C" />
              <defs>
                <linearGradient id="ig-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F58529" />
                  <stop offset="0.5" stopColor="#DD2A7B" />
                  <stop offset="1" stopColor="#515BD4" />
                </linearGradient>
              </defs>
            </svg>
            Save for Instagram
          </button>
        </div>

        <p
          className="text-xs text-center"
          style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.35))' }}
        >
          Instagram tip: download the card, then share from your camera roll.
        </p>
      </div>

      {/* Back link */}
      <div className="text-center">
        <a
          href="/results"
          className="text-sm transition-opacity duration-150 hover:opacity-100"
          style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.6))' }}
        >
          ← Back to my full report
        </a>
      </div>
    </div>
  );
}
