import type { BadgeVariant } from "@workspace/design-system/components/ui/badge";
import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";

export const bugReportSeverityBadgeVariant: Record<BugReportSeverity, BadgeVariant> = {
  [BugReportSeverity.CRITICAL]: "severityCritical",
  [BugReportSeverity.HIGH]: "severityHigh",
  [BugReportSeverity.MEDIUM]: "severityMedium",
  [BugReportSeverity.LOW]: "severityLow",
};
