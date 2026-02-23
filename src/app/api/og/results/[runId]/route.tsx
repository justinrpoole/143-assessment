import { ImageResponse } from "next/og";

import { supabaseRestFetch } from "@/lib/db/supabase-rest";
import archetypeBlocks from "@/data/archetype_blocks.json";
import { RAY_SHORT_NAMES } from "@/lib/types";
import type { ArchetypeBlock } from "@/lib/types";

const blocks = archetypeBlocks as ArchetypeBlock[];

/**
 * GET /api/og/results/[runId]
 *
 * Generates a dynamic 1200×630 OG image for sharing assessment results.
 * Shows archetype name, top two ray names, and overall score.
 *
 * No auth required — the run_id itself is unguessable.
 * Cached for 1 hour at the edge.
 */

export const runtime = "edge";

interface ResultRow {
  ray_pair_id: string;
  top_rays: string[];
  ray_scores: Record<string, number> | null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ runId: string }> },
) {
  const { runId } = await params;

  // Fetch minimal result data
  const res = await supabaseRestFetch<ResultRow[]>({
    restPath: "assessment_results",
    query: {
      select: "ray_pair_id,top_rays,ray_scores",
      run_id: `eq.${runId}`,
      limit: 1,
    },
  });

  const row = res.data?.[0];

  // Fallback OG image if no data
  const pairCode = row?.ray_pair_id ?? "R1-R5";
  const topRays = Array.isArray(row?.top_rays) ? row.top_rays : [];
  const archetype = blocks.find((b) => b.pair_code === pairCode);
  const archetypeName = archetype?.name ?? "Light Signature";

  const ray1Name = RAY_SHORT_NAMES[topRays[0]] ?? "Intention";
  const ray2Name = RAY_SHORT_NAMES[topRays[1]] ?? "Purpose";

  // Compute overall score
  let overallScore = 0;
  if (row?.ray_scores) {
    const scores = Object.values(row.ray_scores);
    if (scores.length > 0) {
      overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #020202 0%, #1a0a2e 40%, #060212 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cosmic glow effect */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(96, 5, 141, 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Gold accent line */}
        <div
          style={{
            width: "80px",
            height: "3px",
            background: "#F8D011",
            borderRadius: "2px",
            marginBottom: "24px",
          }}
        />

        {/* "Your Light Signature" label */}
        <p
          style={{
            fontSize: "16px",
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            color: "#F8D011",
            marginBottom: "12px",
          }}
        >
          Your Light Signature
        </p>

        {/* Archetype name */}
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#FDFCFD",
            marginBottom: "16px",
            textAlign: "center" as const,
            lineHeight: 1.1,
          }}
        >
          {archetypeName}
        </h1>

        {/* Ray pair */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "18px",
              fontWeight: 600,
              background: "rgba(248, 208, 17, 0.12)",
              color: "#F8D011",
              border: "1px solid rgba(248, 208, 17, 0.25)",
            }}
          >
            {ray1Name}
          </span>
          <span
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "18px",
              fontWeight: 600,
              background: "rgba(148, 80, 200, 0.15)",
              color: "#C39BD3",
              border: "1px solid rgba(148, 80, 200, 0.25)",
            }}
          >
            {ray2Name}
          </span>
        </div>

        {/* Score */}
        {overallScore > 0 && (
          <p
            style={{
              fontSize: "14px",
              color: "rgba(253, 252, 253, 0.5)",
              marginBottom: "8px",
            }}
          >
            Overall Stability: {overallScore}
          </p>
        )}

        {/* Brand */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: "rgba(253, 252, 253, 0.4)",
            }}
          >
            143 Leadership Assessment
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    },
  );
}
