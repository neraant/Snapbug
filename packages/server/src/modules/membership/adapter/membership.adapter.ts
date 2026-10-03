import type { MembershipPort } from "@workspace/server/modules/bug-report/port/membership.port";
import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";

export class MembershipAdapter implements MembershipPort {
  constructor(private readonly membershipRepository: MembershipRepository = new MembershipRepository()) {}

  async findByUserAndOrganization(input: FindMembershipInputDtoType): Promise<FindMembershipOutputDtoType> {
    return await new FindMembershipUseCase(this.membershipRepository).execute(input);
  }
}
