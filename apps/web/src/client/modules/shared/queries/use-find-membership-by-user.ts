import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindMembershipByUser() {
  return useSuspenseQuery(orpcQuery.membership.findMembershipByUser.queryOptions());
}
