"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { SegmentedControl, type SegmentedControlItem } from "@workspace/design-system/components/ui/segmented-control";
import { Separator } from "@workspace/design-system/components/ui/separator";
import { Typography } from "@workspace/design-system/components/ui/typography";
import type { NotificationListFilter } from "@workspace/validation/modules/notification/consts/notification-list-filter.const";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { NotificationList } from "@/client/modules/notification/components/notification-list";
import { texts } from "@/client/modules/notification/consts/texts.const";
import { useNotificationList } from "@/client/modules/notification/hooks/use-notification-list";
import { useNotificationMutations } from "@/client/modules/notification/hooks/use-notification-mutations";
import { resolveNotificationHref } from "@/client/modules/notification/utils/resolve-notification-href.util";
import { useNotificationUnreadCount } from "@/client/modules/shared/queries/use-notification-unread-count";
import { url } from "@/shared/build-url.util";

type NotificationPopoverPanelProps = {
  onClose: VoidFunction;
};

export function NotificationPopoverPanel({ onClose }: NotificationPopoverPanelProps) {
  const router = useRouter();
  const [tab, setTab] = useState<NotificationListFilter>("unread");
  const list = useNotificationList({ tab });
  const { data: unread } = useNotificationUnreadCount();
  const { markReadById, markUnread, archive, markAllRead } = useNotificationMutations();
  const [activeId, setActiveId] = useState<string | null>(null);

  const tabItems = useMemo<SegmentedControlItem[]>(
    () => [
      { value: "unread", label: texts.popover.unread },
      { value: "all", label: texts.popover.all },
    ],
    [],
  );

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const moveActive = useCallback(
    (direction: 1 | -1) => {
      const { items } = list;
      if (items.length === 0) return;
      const currentIndex = activeId ? items.findIndex((item) => item.id === activeId) : -1;
      let nextIndex = currentIndex + direction;
      if (currentIndex === -1 && direction === 1) nextIndex = 0;
      if (nextIndex < 0 || nextIndex >= items.length) return;
      setActiveId(items[nextIndex]?.id ?? null);
    },
    [activeId, list],
  );

  const openNotification = useCallback(
    (id: string) => {
      const notification = list.items.find((item) => item.id === id);
      if (!notification?.accessible) return;
      const href = resolveNotificationHref(notification);
      if (!href) return;
      onClose();
      if (!notification.readAt) markReadById(notification.id);
      window.location.assign(href);
    },
    [list.items, markReadById, onClose, router],
  );

  const openActiveItem = useCallback(() => {
    if (!activeId) return;
    if (!list.items.find((item) => item.id === activeId)?.readAt) {
      markReadById(activeId);
    }
    openNotification(activeId);
  }, [activeId, list.items, markReadById, openNotification]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
      } else if (event.key === "Enter") {
        if (!activeId) return;
        event.preventDefault();
        openActiveItem();
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeId, moveActive, onClose, openActiveItem]);

  return (
    <Column gap="none" width="full" className="max-h-[480px] min-h-0">
      <Column gap="sm" padding="md" className="shrink-0">
        <Row align="center" justify="between" wrap={false} width="full">
          <Typography variant="heading-xs" weight="semibold">
            {texts.popover.title}
          </Typography>
          <Row align="center" gap="xs" wrap={false}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={(unread?.count ?? 0) === 0 || markAllRead.isPending}
              onClick={handleMarkAllRead}
            >
              {texts.bell.markAllRead}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={texts.bell.settings}
              nativeButton={false}
              render={<Link href={url.settingsNotifications()} />}
            >
              <SettingsIcon />
            </Button>
          </Row>
        </Row>
        <SegmentedControl
          size="sm"
          aria-label={texts.popover.tabsAria}
          items={tabItems}
          value={tab}
          onValueChange={(value) => setTab(value as NotificationListFilter)}
        />
      </Column>
      <Separator />
      <NotificationList
        tab={tab}
        list={list}
        compact
        activeId={activeId}
        onMarkRead={markReadById}
        onMarkUnread={(id) => markUnread.mutate([id])}
        onArchive={(id) => archive.mutate([id])}
        onItemFocus={setActiveId}
        onOpen={openNotification}
      />
      <Separator />
      <Row justify="center" width="full" className="shrink-0 px-3 py-2">
        <Button
          type="button"
          variant="link"
          size="sm"
          nativeButton={false}
          render={<Link href={url.notifications()} onClick={onClose} />}
        >
          {texts.bell.viewAll}
        </Button>
      </Row>
    </Column>
  );
}
