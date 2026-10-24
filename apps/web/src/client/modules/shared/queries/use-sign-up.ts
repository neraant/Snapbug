import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useSignUp() {
  return useMutation(orpcQuery.auth.signUp.mutationOptions());
}
