import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { FindMembershipByUserOutputDtoType } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";

export class FindMembershipByUserUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async execute(userId: string): Promise<FindMembershipByUserOutputDtoType> {
    const membership = await this.membershipRepository.findByUserId(userId);
    return membership ? MembershipMapper.toDto(membership) : null;
  }
}
