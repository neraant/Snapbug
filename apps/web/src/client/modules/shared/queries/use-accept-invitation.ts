import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useAcceptInvitation() {
  return useMutation(orpcQuery.invitation.acceptInvitation.mutationOptions());
}
