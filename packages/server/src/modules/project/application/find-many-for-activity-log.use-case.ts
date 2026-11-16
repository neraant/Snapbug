import type { AuditProjectLinkType } from "@workspace/server/modules/audit/port/project.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";

export class FindManyProjectsForActivityLogUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(ids: string[]): Promise<AuditProjectLinkType[]> {
    if (ids.length === 0) return [];

    const projects = await this.projectRepository.findManyByIds(ids);
    return projects.map((project) => ({ id: project.id }));
  }
}
