import type { DbClient } from "@workspace/database";
import type { AuditMembershipLinkType, MembershipPort } from "@workspace/server/modules/audit/port/membership.port";
import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";

export class ActivityLogMembershipAdapter implements MembershipPort {
  private readonly findMembership: FindMembershipUseCase;

  constructor(private readonly membershipRepository: MembershipRepository) {
    this.findMembership = new FindMembershipUseCase(membershipRepository);
  }

  withTx(tx: unknown): ActivityLogMembershipAdapter {
    return new ActivityLogMembershipAdapter(this.membershipRepository.withTx(tx as DbClient));
  }

  async findByUserAndOrganization(input: FindMembershipInputDtoType): Promise<FindMembershipOutputDtoType> {
    return await this.findMembership.execute(input);
  }

  async findManyByIds(ids: string[]): Promise<AuditMembershipLinkType[]> {
    const memberships = await this.membershipRepository.findManyByIds(ids);
    return memberships.map((membership) => ({ id: membership.id }));
  }
}
