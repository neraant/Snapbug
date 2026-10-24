import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useUpdateOrganization() {
  return useMutation(orpcQuery.organization.updateOrganization.mutationOptions());
}
