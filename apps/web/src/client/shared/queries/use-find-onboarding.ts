import { useQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

export function useFindOnboarding() {
  return useQuery(orpcQuery.organization.findOnboarding.queryOptions());
}
