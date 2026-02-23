import type { ReactNode } from "react";

const MAX_WIDTH = {
  narrow: "max-w-[720px]",   // legal, long-form content
  default: "max-w-[960px]",  // portal, tools, account
  wide: "max-w-5xl",         // marketing info pages (1024px)
  full: "max-w-6xl",         // resource grids, admin (1152px)
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
    <main className="cosmic-page-bg">
      <div className={`mx-auto ${MAX_WIDTH[maxWidth]} ${PADDING[maxWidth]} ${className}`.trim()}>
        {children}
      </div>
      {after}
    </main>
  );
}
