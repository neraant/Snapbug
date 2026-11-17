import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.notification.updatePreference.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.notification.findPreference.key(),
        });
      },
    }),
  );
}