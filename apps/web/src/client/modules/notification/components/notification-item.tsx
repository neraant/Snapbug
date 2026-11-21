"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Button } from "@workspace/design-system/components/ui/button";
import { Checkbox } from "@workspace/design-system/components/ui/checkbox";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { NotificationModelType } from "@workspace/validation/modules/notification/dto/notification.model";
import { ArchiveIcon, BotIcon, CheckIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { type MouseEvent } from "react";

import { NotificationMessage } from "@/client/modules/notification/components/notification-message";
import { texts } from "@/client/modules/notification/consts/texts.const";
import {
  formatNotificationMessage,
  notificationMessagePlainText,
} from "@/client/modules/notification/utils/format-notification-message.util";
import { notificationTypeIcon } from "@/client/modules/notification/utils/notification-type-icon.util";
import { resolveNotificationHref } from "@/client/modules/notification/utils/resolve-notification-href.util";
import { formatUserDate } from "@/client/modules/preference/utils/format-user-date.util";

type NotificationItemProps = {
  notification: NotificationModelType;
  compact?: boolean;
  selected?: boolean;
  selectable?: boolean;
  active?: boolean;
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onArchive?: (id: string) => void;
  onOpen?: (id: string) => void;
  onToggleSelect?: (id: string, checked: boolean) => void;
  onFocus?: VoidFunction;
};

function actorInitials(notification: NotificationModelType): string {
  const name = notification.payload.actorName?.trim();
  if (!name) return "SB";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? "SB";
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export function NotificationItem({
  notification,
  compact = false,
  selected = false,
  selectable = false,
  active = false,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onOpen,
  onToggleSelect,
  onFocus,
}: NotificationItemProps) {
  const isUnread = !notification.readAt;
  const href = resolveNotificationHref(notification);
  const unavailable = !notification.accessible;
  const message = formatNotificationMessage(notification);
  const summary = notificationMessagePlainText(notification);
  const TypeIcon = notificationTypeIcon(notification.type);
  const metaProject = notification.payload.projectName?.trim();
  const metaTime = formatUserDate({
    createdAt: notification.createdAt,
    timeZone: "UTC",
    relative: true,
  });
  const metaLine = [metaProject, metaTime].filter(Boolean).join(" · ");
  const system = notification.actorUserId == null;

  const handleOpen = () => {
    if (isUnread) onMarkRead?.(notification.id);
    onOpen?.(notification.id);
  };

  const handleRowClick = (event: MouseEvent) => {
    if (unavailable || !href) return;
    if (event.defaultPrevented) return;
    handleOpen();
  };

  const rowClassName = cn(
    "group relative flex gap-3 rounded-lg px-3 py-2.5 transition-colors outline-none",
    isUnread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50",
    active ? "ring-2 ring-ring ring-offset-1 ring-offset-background" : null,
    href && !unavailable ? "cursor-pointer" : null,
  );

  const content = (
    <>
      <div className="relative shrink-0">
        <Avatar size="md">
          {system ? (
            <AvatarFallback>
              <BotIcon className="size-4" aria-hidden />
            </AvatarFallback>
          ) : (
            <AvatarFallback>{actorInitials(notification)}</AvatarFallback>
          )}
        </Avatar>
        <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full border border-background bg-muted text-muted-foreground">
          <TypeIcon className="size-2.5" aria-hidden />
        </span>
      </div>

      <Column gap={compact ? "none" : "xs"} minWidth="0" className="min-w-0 flex-1">
        {unavailable ? (
          <Typography variant="text-sm" color="muted">
            {texts.item.unavailable}
          </Typography>
        ) : (
          <>
            <NotificationMessage content={message} />
            {metaLine ? (
              <Typography variant="text-xs" color="muted" className="truncate">
                {metaLine}
              </Typography>
            ) : null}
          </>
        )}
      </Column>

      <Row align="center" gap="xs" wrap={false} className="shrink-0 self-start pt-0.5">
        {isUnread ? <span className="mt-1 size-2 rounded-full bg-primary" aria-hidden /> : null}
        {selectable ? (
          <Checkbox
            checked={selected}
            className={cn("opacity-0 transition-opacity group-hover:opacity-100", selected ? "opacity-100" : null)}
            aria-label={texts.item.select(notification.id)}
            onCheckedChange={(checked) => onToggleSelect?.(notification.id, checked === true)}
          />
        ) : null}
        <Row align="center" gap="xs" wrap={false} className="opacity-0 transition-opacity group-hover:opacity-100">
          {isUnread ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={texts.item.markRead}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onMarkRead?.(notification.id);
              }}
            >
              <CheckIcon />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={texts.item.markUnread}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onMarkUnread?.(notification.id);
              }}
            >
              <MailIcon />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={texts.item.archive}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onArchive?.(notification.id);
            }}
          >
            <ArchiveIcon />
          </Button>
        </Row>
      </Row>
    </>
  );

  if (unavailable || !href) {
    return (
      <div role="group" tabIndex={0} className={rowClassName} aria-label={texts.item.open(summary)} onFocus={onFocus}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={rowClassName}
      aria-label={texts.item.open(summary)}
      onClick={handleRowClick}
      onFocus={onFocus}
    >
      {content}
    </Link>
  );
}
