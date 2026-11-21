import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";
import type { LucideIcon } from "lucide-react";
import { BellIcon, KeyRoundIcon, MessageSquareIcon, ShieldAlertIcon, TicketIcon, UserRoundIcon } from "lucide-react";

export function notificationTypeIcon(type: NotificationType): LucideIcon {
  if (type.startsWith("ticket.")) return TicketIcon;
  if (type === "comment.created") return MessageSquareIcon;
  if (type.startsWith("security.")) return ShieldAlertIcon;
  if (type === "security.token_created") return KeyRoundIcon;
  if (type.startsWith("membership.") || type.startsWith("project.") || type === "invitation.accepted") {
    return UserRoundIcon;
  }
  return BellIcon;
}
