import { del, put } from "@vercel/blob";
import type {
  FileStoragePort,
  SaveBugReportScreenshotInput,
} from "@workspace/server/modules/bug-report/port/file-storage.port";

function extensionForContentType(contentType: string): string {
  if (contentType === "image/jpeg") return "jpg";
  return "png";
}

export class VercelBlobFileStorageAdapter implements FileStoragePort {
  constructor(private readonly token: string) {}

  async saveBugReportScreenshot(input: SaveBugReportScreenshotInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/screenshot.${extensionForContentType(input.contentType)}`;
    await put(key, Buffer.from(input.bytes), {
      access: "private",
      contentType: input.contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
      token: this.token,
    });
    return key;
  }

  async delete(key: string): Promise<void> {
    await del(key, { token: this.token });
  }
}
