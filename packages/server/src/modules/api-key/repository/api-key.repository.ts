import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { apiKeyTable } from "@workspace/database/schema";
import type { ApiKey } from "@workspace/server/modules/api-key/entity/api-key.entity";
import { ApiKeyMapper } from "@workspace/server/modules/api-key/entity/api-key.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { and, desc, eq, isNull } from "drizzle-orm";

export class ApiKeyRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): ApiKeyRepository {
    return new ApiKeyRepository(tx);
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    const [row] = await this.db.select().from(apiKeyTable).where(eq(apiKeyTable.key, key));
    return row ? ApiKeyMapper.fromPersistence(row) : null;
  }

  async findActiveByProjectId(projectId: string): Promise<ApiKey | null> {
    const [row] = await this.db
      .select()
      .from(apiKeyTable)
      .where(and(eq(apiKeyTable.projectId, projectId), isNull(apiKeyTable.revokedAt)))
      .orderBy(desc(apiKeyTable.createdAt))
      .limit(1);
    return row ? ApiKeyMapper.fromPersistence(row) : null;
  }

  async save(apiKey: ApiKey): Promise<void> {
    const values = ApiKeyMapper.toPersistence(apiKey);

    try {
      await this.db
        .insert(apiKeyTable)
        .values(values)
        .onConflictDoUpdate({
          target: apiKeyTable.id,
          set: {
            revokedAt: values.revokedAt,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
