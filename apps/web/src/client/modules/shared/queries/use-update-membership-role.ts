import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useUpdateMembershipRole() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.membership.updateMembershipRole.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.membership.findTeamMembers.key(),
        });
      },
    }),
  );
}
