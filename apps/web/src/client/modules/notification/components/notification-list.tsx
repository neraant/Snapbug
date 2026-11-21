"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { Mascot } from "@workspace/design-system/components/ui/mascot";
import { Skeleton } from "@workspace/design-system/components/ui/skeleton";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { NotificationListFilter } from "@workspace/validation/modules/notification/consts/notification-list-filter.const";
import type { NotificationModelType } from "@workspace/validation/modules/notification/dto/notification.model";
import { BellIcon } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { NotificationItem } from "@/client/modules/notification/components/notification-item";
import { texts } from "@/client/modules/notification/consts/texts.const";
import type { UseNotificationListReturn } from "@/client/modules/notification/hooks/use-notification-list";
import { formatNotificationDayLabel } from "@/client/modules/notification/utils/format-notification-day-label.util";

type NotificationListProps = {
  tab: NotificationListFilter;
  list: UseNotificationListReturn;
  compact?: boolean;
  selectionMode?: boolean;
  selectedIds?: Set<string>;
  activeId?: string | null;
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onArchive?: (id: string) => void;
  onToggleSelect?: (id: string, checked: boolean) => void;
  onItemFocus?: (id: string) => void;
};

type ListRow =
  | { kind: "divider"; key: string; label: string }
  | { kind: "item"; key: string; notification: NotificationModelType };

function groupRows(items: NotificationModelType[]): ListRow[] {
  const rows: ListRow[] = [];
  let previousLabel: string | null = null;

  for (const notification of items) {
    const label = formatNotificationDayLabel(notification.createdAt);
    if (previousLabel !== label) {
      rows.push({ kind: "divider", key: `day-${label}`, label });
      previousLabel = label;
    }
    rows.push({ kind: "item", key: notification.id, notification });
  }

  return rows;
}

function NotificationListSkeleton() {
  return (
    <Column gap="sm" width="full" padding="sm">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </Column>
  );
}

export function NotificationList({
  tab,
  list,
  compact = false,
  selectionMode = false,
  selectedIds,
  activeId,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onToggleSelect,
  onItemFocus,
}: NotificationListProps) {
  const { items, query } = list;
  const rows = useMemo(() => groupRows(items), [items]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !query.hasNextPage) return;

    const observer = new IntersectionObserver(
      (records) => {
        const [record] = records;
        if (record?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage().catch(() => undefined);
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [query, query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const isInitialLoading = query.isLoading;
  const isEmpty = !isInitialLoading && items.length === 0;
  const emptyMessage = tab === "unread" ? texts.empty.unread : texts.empty.all;

  if (query.isError && items.length === 0) {
    return (
      <Column align="center" justify="center" gap="md" width="full" className="px-4 py-10">
        <Typography variant="text-sm" color="muted" align="center">
          {texts.error.list}
        </Typography>
        <Button type="button" variant="outline" onClick={() => query.refetch().catch(() => undefined)}>
          {texts.error.retry}
        </Button>
      </Column>
    );
  }

  if (isEmpty) {
    return (
      <Column align="center" justify="center" gap="md" width="full" className="px-4 py-10">
        {tab === "unread" ? (
          <Mascot mood="happy" size="sm" />
        ) : (
          <BellIcon className="size-8 text-muted-foreground" aria-hidden />
        )}
        <Typography variant="text-sm" color="muted" align="center">
          {emptyMessage}
        </Typography>
      </Column>
    );
  }

  return (
    <Column gap="none" width="full" minWidth="0" className="min-h-0 flex-1 overflow-y-auto">
      {isInitialLoading ? <NotificationListSkeleton /> : null}
      {!isInitialLoading
        ? rows.map((row) =>
            row.kind === "divider" ? (
              <Typography
                key={row.key}
                variant="text-xs"
                color="muted"
                weight="medium"
                className="sticky top-0 z-10 bg-popover px-3 py-2"
              >
                {row.label}
              </Typography>
            ) : (
              <NotificationItem
                key={row.key}
                notification={row.notification}
                compact={compact}
                selectionMode={selectionMode}
                selected={selectedIds?.has(row.notification.id)}
                active={activeId === row.notification.id}
                onMarkRead={onMarkRead}
                onMarkUnread={onMarkUnread}
                onArchive={onArchive}
                onToggleSelect={onToggleSelect}
                onFocus={() => onItemFocus?.(row.notification.id)}
              />
            ),
          )
        : null}

      {query.isFetchingNextPage ? (
        <Column gap="sm" width="full" padding="sm">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </Column>
      ) : null}

      {query.isFetchNextPageError ? (
        <Row align="center" justify="center" gap="sm" width="full" className="py-3">
          <Typography variant="text-sm" color="muted">
            {texts.error.list}
          </Typography>
          <Button type="button" variant="link" onClick={() => query.fetchNextPage().catch(() => undefined)}>
            {texts.error.retry}
          </Button>
        </Row>
      ) : null}

      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
    </Column>
  );
}
