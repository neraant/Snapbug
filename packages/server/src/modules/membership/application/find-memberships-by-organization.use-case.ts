import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export class FindMembershipsByOrganizationUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async execute(organizationId: string): Promise<MembershipModelType[]> {
    const memberships = await this.membershipRepository.findManyByOrganizationId(organizationId);
    return MembershipMapper.toFindMembershipsByOrganizationOutput(memberships);
  }
}
