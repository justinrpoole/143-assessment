"use client";

import { useMemo, useState } from "react";

interface ReportPreviewToolProps {
  pairIds: string[];
  fixtureIds: string[];
  queryKey: string | null;
  defaultPairId: string;
}

type SourceMode = "pair" | "fixture";

interface HtmlResponsePayload {
  ok?: boolean;
  html?: string;
  ray_pair_id?: string;
  top_rays?: string[];
  error?: string;
  detail?: string;
}

interface PdfResponsePayload {
  ok?: boolean;
  signed_url?: string;
  storage_path?: string;
  error?: string;
  detail?: string;
}

function buildQuery(params: {
  mode: SourceMode;
  pairId: string;
  fixtureId: string;
  key: string | null;
  format: "html" | "pdf";
}) {
  const search = new URLSearchParams();
  search.set("format", params.format);
  if (params.mode === "pair") {
    search.set("pair", params.pairId);
  } else {
    search.set("fixture", params.fixtureId);
  }
  if (params.key) {
    search.set("key", params.key);
  }
  return search.toString();
}

export function ReportPreviewTool({
  pairIds,
  fixtureIds,
  queryKey,
  defaultPairId,
}: ReportPreviewToolProps) {
  const [mode, setMode] = useState<SourceMode>("pair");
  const [pairId, setPairId] = useState<string>(defaultPairId);
  const [fixtureId, setFixtureId] = useState<string>(fixtureIds[0] ?? "");
  const [html, setHtml] = useState<string>("");
  const [htmlMeta, setHtmlMeta] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [pdfPath, setPdfPath] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loadingHtml, setLoadingHtml] = useState<boolean>(false);
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);

  const canRenderFixture = useMemo(() => fixtureIds.length > 0, [fixtureIds.length]);

  async function onRenderHtml() {
    setLoadingHtml(true);
    setError("");
    setPdfUrl("");
    setPdfPath("");
    try {
      const response = await fetch(
        `/api/spec-center/report-preview?${buildQuery({
          mode,
          pairId,
          fixtureId,
          key: queryKey,
          format: "html",
        })}`,
      );
      const payload = (await response.json().catch(() => ({}))) as HtmlResponsePayload;
      if (!response.ok || !payload.html) {
        setError(payload.error ?? "report_preview_html_failed");
        return;
      }
      const topRays = Array.isArray(payload.top_rays) ? payload.top_rays.join(" + ") : "";
      setHtml(payload.html);
      setHtmlMeta(
        payload.ray_pair_id
          ? `Ray Pair: ${payload.ray_pair_id}${topRays ? ` | Top Rays: ${topRays}` : ""}`
          : "Report preview ready",
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "report_preview_html_failed",
      );
    } finally {
      setLoadingHtml(false);
    }
  }

  async function onGeneratePdf() {
    setLoadingPdf(true);
    setError("");
    try {
      const response = await fetch(
        `/api/spec-center/report-preview?${buildQuery({
          mode,
          pairId,
          fixtureId,
          key: queryKey,
          format: "pdf",
        })}`,
      );
      const payload = (await response.json().catch(() => ({}))) as PdfResponsePayload;
      if (!response.ok || !payload.signed_url) {
        setError(payload.error ?? "report_preview_pdf_failed");
        return;
      }
      setPdfUrl(payload.signed_url);
      setPdfPath(payload.storage_path ?? "");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "report_preview_pdf_failed",
      );
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <section className="glass-card p-6 sm:p-8">
      <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>Test Report Preview</h2>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
        Render report HTML instantly from a ray pair or a seed fixture. No full assessment run required.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="offer-card">
          <p className="text-xs uppercase tracking-wide text-[var(--ink-soft)]">Source</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="source_mode"
                checked={mode === "pair"}
                onChange={() => setMode("pair")}
              />
              Ray Pair
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="source_mode"
                checked={mode === "fixture"}
                disabled={!canRenderFixture}
                onChange={() => setMode("fixture")}
              />
              Fixture
            </label>
          </div>
        </article>

        <article className="offer-card">
          {mode === "pair" ? (
            <>
              <p className="text-xs uppercase tracking-wide text-[var(--ink-soft)]">Ray Pair</p>
              <select
                className="mt-2 w-full rounded border border-[var(--line)] px-3 py-2 text-sm"
                value={pairId}
                onChange={(event) => setPairId(event.target.value)}
              >
                {pairIds.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-wide text-[var(--ink-soft)]">Fixture</p>
              <select
                className="mt-2 w-full rounded border border-[var(--line)] px-3 py-2 text-sm"
                value={fixtureId}
                onChange={(event) => setFixtureId(event.target.value)}
              >
                {fixtureIds.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </>
          )}
        </article>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-primary"
          disabled={loadingHtml}
          onClick={() => void onRenderHtml()}
        >
          {loadingHtml ? "Rendering..." : "Render HTML"}
        </button>
        <button
          type="button"
          className="btn-watch"
          disabled={loadingPdf}
          onClick={() => void onGeneratePdf()}
        >
          {loadingPdf ? "Generating..." : "Generate PDF"}
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}

      {htmlMeta ? (
        <p className="mt-4 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{htmlMeta}</p>
      ) : null}

      {html ? (
        <iframe
          title="Report preview HTML"
          className="mt-3 h-[620px] w-full rounded-lg border bg-[#0d0d1a]"
          style={{ borderColor: 'var(--surface-border)' }}
          srcDoc={html}
        />
      ) : null}

      {pdfUrl ? (
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          PDF ready:
          {" "}
          <a
            href={pdfUrl}
            className="font-semibold underline"
            target="_blank"
            rel="noreferrer"
          >
            Open signed URL
          </a>
          {pdfPath ? ` (${pdfPath})` : ""}
        </p>
      ) : null}
    </section>
  );
}
