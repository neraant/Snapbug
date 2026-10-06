import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { OrganizationModelType } from "@workspace/validation/modules/organization/dto/organization.model";
import type { UpdateOrganizationInputDtoType } from "@workspace/validation/modules/organization/dto/update-organization.schema";

export class UpdateOrganizationUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(input: UpdateOrganizationInputDtoType, userId: string): Promise<OrganizationModelType> {
    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: input.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const organization = await this.organizationRepository.findById(input.organizationId);
    if (!organization) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const updatedOrganization = organization.update({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.reports_retention_days !== undefined && {
        reports_retention_days: input.reports_retention_days,
      }),
    });
    await this.organizationRepository.save(updatedOrganization);
    return OrganizationMapper.toDto(updatedOrganization);
  }
}
