'use client';

import { useEffect, useState } from 'react';

/**
 * ScrollProgress — A thin gold progress bar at the very top of the viewport
 * that fills as the user scrolls down the page.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min(1, scrollTop / docHeight));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[3px] sm:h-[2px]"
      style={{
        width: `${progress * 100}%`,
        background: 'linear-gradient(to right, var(--cosmic-purple, var(--text-body)), var(--gold-primary))',
        transition: 'width 80ms cubic-bezier(0.3, 0, 0.7, 1)',
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}
