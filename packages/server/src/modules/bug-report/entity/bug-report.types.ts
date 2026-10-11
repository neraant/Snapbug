import type { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import type { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

export type BugReportPersistedType = {
  id: string;
  projectId: string;
  assignedTo: string | null;
  status: BugReportStatus;
  severity: BugReportSeverity;
  title: string;
  description: string;
  stepsToReproduce: string | null;
  reporterEmail: string | null;
  url: string | null;
  userAgent: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  viewportWidth: number | null;
  viewportHeight: number | null;
  screenshotKey: string | null;
  hasReplay: boolean;
  consoleLogs: unknown[] | null;
  networkLogs: unknown[] | null;
  customContext: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
};

export type CreateBugReportType = {
  projectId: string;
  title: string;
  description: string;
  url: string;
};

export type DailyMetricRow = {
  day: string;
  value: number;
};

export type SeverityCountRow = {
  severity: BugReportSeverity;
  count: number;
};
