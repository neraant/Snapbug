"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NotificationListFilter } from "@workspace/validation/modules/notification/consts/notification-list-filter.const";
import type { NotificationModelType } from "@workspace/validation/modules/notification/dto/notification.model";
import type { UnreadCountOutputDtoType } from "@workspace/validation/modules/notification/dto/unread-count.schema";
import { useCallback } from "react";

import { orpcClient, orpcQuery } from "@/client/modules/shared/orpc/query-utils";

type NotificationListQueryData = {
  pages: Array<{ items: NotificationModelType[]; nextCursor: string | null }>;
  pageParams: unknown[];
};

function patchItems(
  data: NotificationListQueryData | undefined,
  ids: Set<string>,
  patch: (item: NotificationModelType) => NotificationModelType,
): NotificationListQueryData | undefined {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items
        .map((item) => (ids.has(item.id) ? patch(item) : item))
        .filter((item) => item.archivedAt == null),
    })),
  };
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: orpcQuery.notification.unreadCount.key() }),
      queryClient.invalidateQueries({ queryKey: orpcQuery.notification.list.key() }),
    ]);
  }, [queryClient]);

  const markRead = useMutation({
    mutationFn: (ids: string[]) => orpcClient.notification.markRead({ ids }),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: orpcQuery.notification.list.key() });
      const now = new Date().toISOString();
      const idSet = new Set(ids);
      queryClient.setQueriesData<NotificationListQueryData>(
        { queryKey: orpcQuery.notification.list.key() },
        (current) => patchItems(current, idSet, (item) => ({ ...item, readAt: item.readAt ?? now })),
      );
      queryClient.setQueryData<UnreadCountOutputDtoType>(
        orpcQuery.notification.unreadCount.queryOptions().queryKey,
        (current: UnreadCountOutputDtoType | undefined) =>
          current ? { count: Math.max(0, current.count - ids.length) } : current,
      );
    },
    onError: async () => {
      await invalidateAll();
    },
    onSettled: async () => {
      await invalidateAll();
    },
  });

  const markUnread = useMutation({
    mutationFn: (ids: string[]) => orpcClient.notification.markUnread({ ids }),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: orpcQuery.notification.list.key() });
      const idSet = new Set(ids);
      queryClient.setQueriesData<NotificationListQueryData>(
        { queryKey: orpcQuery.notification.list.key() },
        (current) => patchItems(current, idSet, (item) => ({ ...item, readAt: null })),
      );
      queryClient.setQueryData<UnreadCountOutputDtoType>(
        orpcQuery.notification.unreadCount.queryOptions().queryKey,
        (current: UnreadCountOutputDtoType | undefined) => (current ? { count: current.count + ids.length } : current),
      );
    },
    onError: async () => {
      await invalidateAll();
    },
    onSettled: async () => {
      await invalidateAll();
    },
  });

  const markAllRead = useMutation({
    mutationFn: () => orpcClient.notification.markAllRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: orpcQuery.notification.list.key() });
      const now = new Date().toISOString();
      queryClient.setQueriesData<NotificationListQueryData>(
        { queryKey: orpcQuery.notification.list.key() },
        (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              items: page.items.map((item) => ({ ...item, readAt: item.readAt ?? now })),
            })),
          };
        },
      );
      queryClient.setQueryData<UnreadCountOutputDtoType>(orpcQuery.notification.unreadCount.queryOptions().queryKey, {
        count: 0,
      });
    },
    onError: async () => {
      await invalidateAll();
    },
    onSettled: async () => {
      await invalidateAll();
    },
  });

  const archive = useMutation({
    mutationFn: (ids: string[]) => orpcClient.notification.archive({ ids }),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: orpcQuery.notification.list.key() });
      const idSet = new Set(ids);
      const now = new Date().toISOString();
      queryClient.setQueriesData<NotificationListQueryData>(
        { queryKey: orpcQuery.notification.list.key() },
        (current) => patchItems(current, idSet, (item) => ({ ...item, archivedAt: item.archivedAt ?? now })),
      );
    },
    onError: async () => {
      await invalidateAll();
    },
    onSettled: async () => {
      await invalidateAll();
    },
  });

  const markReadById = useCallback((id: string) => markRead.mutate([id]), [markRead]);

  return {
    markRead,
    markUnread,
    markAllRead,
    archive,
    markReadById,
    isPending: markRead.isPending || markUnread.isPending || markAllRead.isPending || archive.isPending,
  };
}

export type NotificationTabFilter = NotificationListFilter;
