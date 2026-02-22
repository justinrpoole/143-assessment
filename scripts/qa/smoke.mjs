import { spawn } from "node:child_process";
import { createServer } from "node:net";
import process from "node:process";

import {
  ALL_V1_ROUTES,
  AUTH_REQUIRED_ROUTES,
  INTERNAL_ROUTES,
  PUBLIC_ROUTES,
} from "./routes.v1.mjs";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeLocation(locationHeader, baseUrl) {
  if (!locationHeader) {
    return "";
  }

  try {
    const url = new URL(locationHeader, baseUrl);
    return `${url.pathname}${url.search}`;
  } catch {
    return locationHeader;
  }
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

      const { port } = address;
      server.close((closeErr) => {
        if (closeErr) {
          reject(closeErr);
          return;
        }
        resolve(port);
      });
    });
    server.on("error", reject);
  });
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
      // Keep polling until timeout.
    }

    await sleep(250);
  }

  throw new Error("Timed out waiting for app server startup.");
}

function startServer(port) {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const args = ["next", "start", "--port", String(port), "--hostname", "127.0.0.1"];
  const serverProcess = spawn(command, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
    stdio: ["ignore", "ignore", "ignore"],
  });

  return { serverProcess };
}

async function probeRoute(baseUrl, routePath) {
  try {
    const response = await fetch(`${baseUrl}${routePath}`, {
      redirect: "manual",
    });
    return {
      route: routePath,
      status: response.status,
      location: normalizeLocation(response.headers.get("location"), baseUrl),
      error: "",
    };
  } catch (error) {
    return {
      route: routePath,
      status: "ERR",
      location: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function makeResult(route, expected, actualStatus, location, pass, note = "") {
  return {
    route,
    expected,
    actualStatus: String(actualStatus),
    location: location || "",
    pass,
    note,
  };
}

function isRedirectTo(locationValue, pathPrefix) {
  return locationValue === pathPrefix || locationValue.startsWith(`${pathPrefix}?`);
}

async function runSmoke() {
  const dedupedRouteCount = new Set(ALL_V1_ROUTES).size;
  const results = [];

  if (dedupedRouteCount !== 31) {
    results.push(
      makeResult(
        "__route_set__",
        "31 unique routes",
        dedupedRouteCount,
        "",
        false,
        "Route list count is not 31.",
      ),
    );
  }

  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const { serverProcess } = startServer(port);

  try {
    await waitForServerReady(baseUrl, serverProcess);

    // Root route has a locked redirect but may be implemented as direct content.
    const rootProbe = await probeRoute(baseUrl, "/");
    const rootPass =
      rootProbe.status === 200 ||
      ((rootProbe.status === 307 || rootProbe.status === 308) &&
        isRedirectTo(rootProbe.location, "/upgrade-your-os"));
    results.push(
      makeResult(
        "/",
        "200 OR 307/308 -> /upgrade-your-os",
        rootProbe.status,
        rootProbe.location,
        rootPass,
        rootProbe.error,
      ),
    );

    for (const route of PUBLIC_ROUTES.filter((item) => item !== "/")) {
      const probe = await probeRoute(baseUrl, route);
      const pass = probe.status === 200;
      results.push(
        makeResult(route, "200", probe.status, probe.location, pass, probe.error),
      );
    }

    for (const route of AUTH_REQUIRED_ROUTES) {
      const probe = await probeRoute(baseUrl, route);
      const pass =
        (probe.status === 307 || probe.status === 308) &&
        isRedirectTo(probe.location, "/login");
      results.push(
        makeResult(
          route,
          "307/308 -> /login (unauthenticated)",
          probe.status,
          probe.location,
          pass,
          probe.error,
        ),
      );
    }

    for (const route of INTERNAL_ROUTES) {
      const probe = await probeRoute(baseUrl, route);
      const pass = probe.status === 404;
      results.push(
        makeResult(route, "404 without key", probe.status, probe.location, pass, probe.error),
      );
    }

    const specCenterKey = process.env.ENV_SPEC_CENTER_KEY;
    if (!specCenterKey) {
      results.push(
        makeResult(
          "/spec-center?key=<ENV_SPEC_CENTER_KEY>",
          "SKIPPED: no key",
          "SKIPPED",
          "",
          true,
        ),
      );
    } else {
      const route = `/spec-center?key=${encodeURIComponent(specCenterKey)}`;
      const probe = await probeRoute(baseUrl, route);
      const pass = probe.status === 200;
      results.push(
        makeResult(
          "/spec-center?key=<ENV_SPEC_CENTER_KEY>",
          "200 with valid key",
          probe.status,
          probe.location,
          pass,
          probe.error,
        ),
      );
    }
  } finally {
    if (serverProcess.exitCode === null) {
      serverProcess.kill("SIGTERM");
      await sleep(250);
      if (serverProcess.exitCode === null) {
        serverProcess.kill("SIGKILL");
      }
    }
  }

  const header = "ROUTE | EXPECTED | ACTUAL STATUS | LOCATION (if redirect) | PASS/FAIL";
  const divider = "---|---|---|---|---";
  const rows = results.map((result) => {
    const status = result.note
      ? `${result.actualStatus} (${result.note.replace(/\|/g, "\\|")})`
      : result.actualStatus;
    return `${result.route} | ${result.expected} | ${status} | ${result.location || "-"} | ${
      result.pass ? "PASS" : "FAIL"
    }`;
  });

  console.log(header);
  console.log(divider);
  for (const row of rows) {
    console.log(row);
  }

  const failed = results.filter((item) => !item.pass);
  if (failed.length > 0) {
    process.exitCode = 1;
  }

  return { failedCount: failed.length };
}

runSmoke().catch((error) => {
  console.error("Smoke runner failed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
