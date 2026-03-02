"use client";

import { useState } from "react";

interface Props {
  runId: string;
}

type DownloadState = "idle" | "checking" | "pending" | "error";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 20;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ReportDownloadButton({ runId }: Props) {
  const [state, setState] = useState<DownloadState>("idle");

  async function pollPdfStatus(): Promise<string | null> {
    for (let attempt = 0; attempt < MAX_POLLS; attempt += 1) {
      const response = await fetch(`/api/runs/${encodeURIComponent(runId)}/report/pdf`, {
        method: "GET",
      });

      if (response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          status?: string;
          signed_url?: string;
        };
        if (typeof data.signed_url === "string" && data.signed_url.length > 0) {
          return data.signed_url;
        }
      }

      setState("pending");
      await sleep(POLL_INTERVAL_MS);
    }

    return null;
  }

  async function handleDownload() {
    setState("checking");
    try {
      const signedUrl = await pollPdfStatus();
      if (!signedUrl) {
        throw new Error("pdf_not_ready");
      }
      window.open(signedUrl, "_blank", "noopener,noreferrer");
      setState("idle");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleDownload()}
      disabled={state === "checking" || state === "pending"}
      className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-200"
      style={{
        background: "#F8D011",
        color: "#020202",
        boxShadow: "0 0 24px rgba(248,208,17,0.25), 0 0 60px rgba(248,208,17,0.10)",
        opacity: state === "checking" || state === "pending" ? 0.8 : 1,
        cursor: state === "checking" || state === "pending" ? "wait" : "pointer",
      }}
    >
      {state === "checking"
        ? "Checking PDF…"
        : state === "pending"
          ? "PDF processing…"
          : state === "error"
            ? "PDF not ready — try again"
            : "Download Gravitational Stability Report (PDF)"}
    </button>
  );
}
