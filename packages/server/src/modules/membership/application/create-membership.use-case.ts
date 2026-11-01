import { MembershipFactory } from "@workspace/server/modules/membership/entity/membership.factory";
import { MembershipMapper } from "@workspace/server/modules/membership/entity/membership.mapper";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import { ConflictError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  CreateMembershipInputDtoType,
  CreateMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/create-membership.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class CreateMembershipUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async execute(
    input: CreateMembershipInputDtoType,
    userId: string,
    role: UserRole = UserRole.ADMIN,
  ): Promise<CreateMembershipOutputDtoType> {
    const existing = await this.membershipRepository.findByUserAndOrganization(userId, input.organizationId);
    if (existing) throw new ConflictError(ERROR_CODES.MEMBERSHIP_ALREADY_EXISTS);

    const membership = MembershipFactory.create({
      userId,
      organizationId: input.organizationId,
      role,
    });
    await this.membershipRepository.save(membership);
    return MembershipMapper.toDto(membership);
  }
}
