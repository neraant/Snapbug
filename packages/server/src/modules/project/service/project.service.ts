import type { DbClient } from "@workspace/database";
import type { Project } from "@workspace/server/modules/project/entity/project.entity";
import { ProjectMapper } from "@workspace/server/modules/project/entity/project.mapper";
import type { ProjectRepository } from "@workspace/server/modules/project/repository/project.repository";
import type { AuditLogService } from "@workspace/server/shared/audit/audit-log.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";

const PROJECT_ENTITY_TYPE = "project";

export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly auditLogService: AuditLogService,
    private readonly actor: AuditActor | null = null,
  ) {}

  withTx(tx: DbClient): ProjectService {
    return new ProjectService(this.projectRepository.withTx(tx), this.auditLogService.withTx(tx), this.actor);
  }

  withActor(actor: AuditActor | null): ProjectService {
    return new ProjectService(this.projectRepository, this.auditLogService, actor);
  }

  async saveWithAudit(project: Project, action: string): Promise<void> {
    const previous = await this.projectRepository.findById(project.id);
    await this.projectRepository.save(project);

    await this.auditLogService.save({
      action,
      entityType: PROJECT_ENTITY_TYPE,
      entityId: project.id,
      organizationId: project.organizationId,
      projectId: project.id,
      actor: this.actor,
      oldSnapshot: previous ? ProjectMapper.toAudit(previous) : null,
      newSnapshot: ProjectMapper.toAudit(project),
    });
  }
}
