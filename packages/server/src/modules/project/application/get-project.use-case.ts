import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { assertMcpProjectAllowed } from "@workspace/server/shared/orpc/mcp/mcp-project-scope.util";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  GetProjectInputDtoType,
  GetProjectOutputDtoType,
} from "@workspace/validation/modules/project/dto/get-project.schema";

export class GetProjectUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(
    input: GetProjectInputDtoType,
    userId: string,
    mcpProjectIds?: string[] | null,
  ): Promise<GetProjectOutputDtoType> {
    const project = await this.projectRepository.findById(input.projectId);
    if (!project) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: project.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    const allowedProjectIds = await this.membershipPort.filterProjectIds(membership, [project.id]);
    if (allowedProjectIds.length === 0) throw new NotFoundError(ERROR_CODES.PROJECT_NOT_FOUND);

    assertMcpProjectAllowed(project.id, mcpProjectIds, ERROR_CODES.PROJECT_NOT_FOUND);

    return ProjectMapper.toDto(project);
  }
}