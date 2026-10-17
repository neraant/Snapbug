import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { UpdateProjectWidgetSettingInputDtoType } from "@workspace/validation/modules/project/dto/update-project-widget-setting.schema";
import type { UpdateProjectWidgetSettingOutputDtoType } from "@workspace/validation/modules/project/dto/update-project-widget-setting.schema";

export class UpdateProjectWidgetSettingUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(
    input: UpdateProjectWidgetSettingInputDtoType,
    userId: string,
  ): Promise<UpdateProjectWidgetSettingOutputDtoType> {
    const membership = await this.membershipPort.findByUser(userId);
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const project = await this.projectRepository.findById(input.projectId);
    if (!project || project.organizationId !== membership.organizationId) {
      throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);
    }

    const updatedProject = project.update({ widgetSettings: input.settings });
    await this.projectRepository.save(updatedProject);

    return ProjectMapper.toWidgetSettingDto(updatedProject);
  }
}
