import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindOrganizations() {
  return useSuspenseQuery(orpcQuery.organization.findOrganizations.queryOptions());
}
