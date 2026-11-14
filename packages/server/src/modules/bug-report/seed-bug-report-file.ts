import { gzipSync } from "node:zlib";

import type { FileStoragePort } from "@workspace/server/modules/bug-report/port/file-storage.port";

const SEEDED_SCREENSHOT_PNG = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  ),
);

const SEEDED_REPLAY_GZIP = Uint8Array.from(gzipSync(Buffer.from("[]")));

type SeedBugReportFileRow = {
  screenshotKey: string | null;
  replayKey: string | null;
};

type SeedBugReportFileStorage = Pick<FileStoragePort, "saveBugReportScreenshot" | "saveBugReportReplay">;

function reportIdFromKey(key: string): string | null {
  const match = /^bug-reports\/([0-9a-f-]{36})\//i.exec(key);
  return match?.[1] ?? null;
}

export async function seedBugReportFile(
  storage: SeedBugReportFileStorage,
  rows: SeedBugReportFileRow[],
): Promise<void> {
  const screenshotKeys = new Set<string>();
  const replayKeys = new Set<string>();

  for (const row of rows) {
    if (row.screenshotKey) screenshotKeys.add(row.screenshotKey);
    if (row.replayKey) replayKeys.add(row.replayKey);
  }

  for (const key of screenshotKeys) {
    const reportId = reportIdFromKey(key);
    if (!reportId) continue;

    await storage.saveBugReportScreenshot({
      reportId,
      bytes: SEEDED_SCREENSHOT_PNG,
      contentType: key.endsWith(".jpg") || key.endsWith(".jpeg") ? "image/jpeg" : "image/png",
    });
  }

  for (const key of replayKeys) {
    const reportId = reportIdFromKey(key);
    if (!reportId) continue;

    await storage.saveBugReportReplay({
      reportId,
      bytes: SEEDED_REPLAY_GZIP,
      contentType: "application/gzip",
    });
  }
}
