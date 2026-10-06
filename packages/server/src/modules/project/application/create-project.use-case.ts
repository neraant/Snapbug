import { ProjectFactory } from "@workspace/server/modules/project/entity/project.factory";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { MembershipPort } from "@workspace/server/modules/project/port/membership.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import { NotFoundError } from "@workspace/server/shared/error/app-errors";
import { ERROR_CODES } from "@workspace/server/shared/error/error-codes";
import type {
  CreateProjectInputDtoType,
  CreateProjectOutputDtoType,
} from "@workspace/validation/modules/project/dto/create-project.schema";

export class CreateProjectUseCase {
  constructor(
    private readonly membershipPort: MembershipPort,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(input: CreateProjectInputDtoType, userId: string): Promise<CreateProjectOutputDtoType> {
    const membership = await this.membershipPort.findByUserAndOrganization({
      userId,
      organizationId: input.organizationId,
    });
    if (!membership) throw new NotFoundError(ERROR_CODES.ORGANIZATION_NOT_FOUND);

    const project = ProjectFactory.create({
      name: input.name,
      organizationId: input.organizationId,
    });
    await this.projectRepository.save(project);
    return ProjectMapper.toDto(project);
  }
}
