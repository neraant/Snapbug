import { execFile } from "node:child_process";
import path from "node:path";

const root = path.resolve(__dirname, "../../..");
const DEFAULT_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/snapbug";

export type AccessFixture = {
  foreignTicketId: string;
  foreignShortId: string;
  foreignTitle: string;
  foreignProjectId: string;
  longTicketShortId: string;
  longTicketTitle: string;
  payTicketId: string;
  payShortId: string;
  discountTicketId: string;
  discountShortId: string;
  aliceMembershipId: string;
  acmeOrganizationId: string;
  storeProjectId: string;
  marketingProjectId: string;
  allowedWidgetHost: string;
  pendingResetToken: string;
  expiredResetToken: string;
  readOnlyMcpToken: string;
  revokedMcpToken: string;
  bobEmail: string;
  aliceEmail: string;
};

function runAccessScript(args: string[]): Promise<unknown> {
  return new Promise((resolve, reject) => {
    execFile(
      "pnpm",
      ["--filter", "@workspace/database", "exec", "tsx", "src/seed/e2e-access.ts", ...args],
      {
        cwd: root,
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Seed access failed.\n${stdout}\n${stderr}`));
          return;
        }

        const lines = stdout
          .trim()
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const lastLine = lines.at(-1);
        if (!lastLine) {
          reject(new Error(`Seed access produced no output.\n${stderr}`));
          return;
        }

        resolve(JSON.parse(lastLine) as unknown);
      },
    );
  });
}

export async function seedAccess(): Promise<AccessFixture> {
  return (await runAccessScript(["prepare"])) as AccessFixture;
}

export async function resetTokenExists(email: string): Promise<boolean> {
  const result = (await runAccessScript(["token-status", email])) as { exists: boolean };
  return result.exists;
}

export async function readTicket(id: string): Promise<{ status: string | null; title: string | null }> {
  return (await runAccessScript(["ticket", id])) as { status: string | null; title: string | null };
}

export async function countTicketsByTitle(title: string): Promise<number> {
  const result = (await runAccessScript(["count-title", title])) as { count: number };
  return result.count;
}

export async function countInvitations(email: string): Promise<number> {
  const result = (await runAccessScript(["invitation-count", email])) as { count: number };
  return result.count;
}
