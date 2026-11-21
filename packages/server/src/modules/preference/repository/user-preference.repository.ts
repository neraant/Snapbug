import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { userPreferenceTable } from "@workspace/database/schema";
import type { UserPreference } from "@workspace/server/modules/preference/entity/user-preference.entity";
import { UserPreferenceMapper } from "@workspace/server/modules/preference/entity/user-preference.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";

export class UserPreferenceRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): UserPreferenceRepository {
    return new UserPreferenceRepository(tx);
  }

  async findByUserId(userId: string): Promise<UserPreference | null> {
    const row = await this.db.query.userPreferenceTable.findFirst({
      where: { userId },
    });
    return row ? UserPreferenceMapper.fromPersistence(row) : null;
  }

  async save(userPreference: UserPreference): Promise<void> {
    const values = UserPreferenceMapper.toPersistence(userPreference);

    try {
      await this.db
        .insert(userPreferenceTable)
        .values(values)
        .onConflictDoUpdate({
          target: userPreferenceTable.userId,
          set: {
            timeZone: values.timeZone,
            theme: values.theme,
            updatedAt: values.updatedAt,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}