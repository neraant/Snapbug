import "@workspace/database/env/load-root-env";

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { pool } from "@workspace/database";
import { seedApiKey } from "@workspace/database/seed/api-key";
import { seedBugReport } from "@workspace/database/seed/bug-report";
import { seedMembership } from "@workspace/database/seed/membership";
import { seedOrganization } from "@workspace/database/seed/organization";
import { seedProject } from "@workspace/database/seed/project";
import { seedProjectAccess } from "@workspace/database/seed/project-access";
import { seedUser } from "@workspace/database/seed/user";

async function main() {
  const users = await seedUser();
  const organizations = await seedOrganization();
  const memberships = await seedMembership(users, organizations);
  const projects = await seedProject(organizations);
  if (memberships && projects.length > 0) {
    await seedProjectAccess(memberships, projects);
  }
  await seedApiKey(projects);
  await seedBugReport(projects, users);
  await seedBugReportFile();
}

function seedBugReportFile(): Promise<void> {
  const require = createRequire(import.meta.url);
  const tsx = require.resolve("tsx/cli");
  const script = new URL("../../../../server/src/modules/bug-report/seed-bug-report-file-main.ts", import.meta.url);

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [tsx, fileURLToPath(script)], { stdio: "inherit", env: process.env });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Seeded ticket files were not stored (${code ?? "signal"})`));
    });
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
