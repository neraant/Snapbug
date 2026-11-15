import type { ProjectApiKeyPort } from "@workspace/server/modules/project/port/api-key.port";
import type { BugReportPort } from "@workspace/server/modules/project/port/bug-report.port";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectService } from "@workspace/server/modules/project/service/project.service";
import type { WithTransactionType } from "@workspace/server/shared/database/transaction.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type { DeleteProjectInputDtoType } from "@workspace/validation/modules/project/dto/update-project.schema";

export class DeleteProjectUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectRepository: ProjectRepository,
    private readonly bugReportPort: BugReportPort,
    private readonly apiKeyPort: ProjectApiKeyPort,
    private readonly projectService: ProjectService,
    private readonly withTransaction: WithTransactionType,
  ) {}

  async execute(input: DeleteProjectInputDtoType, userId: string): Promise<void> {
    const project = await this.projectRepository.findById(input.projectId);
    if (!project) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: project.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const [allowedProjectId] = await this.membershipPort.filterProjectIds(membership, [project.id]);
    if (!allowedProjectId) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    await this.bugReportPort.deleteProjectTicketsAndFiles(project.id);

    await this.withTransaction(async (tx) => {
      await this.apiKeyPort.withTx(tx).deleteByProjectId(project.id);
      await this.projectService
        .withTx(tx)
        .withActor({ type: "user", id: userId })
        .deleteWithAudit(project, "Delete project");
    });
  }
}
