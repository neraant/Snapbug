import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useCreateOrganization() {
  return useMutation(orpcQuery.organization.createOrganization.mutationOptions());
}
