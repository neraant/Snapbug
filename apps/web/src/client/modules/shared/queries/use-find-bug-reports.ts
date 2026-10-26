import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

type UseFindBugReportsInput = {
  projectId?: string;
};

export function useFindBugReports(input: UseFindBugReportsInput) {
  return useSuspenseQuery(orpcQuery.bugReport.findMany.queryOptions({ input }));
}
