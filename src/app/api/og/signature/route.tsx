import { ImageResponse } from "next/og";

/**
 * GET /api/og/signature
 *
 * Generates a real 1080×1920 (Instagram Story) PNG image of a Light Signature card.
 * Query params: name, tagline, ray1, ray2, neonColor, identityCode
 *
 * Also supports 1200×630 landscape via ?format=og for social meta tags.
 *
 * No auth required — params are public archetype data.
 * Cached for 30 days at the edge (archetype data is static).
 */

export const runtime = "edge";

const RAY_HEX: Record<string, string> = {
  intention: "#60A5FA",
  joy: "#F4C430",
  presence: "#8E44AD",
  power: "#C0392B",
  purpose: "#D4770B",
  authenticity: "#2ECC71",
  connection: "#E74C8B",
  possibility: "#1ABC9C",
  "be the light": "#F8D011",
};

function getRayColor(rayName: string): string {
  return RAY_HEX[rayName.toLowerCase()] ?? "#F8D011";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get("name") ?? "Light Signature";
  const tagline = searchParams.get("tagline") ?? "";
  const ray1 = searchParams.get("ray1") ?? "Intention";
  const ray2 = searchParams.get("ray2") ?? "Purpose";
  const neonColor = searchParams.get("neonColor") ?? "#F8D011";
  const identityCode = searchParams.get("identityCode") ?? "";
  const format = searchParams.get("format") ?? "story";

  const ray1Hex = getRayColor(ray1);
  const ray2Hex = getRayColor(ray2);

  const isStory = format === "story";
  const width = isStory ? 1080 : 1200;
  const height = isStory ? 1920 : 630;

  return new ImageResponse(
    (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1E0E35 0%, #120825 50%, #1E0E35 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: isStory ? "15%" : "10%",
            left: "10%",
            width: isStory ? "500px" : "400px",
            height: isStory ? "500px" : "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ray1Hex}18 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: isStory ? "15%" : "10%",
            right: "10%",
            width: isStory ? "500px" : "400px",
            height: isStory ? "500px" : "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ray2Hex}15 0%, transparent 70%)`,
          }}
        />

        {/* Decorative rings */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isStory ? "600px" : "400px",
            height: isStory ? "600px" : "400px",
            borderRadius: "50%",
            border: `1px solid ${neonColor}10`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isStory ? "420px" : "280px",
            height: isStory ? "420px" : "280px",
            borderRadius: "50%",
            border: `1px solid ${neonColor}08`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isStory ? "240px" : "160px",
            height: isStory ? "240px" : "160px",
            borderRadius: "50%",
            border: `1px solid ${neonColor}06`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            padding: isStory ? "0 60px" : "0 40px",
          }}
        >
          {/* Brand mark */}
          <p
            style={{
              fontSize: isStory ? "14px" : "11px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.35)",
              marginBottom: isStory ? "60px" : "20px",
            }}
          >
            143 Leadership
          </p>

          {/* Ray pair */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isStory ? "24px" : "16px",
              marginBottom: isStory ? "32px" : "16px",
            }}
          >
            <span
              style={{
                fontSize: isStory ? "16px" : "13px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: ray1Hex,
              }}
            >
              {ray1}
            </span>
            <span
              style={{
                fontSize: isStory ? "16px" : "13px",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              +
            </span>
            <span
              style={{
                fontSize: isStory ? "16px" : "13px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: ray2Hex,
              }}
            >
              {ray2}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: isStory ? "80px" : "60px",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${neonColor}50, transparent)`,
              marginBottom: isStory ? "40px" : "16px",
            }}
          />

          {/* Archetype name */}
          <h1
            style={{
              fontSize: isStory ? "64px" : "48px",
              fontWeight: 700,
              color: "#F8D011",
              textAlign: "center" as const,
              lineHeight: 1.1,
              marginBottom: isStory ? "32px" : "12px",
              textShadow: `0 0 40px ${neonColor}30`,
            }}
          >
            {name}
          </h1>

          {/* Tagline */}
          {tagline && (
            <p
              style={{
                fontSize: isStory ? "22px" : "16px",
                color: "rgba(255,255,255,0.75)",
                textAlign: "center" as const,
                lineHeight: 1.6,
                maxWidth: isStory ? "700px" : "500px",
                marginBottom: isStory ? "40px" : "16px",
              }}
            >
              {tagline}
            </p>
          )}

          {/* Identity code */}
          {identityCode && (
            <p
              style={{
                fontSize: isStory ? "14px" : "11px",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase" as const,
                color: `${neonColor}90`,
                marginBottom: isStory ? "48px" : "20px",
              }}
            >
              {identityCode}
            </p>
          )}

          {/* Ray color bar */}
          <div
            style={{
              display: "flex",
              width: isStory ? "160px" : "120px",
              height: isStory ? "4px" : "3px",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: isStory ? "60px" : "24px",
            }}
          >
            <div style={{ flex: 1, background: ray1Hex }} />
            <div style={{ flex: 1, background: ray2Hex }} />
          </div>

          {/* URL */}
          <p
            style={{
              fontSize: isStory ? "13px" : "10px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            143leadership.com/archetypes
          </p>
        </div>
      </div>
    ),
    {
      width,
      height,
      headers: {
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000",
        "Content-Type": "image/png",
      },
    },
  );
}
