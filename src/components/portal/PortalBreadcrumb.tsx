import Link from 'next/link';

interface PortalBreadcrumbProps {
  current: string;
}

/**
 * PortalBreadcrumb — Subtle breadcrumb trail above PageHeader on portal pages.
 * Shows: Portal > Current Page
 */
export default function PortalBreadcrumb({ current }: PortalBreadcrumbProps) {
  return (
    <nav className="portal-breadcrumb" aria-label="Breadcrumb">
      <Link href="/portal">Light Portal</Link>
      <span className="portal-breadcrumb__separator" aria-hidden="true" />
      <span style={{ color: 'color-mix(in srgb, var(--gold-primary) 70%, transparent)' }}>{current}</span>
    </nav>
  );
}
