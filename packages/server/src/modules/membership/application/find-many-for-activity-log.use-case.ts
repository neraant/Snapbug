import type { AuditMembershipLinkType } from "@workspace/server/modules/audit/port/membership.port";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";

export class FindManyMembershipsForActivityLogUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async execute(ids: string[]): Promise<AuditMembershipLinkType[]> {
    if (ids.length === 0) return [];

    const memberships = await this.membershipRepository.findManyByIds(ids);
    return memberships.map((membership) => ({ id: membership.id }));
  }
}
