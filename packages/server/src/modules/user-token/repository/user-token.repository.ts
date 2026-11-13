import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { userTokenTable } from "@workspace/database/schema";
import type { UserToken } from "@workspace/server/modules/user-token/entity/user-token.entity";
import { UserTokenMapper } from "@workspace/server/modules/user-token/entity/user-token.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";

export class UserTokenRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): UserTokenRepository {
    return new UserTokenRepository(tx);
  }

  async findById(id: string): Promise<UserToken | null> {
    const row = await this.db.query.userTokenTable.findFirst({
      where: { id },
    });
    return row ? UserTokenMapper.fromPersistence(row) : null;
  }

  async findByHash(tokenHash: string): Promise<UserToken | null> {
    const row = await this.db.query.userTokenTable.findFirst({
      where: { tokenHash },
    });
    return row ? UserTokenMapper.fromPersistence(row) : null;
  }

  async findManyByUserId(userId: string): Promise<UserToken[]> {
    const rows = await this.db.query.userTokenTable.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => UserTokenMapper.fromPersistence(row));
  }

  async save(userToken: UserToken): Promise<void> {
    const values = UserTokenMapper.toPersistence(userToken);

    try {
      await this.db
        .insert(userTokenTable)
        .values(values)
        .onConflictDoUpdate({
          target: userTokenTable.id,
          set: { revokedAt: values.revokedAt },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
