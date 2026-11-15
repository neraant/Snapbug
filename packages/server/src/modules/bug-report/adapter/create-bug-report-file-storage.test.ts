import { createBugReportFileStorage } from "@workspace/server/modules/bug-report/adapter/create-bug-report-file-storage";
import { InMemoryBugReportFileStorageAdapter } from "@workspace/server/modules/bug-report/adapter/in-memory-bug-report-file-storage.adapter";
import { VercelBlobFileStorageAdapter } from "@workspace/server/modules/bug-report/adapter/vercel-blob-file-storage.adapter";
import { afterEach, describe, expect, it } from "vitest";

describe("createBugReportFileStorage", () => {
  const previousE2E = process.env.SNAPBUG_E2E;
  const previousToken = process.env.BLOB_READ_WRITE_TOKEN;

  afterEach(() => {
    if (previousE2E === undefined) {
      delete process.env.SNAPBUG_E2E;
    } else {
      process.env.SNAPBUG_E2E = previousE2E;
    }
    if (previousToken === undefined) {
      delete process.env.BLOB_READ_WRITE_TOKEN;
    } else {
      process.env.BLOB_READ_WRITE_TOKEN = previousToken;
    }
  });

  it("uses in-memory storage during product e2e when Blob is not configured", () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    process.env.SNAPBUG_E2E = "1";

    const storage = createBugReportFileStorage(undefined);

    expect(storage).toBeInstanceOf(InMemoryBugReportFileStorageAdapter);
  });

  it("keeps Vercel Blob when a real token is present", () => {
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_live";
    process.env.SNAPBUG_E2E = "1";

    const storage = createBugReportFileStorage(undefined);

    expect(storage).toBeInstanceOf(VercelBlobFileStorageAdapter);
  });
});
