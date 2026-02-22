function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function gradientFor(type) {
  if (type === "morning") {
    return ["#F8D011", "#60058D"];
  }
  if (type === "growth") {
    return ["#60058D", "#020202"];
  }
  return ["#60058D", "#F8D011"];
}

function titleFor(type) {
  if (type === "morning") {
    return "Morning Rep";
  }
  if (type === "growth") {
    return "Growth Snapshot";
  }
  return "Results Snapshot";
}

export function generateSharecard({ type, payload }) {
  const [start, end] = gradientFor(type);
  const title = titleFor(type);
  const lineA = payload.ray_pair_id
    ? `Pair: ${payload.ray_pair_id}`
    : "143 Leadership";
  const lineB = Array.isArray(payload.top_rays) && payload.top_rays.length > 0
    ? `Top Rays: ${payload.top_rays.join(" + ")}`
    : payload.short_line || "One clear rep at a time.";
  const lineC = payload.short_line || "We don’t become. We build the muscle.";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${start}" />
      <stop offset="100%" stop-color="${end}" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1200" height="630" fill="url(#bg)" />
  <rect x="48" y="48" width="1104" height="534" rx="24" fill="#FDFCFD" fill-opacity="0.96" />
  <text x="90" y="150" font-family="Avenir Next, Segoe UI, sans-serif" font-size="54" font-weight="700" fill="#020202">
    ${escapeXml(title)}
  </text>
  <text x="90" y="250" font-family="Avenir Next, Segoe UI, sans-serif" font-size="40" font-weight="600" fill="#60058D">
    ${escapeXml(lineA)}
  </text>
  <text x="90" y="320" font-family="Avenir Next, Segoe UI, sans-serif" font-size="34" font-weight="500" fill="#020202">
    ${escapeXml(lineB)}
  </text>
  <text x="90" y="420" font-family="Avenir Next, Segoe UI, sans-serif" font-size="30" font-weight="400" fill="#020202">
    ${escapeXml(lineC)}
  </text>
  <text x="90" y="540" font-family="Avenir Next, Segoe UI, sans-serif" font-size="22" font-weight="600" fill="#60058D">
    143leadership.com
  </text>
</svg>`;

  const bytes = new TextEncoder().encode(svg);
  return {
    contentType: "image/svg+xml",
    bytes,
    extension: "svg",
  };
}
