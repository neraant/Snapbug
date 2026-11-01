import type { DbClient } from "@workspace/database";
import type { ProjectAccess } from "@workspace/server/modules/membership/entity/project-access.entity";
import { ProjectAccessMapper } from "@workspace/server/modules/membership/entity/project-access.mapper";
import type { ProjectAccessRepository } from "@workspace/server/modules/membership/repository/project-access.repository";
import type { AuditLogService } from "@workspace/server/shared/audit/audit-log.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";

const PROJECT_ACCESS_ENTITY_TYPE = "project-access";

export class ProjectAccessService {
  constructor(
    private readonly projectAccessRepository: ProjectAccessRepository,
    private readonly auditLogService: AuditLogService,
    private readonly actor: AuditActor | null = null,
  ) {}

  withTx(tx: DbClient): ProjectAccessService {
    return new ProjectAccessService(
      this.projectAccessRepository.withTx(tx),
      this.auditLogService.withTx(tx),
      this.actor,
    );
  }

  withActor(actor: AuditActor | null): ProjectAccessService {
    return new ProjectAccessService(this.projectAccessRepository, this.auditLogService, actor);
  }

  async saveWithAudit(projectAccess: ProjectAccess, action: string): Promise<void> {
    const previous = await this.projectAccessRepository.findById(projectAccess.id);
    await this.projectAccessRepository.save(projectAccess);

    await this.auditLogService.save({
      action,
      entityType: PROJECT_ACCESS_ENTITY_TYPE,
      entityId: projectAccess.id,
      projectId: projectAccess.projectId,
      actor: this.actor,
      oldSnapshot: previous ? ProjectAccessMapper.toAudit(previous) : null,
      newSnapshot: ProjectAccessMapper.toAudit(projectAccess),
    });
  }

  async deleteWithAudit(projectAccess: ProjectAccess, action: string): Promise<void> {
    await this.projectAccessRepository.delete(projectAccess);

    await this.auditLogService.save({
      action,
      entityType: PROJECT_ACCESS_ENTITY_TYPE,
      entityId: projectAccess.id,
      projectId: projectAccess.projectId,
      actor: this.actor,
      oldSnapshot: ProjectAccessMapper.toAudit(projectAccess),
      newSnapshot: { membershipId: null, projectId: null },
    });
  }
}
