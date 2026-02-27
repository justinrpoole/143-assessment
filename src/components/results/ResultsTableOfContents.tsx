'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface TocSection {
  id: string;
  label: string;
}

const SECTIONS: TocSection[] = [
  { id: 'section-identity', label: 'Identity' },
  { id: 'section-rise-path', label: 'Rise Path' },
  { id: 'section-week-one', label: 'Week 1' },
  { id: 'section-30-day', label: '30-Day Plan' },
  { id: 'section-eclipse', label: 'Eclipse' },
  { id: 'section-stability', label: 'Stability' },
  { id: 'section-light-signature', label: 'Signature' },
  { id: 'section-actions', label: 'Next Move' },
];

/**
 * ResultsTableOfContents — Floating vertical navigation dots on the
 * left side of the results page. Only visible on XL screens (1280px+).
 *
 * Uses existing `.section-toc` CSS classes from cosmic.css.
 * Active section detection via IntersectionObserver.
 */
export default function ResultsTableOfContents() {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the most visible section
    let bestEntry: IntersectionObserverEntry | null = null;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
          bestEntry = entry;
        }
      }
    }
    if (bestEntry) {
      setActiveId(bestEntry.target.id);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5],
    });

    const observer = observerRef.current;

    // Observe all sections that exist in the DOM
    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [handleIntersect]);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <nav className="section-toc" aria-label="Results sections">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => scrollToSection(section.id)}
          className={`section-toc__dot${activeId === section.id ? ' section-toc__dot--active' : ''}`}
          aria-label={`Jump to ${section.label}`}
          aria-current={activeId === section.id ? 'true' : undefined}
        >
          <span className="section-toc__label">{section.label}</span>
        </button>
      ))}
    </nav>
  );
}
