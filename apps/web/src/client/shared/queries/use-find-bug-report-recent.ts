import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

type UseFindBugReportRecentInputType = {
  projectId?: string;
};

export function useFindBugReportRecent(input: UseFindBugReportRecentInputType) {
  return useSuspenseQuery(orpcQuery.bugReport.findRecent.queryOptions({ input }));
}
