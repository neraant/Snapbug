import type { DbClient } from "@workspace/database";
import type { Organization } from "@workspace/server/modules/organization/entity/organization.entity";
import { OrganizationMapper } from "@workspace/server/modules/organization/entity/organization.mapper";
import type { OrganizationRepository } from "@workspace/server/modules/organization/repository/organization.repository";
import type { AuditLogService } from "@workspace/server/shared/audit/audit-log.service";
import type { AuditActor } from "@workspace/server/shared/audit/audit-log.types";

const ORGANIZATION_ENTITY_TYPE = "organization";

export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly auditLogService: AuditLogService,
    private readonly actor: AuditActor | null = null,
  ) {}

  withTx(tx: DbClient): OrganizationService {
    return new OrganizationService(this.organizationRepository.withTx(tx), this.auditLogService.withTx(tx), this.actor);
  }

  withActor(actor: AuditActor | null): OrganizationService {
    return new OrganizationService(this.organizationRepository, this.auditLogService, actor);
  }

  async saveWithAudit(organization: Organization, action: string): Promise<void> {
    const previous = await this.organizationRepository.findById(organization.id);
    await this.organizationRepository.save(organization);

    await this.auditLogService.save({
      action,
      entityType: ORGANIZATION_ENTITY_TYPE,
      entityId: organization.id,
      organizationId: organization.id,
      projectId: null,
      actor: this.actor,
      oldSnapshot: previous ? OrganizationMapper.toAudit(previous) : null,
      newSnapshot: OrganizationMapper.toAudit(organization),
    });
  }
}
