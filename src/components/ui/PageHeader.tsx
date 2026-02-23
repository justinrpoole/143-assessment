import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Gold uppercase label above the title (e.g. "Portal", "Daily Practice") */
  label?: string;
  /** Main heading text */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Use larger title styling (3xl/4xl) for feature pages like Results and Growth */
  size?: "default" | "large";
  /** Extra content rendered after the description (e.g. IntentionRecall, metadata) */
  children?: ReactNode;
  /** Override bottom margin — defaults to "mb-6" */
  className?: string;
}

export function PageHeader({
  label,
  title,
  description,
  size = "default",
  children,
  className = "mb-6",
}: PageHeaderProps) {
  const titleClass =
    size === "large"
      ? "text-3xl font-semibold sm:text-4xl"
      : "text-2xl font-semibold";

  return (
    <header className={`glass-card p-6 sm:p-8 ${className}`}>
      {label && (
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--brand-gold, #F8D011)" }}
        >
          {label}
        </p>
      )}
      <h1
        className={`${label ? "mt-2" : ""} ${titleClass}`}
        style={{ color: "var(--text-on-dark)" }}
      >
        {title}
      </h1>
      {description && (
        <p
          className={`mt-2 text-sm leading-relaxed ${size === "large" ? "max-w-3xl" : ""}`}
          style={{ color: "var(--text-on-dark-secondary)" }}
        >
          {description}
        </p>
      )}
      {children}
    </header>
  );
}
