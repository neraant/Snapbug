import { texts } from "@/client/modules/notification/consts/texts.const";

export function notificationBellAriaLabel(unreadCount: number): string {
  if (unreadCount <= 0) return texts.bell.label;
  return texts.bell.labelUnread(unreadCount);
}
