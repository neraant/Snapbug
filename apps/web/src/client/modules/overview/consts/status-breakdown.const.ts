import { BugReportStatus } from "@workspace/validation/modules/bug-report/consts/bug-report-status.const";

export const statusBreakdownColor: Record<BugReportStatus, string> = {
  [BugReportStatus.NEW]: "var(--color-info)",
  [BugReportStatus.IN_PROGRESS]: "var(--color-primary)",
  [BugReportStatus.RESOLVED]: "var(--color-success)",
  [BugReportStatus.CLOSED]: "var(--color-muted-foreground)",
};
