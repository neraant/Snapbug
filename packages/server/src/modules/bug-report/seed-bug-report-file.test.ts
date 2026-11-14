import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { seedBugReportFile } from "@workspace/server/modules/bug-report/seed-bug-report-file";
import { describe, expect, it, vi } from "vitest";

const reportId = "6a8c69a1-1ab1-45a8-8497-eae1e506d901";

describe("seedBugReportFile", () => {
  it("writes each seeded screenshot and replay through Blob storage", async () => {
    const storage = {
      saveBugReportScreenshot: vi.fn().mockResolvedValue("screenshot"),
      saveBugReportReplay: vi.fn().mockResolvedValue("replay"),
    };

    await seedBugReportFile(storage, [
      {
        screenshotKey: `bug-reports/${reportId}/screenshot.png`,
        replayKey: `bug-reports/${reportId}/replay.json.gz`,
      },
      {
        screenshotKey: `bug-reports/${reportId}/screenshot.png`,
        replayKey: null,
      },
    ]);

    expect(storage.saveBugReportScreenshot).toHaveBeenCalledTimes(1);
    expect(storage.saveBugReportScreenshot).toHaveBeenCalledWith({
      reportId,
      bytes: expect.any(Uint8Array),
      contentType: "image/png",
    });
    expect(storage.saveBugReportReplay).toHaveBeenCalledTimes(1);
    expect(storage.saveBugReportReplay).toHaveBeenCalledWith({
      reportId,
      bytes: expect.any(Uint8Array),
      contentType: "application/gzip",
    });
  });

  it("does not write a row that has no file keys", async () => {
    const storage = {
      saveBugReportScreenshot: vi.fn(),
      saveBugReportReplay: vi.fn(),
    };

    await seedBugReportFile(storage, [{ screenshotKey: null, replayKey: null }]);

    expect(storage.saveBugReportScreenshot).not.toHaveBeenCalled();
    expect(storage.saveBugReportReplay).not.toHaveBeenCalled();
  });
});

describe("database seed launcher", () => {
  it("starts the Blob upload script under packages/server", () => {
    const seed = new URL("../../../../database/src/seed/index.ts", import.meta.url);
    const source = readFileSync(seed, "utf8");
    const match = source.match(/new URL\("(\.\.\/[^"]*seed-bug-report-file-main\.ts)"/);
    expect(match).not.toBeNull();
    const script = fileURLToPath(new URL(match![1], seed));
    expect(existsSync(script)).toBe(true);
  });
});
