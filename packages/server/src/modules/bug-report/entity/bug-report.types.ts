import type { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import type { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

export type BugReportPersistedType = {
  id: string;
  projectId: string;
  shortId: string;
  assignedTo: string | null;
  status: BugReportStatus;
  boardOrder: number;
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
  replayKey: string | null;
  hasReplay: boolean;
  consoleLogs: unknown[] | null;
  networkLogs: unknown[] | null;
  customContext: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
};

export type UpdateBugReportType = Partial<
  Pick<
    BugReportPersistedType,
    | "assignedTo"
    | "status"
    | "boardOrder"
    | "severity"
    | "title"
    | "description"
    | "stepsToReproduce"
    | "reporterEmail"
    | "url"
    | "userAgent"
    | "browser"
    | "os"
    | "device"
    | "viewportWidth"
    | "viewportHeight"
    | "consoleLogs"
    | "networkLogs"
    | "customContext"
  >
>;

export type CreateBugReportType = {
  id?: string;
  projectId: string;
  shortId: string;
  title: string;
  description: string;
  url: string;
  userAgent?: string | null;
  browser?: string | null;
  os?: string | null;
  device?: string | null;
  viewportWidth?: number | null;
  viewportHeight?: number | null;
  screenshotKey?: string | null;
  replayKey?: string | null;
  severity?: BugReportSeverity;
  consoleLogs?: unknown[] | null;
  networkLogs?: unknown[] | null;
  reporterEmail?: string | null;
  customContext?: Record<string, unknown> | null;
};

export type AssigneeOpenCountRow = {
  assignedTo: string | null;
  count: number;
};

export type DailyMetricRow = {
  day: string;
  value: number;
};

export type SeverityCountRow = {
  severity: BugReportSeverity;
  count: number;
};

export type StatusCountRow = {
  status: BugReportStatus;
  count: number;
};

export type NullableStringCountRow = {
  value: string | null;
  count: number;
};

export type WeekdayHourCountRow = {
  weekday: number;
  hour: number;
  count: number;
};
