import { execFileSync } from "node:child_process";
import net from "node:net";
import path from "node:path";

const here = path.resolve(__dirname);
const repoRoot = path.join(here, "..");

const defaultDatabaseUrl = "postgres://postgres:postgres@localhost:5432/snapbug";

function databaseEndpoint(): { host: string; port: number } {
  const raw = process.env.DATABASE_URL?.trim() || defaultDatabaseUrl;
  const parsed = new URL(raw.replace(/^postgres:/, "http:"));
  return {
    host: parsed.hostname || "localhost",
    port: Number(parsed.port || 5432),
  };
}

function accepts(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const finish = (value: boolean) => {
      socket.destroy();
      resolve(value);
    };
    socket.setTimeout(500);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

async function waitForPostgres(host: string, port: number, deadlineMs: number): Promise<void> {
  const deadline = Date.now() + deadlineMs;
  while (Date.now() < deadline) {
    if (await accepts(host, port)) {
      return;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
  }
  throw new Error(`Postgres is not reachable at ${host}:${port}`);
}

function startPostgres(): void {
  const attempts: Array<() => void> = [
    () => {
      execFileSync("pnpm", ["db:start"], { cwd: repoRoot, stdio: "pipe" });
    },
    () => {
      execFileSync("docker", ["compose", "up", "-d", "postgres"], { cwd: repoRoot, stdio: "pipe" });
    },
    () => {
      execFileSync("docker-compose", ["up", "-d", "postgres"], { cwd: repoRoot, stdio: "pipe" });
    },
  ];

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      attempt();
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Could not start Postgres for e2e");
}

function runDatabaseMigrate(): void {
  execFileSync("pnpm", ["--filter", "@workspace/database", "db:migrate"], {
    cwd: repoRoot,
    stdio: "pipe",
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? defaultDatabaseUrl,
    },
  });
}

export default async function globalSetup(): Promise<void> {
  const { host, port } = databaseEndpoint();
  if (await accepts(host, port)) {
    await waitForPostgres(host, port, 5_000);
    runDatabaseMigrate();
    return;
  }

  startPostgres();
  await waitForPostgres(host, port, 60_000);
  runDatabaseMigrate();
}
