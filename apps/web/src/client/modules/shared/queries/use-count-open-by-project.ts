import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useCountOpenByProject() {
  return useSuspenseQuery(orpcQuery.bugReport.countOpenByProject.queryOptions());
}
