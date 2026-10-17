import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

export function useUpdateProjectWidgetSetting(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = orpcQuery.project.findProjectWidgetSetting.queryOptions({ input: { projectId } }).queryKey;

  return useMutation(
    orpcQuery.project.updateProjectWidgetSetting.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData(queryKey, data);
      },
    }),
  );
}
