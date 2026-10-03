import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import type { MembershipPersistedType } from "@workspace/server/modules/membership/entity/membership.types";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export abstract class MembershipMapper {
  static fromPersistence(row: MembershipPersistedType): Membership {
    return new Membership(row);
  }

  static toPersistence(membership: Membership): MembershipPersistedType {
    return membership.toObject();
  }

  static toDto(membership: Membership): MembershipModelType {
    const row = membership.toObject();
    return {
      id: row.id,
      userId: row.userId,
      organizationId: row.organizationId,
      role: row.role,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
