export const notificationTypes = [
  "ticket.assigned",
  "ticket.created",
  "ticket.status_changed",
  "comment.created",
  "membership.role_changed",
  "project.access_granted",
  "project.access_revoked",
  "invitation.accepted",
  "project.archived",
  "security.api_key_rotated",
  "security.token_created",
] as const;

export type NotificationType = (typeof notificationTypes)[number];