import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useRevokeUserToken() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.userToken.revoke.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.userToken.findMany.key(),
        });
      },
    }),
  );
}
