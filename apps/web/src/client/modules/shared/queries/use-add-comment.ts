import { useMutation, useQueryClient } from "@tanstack/react-query";

import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation(
    orpcQuery.comment.addComment.mutationOptions({
      onSuccess: () => {
        queryClient
          .invalidateQueries({
            queryKey: orpcQuery.comment.findComments.key(),
          })
          .catch(() => undefined);
      },
    }),
  );
}
