import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { UserPort } from "@workspace/server/modules/organization/port/user.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  UpdateOnboardingOrganizationInputDtoType,
  UpdateOnboardingOrganizationOutputDtoType,
} from "@workspace/validation/modules/organization/dto/update-onboarding-organization.schema";

export class UpdateOnboardingOrganizationUseCase {
  constructor(
    private readonly userPort: UserPort,
    private readonly membershipPort: MembershipPort,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(
    input: UpdateOnboardingOrganizationInputDtoType,
    userId: string,
  ): Promise<UpdateOnboardingOrganizationOutputDtoType> {
    const { onboardingCompletedAt } = await this.userPort.findOnboardingState(userId);
    if (onboardingCompletedAt) {
      throw new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED, "Administrator access is required");
    }

    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: input.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const organization = await this.organizationRepository.findById(input.organizationId);
    if (!organization) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const updatedOrganization = organization.update({ name: input.name });
    await this.organizationRepository.save(updatedOrganization);
    return OrganizationMapper.toDto(updatedOrganization);
  }
}
