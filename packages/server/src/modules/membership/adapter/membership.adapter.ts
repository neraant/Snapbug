import type { DbClient } from "@workspace/database";
import { CreateMembershipUseCase } from "@workspace/server/modules/membership/application/create-membership.use-case";
import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import { FindMembershipByUserUseCase } from "@workspace/server/modules/membership/application/find-membership-by-user.use-case";
import { FindMembershipsByOrganizationUseCase } from "@workspace/server/modules/membership/application/find-memberships-by-organization.use-case";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { MembershipPort as OrganizationMembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type {
  CreateMembershipInputDtoType,
  CreateMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/create-membership.schema";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import type { FindMembershipByUserOutputDtoType } from "@workspace/validation/modules/membership/dto/find-membership-by-user.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";

export class MembershipAdapter implements OrganizationMembershipPort {
  private readonly findMembership: FindMembershipUseCase;
  private readonly findMembershipByUser: FindMembershipByUserUseCase;
  private readonly findMembershipsByOrganization: FindMembershipsByOrganizationUseCase;
  private readonly createMembership: CreateMembershipUseCase;

  constructor(private readonly membershipRepository: MembershipRepository) {
    this.findMembership = new FindMembershipUseCase(membershipRepository);
    this.findMembershipByUser = new FindMembershipByUserUseCase(membershipRepository);
    this.findMembershipsByOrganization = new FindMembershipsByOrganizationUseCase(membershipRepository);
    this.createMembership = new CreateMembershipUseCase(membershipRepository);
  }

  withTx(tx: unknown): MembershipAdapter {
    return new MembershipAdapter(this.membershipRepository.withTx(tx as DbClient));
  }

  async findByUserAndOrganization(input: FindMembershipInputDtoType): Promise<FindMembershipOutputDtoType> {
    return await this.findMembership.execute(input);
  }

  async findByUser(userId: string): Promise<FindMembershipByUserOutputDtoType> {
    return await this.findMembershipByUser.execute(userId);
  }

  async findManyByOrganizationId(organizationId: string): Promise<MembershipModelType[]> {
    return await this.findMembershipsByOrganization.execute(organizationId);
  }

  async create(input: CreateMembershipInputDtoType, userId: string): Promise<CreateMembershipOutputDtoType> {
    return await this.createMembership.execute(input, userId);
  }
}
