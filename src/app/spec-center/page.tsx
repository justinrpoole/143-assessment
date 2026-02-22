import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { emitPageView } from "@/lib/analytics/emitter";
import { getUserStateFromRequest } from "@/lib/auth/user-state";
import {
  integratedDataArchitecture,
  integratedDocs,
  integratedPolicies,
  integratedRoadmap,
  integratedSpecGeneratedAt,
  runDriftCheck,
} from "../../lib/spec-integration";

// Access policy: development allows /spec-center without a key for local diagnostics.
// Production requires ?key=ENV_SPEC_CENTER_KEY; invalid/missing keys return 404.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const uiSurfaceSamples = [
  "Run your system on purpose.",
  "State -> System -> Rays -> Ripple",
  "No labels. No destiny claims.",
  "Developmental, not diagnostic.",
  "Bottom Ray training focus",
];

type SearchParams = Record<string, string | string[] | undefined>;

interface SpecCenterPageProps {
  searchParams?: Promise<SearchParams> | SearchParams;
}

function firstValue(input: string | string[] | undefined): string | null {
  if (typeof input === "string") {
    return input;
  }
  if (Array.isArray(input)) {
    return input[0] ?? null;
  }
  return null;
}

async function resolveSearchParams(
  value: SpecCenterPageProps["searchParams"],
): Promise<SearchParams> {
  if (!value) {
    return {};
  }

  if (typeof (value as Promise<SearchParams>).then === "function") {
    return (await value) ?? {};
  }

  return value;
}

export default async function SpecCenterPage({ searchParams }: SpecCenterPageProps) {
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const keyFromQuery = firstValue(resolvedSearchParams.key);
  const requiredProdKey = process.env.ENV_SPEC_CENTER_KEY;
  const isProd = process.env.NODE_ENV === "production";

  // Chosen behavior: in development, allow access without key for local diagnostics.
  // In production, require ?key=ENV_SPEC_CENTER_KEY and fail closed with 404 otherwise.
  const hasValidKey = Boolean(requiredProdKey && keyFromQuery === requiredProdKey);
  const accessAllowed = !isProd || hasValidKey;
  if (!accessAllowed) {
    notFound();
  }

  const userState = await getUserStateFromRequest();
  emitPageView({
    eventName: "page_view_spec_center",
    sourceRoute: "/spec-center",
    userState,
    entrySource: isProd ? "key" : "dev",
  });

  const drift = runDriftCheck(uiSurfaceSamples);

  return (
    <main className="cosmic-page-bg">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <header className="glass-card p-6 mb-6 sm:p-8">
          <p className="chip mb-3">Spec Center</p>
          <h1 className="text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--text-on-dark)' }}>Integrated Source-of-Truth Runtime</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Every required markdown/CSV source is parsed into runtime policy and exposed here.
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Last sync: {new Date(integratedSpecGeneratedAt).toLocaleString()}
          </p>
        </header>

        <section className="glass-card p-6 mb-6 sm:p-8">
          <p className="step-tag">Sequence + Tone</p>
          <div className="grid gap-3 md:grid-cols-4">
            <article className="offer-card">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>Sequence Lock</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{integratedPolicies.sequence}</p>
            </article>
            <article className="offer-card">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>Notification Cap</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {integratedPolicies.retention.maxNotificationsPerDay}/day
              </p>
            </article>
            <article className="offer-card">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>Forbidden Terms</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {integratedPolicies.governance.qaForbiddenTerms.join(', ')}
              </p>
            </article>
            <article className="offer-card">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>IA Public Routes</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {integratedPolicies.iaPublicRoutes.length} routes parsed
              </p>
            </article>
          </div>
        </section>

        <section className="glass-card p-6 mb-6 sm:p-8">
          <p className="step-tag">Governance Signals</p>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Safeguards parsed from the integrated executive portal specification.
          </p>
          <ul className="mt-3 space-y-2 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {integratedPolicies.governance.executiveSafeguards.slice(0, 4).map((line) => (
              <li key={line}>- {line}</li>
            ))}
          </ul>
        </section>

        <section className="glass-card p-6 mb-6 sm:p-8">
          <p className="step-tag">Drift Check</p>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            UI surface scan against integrated QA forbidden-term rules.
          </p>
          <p className={`mt-2 text-sm font-semibold ${drift.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
            {drift.passed ? "PASS" : `FAIL (${drift.violations.length} violations)`}
          </p>
          {!drift.passed && (
            <ul className="mt-2 space-y-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {drift.violations.map((violation, idx) => (
                <li key={`${violation.term}-${idx}`}>- {violation.term}: {violation.source}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass-card p-6 mb-6 sm:p-8">
          <p className="step-tag">Markdown Sources</p>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.values(integratedDocs).map((doc) => (
              <article key={doc.id} className="offer-card">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>{doc.file_name}</p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>Version: {doc.metadata.version || "n/a"}</p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>Word count: {doc.metadata.word_count || doc.computed_word_count}</p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>Sections: {doc.sections.length}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card p-6 mb-6 sm:p-8">
          <p className="step-tag">CSV Sources</p>
          <div className="grid gap-3 md:grid-cols-2">
            <article className="offer-card">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>04 Data Architecture</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>Rows: {integratedDataArchitecture.length}</p>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>Used in setup/results/dashboard/enterprise bindings.</p>
            </article>
            <article className="offer-card">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-on-dark-secondary)' }}>05 Feature Roadmap</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>Rows: {integratedRoadmap.length}</p>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>Used in pricing/coach/enterprise roadmap sections.</p>
            </article>
          </div>
        </section>

        <footer className="flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">Back Home</Link>
          <Link href="/portal" className="btn-watch">Portal</Link>
          <Link href="/enterprise" className="btn-watch">Enterprise</Link>
          <Link
            href={`/spec-center/report-preview${keyFromQuery ? `?key=${encodeURIComponent(keyFromQuery)}` : ""}`}
            className="btn-watch"
          >
            Report Preview
          </Link>
        </footer>
      </div>
    </main>
  );
}
