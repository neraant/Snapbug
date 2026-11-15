import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";
import type { ArchiveProjectInputDtoType } from "@workspace/validation/modules/project/dto/update-project.schema";

export class ArchiveProjectUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectRepository: ProjectRepository,
    private readonly projectService: ProjectService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(input: ArchiveProjectInputDtoType, userId: string): Promise<ProjectModelType> {
    const project = await this.loadAdminProject(input.projectId, userId);
    if (project.isArchived) return ProjectMapper.toDto(project);

    const archivedProject = project.update({ archivedAt: new Date() });
    await this.withTransaction(async (tx) => {
      await this.projectService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .saveWithAudit(archivedProject, "Archive project");
    });
    return ProjectMapper.toDto(archivedProject);
  }

  private async loadAdminProject(projectId: string, userId: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: project.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const [allowedProjectId] = await this.membershipPort.filterProjectIds(membership, [project.id]);
    if (!allowedProjectId) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    return project;
  }
}
