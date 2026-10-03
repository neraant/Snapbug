import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";

export class FindMembershipUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async execute(input: FindMembershipInputDtoType): Promise<FindMembershipOutputDtoType> {
    const membership = await this.membershipRepository.findByUserAndOrganization(input.userId, input.organizationId);
    return membership ? MembershipMapper.toDto(membership) : null;
  }
}
