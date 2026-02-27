import { NextResponse } from "next/server";

import { supabaseRestFetch } from "@/lib/db/supabase-rest";

export const dynamic = "force-dynamic";

interface HealthCheck {
  status: "ok" | "error";
  latencyMs?: number;
  error?: string;
}

export async function GET() {
  const checks: Record<string, HealthCheck> = {};
  let healthy = true;

  // Database connectivity
  const dbStart = Date.now();
  try {
    await supabaseRestFetch({
      restPath: "app_users",
      query: { select: "id", limit: 1 },
    });
    checks.database = { status: "ok", latencyMs: Date.now() - dbStart };
  } catch (error) {
    healthy = false;
    checks.database = {
      status: "error",
      latencyMs: Date.now() - dbStart,
      error: error instanceof Error ? error.message : "unknown",
    };
  }

  // Environment completeness
  const requiredVars = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "MAGIC_LINK_SECRET",
  ];
  const missingVars = requiredVars.filter((v) => !process.env[v]);
  if (missingVars.length > 0) {
    healthy = false;
    checks.environment = { status: "error", error: `Missing: ${missingVars.join(", ")}` };
  } else {
    checks.environment = { status: "ok" };
  }

  // Stripe (optional but reported)
  if (process.env.STRIPE_SECRET_KEY) {
    checks.stripe = { status: "ok" };
  } else {
    checks.stripe = { status: "error", error: "STRIPE_SECRET_KEY not configured" };
  }

  const statusCode = healthy ? 200 : 503;
  return NextResponse.json(
    { status: healthy ? "healthy" : "degraded", checks },
    { status: statusCode },
  );
}
