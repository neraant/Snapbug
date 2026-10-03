import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { userTable } from "@workspace/database/schema";
import type { User } from "@workspace/server/modules/identity/entity/user.entity";
import { UserMapper } from "@workspace/server/modules/identity/entity/user.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { eq } from "drizzle-orm";

export class UserRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  async findByEmail(email: string): Promise<User | null> {
    const [row] = await this.db.select().from(userTable).where(eq(userTable.email, email));
    return row ? UserMapper.fromPersistence(row) : null;
  }

  async save(user: User): Promise<void> {
    try {
      await this.db.insert(userTable).values(UserMapper.toPersistence(user));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
