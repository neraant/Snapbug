import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useFindInvitationByToken(token: string) {
  return useSuspenseQuery(
    orpcQuery.invitation.findInvitationByToken.queryOptions({
      input: { token },
    }),
  );
}
