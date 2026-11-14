import { Membership } from "@workspace/server/modules/membership/entity/membership.entity";
import type { MembershipPersistedType } from "@workspace/server/modules/membership/entity/membership.types";
import type { FindTeamMembersOutputDtoType } from "@workspace/validation/modules/membership/dto/find-team-members.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";
import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export abstract class MembershipMapper {
  static fromPersistence(row: MembershipPersistedType): Membership {
    return new Membership(row);
  }

  static toPersistence(membership: Membership): MembershipPersistedType {
    return membership.toObject();
  }

  static toAudit(membership: Membership): Record<string, unknown> {
    const { userId, organizationId, role } = membership.toObject();
    return { userId, organizationId, role };
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

  static toFindMembershipsByOrganizationOutput(memberships: Membership[]): MembershipModelType[] {
    return memberships.map((membership) => MembershipMapper.toDto(membership));
  }

  static toTeamMemberOutput(memberships: Membership[], users: UserModelType[]): FindTeamMembersOutputDtoType {
    const userById = new Map(users.map((user) => [user.id, user]));

    return memberships.flatMap((membership) => {
      const user = userById.get(membership.userId);
      if (!user) return [];

      const dto = MembershipMapper.toDto(membership);
      return [
        {
          id: dto.id,
          userId: dto.userId,
          name: user.name,
          email: user.email,
          role: dto.role,
          createdAt: dto.createdAt,
        },
      ];
    });
  }
}
