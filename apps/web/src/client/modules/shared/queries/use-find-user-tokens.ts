import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindUserTokens() {
  return useSuspenseQuery(orpcQuery.userToken.findMany.queryOptions());
}
