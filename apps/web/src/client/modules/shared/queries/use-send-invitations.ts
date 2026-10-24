import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useSendInvitations() {
  return useMutation(orpcQuery.invitation.sendInvitations.mutationOptions());
}
