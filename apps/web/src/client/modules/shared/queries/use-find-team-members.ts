import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindTeamMembers() {
  return useSuspenseQuery(orpcQuery.membership.findTeamMembers.queryOptions());
}
