import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import type { OrganizationService } from "@workspace/server/modules/organization/service/organization.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { OrganizationModelType } from "@workspace/validation/modules/organization/dto/organization.model";
import type { UpdateOrganizationInputDtoType } from "@workspace/validation/modules/organization/dto/update-organization.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export class UpdateOrganizationUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationService: OrganizationService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(input: UpdateOrganizationInputDtoType, userId: string): Promise<OrganizationModelType> {
    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: input.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);
    if (membership.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED, "Administrator access is required");
    }

    const organization = await this.organizationRepository.findById(input.organizationId);
    if (!organization) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const updatedOrganization = organization.update({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.reports_retention_days !== undefined && {
        reports_retention_days: input.reports_retention_days,
      }),
    });
    await this.withTransaction(async (tx) => {
      await this.organizationService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .saveWithAudit(updatedOrganization, "Update organization");
    });
    return OrganizationMapper.toDto(updatedOrganization);
  }
}
