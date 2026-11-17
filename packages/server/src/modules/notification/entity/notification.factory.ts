import { Notification } from "@workspace/server/modules/notification/entity/notification.entity";
import type { NotificationPersistedType } from "@workspace/server/modules/notification/entity/notification.types";
import { randomUUID } from "crypto";

export class NotificationFactory {
  static create(
    input: Omit<NotificationPersistedType, "id" | "readAt" | "archivedAt" | "createdAt"> & { id?: string; createdAt?: Date },
  ): Notification {
    const now = input.createdAt ?? new Date();
    return new Notification({
      id: input.id ?? randomUUID(),
      organizationId: input.organizationId,
      recipientUserId: input.recipientUserId,
      type: input.type,
      actorUserId: input.actorUserId,
      objectType: input.objectType,
      objectId: input.objectId,
      projectId: input.projectId,
      payload: input.payload,
      readAt: null,
      archivedAt: null,
      createdAt: now,
    });
  }
}