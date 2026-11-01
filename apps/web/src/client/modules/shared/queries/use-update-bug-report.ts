import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useUpdateBugReport() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.bugReport.update.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: orpcQuery.bugReport.findMany.key(),
          }),
          queryClient.invalidateQueries({
            queryKey: orpcQuery.bugReport.findOne.key(),
          }),
        ]);
      },
    }),
  );
}
