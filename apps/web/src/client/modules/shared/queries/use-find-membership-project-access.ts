import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindMembershipProjectAccess(membershipId: string) {
  return useSuspenseQuery(orpcQuery.membership.findMembershipProjectAccess.queryOptions({ input: { membershipId } }));
}
