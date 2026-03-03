import type { ReactNode } from "react";

const MAX_WIDTH = {
  narrow: "content-wrap--narrow",
  default: "content-wrap",
  wide: "content-wrap--wide",
  full: "content-wrap--wide",
} as const;

const PADDING = {
  narrow: "px-5 pt-16 pb-20 sm:px-8 sm:pt-24",
  default: "px-5 py-12 sm:px-8 sm:py-16",
  wide: "px-5 py-10 sm:px-8 sm:py-12",
  full: "px-5 py-8 sm:px-8 sm:py-10",
} as const;

interface PageShellProps {
  children: ReactNode;
  /** Content width — defaults to "default" (960px) */
  maxWidth?: keyof typeof MAX_WIDTH;
  /** Extra className on the inner container */
  className?: string;
  /** Content rendered outside the container but inside <main> (e.g. PortalTabBar) */
  after?: ReactNode;
}

export function PageShell({
  children,
  maxWidth = "default",
  className = "",
  after,
}: PageShellProps) {
  return (
    <main className="cosmic-page-bg page-shell">
      <div className={`${MAX_WIDTH[maxWidth]} ${PADDING[maxWidth]} ${className}`.trim()}>
        {children}
      </div>
      {after}
    </main>
  );
}
