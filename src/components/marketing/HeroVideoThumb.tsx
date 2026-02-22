'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * Hero video thumbnail with play-on-click inline embed.
 *
 * Replace VIDEO_ID with your actual YouTube or Vimeo video ID.
 * Set PLATFORM to 'youtube' or 'vimeo' accordingly.
 *
 * The iframe lazy-loads via IntersectionObserver — only initialised
 * when the component scrolls into view AND the user clicks play.
 */

const PLATFORM: 'youtube' | 'vimeo' = 'youtube';
const VIDEO_ID = 'REPLACE_WITH_VIDEO_ID';

function getEmbedUrl(): string {
  if (PLATFORM === 'vimeo') {
    return `https://player.vimeo.com/video/${VIDEO_ID}?autoplay=1&title=0&byline=0&portrait=0`;
  }
  return `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
}

export default function HeroVideoThumb() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mt-8 max-w-[640px]">
      {playing && visible ? (
        <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 h-full w-full rounded-2xl"
            src={getEmbedUrl()}
            title="Justin Ray — What is the 143 Leadership Assessment?"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative block w-full overflow-hidden rounded-2xl text-left focus:outline-none"
          style={{
            background: 'linear-gradient(135deg, rgba(96,5,141,0.4) 0%, rgba(26,10,46,0.9) 100%)',
            border: '1px solid rgba(248,208,17,0.15)',
          }}
          aria-label="Play video: What is the 143 Leadership Assessment?"
        >
          {/* Cosmic thumbnail */}
          <div className="relative flex aspect-video items-center justify-center">
            {/* Decorative sun rays */}
            <div
              className="absolute h-32 w-32 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, #F8D011 0%, transparent 70%)',
              }}
            />

            {/* Play button */}
            <div
              className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110"
              style={{
                background: 'var(--brand-gold, #F8D011)',
                boxShadow: '0 0 32px rgba(248,208,17,0.3)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 5v14l11-7L8 5z" fill="#1A0A2E" />
              </svg>
            </div>

            {/* Bottom text */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                Watch (90 sec)
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
                What happens when exhaustion covers your strongest capacities?
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
