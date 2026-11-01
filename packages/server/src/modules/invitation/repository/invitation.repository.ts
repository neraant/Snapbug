import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { invitationTable } from "@workspace/database/schema/invitation.const";
import type { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import { InvitationMapper } from "@workspace/server/modules/invitation/entity/invitation.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { eq } from "drizzle-orm";

export class InvitationRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): InvitationRepository {
    return new InvitationRepository(tx);
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const [row] = await this.db.select().from(invitationTable).where(eq(invitationTable.token, token));
    return row ? InvitationMapper.fromPersistence(row) : null;
  }

  async save(invitation: Invitation): Promise<void> {
    const values = InvitationMapper.toPersistence(invitation);

    try {
      await this.db
        .insert(invitationTable)
        .values(values)
        .onConflictDoUpdate({
          target: [invitationTable.organizationId, invitationTable.email],
          set: {
            token: values.token,
            expiresAt: values.expiresAt,
            invitedByUserId: values.invitedByUserId,
            acceptedAt: values.acceptedAt,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
