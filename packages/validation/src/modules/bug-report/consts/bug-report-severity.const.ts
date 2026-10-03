export enum BugReportSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export const bugReportSeverities = Object.values(BugReportSeverity) as [BugReportSeverity, ...BugReportSeverity[]];
