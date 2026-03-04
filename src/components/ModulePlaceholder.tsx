interface ModulePlaceholderProps {
  name: string;
}

export function ModulePlaceholder({ name }: ModulePlaceholderProps) {
  return (
    <section
      className="glass-card card-border-var p-6 space-y-3"
      aria-label={name}
      style={{ '--card-border': "1px solid color-mix(in srgb, var(--violet-650) 15%, transparent)" } as { ['--card-border']: string }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: "var(--gold-primary)" }}
        />
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--text-on-dark)" }}
        >
          {name}
        </h2>
      </div>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-on-dark-secondary)" }}
      >
        This module is being built. Your operating system keeps expanding —
        check back soon.
      </p>
    </section>
  );
}
