"use client";

import type { NotificationListFilter } from "@workspace/validation/modules/notification/consts/notification-list-filter.const";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";
import { useMemo } from "react";

import {
  type NotificationTypeFilter,
  notificationTypeFilters,
  notificationTypesByFilter,
} from "@/client/modules/notification/consts/notification-type-filter.const";
import { useListNotifications } from "@/client/modules/shared/queries/use-list-notifications";

type UseNotificationListInput = {
  tab: NotificationListFilter;
  typeFilter?: NotificationTypeFilter;
};

function resolveTypes(typeFilter: NotificationTypeFilter | undefined): NotificationType[] | undefined {
  if (!typeFilter || typeFilter === notificationTypeFilters.all) return undefined;
  return notificationTypesByFilter[typeFilter];
}

export function useNotificationList({ tab, typeFilter = notificationTypeFilters.all }: UseNotificationListInput) {
  const types = resolveTypes(typeFilter);
  const query = useListNotifications({ filter: tab, types });

  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);

  return {
    items,
    query,
    tab,
    typeFilter,
  };
}

export type UseNotificationListReturn = ReturnType<typeof useNotificationList>;
