import { del, put } from "@vercel/blob";
import { VercelBlobFileStorageAdapter } from "@workspace/server/modules/bug-report/adapter/vercel-blob-file-storage.adapter";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/blob", () => ({
  put: vi.fn(),
  del: vi.fn(),
}));

const reportId = "4a8c69a1-1ab1-45a8-8497-eae1e506d9d1";
const token = "vercel_blob_rw_test";

describe("VercelBlobFileStorageAdapter", () => {
  beforeEach(() => {
    vi.mocked(put).mockReset();
    vi.mocked(del).mockReset();
  });

  it("stores a private screenshot and returns the pathname key", async () => {
    vi.mocked(put).mockResolvedValue({
      url: "https://example.private.blob.vercel-storage.com/bug-reports/screenshot.png",
      pathname: `bug-reports/${reportId}/screenshot.png`,
      contentType: "image/png",
      contentDisposition: "attachment",
      downloadUrl: "https://example.private.blob.vercel-storage.com/bug-reports/screenshot.png?download=1",
      etag: "etag",
    });
    const adapter = new VercelBlobFileStorageAdapter(token);
    const bytes = new Uint8Array([1, 2, 3]);

    const key = await adapter.saveBugReportScreenshot({
      reportId,
      bytes,
      contentType: "image/png",
    });

    expect(key).toBe(`bug-reports/${reportId}/screenshot.png`);
    expect(put).toHaveBeenCalledWith(`bug-reports/${reportId}/screenshot.png`, Buffer.from(bytes), {
      access: "private",
      contentType: "image/png",
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
    });
  });

  it("uses a jpg pathname for jpeg screenshots", async () => {
    vi.mocked(put).mockResolvedValue({
      url: "https://example.private.blob.vercel-storage.com/bug-reports/screenshot.jpg",
      pathname: `bug-reports/${reportId}/screenshot.jpg`,
      contentType: "image/jpeg",
      contentDisposition: "attachment",
      downloadUrl: "https://example.private.blob.vercel-storage.com/bug-reports/screenshot.jpg?download=1",
      etag: "etag",
    });
    const adapter = new VercelBlobFileStorageAdapter(token);

    const key = await adapter.saveBugReportScreenshot({
      reportId,
      bytes: new Uint8Array([4]),
      contentType: "image/jpeg",
    });

    expect(key).toBe(`bug-reports/${reportId}/screenshot.jpg`);
    expect(put).toHaveBeenCalledWith(
      `bug-reports/${reportId}/screenshot.jpg`,
      expect.any(Buffer),
      expect.objectContaining({ access: "private", contentType: "image/jpeg" }),
    );
  });

  it("deletes a screenshot by pathname", async () => {
    vi.mocked(del).mockResolvedValue(undefined);
    const adapter = new VercelBlobFileStorageAdapter(token);
    const key = `bug-reports/${reportId}/screenshot.png`;

    await adapter.delete(key);

    expect(del).toHaveBeenCalledWith(key, { token });
  });
});
