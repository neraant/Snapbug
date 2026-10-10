export enum BugReportStatId {
  NEW_REPORT = "newReport",
  OPEN_ISSUE = "openIssue",
  CRITICAL_HIGH_OPEN = "criticalHighOpen",
  MEDIAN_TIME_TO_RESOLVE = "medianTimeToResolve",
}

export const bugReportStatIds = Object.values(BugReportStatId) as [BugReportStatId, ...BugReportStatId[]];
