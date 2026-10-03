import type { ProjectPort as ApiKeyProjectPort } from "@workspace/server/modules/api-key/port/project.port";
import type { ProjectPort } from "@workspace/server/modules/bug-report/port/project.port";
import { FindProjectsUseCase } from "@workspace/server/modules/project/application/find-projects.use-case";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type {
  FindProjectsInputDtoType,
  FindProjectsOutputDtoType,
} from "@workspace/validation/modules/project/dto/find-projects.schema";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";

export class ProjectAdapter implements ProjectPort, ApiKeyProjectPort {
  constructor(private readonly projectRepository: ProjectRepository = new ProjectRepository()) {}

  async findById(id: string): Promise<ProjectModelType | null> {
    const project = await this.projectRepository.findById(id);
    return project ? ProjectMapper.toDto(project) : null;
  }

  async findManyByOrganizationId(input: FindProjectsInputDtoType): Promise<FindProjectsOutputDtoType> {
    return await new FindProjectsUseCase(this.projectRepository).execute(input);
  }
}
