import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import { membershipTable } from "@workspace/database/schema";
import type { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import { InternalServerError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";

export class MembershipRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  async findByUserAndOrganization(userId: string, organizationId: string): Promise<Membership | null> {
    const membership = await this.db.query.membershipTable.findFirst({
      where: { userId, organizationId },
    });
    return membership ? MembershipMapper.fromPersistence(membership) : null;
  }

  async findByUserId(userId: string): Promise<Membership | null> {
    const membership = await this.db.query.membershipTable.findFirst({
      where: { userId },
    });
    return membership ? MembershipMapper.fromPersistence(membership) : null;
  }

  async findByOrganizationId(organizationId: string): Promise<Membership | null> {
    const membership = await this.db.query.membershipTable.findFirst({
      where: { organizationId },
    });
    return membership ? MembershipMapper.fromPersistence(membership) : null;
  }

  async save(membership: Membership): Promise<void> {
    try {
      await this.db.insert(membershipTable).values(MembershipMapper.toPersistence(membership));
    } catch (error) {
      throw new InternalServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, { cause: error });
    }
  }
}
