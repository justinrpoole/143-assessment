import { spawn } from "node:child_process";
import { createServer } from "node:net";
import process from "node:process";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Could not resolve a free port.")));
        return;
      }

      server.close((closeError) => {
        if (closeError) {
          reject(closeError);
          return;
        }
        resolve(address.port);
      });
    });
    server.on("error", reject);
  });
}

function startServer(port) {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const args = ["next", "start", "--port", String(port), "--hostname", "127.0.0.1"];
  const serverProcess = spawn(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "ignore", "ignore"],
  });
  return serverProcess;
}

async function waitForServerReady(baseUrl, serverProcess) {
  const timeoutMs = 30_000;
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (serverProcess.exitCode !== null) {
      throw new Error(`App server exited early with code ${serverProcess.exitCode}.`);
    }
    try {
      const response = await fetch(`${baseUrl}/login`, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) {
        return;
      }
    } catch {
      // Poll until ready.
    }
    await sleep(250);
  }
  throw new Error("Timed out waiting for app server startup.");
}

function hasStripeEnv() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      process.env.STRIPE_PRICE_PAID_43 &&
      process.env.STRIPE_PRICE_SUB_1433,
  );
}

async function runMissingEnvChecks(baseUrl) {
  const checks = [
    {
      name: "checkout",
      path: "/api/stripe/checkout",
      options: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "paid_43" }),
      },
    },
    {
      name: "portal",
      path: "/api/stripe/portal",
      options: { method: "POST" },
    },
    {
      name: "webhook",
      path: "/api/stripe/webhook",
      options: { method: "POST", body: "{}" },
    },
  ];

  const results = [];
  for (const check of checks) {
    const response = await fetch(`${baseUrl}${check.path}`, check.options);
    results.push({
      name: check.name,
      expected: 503,
      actual: response.status,
      pass: response.status === 503,
    });
  }

  console.log("CHECK | EXPECTED | ACTUAL | PASS/FAIL");
  console.log("---|---|---|---");
  for (const row of results) {
    console.log(
      `${row.name} | ${row.expected} | ${row.actual} | ${row.pass ? "PASS" : "FAIL"}`,
    );
  }

  const failed = results.filter((row) => !row.pass);
  if (failed.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log("qa:stripe PASS");
  console.log("Mode: missing env contract verified (503 responses).");
}

async function run() {
  if (hasStripeEnv()) {
    console.log("qa:stripe SKIPPED");
    console.log(
      "Reason: Stripe env present. Run Stripe CLI fixture tests to validate live webhook transitions.",
    );
    return;
  }

  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = startServer(port);

  try {
    await waitForServerReady(baseUrl, server);
    await runMissingEnvChecks(baseUrl);
  } finally {
    if (server.exitCode === null) {
      server.kill("SIGTERM");
      await sleep(250);
      if (server.exitCode === null) {
        server.kill("SIGKILL");
      }
    }
  }
}

run().catch((error) => {
  console.error("qa:stripe FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
