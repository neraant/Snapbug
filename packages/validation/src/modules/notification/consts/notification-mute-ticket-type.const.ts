import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";

export const notificationMuteTicketTypes = [
  "ticket.assigned",
  "ticket.created",
  "ticket.status_changed",
  "comment.created",
] as const satisfies readonly NotificationType[];

export type NotificationMuteTicketType = (typeof notificationMuteTicketTypes)[number];