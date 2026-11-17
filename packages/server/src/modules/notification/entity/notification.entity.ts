import type { NotificationPersistedType } from "@workspace/server/modules/notification/entity/notification.types";

export class Notification {
  readonly id: NotificationPersistedType["id"];
  readonly organizationId: NotificationPersistedType["organizationId"];
  readonly recipientUserId: NotificationPersistedType["recipientUserId"];
  readonly type: NotificationPersistedType["type"];
  readonly actorUserId: NotificationPersistedType["actorUserId"];
  readonly objectType: NotificationPersistedType["objectType"];
  readonly objectId: NotificationPersistedType["objectId"];
  readonly projectId: NotificationPersistedType["projectId"];
  readonly payload: NotificationPersistedType["payload"];
  readonly readAt: NotificationPersistedType["readAt"];
  readonly archivedAt: NotificationPersistedType["archivedAt"];
  readonly createdAt: NotificationPersistedType["createdAt"];

  constructor(notification: NotificationPersistedType) {
    this.id = notification.id;
    this.organizationId = notification.organizationId;
    this.recipientUserId = notification.recipientUserId;
    this.type = notification.type;
    this.actorUserId = notification.actorUserId;
    this.objectType = notification.objectType;
    this.objectId = notification.objectId;
    this.projectId = notification.projectId;
    this.payload = notification.payload;
    this.readAt = notification.readAt;
    this.archivedAt = notification.archivedAt;
    this.createdAt = notification.createdAt;
  }

  toObject(): NotificationPersistedType {
    return {
      id: this.id,
      organizationId: this.organizationId,
      recipientUserId: this.recipientUserId,
      type: this.type,
      actorUserId: this.actorUserId,
      objectType: this.objectType,
      objectId: this.objectId,
      projectId: this.projectId,
      payload: this.payload,
      readAt: this.readAt,
      archivedAt: this.archivedAt,
      createdAt: this.createdAt,
    };
  }

  markRead(at: Date): Notification {
    if (this.readAt) return this;
    return new Notification({ ...this.toObject(), readAt: at });
  }

  markUnread(): Notification {
    if (!this.readAt) return this;
    return new Notification({ ...this.toObject(), readAt: null });
  }

  archive(at: Date): Notification {
    if (this.archivedAt) return this;
    return new Notification({ ...this.toObject(), archivedAt: at });
  }

  bumpGrouped(payload: NotificationPersistedType["payload"], at: Date): Notification {
    return new Notification({
      ...this.toObject(),
      payload,
      createdAt: at,
      readAt: null,
    });
  }
}