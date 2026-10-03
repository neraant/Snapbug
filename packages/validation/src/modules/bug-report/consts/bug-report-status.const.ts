export enum BugReportStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export const bugReportStatuses = Object.values(BugReportStatus) as [BugReportStatus, ...BugReportStatus[]];
