import { defineConfig, devices } from "@playwright/test";
import path from "path";

const AUTH_FILE = path.join(__dirname, "playwright", ".auth", "test-user.json");

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: "list",
  fullyParallel: true,

  projects: [
    // Auth setup — runs seed + beta-login to create storageState
    {
      name: "setup",
      testMatch: /global-setup\.ts/,
    },

    // Public pages — no auth needed
    {
      name: "public",
      testMatch: [
        /navigation\.spec/,
        /auth-flow\.spec/,
        /payment-flow\.spec/,
        /visual-lead-engine\.spec/,
      ],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.BASE_URL || "http://localhost:3000",
        headless: true,
      },
    },

    // Authenticated tests — depend on setup project
    {
      name: "authenticated",
      testMatch: [
        /assessment-flow\.spec/,
        /portal-flow\.spec/,
        /results-report\.spec/,
        /connections\.spec/,
      ],
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.BASE_URL || "http://localhost:3000",
        headless: true,
        storageState: AUTH_FILE,
      },
    },

    // Legacy tests (existing)
    {
      name: "legacy",
      testMatch: /e2e-journey\.spec/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.BASE_URL || "http://localhost:3000",
        headless: true,
      },
    },
  ],

  webServer: {
    command: "npm run dev -- --hostname 0.0.0.0 --port 3000",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
