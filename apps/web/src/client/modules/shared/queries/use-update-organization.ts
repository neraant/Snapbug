import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.organization.updateOrganization.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpcQuery.organization.findOrganizations.key(),
        });
      },
    }),
  );
}
