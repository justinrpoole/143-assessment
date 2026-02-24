import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/auth/admin";
import { supabaseRestFetch } from "@/lib/db/supabase-rest";

export const dynamic = "force-dynamic";

interface AuditRow {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  completed_at: string | null;
  scorer_version: string | null;
  input_hash: string | null;
  output_hash: string | null;
}

export async function GET() {
  const admin = await isAdminRequest();
  if (!admin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Fetch completed runs with signature pairs
  const runsResponse = await supabaseRestFetch<AuditRow[]>({
    restPath: "assessment_runs",
    query: {
      select:
        "id,user_id,status,created_at,completed_at",
      status: "eq.completed",
      order: "completed_at.desc",
      limit: 100,
    },
  });

  if (!runsResponse.ok) {
    return NextResponse.json(
      { error: runsResponse.error ?? "fetch_failed" },
      { status: 500 },
    );
  }

  const runs = runsResponse.data ?? [];

  // Fetch signature pairs for these runs
  const runIds = runs.map((r) => r.id);
  const signaturePairs: Record<
    string,
    { scorer_version: string; input_hash: string; output_hash: string }
  > = {};

  if (runIds.length > 0) {
    const sigResponse = await supabaseRestFetch<
      Array<{
        assessment_run_id: string;
        scorer_version: string;
        input_hash: string;
        output_hash: string;
      }>
    >({
      restPath: "signature_pairs",
      query: {
        select: "assessment_run_id,scorer_version,input_hash,output_hash",
        assessment_run_id: `in.(${runIds.join(",")})`,
      },
    });

    if (sigResponse.ok && sigResponse.data) {
      for (const row of sigResponse.data) {
        signaturePairs[row.assessment_run_id] = {
          scorer_version: row.scorer_version,
          input_hash: row.input_hash,
          output_hash: row.output_hash,
        };
      }
    }
  }

  // Compute beta stats
  const totalResponse = await supabaseRestFetch<Array<{ count: number }>>({
    restPath: "assessment_runs",
    query: {
      select: "count",
    },
    prefer: "count=exact",
  });

  const completedCount = runs.length;
  const totalCount =
    totalResponse.ok && totalResponse.data?.[0]
      ? totalResponse.data[0].count
      : 0;

  // Average completion time
  let avgCompletionMinutes: number | null = null;
  const completionTimes = runs
    .filter((r) => r.created_at && r.completed_at)
    .map((r) => {
      const start = new Date(r.created_at).getTime();
      const end = new Date(r.completed_at!).getTime();
      return (end - start) / 60000; // minutes
    })
    .filter((t) => t > 0 && t < 480); // filter outliers (>8 hours)

  if (completionTimes.length > 0) {
    avgCompletionMinutes =
      Math.round(
        (completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length) *
          10,
      ) / 10;
  }

  // Build audit rows
  const auditRows = runs.map((run) => {
    const sig = signaturePairs[run.id];
    return {
      run_id: run.id,
      user_id: run.user_id,
      status: run.status,
      created_at: run.created_at,
      completed_at: run.completed_at,
      scorer_version: sig?.scorer_version ?? null,
      input_hash: sig?.input_hash ?? null,
      output_hash: sig?.output_hash ?? null,
      has_signature: Boolean(sig),
    };
  });

  return NextResponse.json({
    stats: {
      total_runs: totalCount,
      completed_runs: completedCount,
      avg_completion_minutes: avgCompletionMinutes,
    },
    runs: auditRows,
  });
}
