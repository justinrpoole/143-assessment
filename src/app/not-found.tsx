import Link from "next/link";

export const metadata = {
  title: "Page Not Found — 143 Leadership",
  description: "The page you are looking for does not exist or has moved.",
};

export default function NotFound() {
  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-center justify-center px-5 py-16 text-center">
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--brand-gold, #F8D011)" }}
        >
          404
        </p>
        <h1
          className="mt-3 text-2xl font-semibold"
          style={{ color: "var(--text-on-dark, #FFFEF5)" }}
        >
          This page does not exist.
        </h1>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "var(--text-on-dark-secondary, rgba(255,255,255,0.70))" }}
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
            className="rounded-lg px-5 py-2.5 text-sm font-semibold"
            style={{
              border: "1px solid var(--brand-gold, #F8D011)",
              color: "var(--brand-gold, #F8D011)",
            }}
          >
            Take the Stability Check
          </Link>
        </div>
      </div>
    </main>
  );
}
