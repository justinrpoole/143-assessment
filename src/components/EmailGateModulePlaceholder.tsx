import Link from "next/link";

interface EmailGateModulePlaceholderProps {
  route: string;
  message?: string;
}

export function EmailGateModulePlaceholder({ route, message }: EmailGateModulePlaceholderProps) {
  return (
    <section
      className="glass-card card-border-var p-6 space-y-4"
      aria-label="Sign in to continue"
      style={{ '--card-border': "1px solid color-mix(in srgb, var(--gold-primary) 15%, transparent)" } as { ['--card-border']: string }}
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
          Sign in to unlock this
        </h2>
      </div>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-on-dark-secondary)" }}
      >
        {message ?? "This tool is part of your leadership OS. Sign in with your email to access it — no password needed."}
      </p>
      <Link
        href={`/login?next=${encodeURIComponent(route)}`}
        className="btn-primary inline-block text-sm py-2 px-5"
      >
        Sign in with email
      </Link>
    </section>
  );
}
