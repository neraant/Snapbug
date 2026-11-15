import { createBugReportFileStorage } from "@workspace/server/modules/bug-report/adapter/create-bug-report-file-storage";
import { VercelBlobFileStorageAdapter } from "@workspace/server/modules/bug-report/adapter/vercel-blob-file-storage.adapter";
import { afterEach, describe, expect, it } from "vitest";

describe("createBugReportFileStorage", () => {
  const previousToken = process.env.BLOB_READ_WRITE_TOKEN;

  afterEach(() => {
    if (previousToken === undefined) {
      delete process.env.BLOB_READ_WRITE_TOKEN;
    } else {
      process.env.BLOB_READ_WRITE_TOKEN = previousToken;
    }
  });

  it("uses Vercel Blob when Blob is not configured", () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;

    const storage = createBugReportFileStorage(undefined);

    expect(storage).toBeInstanceOf(VercelBlobFileStorageAdapter);
  });

  it("uses Vercel Blob when a real token is present", () => {
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_live";

    const storage = createBugReportFileStorage(undefined);

    expect(storage).toBeInstanceOf(VercelBlobFileStorageAdapter);
  });
});
