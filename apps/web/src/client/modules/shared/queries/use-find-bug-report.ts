import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

type UseFindBugReportInput = {
  shortId: string;
};

export function useFindBugReport(input: UseFindBugReportInput) {
  return useSuspenseQuery(orpcQuery.bugReport.findOne.queryOptions({ input }));
}
