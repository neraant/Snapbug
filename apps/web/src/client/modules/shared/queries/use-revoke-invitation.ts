import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useRevokeInvitation() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.invitation.revokeInvitation.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.invitation.findInvitations.key(),
        });
      },
    }),
  );
}
