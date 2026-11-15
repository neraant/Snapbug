import { useMutation } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useCopyInvitationLink() {
  return useMutation(orpcQuery.invitation.copyInvitationLink.mutationOptions());
}