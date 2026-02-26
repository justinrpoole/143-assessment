'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  label: string;
}

interface SectionTOCProps {
  /** Array of { id, label } for each section heading */
  items: TocItem[];
}

/**
 * SectionTOC — Floating left-rail table of contents with gold dot indicators.
 * Scroll-spy updates active dot via IntersectionObserver.
 * Hidden on screens narrower than 1280px.
 */
export default function SectionTOC({ items }: SectionTOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="section-toc" aria-label="Page sections">
      <ul>
        {items.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
              className={`section-toc__dot ${activeId === id ? 'section-toc__dot--active' : ''}`}
              aria-current={activeId === id ? 'true' : undefined}
              title={label}
            >
              <span className="section-toc__label">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
