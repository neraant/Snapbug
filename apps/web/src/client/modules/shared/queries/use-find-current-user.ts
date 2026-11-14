import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindCurrentUser() {
  return useSuspenseQuery(orpcQuery.identity.findCurrentUser.queryOptions());
}
