import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/organization/port/project.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";

export class FindOnboardingUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly organizationRepository: OrganizationRepository,
    private readonly projectPort: ProjectPort,
  ) {}

  async execute(userId: string): Promise<FindOnboardingOutputDtoType> {
    const membership = await this.membershipPort.findByUser(userId);
    if (!membership) {
      return null;
    }

    const organization = await this.organizationRepository.findById(membership.organizationId);
    if (!organization) {
      return null;
    }

    const projects = await this.projectPort.findManyByOrganizationId({
      organizationId: membership.organizationId,
    });
    const project = [...projects].sort((left, right) => left.createdAt.localeCompare(right.createdAt))[0];

    return {
      organizationId: organization.id,
      organizationName: organization.name,
      projectId: project?.id ?? null,
      projectName: project?.name ?? null,
    };
  }
}
