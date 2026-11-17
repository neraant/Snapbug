import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useUpdateUserPreference() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.preference.updateUserPreference.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.preference.findUserPreference.key(),
        });
      },
    }),
  );
}
