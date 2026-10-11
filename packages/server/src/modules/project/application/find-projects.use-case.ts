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

  async executeForUser(userId: string): Promise<FindProjectsOutputDtoType> {
    const membership = await this.membershipPort.findByUser(userId);
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    return await this.execute({ organizationId: membership.organizationId });
  }

  async execute(input: FindProjectsInputDtoType): Promise<FindProjectsOutputDtoType> {
    const projects = await this.projectRepository.findManyByOrganizationId(input.organizationId);
    return projects.map((project) => ProjectMapper.toDto(project));
  }
}
