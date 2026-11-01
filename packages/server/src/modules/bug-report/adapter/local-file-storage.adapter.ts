import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  FileStoragePort,
  SaveBugReportReplayInput,
  SaveBugReportScreenshotInput,
} from "@workspace/server/modules/bug-report/port/file-storage.port";

const DEFAULT_UPLOAD_DIR = ".data/bug-report-uploads";

function uploadRootDir(): string {
  const configured = process.env.BUG_REPORT_UPLOAD_DIR?.trim();
  return configured && configured.length > 0 ? configured : DEFAULT_UPLOAD_DIR;
}

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
  async saveBugReportScreenshot(input: SaveBugReportScreenshotInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/screenshot.${extensionForContentType(input.contentType)}`;
    const absolutePath = path.join(uploadRootDir(), key);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, input.bytes);
    return key;
  }

  async readBugReportScreenshot(key: string) {
    const absolutePath = path.join(uploadRootDir(), key);
    const bytes = await readFile(absolutePath);
    return { bytes: new Uint8Array(bytes), contentType: contentTypeForScreenshotKey(key) };
  }

  async saveBugReportReplay(input: SaveBugReportReplayInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/replay.json.gz`;
    const absolutePath = path.join(uploadRootDir(), key);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, input.bytes);
    return key;
  }

  async readBugReportReplay(key: string) {
    const absolutePath = path.join(uploadRootDir(), key);
    const bytes = await readFile(absolutePath);
    return { bytes: new Uint8Array(bytes), contentType: contentTypeForReplayKey(key) };
  }

  async delete(key: string): Promise<void> {
    const absolutePath = path.join(uploadRootDir(), key);
    await rm(absolutePath, { force: true });
  }
}
