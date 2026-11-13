import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindActivityLogs() {
  return useSuspenseQuery(orpcQuery.audit.findActivityLogs.queryOptions());
}
