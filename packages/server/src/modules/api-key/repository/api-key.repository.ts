import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { apiKeyTable } from "@workspace/database/schema";
import type { ApiKey } from "@workspace/server/modules/api-key/entity/api-key.entity";
import { ApiKeyMapper } from "@workspace/server/modules/api-key/entity/api-key.mapper";
import { eq } from "drizzle-orm";

export class ApiKeyRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  async findByKey(key: string): Promise<ApiKey | null> {
    const [row] = await this.db.select().from(apiKeyTable).where(eq(apiKeyTable.key, key));
    return row ? ApiKeyMapper.fromPersistence(row) : null;
  }
}
