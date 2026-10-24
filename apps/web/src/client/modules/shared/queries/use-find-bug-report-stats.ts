import { useSuspenseQuery } from "@tanstack/react-query";
import type { BugReportStatPeriodDaysType } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-period-days.const";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

type UseFindBugReportStatsInputType = {
  projectId?: string;
  periodDays: BugReportStatPeriodDaysType;
};

export function useFindBugReportStats(input: UseFindBugReportStatsInputType) {
  return useSuspenseQuery(orpcQuery.bugReport.findStats.queryOptions({ input }));
}
