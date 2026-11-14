import { OrganizationFactory } from "@workspace/server/modules/organization/entity/organization.factory";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { MembershipPort } from "@workspace/server/modules/organization/port/membership.port";
import type { ProjectPort } from "@workspace/server/modules/organization/port/project.port";
import type { OrganizationService } from "@workspace/server/modules/organization/service/organization.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import type {
  CreateOrganizationInputDtoType,
  CreateOrganizationOutputDtoType,
} from "@workspace/validation/modules/organization/dto/create-organization.schema";
import { projectColorDefault } from "@workspace/validation/shared/project-color.schema";

const DEFAULT_PROJECT_NAME = "Default project";

export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly membershipPort: MembershipPort,
    private readonly projectPort: ProjectPort,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(input: CreateOrganizationInputDtoType, userId: string): Promise<CreateOrganizationOutputDtoType> {
    const organization = OrganizationFactory.create({
      name: input.name,
      ...(input.reports_retention_days !== undefined && {
        reports_retention_days: input.reports_retention_days,
      }),
    });
    const project = await this.withTransaction(async (tx) => {
      await this.organizationService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .saveWithAudit(organization, "Create organization");
      await this.membershipPort.withTx(tx).create({ organizationId: organization.id }, userId);
      return await this.projectPort
        .withTx(tx)
        .create({ organizationId: organization.id, name: DEFAULT_PROJECT_NAME, color: projectColorDefault }, userId);
    });

    return OrganizationMapper.toCreateOrganizationOutput(organization, project);
  }
}
