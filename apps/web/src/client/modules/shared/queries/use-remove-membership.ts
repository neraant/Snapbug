import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useRemoveMembership() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.membership.removeMembership.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.membership.findTeamMembers.key(),
        });
      },
    }),
  );
}
