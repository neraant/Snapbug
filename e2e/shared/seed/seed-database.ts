import { execFile } from "node:child_process";
import path from "node:path";

const root = path.resolve(__dirname, "../../..");

export function seedDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(
      "pnpm",
      ["--filter", "@workspace/database", "db:seed"],
      {
        cwd: root,
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/snapbug",
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Database seed failed.\n${stdout}\n${stderr}`));
          return;
        }

        resolve();
      },
    );
  });
}
