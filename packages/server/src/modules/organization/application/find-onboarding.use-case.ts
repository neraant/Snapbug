import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/organization/port/project.port";
import type { UserPort } from "@workspace/server/modules/organization/port/user.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import type { FindOnboardingOutputDtoType } from "@workspace/validation/modules/organization/dto/find-onboarding.schema";

export class FindOnboardingUseCase {
  constructor(
    private readonly userPort: UserPort,
    private readonly membershipPort: MembershipPort,
    private readonly organizationRepository: OrganizationRepository,
    private readonly projectPort: ProjectPort,
  ) {}

  async execute(userId: string, organizationId: string | null): Promise<FindOnboardingOutputDtoType> {
    const { onboardingCompletedAt, suggestedOrganizationName } = await this.userPort.findOnboardingState(userId);
    const membership = organizationId
      ? await this.membershipPort.findByUserAndOrganization({ userId, organizationId })
      : null;

    if (!membership) {
      return OrganizationMapper.toFindOnboardingOutput({
        completedAt: onboardingCompletedAt,
        suggestedOrganizationName,
        organization: null,
        project: null,
      });
    }

    const organization = await this.organizationRepository.findById(membership.organizationId);
    if (!organization) {
      return OrganizationMapper.toFindOnboardingOutput({
        completedAt: onboardingCompletedAt,
        suggestedOrganizationName,
        organization: null,
        project: null,
      });
    }

    const projects = await this.projectPort.findManyByOrganizationId({
      organizationId: membership.organizationId,
    });
    const project = [...projects].sort((left, right) => left.createdAt.localeCompare(right.createdAt))[0];

    return OrganizationMapper.toFindOnboardingOutput({
      completedAt: onboardingCompletedAt,
      suggestedOrganizationName,
      organization,
      project: project ?? null,
    });
  }
}
