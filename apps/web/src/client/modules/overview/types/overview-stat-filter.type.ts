import type { BugReportStatPeriodDaysType } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-period-days.const";

export type OverviewStatFilters = {
  projectId: string | null;
  periodDays: BugReportStatPeriodDaysType;
};
