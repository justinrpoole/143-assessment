import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    headless: true,
  },
  webServer: {
    command: "npm run dev -- --hostname 0.0.0.0 --port 3000",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
