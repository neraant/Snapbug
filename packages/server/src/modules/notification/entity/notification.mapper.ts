import { Notification } from "@workspace/server/modules/notification/entity/notification.entity";
import type { NotificationPersistedType } from "@workspace/server/modules/notification/entity/notification.types";
import type { NotificationModelType } from "@workspace/validation/modules/notification/dto/notification.model";

export class NotificationMapper {
  static fromPersistence(row: NotificationPersistedType): Notification {
    return new Notification(row);
  }

  static toPersistence(notification: Notification): NotificationPersistedType {
    return notification.toObject();
  }

  static toDto(notification: Notification, accessible: boolean): NotificationModelType {
    const row = notification.toObject();
    return {
      id: row.id,
      organizationId: row.organizationId,
      recipientUserId: row.recipientUserId,
      type: row.type,
      actorUserId: row.actorUserId,
      objectType: row.objectType,
      objectId: row.objectId,
      projectId: row.projectId,
      payload: row.payload,
      readAt: row.readAt?.toISOString() ?? null,
      archivedAt: row.archivedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      accessible,
    };
  }
}
