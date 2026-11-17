import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";

export const notificationTypeFilters = {
  all: "all",
  ticket: "ticket",
  comment: "comment",
  team: "team",
  security: "security",
} as const;

export type NotificationTypeFilter = (typeof notificationTypeFilters)[keyof typeof notificationTypeFilters];

export const notificationTypesByFilter: Record<Exclude<NotificationTypeFilter, "all">, NotificationType[]> = {
  ticket: ["ticket.assigned", "ticket.created", "ticket.status_changed"],
  comment: ["comment.created"],
  team: [
    "membership.role_changed",
    "project.access_granted",
    "project.access_revoked",
    "invitation.accepted",
    "project.archived",
  ],
  security: ["security.api_key_rotated", "security.token_created"],
};