export const notificationObjectTypes = [
  "bug-report",
  "project",
  "membership",
  "invitation",
  "user-token",
  "api-key",
] as const;

export type NotificationObjectType = (typeof notificationObjectTypes)[number];