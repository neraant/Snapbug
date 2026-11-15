import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectAccessPort } from "@workspace/server/modules/project/port/project-access.port";
import type { ProjectUserPort } from "@workspace/server/modules/project/port/user.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import { ProjectSlugService } from "@workspace/server/modules/project/service/project-slug.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { BadRequestError, ConflictError, NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";
import type { UpdateProjectInputDtoType } from "@workspace/validation/modules/project/dto/update-project.schema";

export class UpdateProjectUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectRepository: ProjectRepository,
    private readonly projectService: ProjectService,
    private readonly projectAccessPort: ProjectAccessPort,
    private readonly projectUserPort: ProjectUserPort,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(input: UpdateProjectInputDtoType, userId: string): Promise<ProjectModelType> {
    const project = await this.projectRepository.findById(input.projectId);
    if (!project) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: project.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const [allowedProjectId] = await this.membershipPort.filterProjectIds(membership, [project.id]);
    if (!allowedProjectId) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    if (input.slug !== undefined) {
      const taken = await this.projectRepository.isSlugTakenInOrganization(
        input.slug,
        project.organizationId,
        project.id,
      );
      if (taken) throw new ConflictError(ERROR_CODES.PROJECT_SLUG_TAKEN);
    }

    if (input.defaultAssigneeId !== undefined && input.defaultAssigneeId !== null) {
      const assignee = await this.projectUserPort.findById(input.defaultAssigneeId);
      if (!assignee) throw new BadRequestError(ERROR_CODES.INVALID_DEFAULT_ASSIGNEE);

      const hasAccess = await this.projectAccessPort.userHasProjectAccess(
        input.defaultAssigneeId,
        project.id,
        project.organizationId,
      );
      if (!hasAccess) throw new BadRequestError(ERROR_CODES.INVALID_DEFAULT_ASSIGNEE);
    }

    const nextSlug =
      input.slug ??
      (input.name !== undefined && input.name !== project.name
        ? await this.resolveSlugAfterRename(project.organizationId, project.id, input.name, project.slug)
        : undefined);

    const updatedProject = project.update({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(nextSlug !== undefined ? { slug: nextSlug } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
      ...(input.defaultAssigneeId !== undefined ? { defaultAssigneeId: input.defaultAssigneeId } : {}),
      ...(input.storeVisitorIp !== undefined ? { storeVisitorIp: input.storeVisitorIp } : {}),
      ...(input.collectVisitorEmail !== undefined ? { collectVisitorEmail: input.collectVisitorEmail } : {}),
    });

    await this.withTransaction(async (tx) => {
      await this.projectService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .saveWithAudit(updatedProject, "Update project");
    });
    return ProjectMapper.toDto(updatedProject);
  }

  private async resolveSlugAfterRename(
    organizationId: string,
    projectId: string,
    name: string,
    currentSlug: string,
  ): Promise<string | undefined> {
    const baseSlug = ProjectSlugService.baseSlugFromName(name);
    if (baseSlug === currentSlug) return undefined;

    const takenSlugs = new Set(await this.projectRepository.findSlugsByOrganizationId(organizationId));
    takenSlugs.delete(currentSlug);
    return ProjectSlugService.allocateSlug(baseSlug, takenSlugs);
  }
}
