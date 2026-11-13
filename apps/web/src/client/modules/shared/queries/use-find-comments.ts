import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

type UseFindCommentsInput = {
  bugReportId: string;
};

export function useFindComments(input: UseFindCommentsInput) {
  return useSuspenseQuery(orpcQuery.comment.findComments.queryOptions({ input }));
}
