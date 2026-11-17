import type { NotificationPayloadType as DbNotificationPayloadType } from "@workspace/database/schema/notification.const";
import type { NotificationObjectType } from "@workspace/validation/modules/notification/consts/notification-object-type.const";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";

export type NotificationPersistedType = {
  id: string;
  organizationId: string;
  recipientUserId: string;
  type: NotificationType;
  actorUserId: string | null;
  objectType: NotificationObjectType;
  objectId: string;
  projectId: string | null;
  payload: DbNotificationPayloadType;
  readAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
};