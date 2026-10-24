import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useResetPassword() {
  return useMutation(orpcQuery.auth.resetPassword.mutationOptions());
}
