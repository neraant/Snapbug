import type { MembershipPort as BugReportMembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import { CreateMembershipUseCase } from "@workspace/server/modules/membership/application/create-membership.use-case";
import { FindMembershipByUserUseCase } from "@workspace/server/modules/membership/application/find-membership-by-user.use-case";
import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { MembershipPort as OrganizationMembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type {
  CreateMembershipInputDtoType,
  CreateMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/create-membership.schema";
import type { FindMembershipByUserOutputDtoType } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";

export class MembershipAdapter implements BugReportMembershipPort, OrganizationMembershipPort {
  constructor(private readonly membershipRepository: MembershipRepository = new MembershipRepository()) {}

  async findByUserAndOrganization(input: FindMembershipInputDtoType): Promise<FindMembershipOutputDtoType> {
    return await new FindMembershipUseCase(this.membershipRepository).execute(input);
  }

  async findByUser(userId: string): Promise<FindMembershipByUserOutputDtoType> {
    return await new FindMembershipByUserUseCase(this.membershipRepository).execute(userId);
  }

  async create(input: CreateMembershipInputDtoType, userId: string): Promise<CreateMembershipOutputDtoType> {
    return await new CreateMembershipUseCase(this.membershipRepository).execute(input, userId);
  }
}
