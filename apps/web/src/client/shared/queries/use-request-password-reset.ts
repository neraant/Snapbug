import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/shared/orpc/query-utils";

export function useRequestPasswordReset() {
  return useMutation(orpcQuery.auth.requestResetPassword.mutationOptions());
}
