import { InMemoryBugReportFileStorageAdapter } from "@workspace/server/modules/bug-report/adapter/in-memory-bug-report-file-storage.adapter";
import { describe, expect, it } from "vitest";

const reportId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";

describe("InMemoryBugReportFileStorageAdapter", () => {
  it("round-trips a screenshot by key", async () => {
    const adapter = new InMemoryBugReportFileStorageAdapter();
    const bytes = new Uint8Array([1, 2, 3]);

    const key = await adapter.saveBugReportScreenshot({
      reportId,
      bytes,
      contentType: "image/png",
    });

    await expect(adapter.readBugReportScreenshot(key)).resolves.toEqual({
      bytes,
      contentType: "image/png",
    });
  });
});
