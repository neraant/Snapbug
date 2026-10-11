import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

type UseFindBugReportWorkloadInputType = {
  projectId?: string;
};

export function useFindBugReportWorkload(input: UseFindBugReportWorkloadInputType) {
  return useSuspenseQuery(orpcQuery.bugReport.findWorkload.queryOptions({ input }));
}
