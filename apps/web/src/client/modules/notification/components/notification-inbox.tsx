"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { PageContainer } from "@workspace/design-system/components/layout/page";
import { Row } from "@workspace/design-system/components/layout/row";
import { Button } from "@workspace/design-system/components/ui/button";
import { SegmentedControl, type SegmentedControlItem } from "@workspace/design-system/components/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/design-system/components/ui/select";
import type { NotificationListFilter } from "@workspace/validation/modules/notification/consts/notification-list-filter.const";
import { useCallback, useMemo, useState } from "react";

import { NotificationInboxBulkBar } from "@/client/modules/notification/components/notification-inbox-bulk-bar";
import { NotificationList } from "@/client/modules/notification/components/notification-list";
import {
  type NotificationTypeFilter,
  notificationTypeFilters,
} from "@/client/modules/notification/consts/notification-type-filter.const";
import { texts } from "@/client/modules/notification/consts/texts.const";
import { useNotificationList } from "@/client/modules/notification/hooks/use-notification-list";
import { useNotificationMutations } from "@/client/modules/notification/hooks/use-notification-mutations";
import { useNotificationUnreadCount } from "@/client/modules/shared/queries/use-notification-unread-count";

export function NotificationInbox() {
  const [tab, setTab] = useState<NotificationListFilter>("unread");
  const [typeFilter, setTypeFilter] = useState<NotificationTypeFilter>(notificationTypeFilters.all);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const list = useNotificationList({ tab, typeFilter });
  const { data: unread } = useNotificationUnreadCount();
  const { markRead, markUnread, archive, markAllRead } = useNotificationMutations();

  const tabItems = useMemo<SegmentedControlItem[]>(
    () => [
      { value: "unread", label: texts.popover.unread },
      { value: "all", label: texts.popover.all },
    ],
    [],
  );

  const toggleSelect = useCallback((id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const bulkMarkRead = () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    markRead.mutate(ids, { onSuccess: clearSelection });
  };

  const bulkArchive = () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    archive.mutate(ids, { onSuccess: clearSelection });
  };

  return (
    <PageContainer title={texts.inbox.title} description={texts.inbox.description}>
      <Column gap="lg" width="full" minWidth="0" className="min-h-0 flex-1">
        <Row align="center" justify="between" wrap gap="md" width="full">
          <Row align="center" gap="md" wrap>
            <SegmentedControl
              size="sm"
              aria-label={texts.inbox.tabsAria}
              items={tabItems}
              value={tab}
              onValueChange={(value) => setTab(value as NotificationListFilter)}
            />
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as NotificationTypeFilter)}
            >
              <SelectTrigger className="w-44" aria-label={texts.inbox.typeFilterLabel}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={notificationTypeFilters.all}>{texts.inbox.typeAll}</SelectItem>
                <SelectItem value={notificationTypeFilters.ticket}>{texts.inbox.typeTicket}</SelectItem>
                <SelectItem value={notificationTypeFilters.comment}>{texts.inbox.typeComment}</SelectItem>
                <SelectItem value={notificationTypeFilters.team}>{texts.inbox.typeTeam}</SelectItem>
                <SelectItem value={notificationTypeFilters.security}>{texts.inbox.typeSecurity}</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={(unread?.count ?? 0) === 0 || markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            {texts.bell.markAllRead}
          </Button>
        </Row>

        {selectedIds.size > 0 ? (
          <NotificationInboxBulkBar
            count={selectedIds.size}
            onMarkRead={bulkMarkRead}
            onArchive={bulkArchive}
            onClear={clearSelection}
            pending={markRead.isPending || archive.isPending}
          />
        ) : null}

        <Column
          gap="none"
          width="full"
          minWidth="0"
          className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card"
        >
          <NotificationList
            tab={tab}
            list={list}
            selectable
            selectedIds={selectedIds}
            onMarkRead={(id) => markRead.mutate([id])}
            onMarkUnread={(id) => markUnread.mutate([id])}
            onArchive={(id) => archive.mutate([id])}
            onToggleSelect={toggleSelect}
          />
        </Column>
      </Column>
    </PageContainer>
  );
}

function NotificationInboxFallback() {
  return <PageContainer title={texts.inbox.title} description={texts.inbox.description} />;
}

NotificationInbox.Fallback = NotificationInboxFallback;