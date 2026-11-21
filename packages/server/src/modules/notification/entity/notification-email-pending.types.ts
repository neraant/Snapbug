import type { NotificationObjectType } from "@workspace/validation/modules/notification/consts/notification-object-type.const";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";
import type { NotificationPayloadType } from "@workspace/validation/modules/notification/dto/notification-payload.schema";

export type NotificationEmailPendingPersistedType = {
  id: string;
  userId: string;
  organizationId: string;
  type: NotificationType;
  actorUserId: string | null;
  objectType: NotificationObjectType;
  objectId: string;
  projectId: string | null;
  payload: NotificationPayloadType;
  createdAt: Date;
};
