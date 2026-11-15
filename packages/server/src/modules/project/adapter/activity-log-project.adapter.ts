import type { DbClient } from "@workspace/database";
import type { AuditProjectLinkType, ProjectPort } from "@workspace/server/modules/audit/port/project.port";
import { FindManyProjectsForActivityLogUseCase } from "@workspace/server/modules/project/application/find-many-for-activity-log.use-case";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";

export class ActivityLogProjectAdapter implements ProjectPort {
  private readonly findManyForActivityLog: FindManyProjectsForActivityLogUseCase;

  constructor(private readonly projectRepository: ProjectRepository) {
    this.findManyForActivityLog = new FindManyProjectsForActivityLogUseCase(projectRepository);
  }

  withTx(tx: unknown): ActivityLogProjectAdapter {
    return new ActivityLogProjectAdapter(this.projectRepository.withTx(tx as DbClient));
  }

  async findManyByIds(ids: string[]): Promise<AuditProjectLinkType[]> {
    return await this.findManyForActivityLog.execute(ids);
  }
}
