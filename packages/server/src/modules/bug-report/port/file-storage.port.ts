export type SaveBugReportScreenshotInput = {
  reportId: string;
  bytes: Uint8Array;
  contentType: string;
};

export type ReadBugReportScreenshotResult = {
  bytes: Uint8Array;
  contentType: string;
};

export type SaveBugReportReplayInput = {
  reportId: string;
  bytes: Uint8Array;
  contentType: string;
};

export type ReadBugReportReplayResult = {
  bytes: Uint8Array;
  contentType: string;
};

export type FileStoragePort = {
  saveBugReportScreenshot(input: SaveBugReportScreenshotInput): Promise<string>;
  readBugReportScreenshot(key: string): Promise<ReadBugReportScreenshotResult>;
  saveBugReportReplay(input: SaveBugReportReplayInput): Promise<string>;
  readBugReportReplay(key: string): Promise<ReadBugReportReplayResult>;
  delete(key: string): Promise<void>;
};
