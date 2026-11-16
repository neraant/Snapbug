import { BugReportSeverity } from "@workspace/validation/modules/bug-report/consts/bug-report-severity.const";
import { AlertTriangleIcon, FlameIcon, InfoIcon, type LucideIcon,ZapIcon } from "lucide-react";

export const bugReportSeveritySearchIcon: Record<BugReportSeverity, LucideIcon> = {
  [BugReportSeverity.CRITICAL]: FlameIcon,
  [BugReportSeverity.HIGH]: ZapIcon,
  [BugReportSeverity.MEDIUM]: AlertTriangleIcon,
  [BugReportSeverity.LOW]: InfoIcon,
};