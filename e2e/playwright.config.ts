import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const here = __dirname;
const portCacheMs = 30_000;

// Bind the first free port so a server already on :3000 does not abort this run.
// Workers load this file again; they must keep the port chosen for the web server.
const choosePortScript = `
const net = require("net");

function available(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.listen({ port, host: "127.0.0.1", exclusive: true }, () => {
      server.close(() => resolve(true));
    });
  });
}

(async () => {
  const preferred = [3000];
  for (let port = 3100; port < 3200; port += 1) preferred.push(port);
  for (const port of preferred) {
    if (await available(port)) {
      process.stdout.write(String(port));
      return;
    }
  }
  process.stderr.write("no free e2e port\\n");
  process.exit(1);
})().catch((error) => {
  process.stderr.write(String(error) + "\\n");
  process.exit(1);
});
`;

function sleepSync(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function portFiles() {
  const id = createHash("sha256").update(here).digest("hex").slice(0, 16);
  const dir = path.join(tmpdir(), "snapbug-e2e");
  mkdirSync(dir, { recursive: true });
  return {
    port: path.join(dir, `${id}.port`),
    lock: path.join(dir, `${id}.lock`),
  };
}

function readCachedPort(file: string): number | undefined {
  try {
    const info = statSync(file);
    if (Date.now() - info.mtimeMs > portCacheMs) return undefined;
    const port = Number(readFileSync(file, "utf8").trim());
    if (!Number.isInteger(port) || port < 1 || port > 65535) return undefined;
    return port;
  } catch {
    return undefined;
  }
}

function rememberPort(file: string, port: number) {
  writeFileSync(file, `${port}\n`);
  process.env.E2E_PORT = String(port);
  return port;
}

function chooseFreePort(): number {
  const output = execFileSync(process.execPath, ["-e", choosePortScript], {
    encoding: "utf8",
    timeout: 5_000,
    env: { ...process.env, E2E_PORT: "" },
  });
  const port = Number(output.trim());
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Could not choose an e2e port (received ${JSON.stringify(output)})`);
  }
  return port;
}

function e2ePort(): number {
  const fromEnv = Number(process.env.E2E_PORT);
  if (Number.isInteger(fromEnv) && fromEnv >= 1 && fromEnv <= 65535) return fromEnv;

  const files = portFiles();
  const cached = readCachedPort(files.port);
  if (cached) return rememberPort(files.port, cached);

  try {
    writeFileSync(files.lock, String(process.pid), { flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    const deadline = Date.now() + 5_000;
    while (Date.now() < deadline) {
      const port = readCachedPort(files.port);
      if (port) return rememberPort(files.port, port);
      sleepSync(50);
    }
    try {
      unlinkSync(files.lock);
    } catch {
      // The lock owner finished between the timeout and the delete.
    }
    return e2ePort();
  }

  try {
    const port = readCachedPort(files.port) ?? chooseFreePort();
    return rememberPort(files.port, port);
  } finally {
    try {
      unlinkSync(files.lock);
    } catch {
      // The waiter may already have removed a stale lock.
    }
  }
}

const port = e2ePort();
// Next.js dev hydrates the page when the browser origin is localhost.
const baseURL = `http://localhost:${port}`;

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
    command: `pnpm exec next dev --webpack -p ${port}`,
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
