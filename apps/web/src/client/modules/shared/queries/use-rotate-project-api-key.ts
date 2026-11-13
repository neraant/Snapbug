import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useRotateProjectApiKey() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.apiKey.rotateProjectApiKey.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.apiKey.findProjectApiKey.key(),
        });
      },
    }),
  );
}
