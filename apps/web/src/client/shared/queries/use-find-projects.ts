import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

export function useFindProjects() {
  return useSuspenseQuery(orpcQuery.project.findProjects.queryOptions());
}
