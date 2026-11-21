import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { userNotificationPreferenceTable } from "@workspace/database/schema/user-notification-preference.const";
import { UserNotificationPreference } from "@workspace/server/modules/notification/entity/user-notification-preference.entity";
import { UserNotificationPreferenceMapper } from "@workspace/server/modules/notification/entity/user-notification-preference.mapper";
import type { UserOrganizationNotificationPreference } from "@workspace/server/modules/notification/entity/user-organization-notification-preference.entity";
import { UserOrganizationNotificationPreferenceMapper } from "@workspace/server/modules/notification/entity/user-organization-notification-preference.mapper";
import { userOrganizationNotificationPreferenceTable } from "@workspace/database/schema/user-organization-notification-preference.const";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { and, eq } from "drizzle-orm";

export class UserNotificationPreferenceRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): UserNotificationPreferenceRepository {
    return new UserNotificationPreferenceRepository(tx);
  }

  async findByUserId(userId: string): Promise<UserNotificationPreference | null> {
    const row = await this.db.query.userNotificationPreferenceTable.findFirst({
      where: { userId },
    });
    return row ? UserNotificationPreferenceMapper.fromPersistence(row) : null;
  }

  async save(userNotificationPreference: UserNotificationPreference): Promise<void> {
    const values = UserNotificationPreferenceMapper.toPersistence(userNotificationPreference);

    try {
      await this.db
        .insert(userNotificationPreferenceTable)
        .values(values)
        .onConflictDoUpdate({
          target: userNotificationPreferenceTable.userId,
          set: {
            channels: values.channels,
            updatedAt: values.updatedAt,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async findOrganizationPreference(
    userId: string,
    organizationId: string,
  ): Promise<UserOrganizationNotificationPreference | null> {
    const row = await this.db.query.userOrganizationNotificationPreferenceTable.findFirst({
      where: { userId, organizationId },
    });
    return row ? UserOrganizationNotificationPreferenceMapper.fromPersistence(row) : null;
  }

  async saveOrganizationPreference(preference: UserOrganizationNotificationPreference): Promise<void> {
    const values = UserOrganizationNotificationPreferenceMapper.toPersistence(preference);

    try {
      await this.db
        .insert(userOrganizationNotificationPreferenceTable)
        .values(values)
        .onConflictDoUpdate({
          target: [
            userOrganizationNotificationPreferenceTable.userId,
            userOrganizationNotificationPreferenceTable.organizationId,
          ],
          set: {
            mutedProjectIds: values.mutedProjectIds,
            updatedAt: values.updatedAt,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async listOrganizationPreferencesByUserId(userId: string): Promise<UserOrganizationNotificationPreference[]> {
    const rows = await this.db.query.userOrganizationNotificationPreferenceTable.findMany({
      where: { userId },
    });
    return rows.map((row) => UserOrganizationNotificationPreferenceMapper.fromPersistence(row));
  }

  async findMutedProjectIds(userId: string, organizationId: string): Promise<string[]> {
    const row = await this.db
      .select({ mutedProjectIds: userOrganizationNotificationPreferenceTable.mutedProjectIds })
      .from(userOrganizationNotificationPreferenceTable)
      .where(
        and(
          eq(userOrganizationNotificationPreferenceTable.userId, userId),
          eq(userOrganizationNotificationPreferenceTable.organizationId, organizationId),
        ),
      )
      .limit(1);

    return row[0]?.mutedProjectIds ?? [];
  }
}
