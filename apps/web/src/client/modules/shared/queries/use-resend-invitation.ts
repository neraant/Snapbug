import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useResendInvitation() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.invitation.resendInvitation.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.invitation.findInvitations.key(),
        });
      },
    }),
  );
}
