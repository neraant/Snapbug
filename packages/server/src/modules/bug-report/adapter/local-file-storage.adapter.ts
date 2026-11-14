import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

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

export class LocalFileStorageAdapter implements FileStoragePort {
  constructor(private readonly root = path.join(tmpdir(), "snapbug-files")) {}

  async saveBugReportScreenshot(input: SaveBugReportScreenshotInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/screenshot.${extensionForContentType(input.contentType)}`;
    await this.write(key, input.bytes);
    return key;
  }

  async readBugReportScreenshot(key: string) {
    const bytes = await this.read(key);
    return { bytes, contentType: contentTypeForScreenshotKey(key) };
  }

  async saveBugReportReplay(input: SaveBugReportReplayInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/replay.json.gz`;
    await this.write(key, input.bytes);
    return key;
  }

  async readBugReportReplay(key: string) {
    const bytes = await this.read(key);
    return { bytes, contentType: contentTypeForReplayKey(key) };
  }

  async delete(key: string): Promise<void> {
    await rm(this.resolve(key), { force: true });
  }

  private resolve(key: string): string {
    const resolved = path.resolve(this.root, key);
    const root = path.resolve(this.root);
    if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
      throw new Error("File key escapes storage");
    }
    return resolved;
  }

  private async write(key: string, bytes: Uint8Array): Promise<void> {
    const file = this.resolve(key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, bytes);
  }

  private async read(key: string): Promise<Uint8Array> {
    return new Uint8Array(await readFile(this.resolve(key)));
  }
}
