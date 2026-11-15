import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useArchiveProject() {
  return useMutation(orpcQuery.project.archiveProject.mutationOptions());
}
