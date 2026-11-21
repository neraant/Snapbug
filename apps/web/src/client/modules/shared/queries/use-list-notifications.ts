import { useInfiniteQuery } from "@tanstack/react-query";
import type { ListNotificationInputDtoType } from "@workspace/validation/modules/notification/dto/list-notification.schema";

import { notificationListLimit } from "@/client/modules/notification/consts/notification-list.const";
import { orpcClient, orpcQuery } from "@/client/modules/shared/orpc/query-utils";

type UseListNotificationsInput = Omit<ListNotificationInputDtoType, "cursor" | "limit">;

export function useListNotifications(input: UseListNotificationsInput) {
  const requestInput: ListNotificationInputDtoType = {
    limit: notificationListLimit,
    filter: input.filter,
    types: input.types && input.types.length > 0 ? input.types : undefined,
  };

  return useInfiniteQuery({
    queryKey: [...orpcQuery.notification.list.key({ input: requestInput }), "infinite"],
    queryFn: async ({ pageParam }) => {
      return await orpcClient.notification.list({
        ...requestInput,
        cursor: pageParam,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnWindowFocus: true,
  });
}
