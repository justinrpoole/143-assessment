import { NextRequest, NextResponse } from "next/server";

import {
  coerceAssessmentData,
  createSampleAssessmentData,
  fetchGravitationalAssessmentData,
  generateGravitationalStabilityPdf,
} from "@/lib/report/gravitational-stability";

export const runtime = "nodejs";

interface PdfRequestBody {
  userId?: string;
  assessmentData?: unknown;
}

function pdfResponse(pdfBytes: Uint8Array) {
  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="gravitational-stability-report.pdf"',
      "Cache-Control": "no-store",
    },
  });
}

async function resolveAssessmentData(input: {
  userId?: string;
  providedAssessmentData?: unknown;
}) {
  const { userId, providedAssessmentData } = input;
  const seededFallback = createSampleAssessmentData(userId);

  if (providedAssessmentData) {
    return {
      data: coerceAssessmentData(providedAssessmentData, seededFallback),
      source: "provided" as const,
    };
  }

  if (userId) {
    const fromDb = await fetchGravitationalAssessmentData(userId);
    if (fromDb) {
      return { data: fromDb, source: "database" as const };
    }
  }

  return { data: seededFallback, source: "sample" as const };
}

export async function POST(request: NextRequest) {
  let body: PdfRequestBody;

  try {
    body = (await request.json()) as PdfRequestBody;
  } catch {
    body = {};
  }

  try {
    const resolved = await resolveAssessmentData({
      userId: typeof body.userId === "string" ? body.userId : undefined,
      providedAssessmentData: body.assessmentData,
    });

    const pdfBytes = await generateGravitationalStabilityPdf(resolved.data);
    return pdfResponse(pdfBytes);
  } catch (error) {
    return NextResponse.json(
      {
        error: "pdf_generation_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? undefined;

  try {
    const resolved = await resolveAssessmentData({ userId });
    const pdfBytes = await generateGravitationalStabilityPdf(resolved.data);
    return pdfResponse(pdfBytes);
  } catch (error) {
    return NextResponse.json(
      {
        error: "pdf_generation_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
