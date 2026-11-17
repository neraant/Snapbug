import { execFile } from "node:child_process";
import path from "node:path";

const root = path.resolve(__dirname, "../../..");
const DEFAULT_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/snapbug";

export async function seedUnreadNotification(): Promise<{ ticketShortId: string }> {
  return new Promise((resolve, reject) => {
    execFile(
      "pnpm",
      ["--filter", "@workspace/database", "exec", "tsx", "src/seed/e2e-unread-notification.ts"],
      {
        cwd: root,
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Seed unread notification failed.\n${stdout}\n${stderr}`));
          return;
        }

        const lines = stdout
          .trim()
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const lastLine = lines.at(-1);
        if (!lastLine) {
          reject(new Error(`Seed unread notification produced no output.\n${stderr}`));
          return;
        }

        const parsed = JSON.parse(lastLine) as { ticketShortId: string };
        resolve({ ticketShortId: parsed.ticketShortId });
      },
    );
  });
}
