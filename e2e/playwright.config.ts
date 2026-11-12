import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const here = __dirname;
const port = 3000;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: here,
  testMatch: "**/*.spec.ts",
  outputDir: path.join(here, "test-results"),
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: path.join(here, "playwright-report"), open: "never" }]],
  use: {
    baseURL,
    viewport: { width: 1280, height: 800 },
    screenshot: "off",
    video: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm exec next dev --webpack -p 3000",
    cwd: path.join(here, "..", "apps", "web"),
    url: `${baseURL}/sign-in`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/snapbug",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "your-secret-auth-secret",
      NEXT_PUBLIC_APP_URL: baseURL,
      RESEND_API_KEY: process.env.RESEND_API_KEY ?? "your-resend-api-key-here",
      EMAIL_FROM: process.env.EMAIL_FROM ?? "noreply@snapbug.com",
    },
  },
});
