import Link from "next/link";

export const metadata = {
  title: "Page Not Found — 143 Leadership",
  description: "The page you are looking for does not exist or has moved.",
};

export default function NotFound() {
  return (
    <main className="cosmic-page-bg page-shell">
      <div className="content-wrap--narrow flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--gold-primary)" }}
        >
          404
        </p>
        <h1
          className="mt-3 text-2xl font-semibold"
          style={{ color: "var(--text-body)" }}
        >
          This page does not exist.
        </h1>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          The light is still there — just not at this address. Head back to see
          where your leadership capacities stand.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/upgrade-your-os" className="btn-primary text-sm font-semibold">
            Go Home
          </Link>
          <Link
            href="/preview"
            className="cta-secondary text-sm font-semibold"
          >
            Take the Stability Check
          </Link>
        </div>
      </div>
    </main>
  );
}
