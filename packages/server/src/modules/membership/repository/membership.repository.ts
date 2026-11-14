import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { membershipTable } from "@workspace/database/schema";
import type { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import { eq } from "drizzle-orm";

export class MembershipRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  withTx(tx: DbClient): MembershipRepository {
    return new MembershipRepository(tx);
  }

  async findById(id: string): Promise<Membership | null> {
    const membership = await this.db.query.membershipTable.findFirst({
      where: { id },
    });
    return membership ? MembershipMapper.fromPersistence(membership) : null;
  }

  async findByUserAndOrganization(userId: string, organizationId: string): Promise<Membership | null> {
    const membership = await this.db.query.membershipTable.findFirst({
      where: { userId, organizationId },
    });
    return membership ? MembershipMapper.fromPersistence(membership) : null;
  }

  async findManyByUserId(userId: string): Promise<Membership[]> {
    const memberships = await this.db.query.membershipTable.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return memberships.map((membership) => MembershipMapper.fromPersistence(membership));
  }

  async findManyByOrganizationId(organizationId: string): Promise<Membership[]> {
    const memberships = await this.db.query.membershipTable.findMany({
      where: { organizationId },
    });
    return memberships.map((membership) => MembershipMapper.fromPersistence(membership));
  }

  async save(membership: Membership): Promise<void> {
    const values = MembershipMapper.toPersistence(membership);

    try {
      await this.db
        .insert(membershipTable)
        .values(values)
        .onConflictDoUpdate({
          target: membershipTable.id,
          set: { role: values.role },
        });
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }

  async delete(membership: Membership): Promise<void> {
    try {
      await this.db.delete(membershipTable).where(eq(membershipTable.id, membership.id));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
