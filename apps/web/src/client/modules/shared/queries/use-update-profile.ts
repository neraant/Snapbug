import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.identity.updateProfile.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.identity.findCurrentUser.key(),
        });
      },
    }),
  );
}
