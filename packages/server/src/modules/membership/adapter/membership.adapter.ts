import type { DbClient } from "@workspace/database";
import { CreateMembershipUseCase } from "@workspace/server/modules/membership/application/create-membership.use-case";
import { FilterProjectIdsUseCase } from "@workspace/server/modules/membership/application/filter-project-ids.use-case";
import { FindMembershipUseCase } from "@workspace/server/modules/membership/application/find-membership.use-case";
import { FindMembershipsByOrganizationUseCase } from "@workspace/server/modules/membership/application/find-memberships-by-organization.use-case";
import { FindMembershipsByUserUseCase } from "@workspace/server/modules/membership/application/find-memberships-by-user.use-case";
import { GrantMembershipProjectsUseCase } from "@workspace/server/modules/membership/application/grant-membership-projects.use-case";
import { GrantProjectToMembersUseCase } from "@workspace/server/modules/membership/application/grant-project-to-members.use-case";
import type { MembershipRepository } from "@workspace/server/modules/membership/repository/membership.repository";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import type { ProjectAccessService } from "@workspace/server/modules/membership/service/project-access.service";
import type { MembershipPort as OrganizationMembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type {
  CreateMembershipInputDtoType,
  CreateMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/create-membership.schema";
import type {
  FindMembershipInputDtoType,
  FindMembershipOutputDtoType,
} from "@workspace/validation/modules/membership/dto/find-membership.schema";
import type { MembershipModelType } from "@workspace/validation/modules/membership/dto/membership.model";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class MembershipAdapter implements OrganizationMembershipPort {
  private readonly findMembership: FindMembershipUseCase;
  private readonly findMembershipsByUser: FindMembershipsByUserUseCase;
  private readonly findMembershipsByOrganization: FindMembershipsByOrganizationUseCase;
  private readonly createMembership: CreateMembershipUseCase;
  private readonly filterProjectIdsUseCase: FilterProjectIdsUseCase;
  private readonly grantProjectToMembersUseCase: GrantProjectToMembersUseCase;
  private readonly grantMembershipProjectsUseCase: GrantMembershipProjectsUseCase;

  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly projectAccessRepository: ProjectAccessRepository,
    private readonly projectAccessService: ProjectAccessService,
  ) {
    this.findMembership = new FindMembershipUseCase(membershipRepository);
    this.findMembershipsByUser = new FindMembershipsByUserUseCase(membershipRepository);
    this.findMembershipsByOrganization = new FindMembershipsByOrganizationUseCase(membershipRepository);
    this.createMembership = new CreateMembershipUseCase(membershipRepository);
    this.filterProjectIdsUseCase = new FilterProjectIdsUseCase(projectAccessRepository);
    this.grantProjectToMembersUseCase = new GrantProjectToMembersUseCase(
      membershipRepository,
      projectAccessRepository,
      projectAccessService,
    );
    this.grantMembershipProjectsUseCase = new GrantMembershipProjectsUseCase(
      projectAccessRepository,
      projectAccessService,
    );
  }

  withTx(tx: unknown): MembershipAdapter {
    return new MembershipAdapter(
      this.membershipRepository.withTx(tx as DbClient),
      this.projectAccessRepository.withTx(tx as DbClient),
      this.projectAccessService.withTx(tx as DbClient),
    );
  }

  async findByUserAndOrganization(input: FindMembershipInputDtoType): Promise<FindMembershipOutputDtoType> {
    return await this.findMembership.execute(input);
  }

  async findManyByUser(userId: string): Promise<MembershipModelType[]> {
    return await this.findMembershipsByUser.execute(userId);
  }

  async findManyByOrganizationId(organizationId: string): Promise<MembershipModelType[]> {
    return await this.findMembershipsByOrganization.execute(organizationId);
  }

  async create(input: CreateMembershipInputDtoType, userId: string): Promise<CreateMembershipOutputDtoType> {
    return await this.createMembership.execute(input, userId);
  }

  async createInvited(organizationId: string, userId: string): Promise<MembershipModelType> {
    return await this.createMembership.execute({ organizationId }, userId, UserRole.USER);
  }

  async filterProjectIds(
    membership: Pick<MembershipModelType, "id" | "role">,
    projectIds: string[],
  ): Promise<string[]> {
    return await this.filterProjectIdsUseCase.execute(membership, projectIds);
  }

  async grantProjectToMembers(organizationId: string, projectId: string, userId: string): Promise<void> {
    await this.grantProjectToMembersUseCase.execute(organizationId, projectId, userId);
  }

  async grantProjects(membershipId: string, projectIds: string[], userId: string): Promise<void> {
    await this.grantMembershipProjectsUseCase.execute(membershipId, projectIds, userId);
  }
}
