import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export class FindMembershipsByUserUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async execute(userId: string): Promise<MembershipModelType[]> {
    const memberships = await this.membershipRepository.findManyByUserId(userId);
    return memberships.map((membership) => MembershipMapper.toDto(membership));
  }
}
