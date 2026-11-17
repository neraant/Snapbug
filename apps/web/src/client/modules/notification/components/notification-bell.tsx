"use client";

import { Button } from "@workspace/design-system/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/design-system/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/design-system/components/ui/tooltip";
import { cn } from "@workspace/design-system/lib/utils";
import { BellIcon } from "lucide-react";
import { useState } from "react";

import { NotificationPopoverPanel } from "@/client/modules/notification/components/notification-popover-panel";
import { texts } from "@/client/modules/notification/consts/texts.const";
import { formatUnreadBadge } from "@/client/modules/notification/utils/format-unread-badge.util";
import { notificationBellAriaLabel } from "@/client/modules/notification/utils/notification-bell-aria-label.util";
import { useNotificationUnreadCount } from "@/client/modules/shared/queries/use-notification-unread-count";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data } = useNotificationUnreadCount();
  const unreadCount = data?.count ?? 0;
  const badgeLabel = formatUnreadBadge(unreadCount);
  const ariaLabel = notificationBellAriaLabel(unreadCount);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="relative size-9 shrink-0"
                  aria-label={ariaLabel}
                />
              }
            />
          }
        >
          <BellIcon />
          {badgeLabel ? (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 py-0 text-[10px] leading-none font-semibold text-primary-foreground",
              )}
              aria-hidden
            >
              {badgeLabel}
            </span>
          ) : null}
        </TooltipTrigger>
        <TooltipContent>{texts.bell.label}</TooltipContent>
      </Tooltip>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="max-h-[480px] w-[400px] gap-0 overflow-hidden p-0"
      >
        <NotificationPopoverPanel onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
