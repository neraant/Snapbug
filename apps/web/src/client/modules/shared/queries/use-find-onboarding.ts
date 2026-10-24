import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindOnboarding() {
  return useSuspenseQuery(orpcQuery.organization.findOnboarding.queryOptions());
}
