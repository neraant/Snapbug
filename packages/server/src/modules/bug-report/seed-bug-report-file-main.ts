import "@workspace/database/env/load-root-env";

import { db, pool } from "@workspace/database";
import { bugReportTable } from "@workspace/database/schema";
import { VercelBlobFileStorageAdapter } from "@workspace/server/modules/bug-report/adapter/vercel-blob-file-storage.adapter";
import { seedBugReportFile } from "@workspace/server/modules/bug-report/seed-bug-report-file";

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return;

  const rows = await db
    .select({
      screenshotKey: bugReportTable.screenshotKey,
      replayKey: bugReportTable.replayKey,
    })
    .from(bugReportTable);

  await seedBugReportFile(new VercelBlobFileStorageAdapter(token), rows);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
