export const notificationListFilters = ["unread", "all"] as const;

export type NotificationListFilter = (typeof notificationListFilters)[number];