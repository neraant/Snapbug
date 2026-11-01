import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useCountOpenByAssignee() {
  return useSuspenseQuery(orpcQuery.bugReport.countOpenByAssignee.queryOptions());
}
