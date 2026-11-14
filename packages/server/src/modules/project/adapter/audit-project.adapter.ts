import type { DbClient } from "@workspace/database";
import { FindProjectByIdUseCase } from "@workspace/server/modules/project/application/find-project-by-id.use-case";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { AuditProjectPort } from "@workspace/server/shared/audit/project.port";
import type { ProjectModelType } from "@workspace/validation/modules/project/dto/project.model";

export class AuditProjectAdapter implements AuditProjectPort {
  private readonly findProjectById: FindProjectByIdUseCase;

  constructor(private readonly projectRepository: ProjectRepository) {
    this.findProjectById = new FindProjectByIdUseCase(projectRepository);
  }

  withTx(tx: unknown): AuditProjectAdapter {
    return new AuditProjectAdapter(this.projectRepository.withTx(tx as DbClient));
  }

  async findById(id: string): Promise<ProjectModelType | null> {
    return await this.findProjectById.execute(id);
  }
}
