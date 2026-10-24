import { type Query, useSuspenseQuery } from "@tanstack/react-query";
import type { FindRecentOutputDtoType } from "@workspace/validation/modules/bug-report/dto/find-recent.schema";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

type UseFindBugReportRecentInputType = {
  projectId?: string;
};

type UseFindBugReportRecentOptions = {
  refetchInterval?:
    | number
    | false
    | ((query: Query<FindRecentOutputDtoType, Error, FindRecentOutputDtoType>) => number | false | undefined);
};

export function useFindBugReportRecent(
  input: UseFindBugReportRecentInputType,
  options?: UseFindBugReportRecentOptions,
) {
  return useSuspenseQuery({
    ...orpcQuery.bugReport.findRecent.queryOptions({ input }),
    refetchInterval: options?.refetchInterval,
  });
}
