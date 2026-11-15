import type { DbClient } from "@workspace/database";
import type { AuditProjectLinkType, ProjectPort } from "@workspace/server/modules/audit/port/project.port";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";

export class ActivityLogProjectAdapter implements ProjectPort {
  constructor(private readonly projectRepository: ProjectRepository) {}

  withTx(tx: unknown): ActivityLogProjectAdapter {
    return new ActivityLogProjectAdapter(this.projectRepository.withTx(tx as DbClient));
  }

  async findManyByIds(ids: string[]): Promise<AuditProjectLinkType[]> {
    const projects = await this.projectRepository.findManyByIds(ids);
    return projects.map((project) => ({ id: project.id }));
  }
}
