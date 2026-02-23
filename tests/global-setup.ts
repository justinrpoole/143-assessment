/**
 * Playwright Global Setup
 *
 * Authenticates via beta-login and saves session cookies
 * to playwright/.auth/test-user.json for authenticated test projects.
 *
 * Prerequisites: npm run seed:test must have been run first
 * to populate the test account with data.
 */

import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const AUTH_FILE = path.join(__dirname, "..", "playwright", ".auth", "test-user.json");
const TEST_EMAIL = "test@143leadership.com";

setup("authenticate via beta-login", async ({ request }) => {
  // Ensure auth directory exists
  const authDir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Step 1: POST to beta-login endpoint
  const loginRes = await request.post("/api/auth/beta-login", {
    data: { email: TEST_EMAIL },
  });

  expect(loginRes.ok(), `Beta login failed: ${loginRes.status()}`).toBeTruthy();

  const body = await loginRes.json();
  expect(body.ok).toBeTruthy();
  expect(body.verify_url).toBeTruthy();

  // Step 2: Follow verify_url to set session cookies
  // The verify endpoint sets cookies and redirects to /portal
  const verifyRes = await request.get(body.verify_url, {
    maxRedirects: 0,
  });

  // Expect a redirect (302) to /portal — cookies are now set
  expect([200, 302, 303, 307]).toContain(verifyRes.status());

  // Step 3: Save storage state (cookies) for authenticated tests
  await request.storageState({ path: AUTH_FILE });

  // Step 4: Verify the auth works by hitting a protected endpoint
  const summaryRes = await request.get("/api/portal/summary");
  expect(summaryRes.ok(), "Portal summary should be accessible after auth").toBeTruthy();

  const summary = await summaryRes.json();
  expect(summary.has_completed_run).toBe(true);
});
