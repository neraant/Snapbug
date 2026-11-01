import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindProjectMembers(projectId: string) {
  return useSuspenseQuery(orpcQuery.membership.findProjectMembers.queryOptions({ input: { projectId } }));
}
