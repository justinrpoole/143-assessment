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
      <Link href="/portal">Portal</Link>
      <span className="portal-breadcrumb__separator" aria-hidden="true" />
      <span style={{ color: 'rgba(248,208,17,0.7)' }}>{current}</span>
    </nav>
  );
}
