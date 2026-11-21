import { useInfiniteQuery } from "@tanstack/react-query";
import type { FindActivityLogsInputDtoType } from "@workspace/validation/modules/audit/dto/find-activity-logs-input.schema";

import { orpcClient, orpcQuery } from "@/client/modules/shared/orpc/query-utils";

const defaultLimit = 50;

type UseFindActivityLogsInput = Omit<FindActivityLogsInputDtoType, "cursor" | "limit">;

export function useFindActivityLogs(input: UseFindActivityLogsInput) {
  const requestInput: FindActivityLogsInputDtoType = {
    limit: defaultLimit,
    search: input.search?.trim() ? input.search.trim() : undefined,
    actorId: input.actorId,
    entityType: input.entityType,
    range: input.range,
  };

  return useInfiniteQuery({
    queryKey: [...orpcQuery.audit.findActivityLogs.key({ input: requestInput }), "infinite"],
    queryFn: async ({ pageParam }) => {
      return await orpcClient.audit.findActivityLogs({
        ...requestInput,
        cursor: pageParam,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnWindowFocus: true,
  });
}
