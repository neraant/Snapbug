import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type {
  FindProjectsInputDtoType,
  FindProjectsOutputDtoType,
} from "@workspace/validation/modules/project/dto/find-projects.schema";

export class FindProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(input: FindProjectsInputDtoType): Promise<FindProjectsOutputDtoType> {
    const projects = await this.projectRepository.findManyByOrganizationId(input.organizationId);
    return projects.map((project) => ProjectMapper.toDto(project));
  }
}
