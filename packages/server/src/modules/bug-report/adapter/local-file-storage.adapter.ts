import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  FileStoragePort,
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

export class LocalFileStorageAdapter implements FileStoragePort {
  async saveBugReportScreenshot(input: SaveBugReportScreenshotInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/screenshot.${extensionForContentType(input.contentType)}`;
    const absolutePath = path.join(uploadRootDir(), key);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, input.bytes);
    return key;
  }

  async delete(key: string): Promise<void> {
    const absolutePath = path.join(uploadRootDir(), key);
    await rm(absolutePath, { force: true });
  }
}
