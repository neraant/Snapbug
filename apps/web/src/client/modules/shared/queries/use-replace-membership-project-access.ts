import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useReplaceMembershipProjectAccess() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.membership.replaceMembershipProjectAccess.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.membership.findMembershipProjectAccess.key(),
        });
      },
    }),
  );
}
