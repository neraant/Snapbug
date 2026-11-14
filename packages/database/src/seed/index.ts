import "@workspace/database/env/load-root-env";

import { pool } from "@workspace/database";
import { seedApiKey } from "@workspace/database/seed/api-key";
import { seedBugReport } from "@workspace/database/seed/bug-report";
import { loadSeedBlobPut, uploadSeedBugReportFiles } from "@workspace/database/seed/bug-report-file";
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
  const bugReports = await seedBugReport(projects, users);
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (blobToken) {
    await uploadSeedBugReportFiles(bugReports, { token: blobToken, put: loadSeedBlobPut() });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
