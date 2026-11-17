import { useQuery } from "@tanstack/react-query";

import { notificationUnreadPollIntervalMs } from "@/client/modules/notification/consts/notification-list.const";
import { orpcQuery } from "@/client/modules/shared/orpc/query-utils";

export function useNotificationUnreadCount() {
  return useQuery({
    ...orpcQuery.notification.unreadCount.queryOptions(),
    refetchInterval: notificationUnreadPollIntervalMs,
    refetchOnWindowFocus: true,
  });
}