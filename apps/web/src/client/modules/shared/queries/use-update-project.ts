import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useUpdateProject() {
  return useMutation(orpcQuery.project.updateProject.mutationOptions());
}
