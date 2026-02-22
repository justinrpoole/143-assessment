import process from "node:process";

function resolveBaseUrl() {
  const raw =
    process.env.STAGING_BASE_URL ??
    process.env.QA_STAGING_BASE_URL ??
    process.env.APP_BASE_URL ??
    null;
  if (!raw) {
    return null;
  }
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function truthy(value) {
  if (!value) {
    return false;
  }
  const normalized = String(value).trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function makeHeaders(params = {}) {
  const headers = { ...params };
  const authCookie = process.env.STAGING_AUTH_COOKIE;
  if (authCookie) {
    headers.Cookie = authCookie;
  }
  return headers;
}

async function requestJson(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    ...options,
  });

  const raw = await response.text();
  let parsed = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  }

  return {
    status: response.status,
    location: response.headers.get("location"),
    body: parsed,
    raw,
  };
}

function record(results, row) {
  results.push(row);
}

function passIf(status, allowed) {
  return allowed.includes(status);
}

async function run() {
  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    console.log("qa:staging-smoke SKIPPED");
    console.log(
      "Reason: missing STAGING_BASE_URL (or QA_STAGING_BASE_URL / APP_BASE_URL).",
    );
    return;
  }

  const hasAuthHarness = Boolean(process.env.STAGING_AUTH_COOKIE);
  const results = [];

  // Contract checks first: unauth behavior.
  {
    const portal = await requestJson(baseUrl, "/portal", { method: "GET" });
    const portalPass =
      passIf(portal.status, [307, 308]) &&
      typeof portal.location === "string" &&
      portal.location.startsWith("/login");
    record(results, {
      step: "unauth /portal",
      expected: "307/308 -> /login",
      actual: `${portal.status}${portal.location ? ` (${portal.location})` : ""}`,
      pass: portalPass,
    });
  }

  {
    const draft = await requestJson(baseUrl, "/api/runs/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context_scope: "work",
        focus_area: "clarity",
        source_route: "/assessment/setup",
      }),
    });
    const draftPass = passIf(draft.status, [401]);
    record(results, {
      step: "unauth /api/runs/draft",
      expected: "401",
      actual: String(draft.status),
      pass: draftPass,
    });
  }

  {
    const checkout = await requestJson(baseUrl, "/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "paid_43" }),
    });
    const checkoutPass = passIf(checkout.status, [401, 503]);
    record(results, {
      step: "unauth /api/stripe/checkout",
      expected: "401 or 503",
      actual: String(checkout.status),
      pass: checkoutPass,
    });
  }

  // Ordered key endpoint sequence.
  {
    let previewStart = await requestJson(baseUrl, "/preview/start", {
      method: "POST",
      headers: makeHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ source_route: "/preview" }),
    });
    let previewPathUsed = "/preview/start";
    if (previewStart.status === 404) {
      previewStart = await requestJson(baseUrl, "/api/preview/start", {
        method: "POST",
        headers: makeHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ source_route: "/preview" }),
      });
      previewPathUsed = "/api/preview/start";
    }
    const previewPass =
      previewStart.status === 200 &&
      typeof previewStart.body?.preview_run_id === "string";
    record(results, {
      step: `1) ${previewPathUsed}`,
      expected: "200 with preview_run_id",
      actual: String(previewStart.status),
      pass: previewPass,
    });
  }

  {
    const checkout = await requestJson(baseUrl, "/api/stripe/checkout", {
      method: "POST",
      headers: makeHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        mode: "paid_43",
        successUrl: "/portal",
        cancelUrl: "/upgrade",
      }),
    });

    const checkoutHasUrl =
      checkout.status === 200 && typeof checkout.body?.url === "string";
    const checkoutPass =
      checkout.status === 503 ||
      checkoutHasUrl ||
      (checkout.status === 401 && !hasAuthHarness);

    record(results, {
      step: "2) /api/stripe/checkout",
      expected: hasAuthHarness
        ? "200 with url OR 503"
        : "503 (non-staging) OR 401 (no auth harness) OR 200 with url",
      actual: `${checkout.status}${
        checkoutHasUrl ? " (url)" : ""
      }`,
      pass: checkoutPass,
    });
  }

  {
    const draft = await requestJson(baseUrl, "/api/runs/draft", {
      method: "POST",
      headers: makeHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        context_scope: "work",
        focus_area: "clarity",
        source_route: "/assessment/setup",
      }),
    });

    const isDraftOk =
      draft.status === 200 && typeof draft.body?.run_id === "string";
    const isAuthSkip = draft.status === 401 && !hasAuthHarness;
    const isEntitlementBlocked = draft.status === 403;
    const pass = isDraftOk || isAuthSkip || isEntitlementBlocked;

    record(results, {
      step: "3) /api/runs/draft",
      expected: hasAuthHarness
        ? "200 with run_id OR 403 entitlement block"
        : "401 (SKIP no auth harness) OR 200 with run_id OR 403",
      actual: String(draft.status),
      pass,
    });
  }

  console.log("STEP | EXPECTED | ACTUAL | PASS/FAIL");
  console.log("---|---|---|---");
  for (const row of results) {
    console.log(`${row.step} | ${row.expected} | ${row.actual} | ${row.pass ? "PASS" : "FAIL"}`);
  }

  const failed = results.filter((row) => !row.pass);
  if (failed.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log("qa:staging-smoke PASS");
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Auth harness: ${hasAuthHarness ? "present" : "not provided"}`);
}

run().catch((error) => {
  console.error("qa:staging-smoke FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  if (truthy(process.env.CI)) {
    process.exit(1);
  }
  process.exitCode = 1;
});
