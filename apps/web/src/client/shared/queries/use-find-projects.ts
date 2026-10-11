import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

type UseFindProjectsInput = {
  organizationId: string;
};

export function useFindProjects(input: UseFindProjectsInput) {
  return useSuspenseQuery(orpcQuery.project.findProjects.queryOptions({ input }));
}
