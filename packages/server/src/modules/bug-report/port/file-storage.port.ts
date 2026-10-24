export type SaveBugReportScreenshotInput = {
  reportId: string;
  bytes: Uint8Array;
  contentType: string;
};

export type FileStoragePort = {
  saveBugReportScreenshot(input: SaveBugReportScreenshotInput): Promise<string>;
  delete(key: string): Promise<void>;
};
