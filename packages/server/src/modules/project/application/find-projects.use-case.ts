import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  FindProjectsInputDtoType,
  FindProjectsOutputDtoType,
} from "@workspace/validation/modules/project/dto/find-projects.schema";

export class FindProjectsUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async executeForUser(userId: string, organizationId: string | null): Promise<FindProjectsOutputDtoType> {
    if (!organizationId) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const membership = await this.membershipPort.findByUserAndOrganization({ userId, organizationId });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const projects = await this.projectRepository.findManyByOrganizationId(membership.organizationId);
    const allowedProjectIds = new Set(
      await this.membershipPort.filterProjectIds(
        membership,
        projects.map((project) => project.id),
      ),
    );
    return ProjectMapper.toFindProjectsOutput(projects.filter((project) => allowedProjectIds.has(project.id)));
  }

  async execute(input: FindProjectsInputDtoType): Promise<FindProjectsOutputDtoType> {
    const projects = await this.projectRepository.findManyByOrganizationId(input.organizationId);
    return ProjectMapper.toFindProjectsOutput(projects);
  }
}
