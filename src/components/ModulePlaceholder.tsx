interface ModulePlaceholderProps {
  name: string;
}

export function ModulePlaceholder({ name }: ModulePlaceholderProps) {
  return (
    <section
      className="glass-card p-6 space-y-3"
      aria-label={name}
      style={{ borderColor: "rgba(96, 5, 141, 0.15)" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: "var(--brand-gold, #F8D011)" }}
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
