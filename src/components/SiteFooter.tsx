import Link from "next/link";

const COLS = [
  {
    heading: "Product",
    links: [
      { href: "/assessment", label: "Take the Assessment" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/sample-report", label: "Sample Report" },
      { href: "/outcomes", label: "Outcomes" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Practice",
    links: [
      { href: "/framework", label: "The Framework" },
      { href: "/143-challenge", label: "143 Challenge" },
      { href: "/coaches", label: "Coaching Program" },
      { href: "/resources", label: "Resources" },
      { href: "/glossary", label: "Glossary" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/justin", label: "Justin Ray" },
      { href: "/organizations", label: "For Organizations" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer
      className="border-t px-6 py-12 sm:px-8"
      style={{ borderColor: 'var(--surface-border)', background: 'var(--overlay-light)' }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--brand-gold)' }}>
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: 'var(--text-on-dark-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-10 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs"
          style={{ borderTop: '1px solid var(--surface-border)', color: 'var(--text-on-dark-muted)' }}
        >
          <p>&copy; {new Date().getFullYear()} 143 Leadership. All rights reserved.</p>
          <p>Measure your light. Train your light. Sustain your light.</p>
        </div>
      </div>
    </footer>
  );
}
