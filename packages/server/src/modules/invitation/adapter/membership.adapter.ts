import type { MembershipPort } from "@workspace/server/modules/invitation/port/membership.port";
import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import { FindMembershipByUserUseCase } from "@workspace/server/modules/membership/application/find-membership-by-user.use-case";
import { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import type { FindMembershipByUserOutputDtoType } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";

export class MembershipAdapter implements MembershipPort {
  constructor(private readonly membershipRepository: MembershipRepository = new MembershipRepository()) {}

  async findByUserAndOrganization(input: FindMembershipInputDtoType): Promise<FindMembershipOutputDtoType> {
    return await new FindMembershipUseCase(this.membershipRepository).execute(input);
  }

  async findByUser(userId: string): Promise<FindMembershipByUserOutputDtoType> {
    return await new FindMembershipByUserUseCase(this.membershipRepository).execute(userId);
  }
}
