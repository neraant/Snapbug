import { useSuspenseQuery } from "@tanstack/react-query";
import type { BugReportStatPeriodDaysType } from "@workspace/validation/modules/bug-report/consts/bug-report-stat-period-days.const";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

type UseFindBugReportBreakdownsInputType = {
  projectId?: string;
  periodDays: BugReportStatPeriodDaysType;
};

export function useFindBugReportBreakdowns(input: UseFindBugReportBreakdownsInputType) {
  return useSuspenseQuery(orpcQuery.bugReport.findBreakdowns.queryOptions({ input }));
}
