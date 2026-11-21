import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { notificationEmailPendingTable } from "@workspace/database/schema/notification-email-pending.const";
import type { NotificationEmailPendingPersistedType } from "@workspace/server/modules/notification/entity/notification-email-pending.types";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { eq, inArray } from "drizzle-orm";

export class NotificationEmailPendingRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): NotificationEmailPendingRepository {
    return new NotificationEmailPendingRepository(tx);
  }

  async enqueue(row: NotificationEmailPendingPersistedType): Promise<void> {
    try {
      await this.db.insert(notificationEmailPendingTable).values(row);
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async findByUserId(userId: string): Promise<NotificationEmailPendingPersistedType[]> {
    return await this.db.query.notificationEmailPendingTable.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async deleteByIds(ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    try {
      await this.db.delete(notificationEmailPendingTable).where(inArray(notificationEmailPendingTable.id, ids));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await this.db.delete(notificationEmailPendingTable).where(eq(notificationEmailPendingTable.userId, userId));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
