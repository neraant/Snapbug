import { useSuspenseQuery } from "@tanstack/react-query";
import type { BugReportStatPeriodDaysType } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-period-days.const";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

type UseFindBugReportChartsInputType = {
  projectId?: string;
  periodDays: BugReportStatPeriodDaysType;
};

export function useFindBugReportCharts(input: UseFindBugReportChartsInputType) {
  return useSuspenseQuery(orpcQuery.bugReport.findCharts.queryOptions({ input }));
}
