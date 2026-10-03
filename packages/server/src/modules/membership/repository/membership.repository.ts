import type { DbClient } from "@workspace/database";
import { db as defaultDb } from "@workspace/database";
import type { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";

export class MembershipRepository {
  constructor(private readonly db: DbClient = defaultDb) {}

  async findByUserAndOrganization(userId: string, organizationId: string): Promise<Membership | null> {
    const membership = await this.db.query.membershipTable.findFirst({
      where: { userId, organizationId },
    });
    return membership ? MembershipMapper.fromPersistence(membership) : null;
  }
}
