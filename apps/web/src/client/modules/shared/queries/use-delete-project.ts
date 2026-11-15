import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useDeleteProject() {
  return useMutation(orpcQuery.project.deleteProject.mutationOptions());
}
