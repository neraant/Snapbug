import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useCreateProject() {
  return useMutation(orpcQuery.project.createProject.mutationOptions());
}
