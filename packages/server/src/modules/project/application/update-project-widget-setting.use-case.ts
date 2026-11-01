import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { UpdateProjectWidgetSettingInputDtoType } from "@workspace/validation/modules/project/dto/update-project-widget-setting.schema";
import type { UpdateProjectWidgetSettingOutputDtoType } from "@workspace/validation/modules/project/dto/update-project-widget-setting.schema";

export class UpdateProjectWidgetSettingUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectRepository: ProjectRepository,
    private readonly projectService: ProjectService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(
    input: UpdateProjectWidgetSettingInputDtoType,
    userId: string,
    organizationId: string | null,
  ): Promise<UpdateProjectWidgetSettingOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const project = await this.projectRepository.findById(input.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
    }

    const [allowedProjectId] = await this.membershipPort.filterProjectIds(membership, [project.id]);
    if (!allowedProjectId) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    const updatedProject = project.update({ widgetSettings: input.settings });
    await this.withTransaction(async (tx) => {
      await this.projectService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .saveWithAudit(updatedProject, "Update project widget settings");
    });

    return ProjectMapper.toWidgetSettingDto(updatedProject);
  }
}
