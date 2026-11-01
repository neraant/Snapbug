import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useUpdateOnboardingOrganization() {
  return useMutation(orpcQuery.organization.updateOnboardingOrganization.mutationOptions());
}
