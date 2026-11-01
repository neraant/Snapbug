import { ProjectFactory } from "@workspace/server/modules/project/entity/project.factory";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  CreateProjectInputDtoType,
  CreateProjectOutputDtoType,
} from "@workspace/validation/modules/project/dto/create-project.schema";

export class CreateProjectUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectService: ProjectService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(input: CreateProjectInputDtoType, userId: string): Promise<CreateProjectOutputDtoType> {
    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: input.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const project = ProjectFactory.create({
      name: input.name,
      color: input.color,
      organizationId: input.organizationId,
    });
    await this.withTransaction(async (tx) => {
      await this.projectService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .saveWithAudit(project, "Create project");
      await this.membershipPort.withTx(tx).grantProjectToMembers(input.organizationId, project.id, userId);
    });
    return ProjectMapper.toDto(project);
  }
}
