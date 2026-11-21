import { notificationUnreadBadgeCap } from "@/client/modules/notification/consts/notification-list.const";
import { texts } from "@/client/modules/notification/consts/texts.const";

export function formatUnreadBadge(count: number): string | null {
  if (count <= 0) return null;
  const capped = count > notificationUnreadBadgeCap ? notificationUnreadBadgeCap + 1 : count;
  return texts.bell.unreadBadge(capped);
}
