import { del, get, put } from "@vercel/blob";
import type {
  FileStoragePort,
  SaveBugReportReplayInput,
  SaveBugReportScreenshotInput,
} from "@workspace/server/modules/bug-report/port/file-storage.port";

function extensionForContentType(contentType: string): string {
  if (contentType === "image/jpeg") return "jpg";
  return "png";
}

function contentTypeForScreenshotKey(key: string): string {
  if (key.endsWith(".jpg") || key.endsWith(".jpeg")) return "image/jpeg";
  return "image/png";
}

function contentTypeForReplayKey(key: string): string {
  if (key.endsWith(".json")) return "application/json";
  return "application/gzip";
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

  async readBugReportScreenshot(key: string) {
    const result = await get(key, { access: "private", token: this.token });
    if (!result) {
      throw new Error(`Screenshot not found: ${key}`);
    }

    const contentType = result.blob.contentType ?? contentTypeForScreenshotKey(key);
    const bytes = new Uint8Array(await new Response(result.stream).arrayBuffer());
    return { bytes, contentType };
  }

  async saveBugReportReplay(input: SaveBugReportReplayInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/replay.json.gz`;
    await put(key, Buffer.from(input.bytes), {
      access: "private",
      contentType: input.contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
      token: this.token,
    });
    return key;
  }

  async readBugReportReplay(key: string) {
    const result = await get(key, { access: "private", token: this.token });
    if (!result) {
      throw new Error(`Replay not found: ${key}`);
    }

    const contentType = result.blob.contentType ?? contentTypeForReplayKey(key);
    const bytes = new Uint8Array(await new Response(result.stream).arrayBuffer());
    return { bytes, contentType };
  }

  async delete(key: string): Promise<void> {
    await del(key, { token: this.token });
  }
}
