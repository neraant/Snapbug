import type { NotificationObjectType } from "@workspace/validation/modules/notification/consts/notification-object-type.const";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function notificationSettingsUrl(): string {
  return `${appUrl()}/settings?tab=notifications`;
}

export function notificationObjectUrl(
  objectType: NotificationObjectType,
  payload: NotificationPayloadType,
): string | null {
  const base = appUrl();
  switch (objectType) {
    case "bug-report":
      if (!payload.ticketShortId) return `${base}/tickets`;
      return `${base}/tickets/${encodeURIComponent(payload.ticketShortId)}`;
    case "project":
      return `${base}/projects`;
    case "membership":
    case "invitation":
      return `${base}/team`;
    case "user-token":
      return `${base}/mcp`;
    case "api-key":
      return `${base}/sdk`;
    default:
      return null;
  }
}
