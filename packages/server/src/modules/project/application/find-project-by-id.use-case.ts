import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";

export class FindProjectByIdUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<ProjectModelType | null> {
    const project = await this.projectRepository.findById(id);
    return project ? ProjectMapper.toDto(project) : null;
  }
}
