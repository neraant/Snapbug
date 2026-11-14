import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

export type SeedBugReportFile = {
  screenshotKey: string | null;
  replayKey: string | null;
};

export type SeedBlobPutOptions = {
  access: "private";
  contentType: string;
  addRandomSuffix: false;
  allowOverwrite: true;
  token: string;
};

export type SeedBlobPut = (pathname: string, body: Buffer, options: SeedBlobPutOptions) => Promise<unknown>;

const SEED_SCREENSHOT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const SEED_REPLAY_EVENTS = [
  {
    type: 4,
    data: { href: "https://store.acme.test/", width: 1440, height: 900 },
    timestamp: 1,
  },
];

export function seedScreenshotBytes(): Buffer {
  return SEED_SCREENSHOT_PNG;
}

export function seedReplayBytes(): Buffer {
  return gzipSync(Buffer.from(JSON.stringify(SEED_REPLAY_EVENTS)));
}

export async function uploadSeedBugReportFiles(
  reports: SeedBugReportFile[],
  options: { token: string | undefined; put: SeedBlobPut },
): Promise<void> {
  const token = options.token?.trim();
  if (!token) return;

  const screenshot = seedScreenshotBytes();
  const replay = seedReplayBytes();

  for (const report of reports) {
    if (report.screenshotKey) {
      await options.put(report.screenshotKey, screenshot, {
        access: "private",
        contentType: "image/png",
        addRandomSuffix: false,
        allowOverwrite: true,
        token,
      });
    }

    if (report.replayKey) {
      await options.put(report.replayKey, replay, {
        access: "private",
        contentType: "application/gzip",
        addRandomSuffix: false,
        allowOverwrite: true,
        token,
      });
    }
  }
}

export function loadSeedBlobPut(): SeedBlobPut {
  const serverPackageJson = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../../server/package.json",
  );
  const require = createRequire(serverPackageJson);
  const blob = require("@vercel/blob") as { put: SeedBlobPut };
  return blob.put.bind(blob);
}
