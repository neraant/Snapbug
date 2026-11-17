import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useChangePassword() {
  return useMutation(orpcQuery.identity.changePassword.mutationOptions());
}
