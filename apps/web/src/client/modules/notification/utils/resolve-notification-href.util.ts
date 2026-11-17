import type { NotificationModelType } from "@workspace/validation/modules/notification/dto/notification.model";

import { url } from "@/shared/build-url.util";

export function resolveNotificationHref(notification: NotificationModelType): string | null {
  if (!notification.accessible) return null;

  switch (notification.objectType) {
    case "bug-report":
      if (!notification.payload.ticketShortId) return url.ticketsBoard();
      return url.ticket(notification.payload.ticketShortId);
    case "project":
      return url.projects();
    case "membership":
      return url.team();
    case "invitation":
      return url.team();
    case "user-token":
      return url.mcp();
    case "api-key":
      return url.sdk();
    default:
      return null;
  }
}