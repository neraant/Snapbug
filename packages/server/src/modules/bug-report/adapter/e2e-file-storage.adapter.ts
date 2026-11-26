import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
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

export function resolveE2eBlobStorageDir(): string {
  const fromEnv = process.env.SNAPBUG_E2E_BLOB_DIR?.trim();
  if (fromEnv) return fromEnv;
  return path.join(tmpdir(), "snapbug-e2e-blob");
}

export class E2eFileStorageAdapter implements FileStoragePort {
  constructor(private readonly rootDir: string) {}

  private filePath(key: string): string {
    return path.join(this.rootDir, key);
  }

  private async ensureParent(filePath: string): Promise<void> {
    await mkdir(path.dirname(filePath), { recursive: true });
  }

  async saveBugReportScreenshot(input: SaveBugReportScreenshotInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/screenshot.${extensionForContentType(input.contentType)}`;
    const filePath = this.filePath(key);
    await this.ensureParent(filePath);
    await writeFile(filePath, Buffer.from(input.bytes));
    return key;
  }

  async readBugReportScreenshot(key: string) {
    try {
      const bytes = new Uint8Array(await readFile(this.filePath(key)));
      const contentType = key.endsWith(".jpg") || key.endsWith(".jpeg") ? "image/jpeg" : "image/png";
      return { bytes, contentType };
    } catch {
      throw new Error(`Screenshot not found: ${key}`);
    }
  }

  async saveBugReportReplay(input: SaveBugReportReplayInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/replay.json.gz`;
    const filePath = this.filePath(key);
    await this.ensureParent(filePath);
    await writeFile(filePath, Buffer.from(input.bytes));
    return key;
  }

  async readBugReportReplay(key: string) {
    try {
      const bytes = new Uint8Array(await readFile(this.filePath(key)));
      const contentType = key.endsWith(".json") ? "application/json" : "application/gzip";
      return { bytes, contentType };
    } catch {
      throw new Error(`Replay not found: ${key}`);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await unlink(this.filePath(key));
    } catch {
      // Blob delete is idempotent for missing keys in e2e.
    }
  }
}
