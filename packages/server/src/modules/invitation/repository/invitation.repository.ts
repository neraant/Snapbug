import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { invitationTable } from "@workspace/database/schema/invitation.const";
import type { Invitation } from "@workspace/server/modules/invitation/entity/invitation.entity";
import { InvitationMapper } from "@workspace/server/modules/invitation/entity/invitation.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { and, desc, eq, isNull } from "drizzle-orm";

export class InvitationRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): InvitationRepository {
    return new InvitationRepository(tx);
  }

  async findById(id: string): Promise<Invitation | null> {
    const [row] = await this.db.select().from(invitationTable).where(eq(invitationTable.id, id));
    return row ? InvitationMapper.fromPersistence(row) : null;
  }

  async findByToken(tokenHash: string): Promise<Invitation | null> {
    const [row] = await this.db.select().from(invitationTable).where(eq(invitationTable.tokenHash, tokenHash));
    return row ? InvitationMapper.fromPersistence(row) : null;
  }

  async findByOrganizationAndEmail(organizationId: string, email: string): Promise<Invitation | null> {
    const [row] = await this.db
      .select()
      .from(invitationTable)
      .where(and(eq(invitationTable.organizationId, organizationId), eq(invitationTable.email, email)));
    return row ? InvitationMapper.fromPersistence(row) : null;
  }

  async findManyPendingByOrganizationId(organizationId: string): Promise<Invitation[]> {
    const rows = await this.db
      .select()
      .from(invitationTable)
      .where(and(eq(invitationTable.organizationId, organizationId), isNull(invitationTable.acceptedAt)))
      .orderBy(desc(invitationTable.createdAt));

    return rows.map((row) => InvitationMapper.fromPersistence(row));
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
            tokenHash: values.tokenHash,
            tokenVersion: values.tokenVersion,
            expiresAt: values.expiresAt,
            invitedByUserId: values.invitedByUserId,
            acceptedAt: values.acceptedAt,
            revokedAt: values.revokedAt,
          },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
