import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { notificationTable } from "@workspace/database/schema/notification.const";
import type { Notification } from "@workspace/server/modules/notification/entity/notification.entity";
import { NotificationMapper } from "@workspace/server/modules/notification/entity/notification.mapper";
import type { NotificationPersistedType } from "@workspace/server/modules/notification/entity/notification.types";
import { decodeNotificationCursor } from "@workspace/server/modules/notification/notification-cursor.util";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { NotificationListFilter } from "@workspace/validation/modules/notification/consts/notification-list-filter.const";
import type { NotificationType } from "@workspace/validation/modules/notification/consts/notification-type.const";
import { and, desc, eq, gt, inArray, isNull, lt, or, sql } from "drizzle-orm";

export type FindNotificationsPageInput = {
  organizationId: string;
  recipientUserId: string;
  limit: number;
  cursor?: string;
  filter?: NotificationListFilter;
  types?: NotificationType[];
};

const GROUPABLE_TYPES: NotificationType[] = ["comment.created", "ticket.status_changed"];

export class NotificationRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): NotificationRepository {
    return new NotificationRepository(tx);
  }

  async save(notification: Notification): Promise<void> {
    const values = NotificationMapper.toPersistence(notification);
    try {
      await this.db
        .insert(notificationTable)
        .values(values)
        .onConflictDoUpdate({
          target: notificationTable.id,
          set: {
            payload: values.payload,
            createdAt: values.createdAt,
            readAt: values.readAt,
            archivedAt: values.archivedAt,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async findGroupable(input: {
    recipientUserId: string;
    type: NotificationType;
    objectType: NotificationPersistedType["objectType"];
    objectId: string;
    since: Date;
  }): Promise<Notification | null> {
    if (!GROUPABLE_TYPES.includes(input.type)) return null;

    const rows = await this.db
      .select()
      .from(notificationTable)
      .where(
        and(
          eq(notificationTable.recipientUserId, input.recipientUserId),
          eq(notificationTable.type, input.type),
          eq(notificationTable.objectType, input.objectType),
          eq(notificationTable.objectId, input.objectId),
          isNull(notificationTable.archivedAt),
          gt(notificationTable.createdAt, input.since),
        ),
      )
      .orderBy(desc(notificationTable.createdAt))
      .limit(1);

    const row = rows[0];
    return row ? NotificationMapper.fromPersistence(row as NotificationPersistedType) : null;
  }

  async findPage(input: FindNotificationsPageInput): Promise<Notification[]> {
    const conditions = [
      eq(notificationTable.organizationId, input.organizationId),
      eq(notificationTable.recipientUserId, input.recipientUserId),
      isNull(notificationTable.archivedAt),
    ];

    if (input.filter === "unread") {
      conditions.push(isNull(notificationTable.readAt));
    }

    if (input.types && input.types.length > 0) {
      conditions.push(inArray(notificationTable.type, input.types));
    }

    if (input.cursor) {
      const decoded = decodeNotificationCursor(input.cursor);
      if (decoded) {
        conditions.push(
          or(
            lt(notificationTable.createdAt, decoded.createdAt),
            and(eq(notificationTable.createdAt, decoded.createdAt), lt(notificationTable.id, decoded.id)),
          )!,
        );
      }
    }

    const rows = await this.db
      .select()
      .from(notificationTable)
      .where(and(...conditions))
      .orderBy(desc(notificationTable.createdAt), desc(notificationTable.id))
      .limit(input.limit + 1);

    return rows.map((row) => NotificationMapper.fromPersistence(row as NotificationPersistedType));
  }

  async countUnread(organizationId: string, recipientUserId: string): Promise<number> {
    const [row] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(notificationTable)
      .where(
        and(
          eq(notificationTable.organizationId, organizationId),
          eq(notificationTable.recipientUserId, recipientUserId),
          isNull(notificationTable.readAt),
          isNull(notificationTable.archivedAt),
        ),
      );
    return row?.count ?? 0;
  }

  async findManyByIdsForRecipient(ids: string[], recipientUserId: string, organizationId: string): Promise<Notification[]> {
    if (ids.length === 0) return [];

    const rows = await this.db
      .select()
      .from(notificationTable)
      .where(
        and(
          inArray(notificationTable.id, ids),
          eq(notificationTable.recipientUserId, recipientUserId),
          eq(notificationTable.organizationId, organizationId),
        ),
      );

    return rows.map((row) => NotificationMapper.fromPersistence(row as NotificationPersistedType));
  }

  async markAllRead(organizationId: string, recipientUserId: string): Promise<number> {
    const now = new Date();
    const rows = await this.db
      .update(notificationTable)
      .set({ readAt: now })
      .where(
        and(
          eq(notificationTable.organizationId, organizationId),
          eq(notificationTable.recipientUserId, recipientUserId),
          isNull(notificationTable.readAt),
          isNull(notificationTable.archivedAt),
        ),
      )
      .returning({ id: notificationTable.id });
    return rows.length;
  }
}