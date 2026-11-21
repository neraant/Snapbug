"use client";

import { Column } from "@workspace/design-system/components/layout/column";
import { Row } from "@workspace/design-system/components/layout/row";
import { Avatar, AvatarFallback } from "@workspace/design-system/components/ui/avatar";
import { Button } from "@workspace/design-system/components/ui/button";
import { Checkbox } from "@workspace/design-system/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/design-system/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { Typography } from "@workspace/design-system/components/ui/typography";
import { cn } from "@workspace/design-system/lib/utils";
import type { NotificationModelType } from "@workspace/validation/modules/notification/dto/notification.model";
import { ArchiveIcon, BotIcon, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { type KeyboardEvent, type MouseEvent } from "react";

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
  selectionMode?: boolean;
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

function NotificationItemMenu({
  notification,
  isUnread,
  onMarkRead,
  onMarkUnread,
  onArchive,
}: {
  notification: NotificationModelType;
  isUnread: boolean;
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onArchive?: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={texts.item.menuLabel}
                  className={cn(
                    "shrink-0 opacity-100 max-sm:opacity-100 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100",
                  )}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
          }
        />
        <TooltipContent>{texts.item.menuLabel}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
        {isUnread ? (
          <DropdownMenuItem
            onClick={() => {
              onMarkRead?.(notification.id);
            }}
          >
            {texts.item.markRead}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              onMarkUnread?.(notification.id);
            }}
          >
            {texts.item.markUnread}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            onArchive?.(notification.id);
          }}
        >
          <ArchiveIcon />
          {texts.item.archive}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NotificationItem({
  notification,
  compact = false,
  selected = false,
  selectionMode = false,
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
  const canNavigate = Boolean(href && !unavailable);

  const handleOpen = () => {
    if (isUnread) onMarkRead?.(notification.id);
    onOpen?.(notification.id);
  };

  const handleRowClick = (event: MouseEvent) => {
    if (selectionMode) {
      event.preventDefault();
      onToggleSelect?.(notification.id, !selected);
      return;
    }
    if (unavailable || !href) return;
    if (event.defaultPrevented) return;
    handleOpen();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (selectionMode && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onToggleSelect?.(notification.id, !selected);
      return;
    }
    if (!selectionMode && event.key === "Enter" && canNavigate) {
      event.preventDefault();
      handleOpen();
    }
  };

  const rowClassName = cn(
    "group relative flex gap-3 rounded-lg px-3 py-2.5 transition-colors outline-none",
    isUnread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50",
    active ? "ring-2 ring-ring ring-offset-1 ring-offset-background" : null,
    canNavigate || selectionMode ? "cursor-pointer" : null,
  );

  const content = (
    <>
      {selectionMode ? (
        <div className="flex w-7 shrink-0 items-start pt-1">
          <Checkbox
            checked={selected}
            aria-label={texts.item.select(notification.id)}
            onCheckedChange={(checked) => onToggleSelect?.(notification.id, checked === true)}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}

      <div className="flex w-2 shrink-0 items-start justify-center pt-3">
        {isUnread ? <span className="size-2 rounded-full bg-primary" aria-hidden /> : null}
      </div>

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

      {!unavailable ? (
        <Row align="start" gap="xs" wrap={false} className="shrink-0 self-start pt-0.5">
          <NotificationItemMenu
            notification={notification}
            isUnread={isUnread}
            onMarkRead={onMarkRead}
            onMarkUnread={onMarkUnread}
            onArchive={onArchive}
          />
        </Row>
      ) : null}
    </>
  );

  if (selectionMode) {
    return (
      <div
        role="option"
        aria-selected={selected}
        tabIndex={0}
        className={rowClassName}
        aria-label={texts.item.open(summary)}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
      >
        {content}
      </div>
    );
  }

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
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
    >
      {content}
    </Link>
  );
}
