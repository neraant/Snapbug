import type { BugReportStatPeriodDaysType } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-period-days.const";
import { bugReportStatPeriodDays } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-period-days.const";

import type { OverviewStatFilters } from "@/client/modules/overview/types/overview-stat-filter.type";

export const overviewStatPeriodDaysDefault: BugReportStatPeriodDaysType = 30;

export const defaultOverviewStatFilters: OverviewStatFilters = {
  projectId: null,
  periodDays: overviewStatPeriodDaysDefault,
};

export const overviewStatPeriodDayOptions = bugReportStatPeriodDays.map((days) => ({
  value: String(days),
  periodDays: days,
}));

export const overviewStatAllProjectsValue = "all";
