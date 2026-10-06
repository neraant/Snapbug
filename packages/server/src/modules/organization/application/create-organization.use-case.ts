import { OrganizationFactory } from "@workspace/server/modules/organization/entity/organization.factory";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/organization/port/project.port";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import { ConflictError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  CreateOrganizationInputDtoType,
  CreateOrganizationOutputDtoType,
} from "@workspace/validation/modules/organization/dto/create-organization.schema";

const DEFAULT_PROJECT_NAME = "Default project";

export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
  ) {}

  async execute(input: CreateOrganizationInputDtoType, userId: string): Promise<CreateOrganizationOutputDtoType> {
    const existingMembership = await this.membershipPort.findByUser(userId);
    if (existingMembership) {
      throw new ConflictError(ERROR_CODES.USER_ALREADY_HAS_ORGANIZATION);
    }

    const organization = OrganizationFactory.create({
      name: input.name,
      ...(input.reports_retention_days !== undefined && {
        reports_retention_days: input.reports_retention_days,
      }),
    });
    await this.organizationRepository.save(organization);

    await this.membershipPort.create({ organizationId: organization.id }, userId);
    const project = await this.projectPort.create(
      { organizationId: organization.id, name: DEFAULT_PROJECT_NAME },
      userId,
    );

    return {
      organization: OrganizationMapper.toDto(organization),
      project,
    };
  }
}
