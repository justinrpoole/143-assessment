import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import {
  getReportForRun,
  getRunForUser,
  upsertPdfReport,
} from "@/lib/db/assessment-runs";
import { renderReportPdf } from "@/lib/report/render-report-pdf.mjs";
import {
  getSignedUrl,
  uploadBytes,
} from "@/lib/storage/supabase-storage";

interface RouteParams {
  params: Promise<{ runId: string }> | { runId: string };
}

const PDF_SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;

async function resolveRunId(params: RouteParams["params"]): Promise<string> {
  if (typeof (params as Promise<{ runId: string }>).then === "function") {
    const resolved = await (params as Promise<{ runId: string }>);
    return resolved.runId;
  }
  return (params as { runId: string }).runId;
}

function pdfStoragePath(userId: string, runId: string): string {
  return `reports/${userId}/${runId}/report_v1.pdf`;
}

async function buildSignedPdfResponse(path: string) {
  const signed = await getSignedUrl({
    bucket: "reports",
    path,
    expiresSeconds: PDF_SIGNED_URL_TTL_SECONDS,
  });
  if (!signed.ok) {
    if (signed.error === "storage_not_configured") {
      return NextResponse.json(
        { error: "storage_not_configured" },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "signed_url_failed", detail: signed.error },
      { status: 500 },
    );
  }

  return NextResponse.json({
    status: "ready",
    storage_path: path,
    signed_url: signed.signedUrl,
    expires_in: signed.expiresSeconds,
  });
}

export async function POST(_request: Request, context: RouteParams) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const runId = await resolveRunId(context.params);

  try {
    const run = await getRunForUser(runId, auth.userId);
    if (!run) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const existingPdf = await getReportForRun({
      runId,
      userId: auth.userId,
      format: "pdf",
    });
    if (
      existingPdf &&
      existingPdf.status === "ready" &&
      typeof existingPdf.storage_path === "string" &&
      existingPdf.storage_path.length > 0
    ) {
      emitEvent({
        eventName: "report_download",
        sourceRoute: "/reports",
        userState: auth.userState,
        userId: auth.userId,
        extra: {
          run_id: runId,
          artifact_type: "pdf",
          delivery_mode: "signed_url",
        },
      });
      return buildSignedPdfResponse(existingPdf.storage_path);
    }

    const htmlReport = await getReportForRun({
      runId,
      userId: auth.userId,
      format: "html",
    });
    if (!htmlReport || htmlReport.status !== "ready" || !htmlReport.html) {
      return NextResponse.json(
        { error: "html_report_not_ready" },
        { status: 409 },
      );
    }

    await upsertPdfReport({
      runId,
      userId: auth.userId,
      status: "pending",
      meta: { stage: "queued" },
    });
    emitEvent({
      eventName: "report_pdf_job_enqueued",
      sourceRoute: "/reports",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        run_id: runId,
        artifact_version: "v1",
      },
    });

    let pdfBytes: Buffer;
    try {
      pdfBytes = await renderReportPdf({ html: htmlReport.html });
    } catch (renderError) {
      await upsertPdfReport({
        runId,
        userId: auth.userId,
        status: "failed",
        meta: {
          error: renderError instanceof Error ? renderError.message : String(renderError),
        },
      });
      const message =
        renderError instanceof Error ? renderError.message : String(renderError);
      emitEvent({
        eventName: "report_pdf_job_failed",
        sourceRoute: "/reports",
        userState: auth.userState,
        userId: auth.userId,
        extra: {
          run_id: runId,
          artifact_version: "v1",
          attempt_count: 1,
          error_code: message.slice(0, 128),
        },
      });
      if (message.includes("playwright_not_installed")) {
        return NextResponse.json(
          { error: "pdf_renderer_not_available", detail: message },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "pdf_generation_failed", detail: message },
        { status: 500 },
      );
    }

    const storagePath = pdfStoragePath(auth.userId, runId);
    const upload = await uploadBytes({
      bucket: "reports",
      path: storagePath,
      contentType: "application/pdf",
      bytes: pdfBytes,
    });
    if (!upload.ok) {
      await upsertPdfReport({
        runId,
        userId: auth.userId,
        status: "failed",
        meta: { error: upload.error },
      });
      emitEvent({
        eventName: "report_pdf_job_failed",
        sourceRoute: "/reports",
        userState: auth.userState,
        userId: auth.userId,
        extra: {
          run_id: runId,
          artifact_version: "v1",
          attempt_count: 1,
          error_code: String(upload.error).slice(0, 128),
        },
      });
      if (upload.error === "storage_not_configured") {
        return NextResponse.json(
          { error: "storage_not_configured" },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "pdf_upload_failed", detail: upload.error },
        { status: 500 },
      );
    }

    await upsertPdfReport({
      runId,
      userId: auth.userId,
      status: "ready",
      storagePath,
      meta: { generated_at: new Date().toISOString() },
    });
    emitEvent({
      eventName: "report_pdf_job_ready",
      sourceRoute: "/reports",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        run_id: runId,
        artifact_version: "v1",
        pdf_size_bytes: pdfBytes.byteLength,
      },
    });
    emitEvent({
      eventName: "report_download",
      sourceRoute: "/reports",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        run_id: runId,
        artifact_type: "pdf",
        delivery_mode: "signed_url",
      },
    });

    return buildSignedPdfResponse(storagePath);
  } catch (error) {
    return NextResponse.json(
      {
        error: "pdf_report_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(_request: Request, context: RouteParams) {
  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const runId = await resolveRunId(context.params);

  try {
    const run = await getRunForUser(runId, auth.userId);
    if (!run) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const pdfReport = await getReportForRun({
      runId,
      userId: auth.userId,
      format: "pdf",
    });
    if (!pdfReport) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (
      pdfReport.status === "ready" &&
      typeof pdfReport.storage_path === "string" &&
      pdfReport.storage_path.length > 0
    ) {
      emitEvent({
        eventName: "report_download",
        sourceRoute: "/reports",
        userState: auth.userState,
        userId: auth.userId,
        extra: {
          run_id: runId,
          artifact_type: "pdf",
          delivery_mode: "signed_url",
        },
      });
      return buildSignedPdfResponse(pdfReport.storage_path);
    }

    return NextResponse.json({
      status: pdfReport.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "pdf_report_status_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
