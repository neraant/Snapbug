import type {
  FileStoragePort,
  ReadBugReportReplayResult,
  ReadBugReportScreenshotResult,
  SaveBugReportReplayInput,
  SaveBugReportScreenshotInput,
} from "@workspace/server/modules/bug-report/port/file-storage.port";

type StoredObject = {
  bytes: Uint8Array;
  contentType: string;
};

function extensionForContentType(contentType: string): string {
  if (contentType === "image/jpeg") return "jpg";
  return "png";
}

const store = new Map<string, StoredObject>();

export class InMemoryBugReportFileStorageAdapter implements FileStoragePort {
  async saveBugReportScreenshot(input: SaveBugReportScreenshotInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/screenshot.${extensionForContentType(input.contentType)}`;
    store.set(key, { bytes: input.bytes, contentType: input.contentType });
    return key;
  }

  async readBugReportScreenshot(key: string): Promise<ReadBugReportScreenshotResult> {
    const object = store.get(key);
    if (!object) {
      throw new Error(`Screenshot not found: ${key}`);
    }

    return { bytes: object.bytes, contentType: object.contentType };
  }

  async saveBugReportReplay(input: SaveBugReportReplayInput): Promise<string> {
    const key = `bug-reports/${input.reportId}/replay.json.gz`;
    store.set(key, { bytes: input.bytes, contentType: input.contentType });
    return key;
  }

  async readBugReportReplay(key: string): Promise<ReadBugReportReplayResult> {
    const object = store.get(key);
    if (!object) {
      throw new Error(`Replay not found: ${key}`);
    }

    return { bytes: object.bytes, contentType: object.contentType };
  }

  async delete(key: string): Promise<void> {
    store.delete(key);
  }
}
