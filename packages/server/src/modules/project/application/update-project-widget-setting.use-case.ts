import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { ForbiddenError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { UpdateProjectWidgetSettingInputDtoType } from "@workspace/validation/modules/project/dto/update-project-widget-setting.schema";
import type { UpdateProjectWidgetSettingOutputDtoType } from "@workspace/validation/modules/project/dto/update-project-widget-setting.schema";
import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

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

    const currentSettings = ProjectMapper.toWidgetSettingDto(project);
    const nextSettings = input.settings;
    const domainsChanged = this.listsDiffer(currentSettings.allowedDomains, nextSettings.allowedDomains);
    const maskingChanged =
      currentSettings.privacy.maskText !== nextSettings.privacy.maskText ||
      currentSettings.privacy.maskInputs !== nextSettings.privacy.maskInputs ||
      this.listsDiffer(currentSettings.privacy.blockSelectors, nextSettings.privacy.blockSelectors);

    if ((domainsChanged || maskingChanged) && membership.role !== UserRole.ADMIN) {
      throw new ForbiddenError(ERROR_CODES.ADMIN_REQUIRED, "Administrator access is required");
    }

    const updatedProject = project.update({ widgetSettings: input.settings });
    await this.withTransaction(async (tx) => {
      await this.projectService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .saveWithAudit(updatedProject, "Update project widget settings");
    });

    return ProjectMapper.toWidgetSettingDto(updatedProject);
  }

  private listsDiffer(current: readonly string[], next: readonly string[]): boolean {
    return current.length !== next.length || current.some((entry, index) => entry !== next[index]);
  }
}
