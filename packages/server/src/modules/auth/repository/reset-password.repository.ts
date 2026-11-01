import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { resetPasswordTokenTable } from "@workspace/database/schema/reset-password-token.const";
import type { ResetPassword } from "@workspace/server/modules/auth/domain/reset-password.entity";
import { ResetPasswordMapper } from "@workspace/server/modules/auth/domain/reset-password.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { eq } from "drizzle-orm";

export class ResetPasswordRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): ResetPasswordRepository {
    return new ResetPasswordRepository(tx);
  }

  async findByToken(token: string): Promise<ResetPassword | null> {
    const [row] = await this.db.select().from(resetPasswordTokenTable).where(eq(resetPasswordTokenTable.token, token));
    return row ? ResetPasswordMapper.fromPersistence(row) : null;
  }

  async findByUserId(userId: string): Promise<ResetPassword | null> {
    const row = await this.db.query.resetPasswordTokenTable.findFirst({ where: { userId } });
    return row ? ResetPasswordMapper.fromPersistence(row) : null;
  }

  async delete(resetPassword: ResetPassword): Promise<void> {
    try {
      await this.db.delete(resetPasswordTokenTable).where(eq(resetPasswordTokenTable.id, resetPassword.id));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async save(resetPassword: ResetPassword): Promise<void> {
    try {
      await this.db.insert(resetPasswordTokenTable).values(ResetPasswordMapper.toPersistence(resetPassword));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
