import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

type UseFindBugReportStatsInputType = {
  organizationId: string;
  projectId?: string;
};

export function useFindBugReportStats(input: UseFindBugReportStatsInputType) {
  return useSuspenseQuery(orpcQuery.bugReport.findStats.queryOptions({ input }));
}
