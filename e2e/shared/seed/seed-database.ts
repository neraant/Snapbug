import { execFile } from "node:child_process";
import path from "node:path";

const root = path.resolve(__dirname, "../../..");

function runDatabaseScript(script: "db:migrate" | "db:seed"): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(
      "pnpm",
      ["--filter", "@workspace/database", script],
      {
        cwd: root,
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/snapbug",
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Database ${script} failed.\n${stdout}\n${stderr}`));
          return;
        }

        resolve();
      },
    );
  });
}

export async function seedDatabase(): Promise<void> {
  await runDatabaseScript("db:migrate");
  await runDatabaseScript("db:seed");
}
